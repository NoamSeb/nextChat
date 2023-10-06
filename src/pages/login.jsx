import { useRouter } from "next/router";
import { useRef, useEffect, useState } from "react";
import s from "@/styles/login.module.scss";

const Login = () => {
  const inputRef = useRef();
  const [error, setError] = useState("");
  const { push } = useRouter();

  console.log(inputRef);

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      localStorage.setItem("username", inputRef.current.value);
      inputRef.current.value = "";

      push("/");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("error") == 200) {
      console.log("error is present");

      setError("Server is down atm");
    }
  }, []);

  return (
    <>
      <div className={s.loginFrame}>
        <div className={s.loginForm}>
          <h1>Login Page!</h1>
          <p>Enter username</p>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter your text here..."
            onKeyDown={onKeyDown}
          ></input>
          {error !== "" ? <h2>{error}</h2> : ""}
        </div>
      </div>
    </>
  );
};
export default Login;
