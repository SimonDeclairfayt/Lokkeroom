import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./home.css";
export default function Homepage() {
  const [channelsAvailable, setChannelsAvailable] = useState(null);
  let navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://lokkerroom-simon-40551508c11d.herokuapp.com`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          if (response.status === 401 || response.status === 503) {
            navigate("/login");
          } else {
            console.error("Error fetching data:", response.statusText);
          }
          return;
        }
        const jsonData = await response.json();
        setChannelsAvailable(jsonData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      {channelsAvailable ? (
        <section className="home-container">
          <h1 className="title title--logo">Lokkeroom</h1>
          <p className="text text--createLobby">
            Click on any of the channels to start talking to your team{" "}
          </p>
          {channelsAvailable.length === 0 && (
              <p className="lobby-link-container-empty">There are no channels yet. Click "Create Channel" to get started.</p>
          )} {/*Added this for when the list is empty*/}
          <ul className="lobby-container">
            {channelsAvailable.map((channel) => {
              return (
                <li
                  key={channel.lobby.lobby_id}
                  className="lobby-link-container"
                >
                  <Link
                    to={`/lobby/${channel.lobby.lobby_id}`}
                    state={{ lobbyName: channel.lobby.lobby_name }}
                    className="lobby-link"
                  >
                    <span>#</span> {channel.lobby.lobby_name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link to="/create-lobby" className="link link--createLobby">
            Create Channel
          </Link>
          <Link to="/login" className="link link--logout">
            Logout
          </Link>
        </section>
      ) : (
        <div>There are no channels yet</div>
      )}
    </>
  );
}
