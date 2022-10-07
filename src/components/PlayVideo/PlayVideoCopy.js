import React, {Component} from 'react';
import axios from 'axios';
import './PlayVideo.css'
import { AiFillInfoCircle } from "react-icons/ai/";
import Timestamp from '../SideBar/Timestamp/Timestamp';


export class PlayVideoCopy extends Component {  
  state = {
    segmentation: [],
    videos: [],
    recommended_view: [],
    Task_ID: 1,
    Patient_ID: 1,
    Segment: "IPT",
    view: "",
    definition: ""
  }

  componentDidMount() {
    axios.get(`http://localhost:5000/segmentation`)
    .then(res => {
      const segmentation =res.data;
      this.setState({ segmentation });
    })
    axios.get(`http://localhost:5000/videos`)
    .then(res => {
      const videos =res.data;
      this.setState({ videos });
    })
    axios.get(`http://localhost:5000/recommended_view`)
    .then(res => {
      const recommended_view =res.data;
      const view = recommended_view.filter(view => view.Task_ID === this.state.Task_ID && view.Segment === this.state.Segment)[0].Recommended_View;
      const definition = recommended_view.filter(view => view.Task_ID === this.state.Task_ID && view.Segment === this.state.Segment)[0].Definition;
      console.log(definition);
      this.setState({ recommended_view });
      this.setState({ view });
      this.setState({ definition });
    })
  }


  render() { 
    var Task_ID=1;
    var Patient_ID=1;
    var Segment='IPT';
    // function getView(){
    //   return this.state.recommended_view.filter(
    //     function(recommended_view){
    //       return recommended_view.Task_ID===Task_ID && recommended_view.Segment===Segment
    //     }
    //   )
    // }
    // var value = getView();
    // console.log(value);
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
    function Definition() {      
      alert("IPT: Starts with the first effort for initiation of movement; ends at the first perceptible movement of the object towards the target location.\nRecommended view: Ipsilateral ");
    }
    return (
      <div className='container'>
        
        <div className='PlayVideo'>
        <h1>Sigmentation Interface</h1>
        {
              this.state.videos.filter(video => video.Task_ID === Task_ID && video.Patient_ID === Patient_ID && video.View === "Ipsilateral")
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
                {/* { this.state.recommended_view.map(view=><div>{view.Definition}</div>)} */}
              </h5>              
              <AiFillInfoCircle/>
            </div> 
            <div className='hide'>
              {this.state.definition}
            </div>             
            <button id="out" onClick={OUT}>OUT</button>
          </div>
            <div className='hide'>
              {this.state.recommended_view.filter(view => view.Task_ID === Task_ID && view.Segment === Segment).map(view => (
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
              this.state.videos.filter(video => video.Task_ID === Task_ID && video.Patient_ID === Patient_ID && video.View !== "Ipsilateral")
              .map(video=>
                <div className="video-preview">
                  <iframe src={video.Path} title={video.Path}></iframe>
                  <h5>{video.View}</h5>
              </div>
              )
            }
              
              
            </div>
          <div className='TimeStamp'>
            <h4>Timestamp Record</h4>
            <table>
              <thead>
                  <tr>
                      <th>Segment</th>
                      <th>IN</th>
                      <th>OUT</th>
                  </tr>
              </thead>
              {
                this.state.segmentation
                  .map(person =>
                    <tr>
                      <td>{person.Segment}</td>
                      <td>{person.IN}</td>
                      <td>{person.OUT}</td>
                    </tr>
                  )
              }
            </table>
            
          </div>
        </div>
      </div>
    );
  }
}
