import React, { Component } from 'react';
import './PlayBack.css';
import { AiOutlineClose, AiOutlineFullscreenExit } from "react-icons/ai/";


export class PlayBack extends Component {  
    constructor(props) {
      super(props);
      this.state = {
        url: "./Videos/"+this.props.url,
        showPlayBack: this.props.values.showPlayBack,
        // startFrame: this.props.startFrame,
        // endFrame: this.props.endFrame,
        // bars: this.props.bars,
        // activeImageIndex: this.props.activeImageIndex,
        // frames: this.props.frames,
        // test: this.props.test,
        // notCalled: this.props.notCalled,
        // loaded: this.props.loaded,
        startFrame: this.props.values.start,
        endFrame: this.props.values.end,
        bars: this.props.values.bars,
        activeImageIndex: this.props.values.activeImageIndex,
        frames: this.props.values.frames,
        test: this.props.values.test,
        notCalled: this.props.values.notCalled,
        loaded: this.props.values.loaded,
        stop: false
      };
    }
    reset = () => {
      this.setState({activeImageIndex: 0});
      this.setState({bars: []});
      this.setState({frames: []});
      this.setState({test: 1});
      this.setState({notCalled: true});
      this.setState({loaded: false});
      
    }
    closePlayback = () => {
      this.setState({showPlayBack: false});
      this.props.sendPlay(this.state.showPlayBack);
      this.reset();
      
      
    }

    getVideoImage = (path, secs, callback) =>{
      var me = this, video = document.createElement('video');
      video.onloadedmetadata = function() {
        if ('function' === typeof secs) {
          secs = secs(this.duration);
        }
        this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
      };
      video.onseeked = function(e) {
        var canvas = document.createElement('canvas');
        canvas.height = video.videoHeight/2;
        canvas.width = video.videoWidth/2;
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
    showImageAt = (frame) => {
      if (this.state.showPlayBack){
      var startSec = frame/30;
      this.getVideoImage(
        this.state.url,
        startSec,
        function(img, startSec, event) {
          console.log("showimageat function");
          if (event.type === 'seeked') {
            console.log("seeked");
              this.state.bars.push(img);
              this.state.frames.push(frame);
              if (document.getElementById("img")) {
                document.getElementById("img").innerHTML="Still Loading... Frame: " + frame;
                document.getElementById("img").appendChild(img);
              }
              if (this.state.endFrame >= ++frame) {
                console.log("showimageat increment frame", "endframe", this.state.endFrame, "currentframe", frame);
                this.showImageAt(frame);
              }
              else {
                console.log("exit show imamge at")
                return;
              }
          }
          }
      );
      }
      else this.closePlayback();
    }
    
    componentDidMount(){
      console.log("component did mount playback", this.state.showPlayBack);
      if (this.state.showPlayBack){
        if (document.getElementById("btn")) {
          document.getElementById("btn").style.display="none";
        }
        // enter component did mount for the first time
        if (this.state.notCalled){
          this.reset();
          // loading image
          var frame = this.state.startFrame;
          this.showImageAt(frame);
          // set it to prevent reloading of the images
          this.setState({notCalled: false});
        }
        var interval = undefined;
        var wait = undefined;
        // if all the images are loaded
        console.log("componentdidmount bar, end, start+1", this.state.bars.length, this.state.endFrame, this.state.startFrame+1)
        if (this.state.bars.length === this.state.endFrame - this.state.startFrame+1){
          // set a new interval to show the images at the rate of 50 micro sec per image
          interval = setInterval(()=>{
            if (this.state.showPlayBack){
              if (this.state.activeImageIndex+1===this.state.bars.length){
                // this.setState({activeImageIndex: 0});
                if (document.getElementById("btn")) {
                  document.getElementById("btn").style.display="block";
                }
                // exit component did mount
                clearInterval(interval);
              }
              // show the image and the frame 
              if (document.getElementById("img")) {
                document.getElementById("img").innerHTML="Frame: " + this.state.frames[this.state.activeImageIndex];
                document.getElementById("img").appendChild(this.state.bars[this.state.activeImageIndex]);
              }
              // update the index of the image and the frame in their arrays
              let newActiveIndex = this.state.activeImageIndex+1     
              this.setState({
                activeImageIndex: newActiveIndex
              })
            }
            else {
              this.closePlayback();
              clearInterval(interval);
            }
            // if all images are displayed, show the replay button
            
          }, 50);
        }
        else {
          // if we haven't finished loading all images, we wait 
          
          wait = setInterval(()=>{
            console.log(this.state.showPlayBack);
            if (this.state.showPlayBack){
              console.log("wait");
              // exit wait and show images
              if (this.state.bars.length === this.state.endFrame - this.state.startFrame + 1) {
                
                if (this.state.loaded === false) {
                  this.setState({loaded: true});
                  this.setState({activeImageIndex: 0});
                  this.componentDidMount();
                  clearInterval(wait);
                }
                else {
                  clearInterval(wait);
                }
              }
              else if (this.state.bars.length > this.state.endFrame - this.state.startFrame + 1){
                clearInterval(wait);
              }
              else if (this.state.loaded) {
                clearInterval(wait);
              }
              // continue wait
              else{
                console.log("continue wait", "loaded", this.state.loaded, "end", this.state.endFrame, "start", this.state.startFrame, "bar", this.state.bars.length);
                let test = this.state.test;
                this.setState({
                  test: test+1
                })
              }
            }
            else {
              this.closePlayback();
              clearInterval(wait);
            }
            
              
          }, 2000);
        }
      }
      else {
        this.closePlayback();
      }
      
    }
   
    render() { 
        return (
            <div className='container'>
                <div className="d-flex flex-row-reverse" onClick={this.closePlayback}><AiOutlineClose/></div>
                <div id="img">
                </div> 
                <div>
                  <button 
                    id="btn"
                    onClick={(() => {
                      this.setState({activeImageIndex: 0});
                      this.componentDidMount();
                    })}>
                    Replay
                  </button>
                </div>
               
            </div>
        );
    }
}
