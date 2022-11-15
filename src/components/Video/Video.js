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
        currentTime: undefined
      };
    }
    handleProgress = (e) => {
      this.setState({currentTime: e.target.currentTime});
      this.props.sendTime(this.state.currentTime);
    } 
    
    render() { 
        var { 
            url, 
            isPlaying,
            timeStart
          } = this.state;
        var fps=30;
        const controls = ['Play', 'Time', 'Progress', 'NextFrame', 'LastFrame', 'FullScreen'];
        
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
                    onVideoPlayingComplete={()=>{this.setState({isPlaying: false})}}
                    fps={fps}
                  />
            </div>
        );
    }
}
