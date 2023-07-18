"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Members, PresenceChannel } from "pusher-js";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { usePusher } from "@/app/context/PusherContext";

export const useRTCHooks = (roomId: string) => {
  const [enableCamera, setEnableCamera] = useState(true);
  const [enableMic, setEnableMic] = useState(true);

  const host = useRef(false);

  const pusherClient = usePusher();
  const router = useRouter();

  const channelRef = useRef<PresenceChannel>();

  // WebRTC refs
  const rtcConnection = useRef<RTCPeerConnection | null>();
  const userStream = useRef<MediaStream>();

  const userVideo = useRef<HTMLVideoElement>(null);
  const otherUserVideo = useRef<HTMLVideoElement>(null);

  const ICE_SERVERS = {
    // you can add TURN servers here too
    iceServers: [
      {
        urls: "stun:openrelay.metered.ca:80",
      },
      {
        urls: "stun:stun.l.google.com:19302",
      },
      {
        urls: "stun:stun2.l.google.com:19302",
      },
    ],
  };

  const handleTrackEvent = (event: RTCTrackEvent) => {
    const stream = event.streams[0];
    otherUserVideo.current!.srcObject = stream;
  };

  const createPeerConnection = () => {
    // We create a RTC Peer Connection
    const connection = new RTCPeerConnection(ICE_SERVERS);

    connection.onicecandidate = handleICECandidateEvent;

    connection.ontrack = handleTrackEvent;

    connection.onicecandidateerror = (e) => console.error(e);
    return connection;
  };

  const handleReceivedOffer = (offer: RTCSessionDescriptionInit) => {
    rtcConnection.current = createPeerConnection();
    userStream.current?.getTracks().forEach((track) => {
      rtcConnection.current?.addTrack(track, userStream.current!);
    });

    rtcConnection.current.setRemoteDescription(offer);
    rtcConnection.current
      .createAnswer()
      .then((answer) => {
        rtcConnection.current!.setLocalDescription(answer);
        channelRef.current?.trigger("client-answer", answer);
      })
      .catch((_) => toast.error("An error occurred with RTC connection!"));
  };

  const initiateCall = () => {
    if (host.current) {
      rtcConnection.current = createPeerConnection();
      // Host creates offer
      userStream.current?.getTracks().forEach((track) => {
        rtcConnection.current?.addTrack(track, userStream.current!);
      });
      rtcConnection
        .current!.createOffer()
        .then((offer) => {
          rtcConnection.current!.setLocalDescription(offer);
          channelRef.current!.trigger("client-offer", offer);
        })
        .catch((_) => {
          toast.error("An error occured with the RTC Connection.");
        });
    }
  };

  useEffect(() => {
    if (roomId) {
      axios.post(`/api/calls/${roomId}`);
    }
  }, [roomId]);

  useEffect(() => {
    pusherClient.subscribe(roomId);

    channelRef.current = pusherClient.subscribe(
      `presence-${roomId}`
    ) as PresenceChannel;

    channelRef.current.bind(
      "pusher:subscription_succeeded",
      (members: Members) => {
        if (members.count === 1) {
          host.current = true;
        }

        // One - One users for now, scalable for future
        if (members.count > 2) {
          router.push("/calls");
        }
        handleRoomJoined();
      }
    );

    //Listen to client-events
    channelRef.current.bind("client-ready", () => {
      initiateCall();
    });

    channelRef.current.bind(
      "client-answer",
      (answer: RTCSessionDescriptionInit) => {
        // answer is sent by non-host, so only host should handle it
        if (host.current) {
          handleAnswerReceived(answer as RTCSessionDescriptionInit);
        }
      }
    );
    channelRef.current.bind("client-ice-candidate", handleNewIceCandidateMsg);
    channelRef.current.bind(
      "client-offer",
      (offer: RTCSessionDescriptionInit) => {
        if (!host.current) {
          handleReceivedOffer(offer);
        }
      }
    );

    return () => {
      if (channelRef.current) {
        pusherClient.unsubscribe(`presence-${roomId}`);
        pusherClient.unsubscribe(roomId);
        userStream.current?.getTracks().forEach((track) => track.stop());

        //Listen to client-events
        channelRef.current.unbind("client-ready", () => {
          initiateCall();
        });
        channelRef.current.unbind(
          "client-ice-candidate",
          handleNewIceCandidateMsg
        );
        channelRef.current.unbind(
          "client-offer",
          (offer: RTCSessionDescriptionInit) => {
            if (!host.current) {
              handleReceivedOffer(offer);
            }
          }
        );
        channelRef.current.unbind(
          "client-answer",
          (answer: RTCSessionDescriptionInit) => {
            // answer is sent by non-host, so only host should handle it
            if (host.current) {
              handleAnswerReceived(answer as RTCSessionDescriptionInit);
            }
          }
        );
      }
    };
  }, [roomId]);

  const handleICECandidateEvent = async (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      channelRef.current?.trigger("client-ice-candidate", event.candidate);
    }
  };

  const handleRoomJoined = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        userStream.current = stream;
        userVideo.current!.srcObject = stream;
        userVideo.current!.onloadedmetadata = () => {
          userVideo.current!.play();
        };

        if (!host.current) {
          channelRef.current!.trigger("client-ready", {});
        }
      })
      .catch((_) =>
        toast.error("Please enable your microphone and video to proceed!")
      );
  };

  const handleAnswerReceived = (answer: RTCSessionDescriptionInit) => {
    rtcConnection
      .current!.setRemoteDescription(answer)
      .catch((_) => toast.error("An error occured with the RTC Connection."));
  };

  const handleNewIceCandidateMsg = (incoming: RTCIceCandidate) => {
    // We cast the incoming candidate to RTCIceCandidate
    const candidate = new RTCIceCandidate(incoming);

    rtcConnection
      .current!.addIceCandidate(candidate)
      .catch((_) => toast.error("An error occured with the RTC Connection."));
  };

  const toggleMediaStream = (type: "video" | "audio", state: boolean) => {
    userStream.current!.getTracks().forEach((track) => {
      if (track.kind === type) {
        track.enabled = !state;
      }
    });
  };

  const toggleMic = () => {
    toggleMediaStream("audio", enableMic);
    setEnableMic((prev) => !prev);
  };

  const toggleCamera = () => {
    toggleMediaStream("video", enableCamera);
    setEnableCamera((prev) => !prev);
  };

  return {
    toggleCamera,
    toggleMic,
    enableCamera,
    enableMic,
    userVideo,
    otherUserVideo,
  };
};
