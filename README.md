# Sustainabli

`npm run dev` to spin up the app in development mode on `http://localhost:3000/`

If you only want to debug the backend and don't need the frontend, run `nodemon server/index.js`

## Pre-Requisites Installations

- node
  - node: 16.x
  - npm: 8.x
- PostgreSQL
  - psql: 14.x
- nodemon

## Project Structure

Server code is hosted in `server/`

Frontend code is hosted in `src/`

- Individual page code is hosted in `src/components/`

- Common components used across multiple pages is hosted in `src/utils/components/`

- Any Frontend utiliy code (e.g. helper functions or constants) are stored in `src/utils/`

- State that needs to persist throughout the app (e.g. userInfo or availableSensors) is handled using Recoil

- Login authentication is handled by AWS Amplify

## Deployment

- Code is pushed to github but app is hosted on Heroku servers

