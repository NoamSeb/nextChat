import s from "../UserList/UserList.module.scss";
import { useEffect, useRef } from "react";

const User = ({ user, setSelectedUser, selectedUser,resetNotification }) => {
  const userRef = useRef();
  useEffect(() => {
    console.log(userRef);
  }, []);
  return (
    <div
      key={user.userID}
      className={`${s.user} ${selectedUser?.userID === user.userID ? s.user__active : ""
      }`}
      onClick={() => {
        setSelectedUser(user);
        resetNotification(user);
      }}
    >
      {user.username}
      {user.hasNewMessages === true ? (
        <span className={s.notification}></span>
      ) : null}
    </div>
  );
};
export default User;
