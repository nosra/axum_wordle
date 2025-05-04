use axum::{
    body::{Body, Bytes}, extract::{Json, Request, State}, http::StatusCode, response::IntoResponse, Router
};
use serde::Deserialize;
use sea_orm::{ ActiveModelTrait, Database, DatabaseConnection };
use serde_json::json;

// custom utils...
use super::super::util;
use util::password;

// custom entities
use entity::user;


use crate::AppState;

#[derive(Deserialize)]
#[derive(Debug)]
pub struct CreateUser {
    username: String,
    password: String,
}

#[axum::debug_handler]
pub async fn post(
    State(state): State<AppState>,
    Json(payload): Json<CreateUser>,
    // alright, so in the case that we succesfully add the user to the database
    // im returning a type that implements IntoResponse (not necessarily an IntoResponse, just a type that... implements it)
) -> Result<impl IntoResponse, StatusCode> {

    // if we have an invalid username input, its a bad request
    if payload.username.is_empty() || payload.password.is_empty() {
        return Err(StatusCode::BAD_REQUEST)?;
    }

    // grab the database instance
    let db = state.database;

    // generate the password hash
    let password_hash = password::generate_password(&payload.password)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // create the activemodel for the user
    let new_user = user::ActiveModel::from_json(json!({
        "username": payload.username,
        "password": password_hash,
    })).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // finally, insert the user
    let _res: user::Model = new_user.insert(&db).await
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    Ok(StatusCode::ACCEPTED)
}