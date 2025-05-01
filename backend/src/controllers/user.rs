use axum::{
    body::{Body, Bytes}, extract::{Json, Request, State}, response::IntoResponse, Router
};
use serde::Deserialize;
use serde_json::Value;

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
    Json(payload): Json<Value>,
) {
    println!("{:?}", payload);
    println!("{:?}", state.database);
}