import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
export default function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  let navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (!email && !password) {
      emailRef.current.classList.add("invalid-input");
      passwordRef.current.classList.add("invalid-input");
      return;
    }
    if (!email) {
      emailRef.current.classList.add("invalid-input");
      return;
    }
    if (!password) {
      passwordRef.current.classList.add("invalid-input");
      return;
    }
    try {
      const requestBody = JSON.stringify({ email, password });

      const response = await fetch(
        "https://lokkerroom-simon-40551508c11d.herokuapp.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
          credentials: "include",
        }
      );
      console.log(response.headers.getSetCookie());
      if (!response.ok) console.log(response);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex flex-col login-container">
      <div className="flex flex-col text-center">
        <h1 className="title title--login sm-mb">Log in to Lokkeroom</h1>
        <p className="text text--login">
          Welcome back ! Sign in using your email to start using our services.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="form-container">
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
          Log in
        </button>
      </form>
      <Link to="/register" className="link">
        No account yet ?
      </Link>
    </div>
  );
}
