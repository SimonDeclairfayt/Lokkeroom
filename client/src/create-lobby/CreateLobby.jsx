import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./createlobby.css";

export default function CreateLobby() {
  const nameRef = useRef(null);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const nameValue = nameRef.current.value;
    if (!nameValue) {
      console.error("Need a name for the lobby");
      return;
    }
    const bodyContent = JSON.stringify({ name: nameValue });
    try {
      const response = await fetch(
        "https://lokkerroom-simon-40551508c11d.herokuapp.com/api/lobby",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: bodyContent,
          credentials: "include",
        }
      );
      if (!response.ok) console.log(response);
      navigate("/");
    } catch (err) {
      console.error(err);
      return;
    }
  };
  return (
    <section className="createLobby-container">
      <h1 className="title title--logo title--createLobby">Lokkeroom</h1>

      <form onSubmit={handleSubmit} className="flex flex-col form-container">
        <label htmlFor="name" className="input-label">
          Give us the name of your lobby
        </label>
        <input type="text" name="name" className="input" ref={nameRef} />
        <button type="submit" className="btn btn--login">
          Create
        </button>
      </form>
      <Link to="/" className="link">
        Go back
      </Link>
    </section>
  );
}
