<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#Installation Set up">Installation Set up</a></li>
    <li><a href="#features">Features</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

The Note App with effective with real time colloboration feature


<p align="right">(<a href="#readme-top">back to top</a>)</p>






### Installation Set up

_Below are the instructions to run the complete project._


1. Clone the repo
   ```sh
   git clone https://github.com/roshidhmohammed/NOTES_APP_BACKEND
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Create a .env file at the root of your project.

5. Set up the `.env` file
   ```js
   ```

6. Run command below to start the project
   ```sh
     npm run dev
    ```


<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- features -->
## features

- [x] User Authentication and authorization
      - User registration (email, password, username)
      - Password hashing with bcrypt
      - Login with JWT token generation
      - Secure routes using userAuth middleware
      - Store JWT in cookies 
      - Logout (clear cookie)

- [x] User Authentication and authorization using JWT token
      - Create a new note (auto-assign current user as creator)
      - Rich-text content support (store HTML from Tiptap editor)
      - Update note content/title (only for creator or editor)
      - Get all notes where the user is: creator, collaborator (editor or viewer)
      - Delete a note (only if user is creator or has editor role)

- [x] Collaboration & Permissions
      - Add collaborator to a note by user ID
      - Assign role to collaborator: "editor" or "viewer"
      - Prevent duplicate collaborators
      - Middleware: checkNoteAccess for editor-only operations

- [x] Note Filtering & Search
      - Support GET /notes?search=""&filter="" -  search on title or content, filter (e.g. by role or ownership)
    
- [x] WebSocket (Real-Time Collaboration)
      - Connect to note by noteId
      - Check permission (creator or editor)
      - Broadcast updates to all connected clients

- [x] Utilities & Middleware
      - userAuth middleware for token validation
      - noteAccessAuth middleware for write-access
      - Error handling with proper status codes and messages
      - API Level validation for input data

    



<p align="right">(<a href="#readme-top">back to top</a>)</p>

