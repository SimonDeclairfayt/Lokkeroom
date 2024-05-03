import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL; // Replace with your Supabase project URL
const supabaseAnonKey = process.env.SUPABASE_KEY; // Replace with your Supabase Anon Key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function returnAllLobbyUserIsIn(userId) {
  const { data, error } = await supabase
    .from("lobby_members")
    .select("lobby(lobby_id,lobby_name)") // Select all columns with '*'
    .eq("users_id", userId); // Filter by email using 'eq' (equal to)

  if (error) {
    console.error(error); // Re-throw the error for handling in the calling function
  }

  return data;
}

export async function saveUserInDb(email, password, username) {
  const { data, error } = await supabase.from("users").insert([
    {
      email: email,
      password: password,
      username: username,
      is_registered: true,
    },
  ]);
  if (error) {
    console.error(error);
  }
  return data;
}
export async function checkUserEmailInDb(email) {
  //return db.query(`SELECT * FROM users WHERE email = '${email}'`);
  const { data, error } = await supabase
    .from("users")
    .select("*") // Select all columns with '*'
    .eq("email", email); // Filter by email using 'eq' (equal to)

  if (error) {
    console.error(error); // Re-throw the error for handling in the calling function
  }

  return data;
}
export async function checkUserNameInDb(username) {
  //return db.query(`SELECT * FROM users WHERE username = '${username}'`);
  const { data, error } = await supabase
    .from("users")
    .select("*") // Select all columns with '*'
    .eq("username", username); // Filter by email using 'eq' (equal to)

  if (error) {
    console.error(error); // Re-throw the error for handling in the calling function
  }

  return data;
}
export async function createLobbyInDB(lobbyName, creatorId) {
  /*await db.query(`INSERT INTO lobby (creator_id,lobby_name) VALUES ($1,$2)`, [
    creatorId,
    lobbyName,
  ]);
  return db.query(
    `SELECT lobby_id FROM lobby WHERE creator_id = ${creatorId} ORDER BY date_created DESC LIMIT 1`
  );*/
  const { data, error } = await supabase
    .from("lobby")
    .insert([{ creator_id: creatorId, lobby_name: lobbyName }])
    .select("lobby_id");

  if (error) {
    console.error(error);
  }
  return data[0].lobby_id;
}
export async function addAdminUserInDb(lobbyId, creatorId) {
  /*
  return db.query(
    `INSERT INTO lobby_members (lobby_id,users_id,is_admin) VALUES ($1,$2,$3)`,
    [lobbyId, creatorId, true]
  );*/
  const { data, error } = await supabase
    .from("lobby_members")
    .insert([{ users_id: creatorId, lobby_id: lobbyId, is_admin: true }])
    .select("lobby_id");
  if (error) {
    console.error(error);
  }
  return data[0].lobby_id;
}
export async function checkIfUserInLobby(lobbyId, userId) {
  //return db.query(`SELECT * FROM lobby_members WHERE users_id = '${userId}' AND lobby_id = '${lobbyId}'`);
  const { data, error } = await supabase
    .from("lobby_members")
    .select("*")
    .eq("users_id", userId)
    .eq("lobby_id", lobbyId);
  if (error) {
    console.error(error);
  }
  return data;
}
export async function getAllMsgFromLobby(lobbyId) {
  //return db.query(`SELECT message,username FROM messages INNER JOIN users ON users.users_id = messages.users_id WHERE lobby_id=${lobbyId} ORDER BY message_id DESC LIMIT 10`);
  const { data, error } = await supabase
    .from("messages")
    .select("message,message_id, users (users_id,username)")
    .eq("lobby_id", lobbyId)
    .order("message_id", { ascending: false });

  if (error) {
    console.error(error); // Re-throw the error for handling in the calling function
  }

  return data;
}
export async function getASpecificMsgFromLobby(msgId) {
  //return db.query(`SELECT message,username FROM messages INNER JOIN users ON users.users_id = messages.users_id WHERE message_id=${msgId}`);
  const { data, error } = await supabase
    .from("messages")
    .select("message,message_id, users (users_id,username)") // Select specific columns
    .eq("message_id", msgId);
  if (error) {
    console.error(error);
  }
  return data;
}
export async function postMsgInLobby(usersId, lobbyId, msgContent) {
  //return db.query(`INSERT INTO messages (users_id,lobby_id,message) VALUES ($1,$2,$3)`,[usersId, lobbyId, msgContent]);
  const { data, error } = await supabase
    .from("messages")
    .insert([{ users_id: usersId, lobby_id: lobbyId, message: msgContent }])
    .select("message_id");
  if (error) {
    console.error(error); // Re-throw the error for handling in the calling function
  }

  return data[0].message_id;
}
export async function checkForAdminRight(usersId, lobbyId) {
  //return db.query(`SELECT is_admin FROM lobby_members WHERE users_id=${usersId} AND lobby_id=${lobbyId}`);
  const { data, error } = await supabase
    .from("lobby_members")
    .select("is_admin,users_id")
    .eq("users_id", usersId)
    .eq("lobby_id", lobbyId);
  if (error) console.error(error);
  return data;
}
export async function updateSpecificMsg(msgId, msgContent) {
  //return db.query(`UPDATE messages SET message=($1) WHERE message_id=($2)`, [msgContent,msgId,]);
  const { data, error } = await supabase
    .from("messages")
    .update({ message: msgContent })
    .match({ message_id: msgId });
  if (error) console.error(error);
  return data;
}
export async function deleteSpecificMsg(msgId) {
  //return db.query(`DELETE FROM messages WHERE message_id=($1)`, [msgId]);
  const { data, error } = await supabase
    .from("messages")
    .delete()
    .match({ message_id: msgId });
  if (error) console.error(error);
  return data;
}
export async function getTheIdWithTheUsername(username) {
  //return db.query(`SELECT users_id FROM users WHERE username =($1)`, [username,]);
  const { data, error } = await supabase
    .from("users")
    .select("users_id")
    .eq("username", username);
  if (error) console.error(error);
  return data;
}
export async function addUserToDb(lobbyId, userId) {
  //return db.query(`INSERT INTO lobby_members (lobby_id,users_id,is_admin) VALUES ($1,$2,false)`,[lobbyId, userId]);
  const { data, error } = await supabase
    .from("lobby_members")
    .insert([{ lobby_id: lobbyId, users_id: userId, is_admin: false }]);
  if (error) console.error(error);
  return data;
}
export async function removeUserToDb(lobbyId, userId) {
  //return db.query(`DELETE FROM lobby_members WHERE lobby_id=($1) AND users_id=($2)`,[lobbyId, userId]);
  const { data, error } = await supabase
    .from("lobby_members")
    .delete()
    .match({ lobby_id: lobbyId, users_id: userId });
  if (error) console.error(error);
  return data;
}
export async function checkLastLogin(email) {
  //return db.query(`SELECT is_blocked,login_attempt,last_attempt FROM users WHERE email = ($1)`,[email]);
  const { data, error } = await supabase
    .from("users")
    .select("is_blocked", "login_attempt", "last_attempt")
    .eq("email", email);
  if (error) console.error(error);
  return data;
}
export async function addOneToLoginCount(email, newCount) {
  //return db.query(`UPDATE users SET login_attempt = ${newCount}, last_attempt = now() WHERE email = ($1)`,[email]);
  const { data, error } = await supabase
    .from("users")
    .update({
      login_attempt: newCount,
      last_attempt: "now()",
    })
    .match({ email: email });
  if (error) console.error(error);
  return data;
}
export async function resetTheCount(email) {
  //return db.query(`UPDATE users SET login_attempt = 0,  is_blocked = false, last_attempt = now() WHERE email = ($1)`,[email]);
  const { data, error } = await supabase
    .from("users")
    .update({
      login_attempt: 0,
      is_blocked: false,
      last_attempt: "now()",
    })
    .match({ email: email });
  if (error) console.error(error);
  return data;
}
export async function blockTheLogin(email) {
  //return db.query(`UPDATE users SET login_attempt = 5, is_blocked = true, last_attempt = now() WHERE email = ($1)`,[email]);
  const { data, error } = await supabase
    .from("users")
    .update({
      login_attempt: 5,
      is_blocked: true,
      last_attempt: supabase.functions("now"),
    })
    .match({ email: email });
  if (error) console.error(error);
  return data;
}
export async function checkIfLobbyExists(username, searchedName) {
  //return db.query(`SELECT * FROM lobby WHERE lobby_name LIKE '%${username}%' AND lobby_name LIKE '%${searchedName}%' `);
  const { data, error } = await supabase
    .from("lobby")
    .select("*")
    .textSearch("lobby_name", `'${username}' & '${searchedName}'`);
  if (error) console.error(error);
  return data;
}
export async function searchUsers(value) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .ilike("username", `%${value}%`);

  if (error) {
    console.error("error searching users:", error);
    return;
  }
  return data;
}

export async function addUnregisteredUser(email) {
  //return db.query(`INSERT INTO users (email) VALUES ($1)`, [email]);
}
export function registerUnregisteredUser(password, username, email) {
  return db.query(
    `UPDATE users SET password = ($1),username = ($2),is_registered = true WHERE email = ($3)`,
    [password, username, email]
  );
}
