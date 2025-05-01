use axum::routing;
use axum::{Router, routing::get, routing::post};
use axum::http::Method;
use tower_http::cors::{Any, CorsLayer};
use migration::{ Migrator, MigratorTrait }; 
use sea_orm::{ ActiveModelTrait, Database, DatabaseConnection };
use serde_json::{self, json};
use std::sync::Arc;
use util::password::{check_password, generate_password};

// libraries for handling environment variables
// this makes switching the DB between production / development branches easy
use std::env;
use dotenvy::dotenv;

// custom entities
use entity::user;

// custom controllers

// custom utils
mod util;
mod controllers;


// testing functions for our db
async fn debug_tests(db: &DatabaseConnection) -> Result<(), sea_orm::DbErr> {
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
    debug_tests(&db).await?;

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

    // creating an app
    let app = Router::new()
        .route("/api/", get(|| async { "Hello, World!"}))
        .route("/api/user/", post(controllers::user::post))
        .with_state(shared_state)
        .layer(cors)
        ;

    // open up listener on :3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await?;

    Ok(())
}
