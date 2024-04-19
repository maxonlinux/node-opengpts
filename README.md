### ⚠️ DISCONTINUED due to broken AI provider
Interaction with the service provider's endpoints has been discontinued due to additional security measures that restrict interaction not originating from their domain.

### To Do:
- [x] Ability to send prompts and get responses
- [x] Conversation history (interactive communication with model)
- [ ] Authentication and authorization
- [ ] User accounts
- [ ] Multiple chats

### How to use:
1. Install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/get-npm) (Node.js version 18.18.0 and npm version 10.3.0 or higher are recommended).
   
2. Clone the repository:
    ```
    git clone https://github.com/maxonlinux/opengpts-express.git
    ```

3. Navigate to the cloned repository directory:
    ```
    cd <repository_directory>
    ```

4. Install all the dependencies:
    ```
    npm install
    ```

5. To run the application in development mode, execute:
    ```
    npm run dev
    ```

    If you want to run the application in production mode, first build the project:
    ```
    npm run build
    ```

    Then start the production server:
    ```
    npm run start
    ```

    Optionally, you can use `pm2` to set up autostart and other features. See the pm2 documentation [here](https://pm2.keymetrics.io/docs/usage/quick-start/).

    Feel free to reach out if you have any questions or need further assistance!
