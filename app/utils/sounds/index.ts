import { Howl } from "howler";

import pingSound from "../../../public/sounds/ping.mp3";
import incomingCallSound from "../../../public/sounds/calling-sound.mp3";

export const notificationSound = () => {
  return new Howl({
    src: [pingSound],
  });
};

export const callingSound = () => {
  return new Howl({
    src: [incomingCallSound],
    loop: true,
  });
};
