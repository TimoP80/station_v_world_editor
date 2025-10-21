# Station V - Virtual World Editor Changelog

All notable changes to this project will be documented in this file.

## [1.1.3] - Bug Fixes & Enhancements

### ✨ Features
- **Add Channel-Only Export**: Added an "Export Channels (JSON)" option to the Import/Export modal. This allows for backing up channel configurations independently of user data, offering more granular control over data management.

### 🐛 Bug Fixes
- **Fix User Re-import Error**: Corrected an issue where the "Export Users (JSON)" function, intended for the simulator, would strip essential editor data (like the `id` field). This prevented the exported file from being re-imported into the editor. The export now preserves all original data, making the file fully compatible for both simulator use and editor re-importing.

## [1.1.2] - Documentation Update

### 📚 Documentation

- **Add World Export Format Documentation**: Created a new detailed HTML document (`WorldEditor_JSON_WorldExport.html`) that specifies the structure of the "World Export" JSON file. This documentation clarifies the format used for creating full backups of the editor's state, distinguishing it from the simulator-specific user export.

## [1.1.1] - Compatibility Fix

### 🐛 Bug Fixes

- **Fix JSON Export Compatibility**: The "Full World" JSON export format was incompatible with the main Station V IRC Simulator, which expects a simple array of users.
  - Added a new, dedicated **"Export Users (JSON)"** button. This option generates a file containing only the user list in the correct format for the simulator.
  - The original JSON export has been renamed to **"Export World (JSON)"** and is now intended for full editor backups only.
  - The UI has been updated to clearly separate the export options for "Simulator Compatibility" versus "Full World Backup" to prevent confusion.

## [1.1.0] - UI Enhancements & Data Sync

### 🚀 Features & Enhancements

#### ✨ **User List View Switcher**
- **New List View**: The user list now defaults to a compact, single-column "List View" that is easier to scan when managing a large number of users.
- **View Toggle**: A new icon-based toggle in the "Virtual Users" header allows you to seamlessly switch between the new scannable list and the original detailed grid view.
- **Improved Readability**: The list view provides a cleaner, more organized way to browse users, showing essential information at a glance.

#### 💾 **Unified World Data Format**
- **Robust JSON Export**: Exporting to JSON now saves a single, structured "world" file containing both `users` and `channels`. This unified format prevents data sync issues with the main IRC simulator.
- **Smarter Import Logic**: The import system now intelligently detects the JSON structure, ensuring backward compatibility with older, user-only JSON files while supporting the new world format.
- **UI Clarity**: The text in the Import/Export modal has been updated to clearly distinguish between a "Full World" (JSON) export and a "Users Only" (CSV) export.

## [1.0.0] - Initial Release

### Summary

This is the first public release of the Station V - Virtual World Editor, a comprehensive tool for creating and managing AI personalities for the Station V IRC Simulator. This version includes robust user and channel management, powerful AI-driven generation capabilities, and full data portability.

### ✨ Features

#### 👤 User Management
- **Create, Edit, & Delete Users**: A full CRUD interface for managing individual virtual users.
- **Advanced User Profiles**: Define users with a deep set of attributes:
  - **Personality**: A free-text description of the user's persona.
  - **Language Skills**: Assign multiple languages with fluency levels (Native to Beginner) and optional accents/dialects.
  - **Writing Style**: Fine-tune AI communication style with controls for formality, verbosity, humor, emoji usage, and punctuation.
- **Mass User Generation**:
  - **Mass Add Modal**: Create between 1 and 50 users at once.
  - **Multiple Generation Methods**:
    - **Template-based**: Use predefined personality archetypes.
    - **AI-Powered**: Let Gemini generate completely unique and creative users.
    - **Random**: Quickly generate users with randomized attributes.
- **Visual User Cards**: View all users and their key traits at a glance on the main dashboard.
- **Clear All Users**: A utility function to completely reset the user list, with a confirmation step.

#### 💬 Channel Management
- **Create, Edit, & Delete Channels**: Full management for IRC-style channels.
- **Channel Attributes**: Define a channel's name (which must start with `#`) and its topic.
- **User Assignment**: A simple and intuitive checklist interface within the channel editor allows you to assign any created user to one or more channels.
- **Visual Channel Cards**: View all created channels and their user counts on the main dashboard.
- **Clear All Channels**: A utility to delete all channels at once, with a confirmation dialog.

#### 🤖 AI-Powered Generation
- **Google Gemini Integration**: Leverages the `@google/genai` library to power creative generation tasks.
- **AI Model Selection**: Choose the best AI model for your needs from a dropdown in Settings:
  - Gemini 2.5 Flash (Fast, Low Cost)
  - Gemini Flash (Balanced)
  - Gemini 2.5 Pro (Highest Quality)
- **AI Nickname Generation**: A "Randomize" button in the user form uses the AI to generate a unique, creative nickname.

#### 💾 Data Portability & Persistence
- **Import/Export System**: Easily move user data in and out of the application.
  - **JSON Support**: Export and import user profiles with full data fidelity.
  - **CSV Support**: Export and import data using a spreadsheet-friendly format.
- **Local Storage Persistence**: All of your created users and channels are automatically saved in your browser's local storage, so your work is preserved between sessions.

#### ⚙️ Configuration & UI
- **Centralized Settings**: A dedicated settings modal to configure the AI model and manage channels.
- **Modern Dark-Themed UI**: A clean, responsive interface built with Tailwind CSS.
- **Intuitive Modals**: All creation, editing, and confirmation tasks are handled in easy-to-use modals.
- **Form Validation**: Real-time validation on user and channel forms prevents bad data and provides helpful error messages.
- **Keyboard Shortcuts**: Close any open modal by pressing the `Escape` key.