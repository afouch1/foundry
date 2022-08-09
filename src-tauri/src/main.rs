#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde::{Serialize,Deserialize};
use std::fs::{File, create_dir_all};
use std::io::{Write,Read};

#[derive(Debug, Serialize, Deserialize)]
struct IPConfig {
  name: String,
  server: String,
  port: Option<u32>,
}

fn is_valid_ip(ip: &String) -> bool {
  let fields: Vec<&str> = ip.split(".").collect();
  if fields.len() > 4 { return false };
  if fields.into_iter().any(|field| field.parse::<u8>().is_err()) { 
    return false;
  }
  true
}

fn is_valid_server(server: &String) -> bool {
  use regex::Regex;

  let site_regex = Regex::new(r"^(www\.)?[a-zA-Z0-9]+\.(\w+)$").unwrap();
  site_regex.is_match(server)
}

fn get_app_dir() -> Option<std::path::PathBuf> {
  let config_json = include_str!("../tauri.conf.json");
  let config: tauri::Config = serde_json::from_str(config_json).unwrap();
  tauri::api::path::app_dir(&config)
}

#[tauri::command]
fn get_config() -> Option<Vec<IPConfig>> {
  let mut path = get_app_dir()?;
  path.push("config.json");
  let mut f = File::open(path).ok()?;
  let mut json = String::new();
  f.read_to_string(&mut json).ok()?;
  serde_json::from_str(json.as_str()).ok()
}

#[tauri::command]
fn set_config(configs: Vec<IPConfig>) {
  for config in configs.iter() {
    if !is_valid_ip(&config.server) && !is_valid_server(&config.server) {
      return
    }
    if config.name.len() > 35 {
      return
    }
  }
  let json = serde_json::to_string(&configs);
  if json.is_err() { return; }
  let path = get_app_dir();
  if path.is_none() { return; }
  let mut path = path.unwrap();
  let _ = create_dir_all(&path);
  path.push("config.json");
  let f = File::create(&path);
  if f.is_err() { return; }
  let f = f.unwrap();
  write!(&f, "{}", json.unwrap().as_str());
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler!(set_config))
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
