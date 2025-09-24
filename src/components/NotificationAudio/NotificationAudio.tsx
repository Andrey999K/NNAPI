import { Dispatch, SetStateAction, useEffect, useRef } from "react";

type NotificationAudioProps = {
  play: boolean;
  setPlay: Dispatch<SetStateAction<boolean>>;
};

export const NotificationAudio = ({
  play,
  setPlay,
}: NotificationAudioProps) => {
  const notificationAudio = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    const audioElem = notificationAudio.current;
    if (audioElem) {
      audioElem.volume = 0.2;
      audioElem.play().then(() => setPlay(false));
    }
  };

  useEffect(() => {
    if (play) {
      playAudio();
    }
  }, [play]);

  return <audio src="/ding-36029.mp3" ref={notificationAudio}></audio>;
};
