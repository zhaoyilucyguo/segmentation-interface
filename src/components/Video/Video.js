import { setSelectionRange } from '@testing-library/user-event/dist/utils';
import React, { Component } from 'react';
import VideoPlayer from 'react-video-player-extended';

export class Video extends Component {  
    constructor(props) {
      super(props);
      this.state = {
        url: this.props.url,
        isPlaying: this.props.isPlaying,
        timeStart: this.props.timeStart,
        currentTime: undefined,
        duration: undefined
      };
    }
    handleProgress = (e) => {
      this.setState({currentTime: e.target.currentTime});
      this.props.sendTime(this.state.currentTime);
    } 
    handleDuration = (duration) => {
      this.setState({duration: duration});
    }
    render() { 
        var { 
            url, 
            isPlaying,
            timeStart,
            duration,
            currentTime
          } = this.state;
        var fps=30;
        const controls = ['Play', 'Time', 'Progress', 'NextFrame', 'LastFrame', 'FullScreen'];
        document.onkeydown = checkKey;

        function checkKey(e) {

            e = e || window.event;

            if (e.keyCode == '37') {
              // left arrow
              document.getElementsByClassName("react-video-player")[0].currentTime = document.getElementsByClassName("react-video-player")[0].currentTime - 1/30;
            }
            else if (e.keyCode == '39') {
              // right arrow
              if (document.getElementsByClassName("react-video-player")[0].currentTime >= 1/30 ){
                document.getElementsByClassName("react-video-player")[0].currentTime = document.getElementsByClassName("react-video-player")[0].currentTime + 1/30;
              }
                
            }
            else if (e.keyCode == '32'){
              if (document.getElementsByClassName("react-video-player")[0].isPlaying){
                document.getElementsByClassName("react-video-player")[0].isPlaying = false;
              }
              else{
                document.getElementsByClassName("react-video-player")[0].isPlaying = true;
              }
            }

        }
        return (
            <div>
                <VideoPlayer
                    url={url}
                    controls={controls}
                    isPlaying={isPlaying}
                    loop={false}
                    height={'auto'}
                    width={'100%'}
                    timeStart={timeStart}
                    onPlay={()=>{this.setState({isPlaying: true})}}
                    onPause={()=>{this.setState({isPlaying: false})}}
                    onProgress={(e)=>{
                      this.handleProgress(e);
                    }}
                    onDuration={(duration)=>{this.handleDuration(duration)}}
                    onVideoPlayingComplete={()=>{this.setState({isPlaying: false})}}
                    fps={fps}
                  />
            </div>
        );
    }
}
