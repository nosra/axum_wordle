use std::vec;

use axum::{
    body::{Body, Bytes}, extract::{Json, Request, State, Path}, http::StatusCode, response::IntoResponse, Router
};
use sea_orm::{ ActiveModelTrait, ActiveValue, DatabaseConnection, EntityTrait, QueryFilter, ColumnTrait };
use serde::{Deserialize, Serialize};
use tower_sessions::Session;
use crate::{util::wrdl_serde, AppState, USER_SESSION_KEY};
use entity::game;
use serde_json::{self, json};

#[derive(Deserialize)]
pub struct Guess {
    guess: String,
}

#[derive(Serialize, Deserialize)]
pub struct CheckedGuess {
    // checks one word guess 
    checks: [char; 5]
}

#[derive(Deserialize)]
pub struct UserInfo{
    // needed for initializing a game,
    id: u32,
}

// for checking the guesses from the path
#[derive(serde::Deserialize)]
pub struct GameCheckPath {
    game_id: String,
    guess: String,
}

// for just getting the game
#[derive(Deserialize, Serialize)]
pub struct GamePath {
    game_id: String,
}

#[derive(Serialize, Deserialize)]
pub struct Board{
    board: [wrdl_serde::Cell; 30],
}

#[axum::debug_handler]
pub async fn create(
    State(state): State<AppState>,
    session: Session,
) -> Result<impl IntoResponse, StatusCode>{
    // start the game here
    // grab the user id of the current session's user
    let user_id: Option<i32> = session.get(USER_SESSION_KEY).await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // if we can't get the id for whatever reason
    let user_id = user_id.ok_or(StatusCode::UNAUTHORIZED)?;

    // grab the database
    let db = state.database;
    
    // init game with the user id
    // binary data in JSON needs base64 encoding/decoding, so I wont use a json macro for this
    let game = game::ActiveModel {
        user_id: ActiveValue::Set(user_id),
        data: ActiveValue::Set(vec![]),
        solution: ActiveValue::Set("audio".into()),
        in_progress: ActiveValue::Set(true),
        ..Default::default()
    }.insert(&db).await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(json!({"game_id": game.id})))
    
}

// check if a game belongs to user
async fn find_game(
    db: &DatabaseConnection,
    game_id: i32,
    user_id: i32
) -> Result<Option<game::Model>, sea_orm::DbErr> {
    // query the game with both game_id and user_id filters
    let game = game::Entity::find()
        .filter(game::Column::Id.eq(game_id))
        .filter(game::Column::UserId.eq(user_id))
        .one(db)
        .await?;

    Ok(game)
}

pub async fn get(
    State(state): State<AppState>,
    session: Session,
    Path(path): Path<GamePath>,
) -> Result<Json<Board>, StatusCode> {
    // query the database for the board, validate it belongs to the user, decompress it, and return it as a board.
    let user_id: i32 = session.get(USER_SESSION_KEY).await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    .ok_or(StatusCode::UNAUTHORIZED)?;

    // verify game ownership (in one query for efficiency)
    let db = state.database;
    let user_game = find_game(&db, path.game_id.parse().unwrap(), user_id)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // return forbidden if this game doesn't belong to the user.
    let game = user_game.ok_or(StatusCode::FORBIDDEN)?;

    // convert the game's data back into cells
    let cells = wrdl_serde::convert_to_wordle(&game.data);

    Ok(Json(Board { board: cells }))
}

// wordle logic
fn get_colors(guess: String, solution: String) -> CheckedGuess {
    let guess_chars: Vec<char> = guess.chars().collect();
    let solution_chars: Vec<char> = solution.chars().collect();
    let mut result = CheckedGuess { checks: ['g'; 5] };
    let mut solution_used = [false; 5];

    // green pass
    for i in 0..5 {
        if guess_chars[i] == solution_chars[i] {
            result.checks[i] = 'G';
            solution_used[i] = true;
        }
    }

    // yellow pass
    for i in 0..5 {
        if result.checks[i] == 'G' {
            continue;
        }

        for j in 0..5 {
            // skip positions already used for exact matches
            if !solution_used[j] && guess_chars[i] == solution_chars[j] {
                result.checks[i] = 'y';
                solution_used[j] = true;
                break;
            }
        }
    }
    result
}

// given a guess, this should return a list of chars representing its accuracy
pub async fn check_guess(
    State(state): State<AppState>,
    session: Session,
    Path(path): Path<GameCheckPath>,
) -> Result<Json<CheckedGuess>, StatusCode> {
    println!("Game ID: {}, Guess: {}", path.game_id, path.guess);
    // fetch the solution for this game
    let db = state.database;

    // explicitly parse game id as i32
    let game_id = path.game_id.parse::<i32>()
        .map_err(|_| StatusCode::BAD_REQUEST)?;

    // fetch the game from the path
    let game = game::Entity::find_by_id(game_id).one(&db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // return the checked guess
    let checked_guess = get_colors(path.guess.to_ascii_lowercase(), game.unwrap().solution);
    Ok(Json(checked_guess))
}