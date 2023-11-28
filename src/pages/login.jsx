import { useRouter } from "next/router";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../public/logo.png";
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
      <link rel="icon" href="/logo.svg" />
      <div className={s.loginFrame}>
        <div className={s.loginForm}>
          <Image src={logo} alt="logo" className={s.loginFormLogo} />
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
