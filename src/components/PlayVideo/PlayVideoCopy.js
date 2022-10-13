import React, {Component} from 'react';
import axios from 'axios';
import './PlayVideo.css'
import { AiFillInfoCircle } from "react-icons/ai/";
import Timestamp from '../SideBar/Timestamp/Timestamp';
import Test from '../SideBar/Timestamp/Test';
import '../SideBar/Timestamp/Timestamp.css';


export class PlayVideoCopy extends Component {  
  state = {
    segmentation: [],
    videos: [],
    recommended_view: [],
    Task_ID: 1,
    Patient_ID: 1,
    Segment: "IPT",
    Segments: ['IPT', 'Enhanced-T', 'M&TR', 'P&R'],
    view: "",
    definition: ""
  }

  componentDidMount() {
    axios.get(`http://localhost:5000/segmentation`)
    .then(res => {
      const data =res.data;
      const segmentation = data.filter(view => view.Task_ID === this.state.Task_ID && view.Patient_ID === this.state.Patient_ID);
      this.setState({ segmentation });
    })
    axios.get(`http://localhost:5000/videos`)
    .then(res => {
      const data =res.data;
      const videos = data.filter(view => view.Task_ID === this.state.Task_ID && view.Patient_ID === this.state.Patient_ID);
      this.setState({ videos });
    })
    axios.get(`http://localhost:5000/recommended_view`)
    .then(res => {
      const recommended_view =res.data;
      const view = recommended_view.filter(view => view.Task_ID === this.state.Task_ID && view.Segment === this.state.Segment)[0].Recommended_View;
      const definition = recommended_view.filter(view => view.Task_ID === this.state.Task_ID && view.Segment === this.state.Segment)[0].Definition;
      this.setState({ recommended_view });
      this.setState({ view });
      this.setState({ definition });
    })
  }


  render() { 
    const { segmentation,videos,recommended_view,Task_ID,Patient_ID,Segment,view,definition,Segments} = this.state
    var index=0;
    var currentTime = 0;
    function onTimeUpdate(e){
      currentTime = Math.round(e.target.currentTime * 1000);
    };
    function IN() {
      alert(currentTime);
    }
    function OUT() {
      alert(currentTime);
    }
    function handleIn(e) {
      segmentation[e.target.id-1].IN=e.target.value;
      console.log(segmentation);      
    }
    function handleOut(e) {
      console.log(e.target.value);      
    }
    return (
      <div className='container'>        
        <div className='PlayVideo'>
          <h1>Sigmentation Interface</h1>
          {
            videos.filter(video => video.Task_ID === Task_ID && video.Patient_ID === Patient_ID && video.View === view)
            .map(video=>
              <div className="video-preview">
                <h2>Patient {video.Patient_ID}, Task {video.Task_ID}, {video.View} View</h2>
                <video id="video" src={video.Path} onTimeUpdate={onTimeUpdate} controls='controls'></video>
            </div>
            )
          }
          <div className='buttons'>
            <button id="in" onClick={IN}>IN</button>
            <div className="instruction">
              <h5>
                Please Select the "IN" Point for the Segment IPT
              </h5>              
              <AiFillInfoCircle/>
            </div> 
            <div className='hide'>
              {definition}
            </div>             
            <button id="out" onClick={OUT}>OUT</button>
          </div>
          <div className='hide'>
            {recommended_view.filter(view => view.Task_ID === Task_ID && view.Segment === Segments[index]).map(view => (
              <div>
                {view.Definition}
              </div>
            ))}
          </div>
        </div>
        <div className='SideBar'>
          <div className='SwitchView'>
            <h4>Switch View</h4>
            {
              videos.filter(video => video.Task_ID === Task_ID && video.Patient_ID === Patient_ID && video.View !== view)
              .map(video=>
                <div className="video-preview" onClick={()=>this.setState({view: video.View})} >
                  <video src={video.Path} title={video.Path} className="sidebarVideo"  id={video.View}></video>
                  <h5>{video.View}</h5>
              </div>
              )
            }                         
            </div>
          <form className='TimeStamp'>
            <h4>Timestamp Record</h4>
            <table>
              <thead>
                  <tr>
                      <th>Segment</th>
                      <th>IN</th>
                      <th>OUT</th>
                  </tr>
              </thead>
              <tbody>
              {
                segmentation
                  .map(segment =>
                    <tr>
                      <td>{segment.Segment}</td>
                      <td><input onChange={(e)=>handleIn(e)} id={segment.id} value={segment.IN}></input></td>
                      <td><input onChange={(e)=>handleOut(e)} id={segment.id} value={segment.OUT}></input></td>
                    </tr>
                  )
              }
              </tbody>
            </table>
            <button type="submit">Submit</button>
          </form>
          {/* <Timestamp currentTime={currentTime}/>
          <Test /> */}
        </div>
        
      </div>
    );
  }
}
