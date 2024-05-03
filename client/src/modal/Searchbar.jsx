import { useState } from "react";

export default function Searchbar({ setResult, input, setInput }) {
  const fetchUsername = (value) => {
    fetch(`https://lokkerroom-simon-40551508c11d.herokuapp.com/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username: value }),
    })
      .then((response) => response.json())
      .then((data) => setResult(data));
  };
  const handleChange = (value) => {
    setInput(value);
    fetchUsername(value);
  };
  return (
    <>
      <input
        type="text"
        name="username"
        className="input"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </>
  );
}
