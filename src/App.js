import './App.css';
// import { Container } from 'react-bootstrap';
import { Component } from 'react';
// import PlayVideo from './components/PlayVideo/PlayVideo.js';
import { PlayVideoCopy } from './components/PlayVideo/PlayVideoCopy';


class App extends Component{
  
  render(){
  return (
  
    <div className='container'>     
        
        <div className='mainContent'>
          {/* <PlayVideo/> */}
          <PlayVideoCopy/>
          {/* <SideBar /> */}
        </div>         
    </div>
    );
  }
}

export default App;
