use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Server {
    pub name: String,
    pub hostname: String,
    pub port: Option<u32>,
}
