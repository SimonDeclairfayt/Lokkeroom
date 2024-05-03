import jwt from "jsonwebtoken";
export default async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Unauthorized");
  try {
    const decoded = jwt.verify(token, process.env.STRONG_KEY);
    if (decoded !== undefined) {
      req.user = decoded;
      next();
    } else {
      return res.status(403).send("Invalid Token"); // Consider returning a specific error response for clarity
    }
  } catch (err) {
    console.log(err);
    return res.status(401).send("Unauthorized");
  }
};
