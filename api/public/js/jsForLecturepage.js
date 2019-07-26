window.onload = function(){
//////RecordRTC
    function captureScreen(cb) {
        getScreenId(function (error, sourceId, screen_constraints) {
            navigator.mediaDevices.getUserMedia(screen_constraints).then(cb).catch(function(error) {
              console.error('getScreenId error', error);
              alert('Failed to capture your screen. Please check Chrome console logs for further information.');
            });
        });
    }
    function captureCamera(cb) {
        navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(cb);
    }
    function keepStreamActive(stream) {
        var video = document.createElement('video');
        video.muted = true;
        setSrcObject(stream, video);
        video.style.display = 'none';
        (document.body || document.documentElement).appendChild(video);
    }
    
    document.getElementById("record").onclick = function (){
        document.getElementById("stop-recording").disabled = false;
        document.getElementById("download").disabled = false;
        captureScreen(function(screen) {
            keepStreamActive(screen);
            captureCamera(function(camera) {
                keepStreamActive(camera);
                screen.width = window.screen.width;
                screen.height = window.screen.height;
                screen.fullcanvas = true;
                
                var recorder = RecordRTC([screen, camera], {
                    type: 'video',
                    mimeType: 'video/webm',
                    previewStream: function(s) {
                        // document.querySelector('video').muted = true;
                        // setSrcObject(s, document.querySelector('video'));
                    }
                });
                recorder.startRecording();
                document.getElementById("stop-recording").onclick =  function() {
                    recorder.stopRecording(function() {
                        var blob = recorder.getBlob();
                        // document.querySelector('video').src = URL.createObjectURL(blob);
                        // document.querySelector('video').muted = false;
                        [screen, camera].forEach(function(stream) {
                            stream.getVideoTracks().forEach(function(track) {
                                track.stop();
                            });
                            stream.getAudioTracks().forEach(function(track) {
                                track.stop();
                            });
                        })
                        document.getElementById("download").onclick = function(){
                            download(blob,"ScreenCapture.webm","video");
                        }
                    });
                    
                };
            });
        });
    }

    //// webRTC
    document.getElementById("hang-up").disabled = true;
    document.getElementById("stop-recording").disabled = true;
    document.getElementById("download").disabled = true;
    var meeting = new Meeting();           
    var meetingsList = document.getElementById('meetings-list');
    var meetingRooms = {};

    meeting.onmeeting = function (room) {
        if (meetingRooms[room.roomid]) return;
        meetingRooms[room.roomid] = room;
        var tr = document.createElement('tr');
        tr.innerHTML = '<li>' +'<td>'+ room.roomid + '</td>' +
            '<td><button class="join">Join</button></td></li>';
        meetingsList.insertBefore(tr, meetingsList.firstChild);
        console.log('asdflkajsdflk');
        // when someone clicks table-row; joining the relevant meeting room
        tr.onclick = function () {
            document.getElementById("hang-up").disabled = false;
            room = meetingRooms[room.roomid];
            // manually joining a meeting room
            if (room) meeting.meet(room);
            meetingsList.style.display = 'none';
            document.getElementById('hang-up').onclick= function(){
                meeting.leave();
                document.getElementById("setup-meeting").disabled = false;
            };
        };    
    };
            
    var remoteMediaStreams = document.getElementById('remote-streams-container');
    var localMediaStream = document.getElementById('local-streams-container');
    // on getting media stream
    meeting.onaddstream = function (e) {
        if (e.type == 'local') localMediaStream.appendChild(e.video);
        if (e.type == 'remote') remoteMediaStreams.insertBefore(e.video, remoteMediaStreams.firstChild);
    };
    
    // via: https://github.com/muaz-khan/WebRTC-Experiment/tree/master/websocket-over-nodejs
    meeting.openSignalingChannel = function(onmessage) {
        var channel = location.href.replace(/\/|:|#|%|\.|\[|\]/g, '');
        // wss://websocket-over-nodejs.herokuapp.com:443/
        // var websocket = new WebSocket('wss://webrtcweb.com:9449/');
        var websocket = new WebSocket('wss://localhost:8081/');
        websocket.onopen = function () {
            websocket.push(JSON.stringify({
                open: true,
                channel: channel
            }));
        };
        websocket.push = websocket.send;
        websocket.send = function (data) {
            if(websocket.readyState != 1) {
                return setTimeout(function() {
                    websocket.send(data);
                }, 300);
            }
            
            websocket.push(JSON.stringify({
                data: data,
                channel: channel
            }));
        };
        websocket.onmessage = function(e) {
            onmessage(JSON.parse(e.data));
        };
        return websocket;
    };
    // using firebase for signaling
    // meeting.firebase = 'muazkh';
    // if someone leaves; just remove his video
    meeting.onuserleft = function (userid) {
        meeting.leave();
        var video = document.getElementById(userid);
        if (video) video.parentNode.removeChild(video);
    };
    // check pre-created meeting rooms
    meeting.check();
    document.getElementById('setup-meeting').onclick = function () {
        // setup new meeting room
        // console.log(editorTap);
        document.getElementById("hang-up").disabled = false;
        var meetingRoomName = document.getElementById('meeting-name').value || 'Simple Meeting';
        meeting.setup(meetingRoomName);
        this.disabled = true;
        document.getElementById('hang-up').onclick= function(){
            meeting.leave();
            document.getElementById("setup-meeting").disabled = false;
        };
    };
}