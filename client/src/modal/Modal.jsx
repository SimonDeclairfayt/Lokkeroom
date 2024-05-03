import "./Modal.css";
import { useState } from "react";
import Searchbar from "./Searchbar";
import SearchResult from "./SearchResult";
const Modal = ({ setIsOpen, lobbyId }) => {
  const [result, setResult] = useState([]);
  const [input, setInput] = useState("");
  const addUser = async () => {
    let userName = input;
    if (!userName) {
      setIsOpen(false);
      return;
    }
    try {
      const requestBody = JSON.stringify({ username: userName });
      const response = await fetch(
        `https://lokkerroom-simon-40551508c11d.herokuapp.com/api/lobby/${lobbyId}/add-user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
          credentials: "include",
        }
      );
      if (!response.ok) console.error(response);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      return;
    }
  };
  return (
    <>
      <div className="darkBG" onClick={() => setIsOpen(false)} />
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h5 className="heading">Add an user to the group</h5>
          </div>
          <div className="modalContent">
            <form className="username-container">
              <label htmlFor="username" className="input-label">
                Their username
              </label>
              <Searchbar
                setResult={setResult}
                input={input}
                setInput={setInput}
              />
            </form>
            <SearchResult
              result={result}
              setInput={setInput}
              setResult={setResult}
            />
          </div>
          <div className="modalActions">
            <div className="actionsContainer">
              <button className="deleteBtn" onClick={() => addUser()}>
                Add
              </button>
              <button className="cancelBtn" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
