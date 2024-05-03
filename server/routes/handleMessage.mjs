import express from "express";
import checkForUser from "../middleware/checkForUser.mjs";
import {
  postMsgInLobby,
  getASpecificMsgFromLobby,
  checkForAdminRight,
  updateSpecificMsg,
  deleteSpecificMsg,
} from "../dbCalls.mjs";
const handleMessage = express.Router();
handleMessage.use("/lobby/:id", checkForUser);

handleMessage.post("/lobby/:id", async (req, res) => {
  try {
    const msgContent = req.body.message;
    const lobbyId = req.params.id;
    const usersId = req.user.id;
    const idFromPostedMessage = await postMsgInLobby(
      usersId,
      lobbyId,
      msgContent
    );
    const messageYouJustPosted = await getASpecificMsgFromLobby(
      idFromPostedMessage
    );
    return res.send(messageYouJustPosted);
  } catch (err) {
    console.error(err);
  }
});

handleMessage.patch("/lobby/:id/:msgId", async (req, res) => {
  const msgId = req.params.msgId,
    userId = req.user.id,
    userName = req.user.username;
  const specificMessage = await getASpecificMsgFromLobby(msgId);
  const adminRight = await checkForAdminRight(userId, req.params.id);
  if (specificMessage.length > 0) {
    if (
      specificMessage[0].username == userName ||
      adminRight[0].is_admin == true
    ) {
      await updateSpecificMsg(msgId, req.body.message);
      return res.status(200).send("Message Updated");
    } else {
      return res.send("You don't have the permission to do so");
    }
  } else {
    return res.send("There is no messages with that id");
  }
});
handleMessage.delete("/lobby/:id/:msgId", async (req, res) => {
  const msgId = req.params.msgId,
    userId = req.user.id,
    userName = req.user.username;
  const specificMessage = await getASpecificMsgFromLobby(msgId);
  const adminRight = await checkForAdminRight(userId, req.params.id);
  if (specificMessage.length > 0) {
    if (
      specificMessage[0].username == userName ||
      adminRight[0].is_admin == true
    ) {
      await deleteSpecificMsg(msgId);
      return res.status(200).send("Message Deleted");
    } else {
      return res.send("You don't have the permission to do so");
    }
  } else {
    return res.send("There is no messages with that id");
  }
});
export default handleMessage;
