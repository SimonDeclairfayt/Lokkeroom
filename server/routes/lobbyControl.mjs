import express from "express";
import checkAdminRights from "../middleware/checkAdminRights.mjs";
import {
  addUnregisteredUser,
  addUserToDb,
  getTheIdWithTheUsername,
  removeUserToDb,
} from "../dbCalls.mjs";
const lobbyControl = express.Router();

lobbyControl.use("/lobby/:id", checkAdminRights);

lobbyControl.post("/lobby/:id/add-user", async (req, res) => {
  if (req.body.username) {
    const userName = req.body.username;
    const lobbyId = req.params.id;
    const userNameToId = await getTheIdWithTheUsername(userName);
    if (userNameToId.length <= 0) {
      return res.status(404).send("User not found");
    } else {
      await addUserToDb(lobbyId, userNameToId[0].users_id);
      return res.status(201).send("User addded");
    }
  } else {
    return res.status(201).send("Need an username at least");
  }
  /* else {
    if (req.body.email) {
      const email = req.body.email;
      await addUnregisteredUser(email);
      return res.send("New user added to db");
    } else {
      return res.send("We at least need an email to invite this new user");
    }
  }*/
});

lobbyControl.post("/lobby/:id/remove-user", async (req, res) => {
  const userName = req.body.username,
    lobbyId = req.params.id,
    userNameToId = await getTheIdWithTheUsername(userName);
  if (userNameToId.length <= 0) {
    return res.status(404).send("User not found");
  } else {
    await removeUserToDb(lobbyId, userNameToId[0].users_id);
    return res.status(200).send("User removed from group");
  }
});

export default lobbyControl;
