import { socket } from "@/utils/socket";
import { useRef } from "react";
import s from "./Input.module.scss";
import { createPortal } from "react-dom";

const Input = ({ selectedUser, setSelectedUser }) => {
  const inputRef = useRef();

  const onKeyDown = (e) => {
    if (inputRef.current.value != "" && e.keyCode === 13) {
      console.log(inputRef.current.value);
      if(selectedUser){
        socket.emit("private message", {
            to : selectedUser.userID,
            content:inputRef.current.value
        })
        // do this because react doesnt re-render otherwise
        const _selectedUser = { ...selectedUser };

        _selectedUser.messages.push({
          content: inputRef.current.value,
          // fromSelf: true,
          username: localStorage.getItem("username"),
          from: socket.userID,
        });

        // change the reference to trigger a render
        setSelectedUser(_selectedUser);
      }else{
        socket.emit("message", { content: inputRef.current.value });
      }
      

      inputRef.current.value = "";
    }
  };
  return (
    <input
      type="text"
      onKeyDown={onKeyDown}
      ref={inputRef}
      className={s.input}
      placeholder="Entrez votre message ici"
    />
  );
};

export default Input;
