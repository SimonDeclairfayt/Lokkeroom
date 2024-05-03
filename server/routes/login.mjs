import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import {
  checkUserEmailInDb,
  checkUserNameInDb,
  saveUserInDb,
  checkLastLogin,
  resetTheCount,
  blockTheLogin,
  addOneToLoginCount,
  registerUnregisteredUser,
} from "../dbCalls.mjs";
const loginRoute = express.Router();

//CREATE AN ACCOUNT
loginRoute.post("/register", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    if (!password) {
      console.log(password);
      return res.status(400).send("Missing password");
    } else if (!email) {
      return res.status(400).send("Missing email");
    } else if (!username) {
      return res.status(400).send("Missing username");
    }
    const checkIfEmailAlreadyExists = await checkUserEmailInDb(email);
    console.log(checkIfEmailAlreadyExists);
    const checkIfUsernameAlreadyExists = await checkUserNameInDb(username);
    if (checkIfEmailAlreadyExists.length > 0) {
      if (checkIfEmailAlreadyExists[0].password != null) {
        return res.send("Email already exist");
      } /* Not doing that right now
       else {
        const hashedPassword = await bcrypt.hash(password, 5);
        await registerUnregisteredUser(hashedPassword, username, email);
        return res.send("Your account has been created");
      }*/
    } else if (checkIfUsernameAlreadyExists.length > 0) {
      return res.send("UserName already exist");
    } else {
      const hashedPassword = await bcrypt.hash(password, 5);
      await saveUserInDb(email.toLowerCase(), hashedPassword, username);
      return res.json({ message: "Registration Successful!!" });
    }
  } catch (err) {
    console.log(err);
  }
});
//LOG IN TO THE ACCOUNT
loginRoute.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return !email
        ? res.status(400).send("Missing Email")
        : res.status(400).send("Missing Password");
    }
    let result = await checkUserEmailInDb(email);
    if (result.length > 0) {
      //ANTI BRUTE FORCE
      let expectedTime = new Date(result[0].last_attempt).getTime();
      expectedTime += 60 * 60 * 1000;
      if (result[0].is_locked == true && expectedTime > Date.now()) {
        return res.send("Too many failed attemps try again in an hour");
      }
      if (expectedTime < Date.now()) {
        await resetTheCount(email);
      }
      //LOGIN
      const match = await bcrypt.compare(password, result[0].password);
      if (match) {
        let token = jwt.sign(
          {
            id: result[0].users_id,
            username: result[0].username,
            password: result[0].password,
            email: email,
          },
          process.env.STRONG_KEY,
          { expiresIn: "2h" }
        );
        res.cookie("token", token, {
          path: "/",
          maxAge: 7200000,
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        return res.send({ accessToken: token });
      } else {
        if (result[0].login_attempt == 4) {
          await blockTheLogin(email);
          return res.send("Too many failed attempts you need to wait an hour");
        } else {
          let newCount = result[0].login_attempt + 1;
          await addOneToLoginCount(email, newCount);
          return res.send("Wrong");
        }
      }
    } else {
      res.send("This email does not exists");
    }
  } catch (err) {
    console.log(err);
  }
});
export default loginRoute;
/* 
add to the db two values  : is_locked (boolean)
And logIn_attempt (count)
last_login_attempt date
if last_login_attempt > 1H differnece from now
if is_locked = true means no log in
if logIn_attempt = 5 is_locked == true
*/
