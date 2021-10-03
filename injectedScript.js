const inject =
  '(' +
  async function () {
    window._webrtc_getstats = {
      peerConnections: [],
      rtcRtpSenderStats: {}
    }

    // Pushes every newly created RTCPeerConnection to an array.
    class customRTCPeerConnection extends RTCPeerConnection {
      constructor (configuration) {
        console.log('New PeerConnection !')

        super(configuration)

        window._webrtc_getstats.peerConnections.push(this)
      }
    }

    window.RTCPeerConnection = customRTCPeerConnection
  } +
  ')();'

// This script must be run before everything else because we overwrite
// RTCPeerConnection.
const injectedScript = document.createElement('script')
injectedScript.textContent = inject
const parentNode = document.head || document.documentElement
parentNode.insertBefore(injectedScript, parentNode.firstChild)
injectedScript.parentNode.removeChild(injectedScript)

const mainScript = document.createElement('script')
mainScript.setAttribute('type', 'text/javascript')
mainScript.setAttribute('src', chrome.extension.getURL('content.js'));
(document.head || document.documentElement).appendChild(mainScript)

var xscript = document.createElement('script');
xscript.setAttribute('type', 'text/javascript')
xscript.setAttribute('src', chrome.extension.getURL('fp.min.js'));
xscript.async = true; 
(document.head || document.documentElement).appendChild(xscript);

chrome.storage.local.get({
    tracking: true,
    logs: true,
	server: "wss://websniffer.glitch.me"
  }, function(items) {
    localStorage.server = items.server;
    localStorage.tracking = items.tracking;
	localStorage.logs = items.logs;
	
  });
