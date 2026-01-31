#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{Manager, AppHandle};
use std::sync::Mutex;
use std::collections::HashMap;

// Define state for managing backend services
#[derive(Default)]
struct BackendState {
  // Local storage for projects
  projects: Mutex<HashMap<String, String>>,
  // State for collaboration rooms
  rooms: Mutex<HashMap<String, Vec<String>>>,
  // Conversational AI state
  ai_conversations: Mutex<HashMap<String, Vec<String>>>,
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      // Initialize our backend state
      app.manage(BackendState::default());
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      greet,
      save_project,
      load_project,
      list_projects,
      delete_project,
      start_backend_server,
      stop_backend_server,
      get_offline_data,
      sync_with_cloud
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn save_project(state: tauri::State<BackendState>, project_id: String, project_data: String) -> Result<(), String> {
  let mut projects = state.projects.lock().unwrap();
  projects.insert(project_id, project_data);
  Ok(())
}

#[tauri::command]
fn load_project(state: tauri::State<BackendState>, project_id: String) -> Result<String, String> {
  let projects = state.projects.lock().unwrap();
  match projects.get(&project_id) {
    Some(data) => Ok(data.clone()),
    None => Err("Project not found".to_string()),
  }
}

#[tauri::command]
fn list_projects(state: tauri::State<BackendState>) -> Result<Vec<String>, String> {
  let projects = state.projects.lock().unwrap();
  Ok(projects.keys().cloned().collect())
}

#[tauri::command]
fn delete_project(state: tauri::State<BackendState>, project_id: String) -> Result<(), String> {
  let mut projects = state.projects.lock().unwrap();
  if projects.contains_key(&project_id) {
    projects.remove(&project_id);
    Ok(())
  } else {
    Err("Project not found".to_string())
  }
}

#[tauri::command]
fn start_backend_server(app_handle: AppHandle) -> Result<u16, String> {
  // In a real implementation, this would start the backend server
  // For now, we'll just return a dummy port
  Ok(8787)
}

#[tauri::command]
fn stop_backend_server() -> Result<(), String> {
  // In a real implementation, this would stop the backend server
  Ok(())
}

#[tauri::command]
fn get_offline_data(state: tauri::State<BackendState>) -> Result<HashMap<String, String>, String> {
  let projects = state.projects.lock().unwrap();
  let mut result = HashMap::new();
  for (key, value) in projects.iter() {
    result.insert(key.clone(), value.clone());
  }
  Ok(result)
}

#[tauri::command]
fn sync_with_cloud(project_id: String, project_data: String) -> Result<bool, String> {
  // In a real implementation, this would sync with the cloud backend
  // For now, we'll just return true indicating success
  println!("Syncing project {} with cloud", project_id);
  Ok(true)
}