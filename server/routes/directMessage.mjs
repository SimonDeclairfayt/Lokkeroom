import express from "express";
import {
  checkIfLobbyExists,
  getTheIdWithTheUsername,
  createLobbyInDB,
  postMsgInLobby,
  addAdminUserInDb,
  searchUsers,
} from "../dbCalls.mjs";
const directMessage = express.Router();

/* Ma logique : DM = Lobby qui n'a que deux personnes 
api/users/:user.post = utiliser l'username de l'user + username donner
si il n'y a rien qui correspond comme nom de lobby contenant user + recherché alors on crée un lobby
et puis on envoie le message sur le lobby
Pour retrouber le lobby a chaque fois il me suffit de rechercher les deux noms et renvoyer des messages pas là et rendre ça impossible de rajouter des utilisateurs


*/
directMessage.post("/users", async (req, res) => {
  const userName = req.body.username;
  if (!userName) return res.send("");
  const filteredUsers = await searchUsers(userName);
  return res.send(filteredUsers);
});

directMessage.post("/users/:user", async (req, res) => {
  const myUserName = req.user.username;
  const otherUserName = req.params.user;
  const message = req.body.message;
  let insertedName = `${myUserName} And ${otherUserName}`;
  const otherUserId = await getTheIdWithTheUsername(otherUserName);
  const result = await checkIfLobbyExists(myUserName, otherUserName);
  if (result.length > 0) {
    await postMsgInLobby(req.user.id, result[0].lobby_id, message);
    return res.send("Sent Message");
  } else {
    const newLobbyId = await createLobbyInDB(insertedName, req.user.id);
    await addAdminUserInDb(newLobbyId, req.user.id);
    await addAdminUserInDb(newLobbyId, otherUserId[0].users_id);
    await postMsgInLobby(req.user.id, newLobbyId, message);
    return res.send("Message Sent");
  }
});
export default directMessage;
