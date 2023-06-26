import { Howl } from "howler";

import pingSound from "../../public/sounds/ping.mp3";

export const notificationSound = () => {
  return new Howl({
    src: [pingSound],
  });
};
