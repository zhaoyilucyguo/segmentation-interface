import React, {useState, useEffect} from 'react';
import './PlayVideo.css'
import { AiFillInfoCircle } from "react-icons/ai/";
import Timestamp from '../SideBar/Timestamp/Timestamp';


function PlayVideo() {  
  const [data,setData]=useState([]);
  const getData=()=>{
    fetch('http://localhost:5000/segmentation'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
        setData(myJson)
      });
  }
  useEffect(()=>{
    getData()
  },[])
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
        const getHeadings = () => {
          return Object.keys(data[0]);
        }
        return (
          <div className='container'>
            
            <div className='PlayVideo'>
            <h1>Sigmentation Interface</h1>
              <h2>Patient 1, Task 1, Ipsilateral View</h2>
              <video id="video" src="./Videos/cam4activity1 (1).webm" onTimeUpdate={onTimeUpdate} controls='controls'></video>
              <div className='buttons'>
                  <button id="in" onClick={IN}>IN</button>
                  <div id="instruction">
                    <h5>Please Select the "IN" Point for the Segment IPT</h5>
                    <AiFillInfoCircle onClick={Definition}/>
                  </div>
                    
                  <button id="out" onClick={OUT}>OUT</button>
                </div>
            </div>
            <div className='SideBar'>
              <div className='SwitchView'>
                <h4>Switch View</h4>
                  <div className="video-preview">
                      <iframe src="./Videos/cam1activity1 (1).webm" title="YouTube video" ></iframe>
                      <h5>Transpose</h5>
                  </div>
                  <div className="video-preview">
                      <iframe src="./Videos/cam2activity1 (1).webm" title="YouTube video" ></iframe>
                      <h5>Contralateral</h5>
                  </div>
                </div>
              <div className='TimeStamp'>
                <h4>Timestamp Record</h4>
                <Timestamp theadData={getHeadings()} tbodyData={data}/> 
              </div>
            </div>
          </div>
        );
}
export default PlayVideo;