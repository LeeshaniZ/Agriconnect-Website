# AgriConnect

AgriConnect is a web-based agricultural supply-chain management project designed to connect farmers, suppliers, and buyers while supporting day-to-day operations such as inventory, supplier records, and purchase orders.

## Project overview

The repository contains the AgriConnect web application. The project uses a Node.js backend, Bootstrap-based frontend components, and Firebase services for data and authentication.

## Technology

- **Backend:** Node.js
- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Data and authentication:** Firebase / Cloud Firestore (as configured in the project)

## Getting started

1. Install a supported version of Node.js.
2. Review the application folders and install dependencies from the relevant package directory.
3. Create or configure a Firebase project with the services required by the application.
4. Configure Firebase credentials locally.
5. Start the application using the scripts provided in its package configuration.

## Security

Do not commit Firebase service-account JSON files, private keys, passwords, or environment-specific configuration. Keep local credentials outside version control and provide a placeholder example when documenting required settings.

## Notes

This README describes the project at a high level. Refer to the source folders for the current implementation and available scripts.


## Repository status and setup limitations

The current repository contains frontend pages and several Express route modules, but it does not yet include a complete, reproducible backend setup. In particular, the route middleware imports a Firebase Admin module from `config/firebaseAdmin`, and the repository currently does not contain that configuration module or a Node.js package manifest. A fresh clone therefore needs those backend setup files before the API can be started reliably.

Before running the backend, add a package manifest with the required dependencies and provide Firebase Admin credentials through environment variables or a securely mounted service-account file. Never commit Firebase private keys or service-account JSON files. The Firebase Admin initialisation module should validate its configuration and fail clearly when required credentials are missing.

The source folder currently has a trailing space in its name (`agriconnect12 `). Keep that exact folder name when navigating the existing source tree, or rename it consistently across the repository before changing import paths.
