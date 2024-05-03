import express from "express";
import checkForUser from "../middleware/checkForUser.mjs";
import {
  addAdminUserInDb,
  createLobbyInDB,
  getAllMsgFromLobby,
  getASpecificMsgFromLobby,
  checkForAdminRight,
} from "../dbCalls.mjs";
const checkLobby = express.Router();

//CREATE A LOBBY
checkLobby.post("/lobby", async (req, res) => {
  const lobbyName = req.body.name;
  const creatorId = req.user.id;
  const newLobbyId = await createLobbyInDB(lobbyName, creatorId);
  await addAdminUserInDb(newLobbyId, creatorId);
  return res.send(
    `New lobby created at http://localhost:3333/api/lobby/${newLobbyId}`
  );
});
checkLobby.use("/lobby/:id", checkForUser);
//VIEW ALL MESSAGES FROM LOBBY
checkLobby.get("/lobby/:id", async (req, res) => {
  try {
    const lobbyId = req.params.id;
    const userId = req.user.id;
    const allMessages = await getAllMsgFromLobby(lobbyId);
    const adminRights = await checkForAdminRight(userId, lobbyId);
    return res.send([allMessages, adminRights]);
  } catch (err) {
    console.error(err);
  }
});
checkLobby.get("/lobby/:id/:msgId", async (req, res, next) => {
  const msgId = req.params.msgId;
  const specificMessage = await getASpecificMsgFromLobby(msgId);
  if (specificMessage.length <= 0) {
    return res.send("There is no message with that Id");
  } else {
    return res.send({
      message: specificMessage[0].message,
      username: specificMessage[0].users.username,
    });
  }
});

export default checkLobby;
