# Collabox in Angular

This project is a rewrite of a previous React project to Angular, which we implemented in a team of two: https://github.com/bbucsek/collabox/ The application is implemented in Angular 11 using Redux Toolkit with angular-redux store. Firebase is used for authentication and Firestore for the NOSQL database. I used Sass as CSS preprocessor. 

## Project status

Some core features (creating playlists, adding and voting on songs, playing the playlist, following and unfollowing) have been implemented in the application. Starting a quarantine party and adding further tests are planned for the later sprints. 

## How to use the application

### Create and follow playlists
Create a playlist and add songs that are shorter than 10 minutes by submitting a youtube url. The playlist owner can delete songs and the playlist itself.

### Listen to the playlist 
Play your playlists as many times as you want. You will not see the youtube video, but you can control the playback (skipping among songs, (un)muting, pausing, stopping).

### Voting on songs
You can upvote/downvote each song in the playlists. The order of the songs in the playlist is determined by their popularity.

## Run the application

Run ` ng serve --configuration=localhost` for a dev server. Navigate to `http://localhost:4200/`. Firebase API key and other configurations are needed to run the application. 

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

