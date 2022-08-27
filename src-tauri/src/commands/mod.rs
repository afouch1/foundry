mod utils;

use utils::*;
use super::config::Server;

use std::fs::{create_dir_all, File};
use std::io::{Write,Read};

#[tauri::command]
pub fn ensure_path_found() -> bool {
    get_app_dir().is_some()
}

#[tauri::command]
pub fn get_config() -> Option<Vec<Server>> {
    let mut path = get_app_dir()?;
    path.push("config.json");
    let mut f = File::open(&path).ok()?;
    let mut json = String::new();
    f.read_to_string(&mut json).ok()?;
    serde_json::from_str(json.as_str()).ok()
}

#[tauri::command]
pub fn set_config(servers: Vec<Server>) {
    let servers: Vec<&Server> = servers.iter().filter(
        |config|
            (is_valid_ip(&config.hostname) || is_valid_server(&config.hostname)) && config.name.len() < 35
    ).collect();

    println!("Servers: {:?}", servers);
    let json = serde_json::to_string(&servers);
    if json.is_err() { return; }
    let json = json.unwrap();
    let path = get_app_dir();
    if path.is_none() { return; }
    let mut path = path.unwrap();
    let _ = create_dir_all(&path);
    path.push("config.json");
    let f = File::create(&path);
    if f.is_err() { return; }
    let f = f.unwrap();
    let _ = write!(&f, "{}", json.as_str());
    println!("Servers are being written to {:?}. ", &path);
}
