#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod commands;
mod config;

use commands::*;

fn main() {
  let menu = tauri::Menu::new();

  tauri::Builder::default()
    .menu(menu)
    .invoke_handler(tauri::generate_handler![set_config, get_config, ensure_path_found])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
