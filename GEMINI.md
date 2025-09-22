# GEMINI.md

## Project Overview

This project is a "Vocab Vault," a dynamic, single-page web application for building and managing a personal vocabulary list. Users can add, edit, and delete words, along with their definitions, example sentences, and types (noun, verb, etc.).

The application is built with:

*   **Frontend:** HTML, vanilla JavaScript
*   **Backend:** Node.js with Express
*   **Styling:** Tailwind CSS (via CDN)
*   **Data Storage:** JSON file (`db.json`)

## Features

*   **CRUD Operations:** Create, Read, Update, and Delete vocabulary words.
*   **Search:** Filter words by text or definition.
*   **Sort:** Sort words alphabetically or by date added.
*   **Pagination:** Paginate through the word list.
*   **Dark Mode:** Toggle between light and dark themes.
*   **Mobile Responsive:** The application is designed to be used on mobile devices.

## Building and Running

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Start the Server:**

    ```bash
    npm start
    ```

3.  **View the Application:**

    Open the `index.html` file in a web browser.

## Development Conventions

*   **Component-Based Structure:** UI elements are broken down into separate HTML files in the `components/` directory and loaded dynamically with JavaScript.
*   **API-Driven:** The frontend communicates with a Node.js backend to perform CRUD operations.
*   **Dynamic Rendering:** The word list is rendered dynamically in `js/app.js` using a template from `components/word-card.html`.
*   **Styling:** Utility-first styling is provided by Tailwind CSS.
*   **Dark Mode:** Dark mode is implemented using Tailwind CSS and `localStorage` to save the user's preference.
