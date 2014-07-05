
chrome.browserAction.onClicked.addListener( function (tab) {
  chrome.browserAction.setIcon({ tabId : tab.id, path: 'recording.png' });
});


/* Feature detection
 */

function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

var currentTab;

var audioStream;
var options = {
  audio: true,
  video: false
};
// var audioStream;
// chrome.tabCapture.capture(options, function(stream) {
//   audioStream = stream;
// });

var pc = new webkitRTCPeerConnection(null);

pc.onaddstream = function(obj) {
  console.log('stream added!');
  console.log(obj);
};

// Helper functions
function endCall() {
  console.log("Ending call");
  pc.close();
}

function error(err) {
  console.log("There was an error!");
  endCall();
}

// Get a list of friends from a server
// User selects a friend to start a peer connection with
chrome.tabCapture.capture(options, function(stream) {
  console.log('capturing the audio stream.');
  // pc.onaddstream(stream);
  var socket = io.connect('http://localhost:3000');
  socket.on('news', function(data) {
    console.log(data);
    socket.emit('my other event', {my: stream});
  });

  var $audio = document.createElement('audio');
  $audio.src = window.URL.createObjectURL(stream);
  setTimeout(function(){$audio.play();}, 2000);
  document.body.appendChild($audio);

  // Adding a local stream won't trigger the onaddstream callback
  // pc.addStream(stream);
  // pc.createOffer(function(offer){
  //   console.log('creating the offer');
  //   pc.setLocalDescription(new RTCSessionDescription(offer), function() {
  //     // send the offer to a server to be forwarded to the friend you're calling.
  //     console.log('sending the offer!');
  //   }, error);
  // }, error);

  audioStream = stream;
});
