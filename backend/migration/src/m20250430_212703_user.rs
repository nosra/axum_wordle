use sea_orm_migration::{prelude::*, schema::*};
use sea_orm::{EnumIter, Iterable};

#[derive(DeriveMigrationName)]
pub struct Migration;

// https://docs.rs/sea-orm/latest/sea_orm/derive.DeriveIden.html
#[derive(DeriveIden)]
enum User {
    Table,
    Username,
    Password,
    Id,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(User::Table)
                    .if_not_exists()
                    .col(pk_auto(User::Id))
                    .col(string(User::Username))
                    .col(string(User::Password))
                    .to_owned()
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts

        manager
            .drop_table(Table::drop().table(User::Table).to_owned())
            .await
    }
}