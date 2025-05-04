use axum::{
    body::{Body, Bytes}, extract::{Json, Request, State}, http::StatusCode, response::IntoResponse, Router
};
use sea_orm::{ ActiveModelTrait, ActiveValue, };
use serde::Deserialize;
use tower_sessions::Session;
use crate::{AppState, USER_SESSION_KEY};
use entity::game;
use serde_json::{self, json};

#[derive(Deserialize)]
pub struct Guess {
    guess: String,
}

#[derive(Deserialize)]
pub struct CheckedGuess {
    // checks one word guess 
    checks: [char; 5]
}

#[derive(Deserialize)]
pub struct UserInfo{
    // needed for initializing a game,
    id: u32,
}

#[axum::debug_handler]
pub async fn start(
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
        in_progress: ActiveValue::Set(true),
        ..Default::default()
    }.insert(&db).await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(json!({"game_id": game.id})))
    
}