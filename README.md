# AgriConnect

AgriConnect is a web-based agricultural supply-chain management project designed to connect farmers, suppliers, and buyers while supporting day-to-day operations such as inventory, supplier records, and purchase orders.

## Project overview

The repository contains the AgriConnect web application. The project uses a Node.js backend, Bootstrap-based frontend components, and Firebase services for data and authentication.

## Technology

- **Backend:** Node.js
- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Data and authentication:** Firebase / Cloud Firestore (as configured in the project)

## Getting started

The Node.js backend and Firebase Admin setup are now included under the `agriconnect12 ` directory (the directory name currently contains a trailing space).

1. Install Node.js 18 or later.
2. Open a terminal and enter the project directory:

   ```powershell
   cd "agriconnect12 "
   ```

3. Install backend dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env`. Set `GOOGLE_APPLICATION_CREDENTIALS` to the absolute path of a Firebase service-account JSON file stored outside this repository. The Firebase project must have Firestore enabled.
5. Start the API and static frontend:

   ```bash
   npm start
   ```

6. Open `http://localhost:5000/login.html`. Check `http://localhost:5000/api/health` to confirm the server is responding.

The frontend uses Firebase Authentication. Configure the Firebase project's authorised domains and authentication providers in the Firebase console. Do not put Firebase Admin service-account credentials in frontend code or commit them to Git.

## Security

Do not commit Firebase service-account JSON files, private keys, passwords, or environment-specific configuration. Keep local credentials outside version control and provide a placeholder example when documenting required settings.

## Notes

This README describes the project at a high level. Refer to the source folders for the current implementation and available scripts.


## Repository notes

- The existing source directory is named `agriconnect12 ` with a trailing space. Keep that exact name when opening it from a terminal, or rename it in a separate change that updates all references.
- The analytics export endpoint referenced by the frontend is not yet implemented in the current backend routes.
- Payment totals in the dashboard route are placeholder values and should not be presented as live financial data.
- Firebase Admin requires local Application Default Credentials through `GOOGLE_APPLICATION_CREDENTIALS`; no service-account key is included in this repository.
