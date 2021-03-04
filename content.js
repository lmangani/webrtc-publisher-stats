const _dom_prefix = "webrtc-getstats-extension";
const interval = 5; // in seconds

const findDOMElementForTrack = (track) => {
  let foundElement = null;

  document.querySelectorAll("video").forEach((element) => {
    if (!element?.srcObject) {
      return;
    }

    const audioTracksFromDOM = element.srcObject.getAudioTracks();
    const videoTracksFromDOM = element.srcObject.getVideoTracks();

    const foundAudioTrack = audioTracksFromDOM.find((e) => e === track);
    const foundVideoTrack = videoTracksFromDOM.find((e) => e === track);

    if (foundAudioTrack) {
      console.log("Found DOM element for audio track : ", element);
      foundElement = element;
      return;
    }

    if (foundVideoTrack) {
      console.log("Found DOM element for video track : ", element);
      foundElement = element;
      return;
    }
  });

  return foundElement;
};

const loopGetStats = () => {
  console.log("I would like to get stats from those RTCPeerConnections...");

  if (!window._webrtc_getstats?.peerConnections) {
    return;
  }

  window._webrtc_getstats.peerConnections.forEach((pc) => {
    if (pc.iceConnectionState !== "completed") {
      return;
    }

    pc.getReceivers().forEach((receiver) => {
      if (!receiver?.track) {
        // No RTCRtpReceiver or MediaTrack, return
        return;
      }

      console.log(`[${receiver.track.kind}][Receiver] stats ------`);
      receiver.getStats().then((stats) => {
        stats.forEach((stat) => {
          stat.type == "candidate-pair" &&
            stat.nominated &&
            console.log(
              "stat.currentRoundTripTime :",
              stat.currentRoundTripTime
            );
        });
      });

      const element = findDOMElementForTrack(receiver.track);
      const container = document.createElement("div");
      container.className = _dom_prefix + "-container";
      container.innerText = "Audio";

      if (
        element &&
        !element.parentNode.querySelector("." + container.className)
      ) {
        element.parentNode.insertBefore(container, element);
      }

      console.log(`[${receiver.track.kind}][Receiver] element :`, element);
    });

    pc.getSenders().forEach((sender) => {
      console.log("sender :", sender);
      if (!sender?.track) {
        // No RTCRtpSender or MediaTrack, return
        return;
      }

      console.log(`[${sender.track.kind}][Sender] stats ------`);
      console.log(
        `[${sender.track.kind}][Sender] sender.track :`,
        sender.track
      );
      sender.getStats().then((stats) => {
        console.log(`[${sender.track.kind}][Sender] stats :`, stats);
        stats.forEach((stat) => {
          stat.type == "candidate-pair" &&
            stat.nominated &&
            console.log(
              "stat.currentRoundTripTime :",
              stat.currentRoundTripTime
            );
        });
      });

      const element = findDOMElementForTrack(sender.track);
      const container = document.createElement("div");
      container.className = _dom_prefix + "-container";
      container.innerText = "Video";

      if (
        element &&
        !element.parentNode.querySelector("." + container.className)
      ) {
        element.parentNode.insertBefore(container, element);
      }

      console.log(`[${sender.track.kind}][Sender] element :`, element);
    });
  });

  setTimeout(loopGetStats, interval * 1000);
};

setTimeout(loopGetStats, interval * 1000);
