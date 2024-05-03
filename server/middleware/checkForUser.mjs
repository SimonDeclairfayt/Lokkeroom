import { checkIfUserInLobby } from "../dbCalls.mjs";
export default async (req, res, next) => {
  const lobbyId = req.params.id;
  const userId = req.user.id;
  const userInLobby = await checkIfUserInLobby(lobbyId, userId);
  if (userInLobby.length <= 0) {
    return res.status(400).send("You are not allowed in this lobby");
  } else {
    next();
  }
};
