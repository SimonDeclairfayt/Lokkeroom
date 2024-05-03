import { checkForAdminRight } from "../dbCalls.mjs";
export default async (req, res, next) => {
  const userId = req.user.id,
    lobbyId = req.params.id;
  const result = await checkForAdminRight(userId, lobbyId);
  if (result[0].is_admin == true) {
    next();
  } else {
    return res.status(401).send("You are not an admin");
  }
};
