/// <reference types="vite/client" />

// Extend the ImportMetaEnv interface with your environment variables
interface ImportMetaEnv {
    readonly VITE_APP_BASE_URL: string;
    // Add other environment variables here as needed
}

// Extend the ImportMeta interface to include ImportMetaEnv
interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// Define the AppConfig interface here
interface AppConfig {
    VERSION: string;
    TITLE: string;
    DOMAIN: string;
    Dev: string;
    production: string;
}