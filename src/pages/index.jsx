"use client";
import { useEffect, useState, useRef } from "react";
import { socket } from "@/utils/socket";
import { useRouter } from "next/router";

import Input from "@/components/Input/Input";
import Commands from "@/components/command/Commands";
import Notification from "@/components/Notification/Notification";
import UserList from "@/components/UserList/UserList";
import Message from "@/components/Message/Message";

import s from "@/styles/index.module.scss";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState();
  const [messages, setMessage] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState();
  const viewerRef = useRef();
  const { push } = useRouter();

  const onSession = ({ sessionID, userID }) => {
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionID };
    // store it in the localStorage
    localStorage.setItem("sessionID", sessionID);
    // save the ID of the user
    socket.userID = userID;

    localStorage.removeItem("error")
  };

  const onMessage = (message) => {
    console.log("message received", message);

    setMessage((oldMessages) => [...oldMessages, message]);
  };
  const scrollToBottom = () => {
    viewerRef.current.scrollTop = viewerRef.current.scrollHeight;
  };

  const onConnectorError = (err) => {
    console.log("test");
    localStorage.removeItem("username");
    localStorage.removeItem("sessionID");
    localStorage.setItem("error", 200);
    push("/login");
  };
  const getMessageAtInit = (messagesAtInit) => {
    // get messages at init
    console.log(messagesAtInit);
    setMessage(messagesAtInit);
  };
  const onUserConnect = (_user) => {
    const existingUser = users.find((user) => user.userID === _user.userID);

    if (existingUser) {
      return;
    }

    setUsers((currentUsers) => [...currentUsers, _user]);
  };

  const onUserDisconnect = (_userID) => {
    const filteredArray = [...users].filter((_user) =>
      _user.userID !== _userID ? true : false
    );
    console.log(filteredArray);
    setUsers(filteredArray);
  };
  const getUsersAtInit = (users) => {
    console.log("get users at init", users);
    setUsers(users);
  };

  const onError = ({ code, error }) => {
    console.log(code, error);

    let title = "";
    let content = "";

    switch (code) {
      // code 100, vous savez que ça correspond à du spam, donc vous pouvez changer les valeurs
      case 100:
        title = `Erreur ${code} : Spam`;
        content = "Tu spam trop chacal";
        break;

      default:
        break;
    }

    setError({
      title,
      content,
    });
  };
  const onPrivateMessage = ({ content, from, to, username }) => {
    console.log(content, from, to, username);
    const userMessaging = users.find((_user) => _user.userID === from);
    const userMessagingIndex = users.findIndex ((_user) => _user.userID === from);
    console.log(userMessaging)

    if(!userMessaging) return;

    userMessaging.messages.push({
      from,
      to,
      content,
      username,
    })

    if (userMessaging.userID !== selectedUser?.userID) {
      userMessaging.hasNewMessages = true;
    }

    const _users = [...users];
    _users[userMessagingIndex] = userMessaging;

    setUsers(_users);
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedUser]);

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");

    // session is already defined
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
      // first time connecting and has already visited login page
    } else if (localStorage.getItem("username")) {
      const username = localStorage.getItem("username");
      socket.auth = { username };
      socket.connect();

      //   // redirect to login page
    } else {
      push("/login");
    }

    socket.on("session", onSession);
    socket.on("message", onMessage);
    socket.on("error", onError);
    socket.on("messages", getMessageAtInit);
    socket.on("users", getUsersAtInit);
    socket.on("disconnect", onConnectorError);
    socket.on("connect_error", onConnectorError);

    return () => {
      socket.disconnect();
      socket.off("session", onSession);
      socket.off("message", onMessage);
      socket.off("error", onError);
      socket.off("messages", getMessageAtInit);
      socket.off("users", getUsersAtInit);
      socket.off("disconnect", onConnectorError);
      socket.off("connect_error", onConnectorError);
    };
  }, []);
  useEffect(() => {
    socket.on("private message", onPrivateMessage);
    socket.on("user connected", onUserConnect);
    socket.on("user disconnected", onUserDisconnect);

    return () => {
      socket.off("private message", onPrivateMessage);
      socket.off("user connected", onUserConnect);
      socket.off("user disconnected", onUserDisconnect);
    };
  }, [users]);

  return (
    <>
      <h1>Iceberg Chat</h1>
      <div className={s.homePage}>
      <div className={s.userList}>
        <UserList
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        setUsers={setUsers}
        />
      </div>
      {error && (
        <Notification
          title={error.title}
          content={error.content}
          onClose={() => setError(null)}
        />
      )}
      <div ref={viewerRef} className={s.chatContainer}>
        {selectedUser
          ? selectedUser.messages.map((message, key) => {
              return (
                <Message 
                key={key}
                username={message.username}
                content={message.content}
                fromSelf={message.from === socket.userID}
                />
                // <>
                //   <div key={key} className={s.messages}>
                //     <h2>{message.username}</h2>
                //     <p>{message.content}</p>
                //   </div>
                // </>
              );
            })
          : messages.map((message, key) => {
              return (
                <Message 
                key={key}
                username={message.username}
                content={message.content}
                fromSelf={message.from === socket.userID}
                />
                // <>
                //   <div key={key} className={`${s.messages} ${message.from === socket.userID? s.message__self : ""}`}>
                //     <h2>{message.username}</h2>
                //     <p>{message.content}</p>
                //   </div>
                // </>
              );
            })}
        <Input selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
      </div>
      <Commands />
      </div>
    </>
  );
};
export default Home;
