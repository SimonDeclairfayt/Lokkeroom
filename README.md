# Lokkeroom

Lokkeroom is a Full-Stack chat application using React/Supabase/Express/Node. This is an exercise done for Becode where we had to build a backend in around 5 days and the frontend in 4 days.
🔗 The link for the actual website is [Here](https://lokkerooms-simond.netlify.app/)

## Summary

This Readme separates in two parts

- [1: The Frontend Part](#frontend)
- [2: The Backend Part](#backend)

# Frontend

## Working on the project

For working on the frontend it's pretty easy you just need to fork this project then :

```
    cd project/client
    npm install
    npm run dev
```

To fetch they use the deployed database if you want to work on the backend you should do these commands in a split terminal :

```
    cd project/server
    npm install
    npm run start
```

And then change the fetch links to your localhost.

## Features

Most of the features that you see in the Backend part are done on the website (Authentication/Create Message Lobbies/Messaging system/Controlling Lobbies)

### To improve

- Make all the lobbies that you are a part of visible on desktop (but not on mobile)
- Improve UX of delete Messages
- Use Context or socket.io to display messages in real time for both users (no need to refresh)

### To add

- Logging out (pretty basic but i forgot oups)
- Updating messages from the lobbies
- Direct Messages (might need to alter the backend for that one)

# Backend

## Features

### Authentication

In order to view lobbies or messages from said lobbies you need to be registered to the application and logged in.
For that you need to make a POST request to the `api/register` with your username/email/password or another POST request to the `api/login` with just email/password

### Create message lobbies

Users can also create lobbies by making a POST request to `api/lobby` with just the name of the Lobby it then returns the lobby_id of newly created lobby

### Messaging system

Users can send messages to lobbies they are members of by making a POST request to `api/lobby/:lobbyId` with their message in the body, they can also edit their messages (Lobby admins can edit everyone's messages) by making a PATCH request to `api/lobby/:lobbyId/:msgId` with the new message content to the body. To delete it is kind of the same as PATCH but instead it is a DELETE request that doesn't need a value in Body.

### Controlling lobbies

You can add a user to a lobby making a POST request to `api/lobby/:lobbyId/add-user` with just the concerned user's Username to the body and for removing an user from a lobby it's also a POST request but this time to `api/lobby/:lobbyId/remove-user` with the user's username in the body.

### Direct messages

You can direct message someone by making a POST request to `api/users/:username` with the message content in the body which will then create a lobby with just you two inside and where you can post messages to by reusing the same method or going through the `api/lobby/:lobbyId` POST method.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`STRONG_KEY` for JWT

`SUPABASE_KEY` and `SUPABASE_URL` to make supabase work
