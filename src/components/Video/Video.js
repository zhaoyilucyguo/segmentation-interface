import React, { Component } from 'react';
import VideoPlayer from 'react-video-player-extended';

export class Video extends Component {  
    constructor(props) {
      super(props);
      this.state = {
        url: this.props.url,
        isPlaying: this.props.isPlaying,
        timeStart: this.props.timeStart
      };
    }
     
    
    render() { 
        var { 
            url, 
            isPlaying,
            timeStart
          } = this.state;
        var fps=30;
        const controls = ['Play', 'Time', 'Progress', 'NextFrame', 'LastFrame', 'FullScreen'];
        function handleProgress(e) {
        console.log('Current time: ', e.target.currentTime);
        
        }
    
        function handleDuration(duration) {
        console.log('Duration: ', duration)
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
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onVideoPlayingComplete={()=>{this.setState({isPlaying: false})}}
                    fps={fps}
                    // selectedMarker={selectedMarker}
                    // viewSettings={settings}
                  />
            </div>
        );
    }
}
