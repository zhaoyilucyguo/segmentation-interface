import React, { Component } from 'react';
import './PlayBack.css';
import { AiOutlineClose, AiOutlineFullscreenExit } from "react-icons/ai/";


export class PlayBack extends Component {  
    constructor(props) {
      super(props);
      this.state = {
        url: "./Videos/"+this.props.url,
        showPlayBack: this.props.showPlayBack,
        startFrame: this.props.startFrame,
        endFrame: this.props.endFrame,
        bars: [],
        activeImageIndex: 0,
        frames: [],
        test: 1,
        notCalled: true
      };
    }
    
    closePlayback = () => {
        this.setState({showPlayBack: false});
        this.props.sendPlay(this.state.showPlayBack);
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
      var startSec = frame/30;
      this.getVideoImage(
        this.state.url,
        startSec,
        function(img, startSec, event) {
          if (event.type === 'seeked') {
              this.state.bars.push(img);
              this.state.frames.push(frame);
              if (this.state.endFrame >= ++frame) {
                // this.setState({this.state.bars});
                this.showImageAt(frame);
              }
              else {
                return;
              }
          }
          }
      );
    }
    
    componentDidMount(){
      if (document.getElementById("btn")) {
        document.getElementById("btn").style.display="none";
      }
      if (this.state.notCalled){
        this.showImageAt(this.state.startFrame);
        this.setState({notCalled: false});
      }
      console.log(this.state.bars.length, this.state.activeImageIndex);
      if (this.state.bars.length === this.state.endFrame - this.state.startFrame+1){
        const interval = setInterval(()=>{
          if (this.state.activeImageIndex+1===this.state.bars.length){
            // this.setState({activeImageIndex: 0});
            if (document.getElementById("btn")) {
              document.getElementById("btn").style.display="block";
            }
            clearInterval(interval);
          }
          if (document.getElementById("img")) {
            
            document.getElementById("img").innerHTML="Frame: " + this.state.frames[this.state.activeImageIndex];
            document.getElementById("img").appendChild(this.state.bars[this.state.activeImageIndex]);
          }
          
          let newActiveIndex = this.state.activeImageIndex+1     
          this.setState({
            activeImageIndex: newActiveIndex
          })
        }, 50);
      }
      else {
        console.log("else");
        const interval1 = setInterval(()=>{
          if (this.state.bars.length === this.state.endFrame - this.state.startFrame + 1) {
            this.componentDidMount();
            clearInterval(interval1);
          }
          let test = this.state.test;
          this.setState({
            test: test+1
          })
        }, 2000);
      }
       
   
    }
   
    render() { 
        return (
            <div className='container'>
                <div className="d-flex flex-row-reverse" onClick={this.closePlayback}><AiOutlineClose/></div>
               
                <div id="img">
                  Still loading...
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
