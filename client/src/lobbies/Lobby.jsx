import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import addUser from "../assets/add-user.png";
import Modal from "../modal/Modal";
import "./lobby.css";
export default function Lobby() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const lobbyId = useParams().id;
  const [isOpen, setIsOpen] = useState(false);
  const [lobbyMessages, setLobbyMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  //Fetching the data
  useEffect(() => {
    //GETTING ALL THE MESSAGES
    async function fetchMessages() {
      try {
        const response = await fetch(
          `https://lokkerroom-simon-40551508c11d.herokuapp.com/api/lobby/${lobbyId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          navigate("/");
        }
        const data = await response.json();
        setLobbyMessages(data[0]);
        setUserId(data[1][0].users_id);
        setIsAdmin(data[1][0].is_admin);
      } catch (err) {
        console.error(err);
      }
    }
    fetchMessages();
  }, []);
  //Submit message to add to the list
  const messageRef = useRef(null);
  const sendMessages = async (event) => {
    event.preventDefault();
    let messageValue = messageRef.current.value;
    if (!messageValue) return;
    try {
      const requestBody = JSON.stringify({ message: messageValue });
      let postMessage = await fetch(
        `https://lokkerroom-simon-40551508c11d.herokuapp.com/api/lobby/${lobbyId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
          credentials: "include",
        }
      );
      if (!postMessage.ok) console.error(postMessage);
      const data = await postMessage.json();
      setLobbyMessages([data[0], ...lobbyMessages]);
      messageRef.current.value = "";
    } catch (err) {
      console.error(err);
    }
  };
  const deleteMessage = async (id) => {
    try {
      const deleteFetch = await fetch(
        `https://lokkerroom-simon-40551508c11d.herokuapp.com/api/lobby/${lobbyId}/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!deleteFetch.ok) console.error(deleteFetch);
      navigate(0);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <section className="lobbyMsg-container">
      <div className={`lobbyMsg-nav ${!isAdmin && "flex-space"}`}>
        <Link to="/">
          <svg
            className="arrow"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m9.474 5.209s-4.501 4.505-6.254 6.259c-.147.146-.22.338-.22.53s.073.384.22.53c1.752 1.754 6.252 6.257 6.252 6.257.145.145.336.217.527.217.191-.001.383-.074.53-.221.293-.293.294-.766.004-1.057l-4.976-4.976h14.692c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-14.692l4.978-4.979c.289-.289.287-.761-.006-1.054-.147-.147-.339-.221-.53-.221-.191-.001-.38.071-.525.215z" />
          </svg>
        </Link>
        <h1 className="title--lobby">{state.lobbyName}</h1>
        {isAdmin && (
          <>
            <button className="btn--adduser" onClick={() => setIsOpen(true)}>
              <img
                src={addUser}
                alt="Just a button to add users"
                className="img--adduser"
              />
            </button>
            {isOpen && <Modal setIsOpen={setIsOpen} lobbyId={lobbyId} />}
          </>
        )}
      </div>

      <ul className="allMessage-container">
        {lobbyMessages.length != 0 ? (
          lobbyMessages.map((message) => {
            return (
              <li key={message.message_id}>
                {isAdmin ? (
                  <div className="message-container">
                    {message.users.users_id === userId ? (
                      <>
                        <div className="option-container option-container--mine">
                          <button
                            className={`delete-button`}
                            onClick={() => deleteMessage(message.message_id)}
                          >
                            Delete message
                          </button>
                        </div>
                        <p className="message message--mine">
                          {message.message}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="option-container">
                          <button
                            className={`delete-button`}
                            onClick={() => deleteMessage(message.message_id)}
                          >
                            Delete message
                          </button>
                        </div>
                        <p className="username">{message.users.username}</p>
                        <p className="message message--other">
                          {message.message}
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    {message.users.users_id === userId ? (
                      <div className="message-container">
                        <div className="option-container option-container--mine">
                          <button
                            className={`delete-button`}
                            onClick={() => deleteMessage(message.message_id)}
                          >
                            Delete message
                          </button>
                        </div>
                        <p className="message message--mine">
                          {message.message}
                        </p>
                      </div>
                    ) : (
                      <div className="message-container">
                        <p className="username">{message.users.username}</p>
                        <p className="message message--other">
                          {message.message}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </li>
            );
          })
        ) : (
          <li className="warning">
            <p>No messages Yet</p>
          </li>
        )}
      </ul>
      <form onSubmit={sendMessages} className="sendMessage-container">
        <input
          type="text"
          name="send"
          className="input-message"
          placeholder="Your message here"
          ref={messageRef}
        />
        <button type="submit" className="btn--send">
          <svg
            width="16"
            height="14"
            viewBox="0 0 16 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="send-svg"
          >
            <path
              d="M2.99811 5.2467L3.43298 6.00772C3.70983 6.4922 3.84825 6.73444 3.84825 7C3.84825 7.26556 3.70983 7.5078 3.43299 7.99227L3.43298 7.99228L2.99811 8.7533C1.75981 10.9203 1.14066 12.0039 1.62348 12.5412C2.1063 13.0785 3.24961 12.5783 5.53623 11.5779L11.8119 8.83231C13.6074 8.04678 14.5051 7.65402 14.5051 7C14.5051 6.34598 13.6074 5.95322 11.8119 5.16769L5.53624 2.4221C3.24962 1.42171 2.1063 0.921508 1.62348 1.45883C1.14066 1.99615 1.75981 3.07966 2.99811 5.2467Z"
              stroke="#20A090"
            />
          </svg>
        </button>
      </form>
    </section>
  );
}
