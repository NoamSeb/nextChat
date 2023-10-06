import s from "./Message.module.scss";
import {gsap} from "gsap";
import { useRef, useEffect } from "react";

const Message = ({ username, content, fromSelf }) => {
  const textRef = useRef();

  useEffect(() =>{
    gsap.to(textRef.current,{
      opacity:1,
      x:1,
    });
  }, [])
  return (
    <div ref={textRef} className={`${s.messages} ${fromSelf ? s.messages__self : ""}`}>
      <h2>{username}</h2>
      <p>{content}</p>
    </div>
  );
};
export default Message;
