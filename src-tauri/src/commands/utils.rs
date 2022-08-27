/// Verifies that a given string is a valid IPv4 address
pub fn is_valid_ip(ip: &String) -> bool {
    let fields: Vec<&str> = ip.split(".").collect();
    if fields.len() > 4 { return false };
    !fields.into_iter().any(|field| field.parse::<u8>().is_err())
}

/// Loosely verifies that a given string is a valid web address
pub fn is_valid_server(server: &String) -> bool {
    regex::Regex::new(r"^(www\.)?[a-zA-Z0-9]+\.(\w+)$")
        .unwrap()
        .is_match(server)
}

/// Retrieves the directory for configuration files for the current system
///
/// # Returns
/// Some(PathBuf) if the dir can be found, otherwise None.
pub fn get_app_dir() -> Option<std::path::PathBuf> {
    let config_json = include_str!("../../tauri.conf.json");
    let config: tauri::Config = serde_json::from_str(config_json).unwrap();
    tauri::api::path::app_dir(&config)
}
