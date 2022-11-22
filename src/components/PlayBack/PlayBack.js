import React, { Component } from 'react';
import './PlayBack.css';
import { AiOutlineClose } from "react-icons/ai/";


export class PlayBack extends Component {  
    constructor(props) {
      super(props);
      this.state = {
        url: "./Videos/"+this.props.url,
        showPlayBack: this.props.showPlayBack,
        startFrame: this.props.startFrame,
        endFrame: this.props.endFrame,
        width: undefined,
        height: undefined
      };
    }
    closePlayback = () => {
        this.setState({showPlayBack: false});
        this.props.sendPlay(this.state.showPlayBack);
      }
    render() { 
        var { 
            url, 
            startFrame,
            endFrame,
          } = this.state;
          function sleep(milliseconds) {
            const date = Date.now();
            let currentDate = null;
            do {
              currentDate = Date.now();
            } while (currentDate - date < milliseconds);
          }
          function getVideoImage(path, secs, callback) {
            var me = this, video = document.createElement('video');
            video.onloadedmetadata = function() {
              if ('function' === typeof secs) {
                secs = secs(this.duration);
              }
              this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
            };
            video.onseeked = function(e) {
              var canvas = document.createElement('canvas');
              canvas.height = video.videoHeight;
              canvas.width = video.videoWidth;
              var ctx = canvas.getContext('2d');
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              var img = new Image();
              img.src = canvas.toDataURL();
              callback.call(me, img, this.currentTime, e);
            };
            video.onerror = function(e) {
              callback.call(me, undefined, undefined, e);
            };
            video.src = path;
          }
          
          function showImageAt(frame) {
            var startSec = frame/30;
            getVideoImage(
              url,
              startSec,
              function(img, startSec, event) {
                if (event.type === 'seeked') {
                  var li = document.getElementById('img');
                  if (li) {
                    li.innerHTML = '<b>Frame ' + frame + '</b><br />';
                    li.appendChild(img);
                    li.innerHTML += '<br>';
                    if (endFrame >= ++frame) {
                        showImageAt(frame, endFrame);
                    }
                    else {
                        // sleep(2000);
                        showImageAt(startFrame, endFrame);
                    }
                  }
                  
                }
               }
            );
          }
          showImageAt(startFrame);
          
        return (
            <div className='container'>
                <div className="d-flex flex-row-reverse" onClick={this.closePlayback}><AiOutlineClose/></div>
                <div id="img" className="align-content-center" ></div>
               
            </div>
        );
    }
}
