import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";
export default function Register() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const usernameRef = useRef(null);
  let navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = emailRef.current.value,
      password = passwordRef.current.value,
      username = usernameRef.current.value;
    const inputs = {
      email: emailRef.current,
      password: passwordRef.current,
      username: usernameRef.current, // Assuming a username ref is present
    };
    let hasEmptyFields = false;

    for (const inputName in inputs) {
      const input = inputs[inputName]; // Get the input element for this iteration
      if (!input.value) {
        input.classList.add("invalid-input");
        hasEmptyFields = true;
      } else {
        input.classList.remove("invalid-input");
      }
    }
    if (hasEmptyFields) {
      return;
    }
    try {
      const requestBody = JSON.stringify({ email, password, username });
      const response = await fetch(
        "https://lokkerroom-simon-40551508c11d.herokuapp.com/api/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        }
      );
      if (!response.ok) console.log(response);
      else {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col login-container">
      <div className="flex flex-col text-center">
        <h1 className="title title--register sm-mb">Sign up to Lokkeroom</h1>
        <p className="text text--login">
          Welcome! Sign up using your email and an username to start using our
          services.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <label htmlFor="username" className="input-label">
          Your Username
        </label>
        <input
          type="text"
          name="username"
          className="input"
          ref={usernameRef}
        />
        <label htmlFor="email" className="input-label">
          Your email
        </label>
        <input type="email" name="email" className="input" ref={emailRef} />
        <label htmlFor="password" className="input-label">
          Password
        </label>
        <input
          type="password"
          name="password"
          className="input"
          ref={passwordRef}
        />
        <button type="submit" className="btn btn--login">
          Create an account
        </button>
      </form>
      <Link to="/login" className="link">
        Go back to log in
      </Link>
    </div>
  );
}
