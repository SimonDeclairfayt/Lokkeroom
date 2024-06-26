
# Lokkeroom

Just a simple back end for a full stack web application where you can create channels to talk.

## My tech stack

I used node.js and express to build it and for the db i first made it using pg and PostgreSQL but for deployment i ended up using Supabase.

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

