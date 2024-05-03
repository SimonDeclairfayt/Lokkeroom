import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import auth from "./middleware/auth.mjs";
import { returnAllLobbyUserIsIn } from "./dbCalls.mjs";
import loginRoute from "./routes/login.mjs";
import checkLobby from "./routes/checkLobby.mjs";
import handleMessage from "./routes/handleMessage.mjs";
import lobbyControl from "./routes/lobbyControl.mjs";
import directMessage from "./routes/directMessage.mjs";
import cors from "cors";
const app = express();

const allowedOrigins = "http://localhost:5173";
/* (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Origin not allowed by CORS"));
    }
  },*/
const corsOptions = {
  origin: ["http://localhost:5173", "https://lokkerooms-simond.netlify.app"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(process.env.PORT, () => {
  console.log(`Server started at http://localhost:${process.env.PORT}`);
});

//ROUTE FOR LOGIN AND REGISTER
app.use("/api", loginRoute);

//JWT VERYFIER
app.use(auth);

app.get("/", async (req, res) => {
  try {
    let result = await returnAllLobbyUserIsIn(req.user.id);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

//ROUTE TO CHECK/CREATE LOBBY AND VIEW MESSAGE FROM LOBBY OR SPECIFIC MESSAGE FROM LOBBY
app.use("/api", checkLobby);

//POSTING A MSG INSIDE A LOBBY
app.use("/api", handleMessage);

//Adding and removing user from lobby
app.use("/api", lobbyControl);

//DIRECT MESSAGE
app.use("/api", directMessage);
