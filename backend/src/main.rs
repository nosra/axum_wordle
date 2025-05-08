use axum::{Router, routing::get, routing::post};
use axum::http::Method;
use time::Duration;
use tower_http::cors::{Any, CorsLayer};
use tower_sessions::{Expiry, MemoryStore, Session, SessionManagerLayer};
use migration::{ Migrator, MigratorTrait }; 
use sea_orm::{ ActiveModelTrait, ActiveValue, Database, DatabaseConnection, EntityTrait };
use serde_json::{self, json};
use util::password::{check_password, generate_password};
use tower_sessions_redis_store::{fred::prelude::*, RedisStore};

// libraries for handling environment variables
// this makes switching the DB between production / development branches easy
use std::env;
use dotenvy::dotenv;

// custom entities
use entity::{ user, game };

// custom utils
mod util;

// custom controllers
mod controllers;

// session constants
pub const USER_SESSION_KEY: &str = "user_id";

// testing functions for our db
async fn user_tests(db: &DatabaseConnection) -> Result<(), sea_orm::DbErr> {
    println!("starting testing...");

    // generating a password
    let pass = "12345";
    let password_hash = generate_password(&pass);
    let test_user = user::ActiveModel::from_json(json!({
        "username": "Carson",
        "password": password_hash.clone().unwrap(),
    }))?;

    // to verify the password, we must parse the argon hash back into a PasswordHash
    let stored_hash_str = password_hash.unwrap();
    if let Ok(()) = check_password("notcorrect...", &stored_hash_str) {
        println!("password is correct!");
    } else {
        println!("password is incorrect!");
    }
    println!("[+] inserting {:?} into db...", test_user);
    let test_user: user::Model = test_user.insert(db).await?;
    println!("{:?}", test_user);
    Ok(())
}

async fn game_tests(db: &DatabaseConnection) -> Result<(), sea_orm::DbErr> {
    // lets try adding a game.
    // at this point, we assume a user must exist. lets get the first user
    let user: Option<user::Model> = user::Entity::find_by_id(1).one(db).await?;
    let user = user.unwrap();
    println!("{:?}", user);
    // try adding a game
    // binary data in JSON needs base64 encoding/decoding, so I wont use a json macro for this
    let test_game = game::ActiveModel {
        // foriegn key
        user_id: ActiveValue::Set(user.id),
        // data (vec for binary blobs)
        data: ActiveValue::Set(Vec::<u8>::new()),
        solution: ActiveValue::Set("audio".into()),
        in_progress: ActiveValue::Set(true),
        ..Default::default()
    };
    let _: game::Model = test_game.insert(db).await?;
    Ok(())
} 

// establish a database connection
async fn init_db() -> Result<DatabaseConnection, sea_orm::DbErr> {
    dotenv().ok();
    // grab the db url
    let db_url = env::var("DATABASE_URL").unwrap();

    // start by establishing the database connection
    let db: DatabaseConnection = Database::connect(&db_url).await?;
    
    // reset migrator on startup -- this clears the DB!
    Migrator::fresh(&db).await?;

    // return the database connection
    Ok(db)
}

// shared state with the database connection
#[derive(Clone)]
struct AppState {
    database: DatabaseConnection,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // grab the db connection
    let db = init_db().await?;
    println!("[+] database initialized...");

    // runs some tests
    user_tests(&db).await?;
    game_tests(&db).await?;

    // apply the tests to the db
    Migrator::up(&db, None).await?;

    // generate shared state
    let shared_state = AppState {
        database: db.clone(),
    };

    // set up a cors layer
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(Any);

    // set up sessions
    // actually, we're not gonna worry redis until deployment
    // that requires us spawning yet ANOTHER process. not worth.
    /* 
    let pool = Pool::new(Config::default(), None, None, None, 6)?;
    let redis_conn = pool.connect();
    pool.wait_for_connect().await?;

    let session_store = RedisStore::new(pool);
    */
    let session_store = MemoryStore::default();
    let session_layer = SessionManagerLayer::new(session_store)
    // set with secure to true when deploying...
        .with_secure(false)
        .with_expiry(Expiry::OnInactivity(Duration::hours(1)));

    // creating an app
    let app = Router::new()
        .route("/api", get(|| async { "Hello, World!"}))
        .route("/api/user/login", post(controllers::user::login))
        .route("/api/game/create", post(controllers::game::create))
        // .route("/api/game/{game_id}", post(controllers::game::enter))
        .route("/api/game/{game_id}", get(controllers::game::get))
        .route("/api/game/{game_id}/{guess}", post(controllers::game::check_guess))
        .with_state(shared_state)
        .layer(cors)
        .layer(session_layer)
        ;

    // open up listener on :3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await?;

    // redis_conn.await??;
    Ok(())
}
