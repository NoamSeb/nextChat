import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";

const Commands = () => {
  const [sounds, setSounds] = useState({});

  useEffect(() => {
    setSounds({
      pinaise: new Audio("/sounds/ou_pinaise.mp3"),
      skype:new Audio("/sounds/skype.mp3"),
      whatsApp: new Audio("/sounds/whatsApp.mp3"),
      greg: new Audio("/sounds/greg.mp3"),
      run: new Audio("/sounds/running.mp3")
    });
  }, []);

  useEffect(() => {
    const onCommand = (command) => {
      switch (command) {
        case "/pinaise":
          sounds.pinaise.currentTime = 0;
          sounds.pinaise.play();
          break;
        case "/skype":
          sounds.skype.currentTime = 0;
          sounds.skype.play();
          break;
        case "/whatsApp":
          sounds.whatsApp.currentTime = 0;
          sounds.whatsApp.play();
          break;
        case "/greg":
          sounds.greg.currentTime = 0;
          sounds.greg.play();
          break;
        case "/run":
          sounds.run.currentTime = 0;
          sounds.run.play();
          break;
          
        default:
          break;
      }
    };

    socket.on("command", onCommand);

    return () => {
      socket.off("command", onCommand);
    };
  }, [sounds]);

  return <div></div>;
};

export default Commands;