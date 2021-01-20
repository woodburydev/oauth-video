# OAuth Video -> The Repository for the Backend of the OAuth2.0 Project Video

## Introduction

Development Branch -> For coding locally (start by running "yarn run dev")
Main Branch -> For production builds and deploying (start by running "yarn build" then "yarn start")

This is the Github Repo for the code built inside of the passport OAuth2.0 youtube video I made..
The video can be found here: https://www.youtube.com/watch?v=cD17CYA1dck&ab_channel=NathanielWoodbury

This code is ready to be deployed to Heroku (it is production ready on the main branch)

When deploying this code ensure that you fill out the ENVIORNMENT variables when deploying, so that the application runs.

Ensure *ALL* Auth providers match your respective backend endpoints:

Google -> https://console.developers.google.com/apis/dashboard
Twitter -> https://developer.twitter.com/en/portal/dashboard
Github -> https://github.com/settings/developers

## For Development:

Switch to "Development" branch (git rebase -b Development)
Fill out .env file with your secrets
Make sure all auth providers are setup for http://localhost:4000
Start ("yarn run dev")

## For Production:

Switch to main branch (git rebase -b main)
Fill out .env file with your secrets
Make sure all auth providers are setup for your heroku app you made

If you are building this locally, ensure you make a file called .env and fill out the variables such as I have done in the youtube video, and make sure 
you are redirecting to your front-end successfully after authentication.
