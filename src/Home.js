import './App.css';
// import { Container } from 'react-bootstrap';
import { Component } from 'react';

import { AiOutlineCheck } from "react-icons/ai/";
import { PlayVideoCopy } from './components/PlayVideo/PlayVideoCopy';
import { Route, Routes, NavLink } from "react-router-dom";
import axios from 'axios';


class Home extends Component{
  constructor(props) {
    super(props);
    this.state = {
      PatientTaskHandMapping: [],
      display: "block"
    }
}
componentDidMount() {
  axios.get(`http://localhost:5000/PatientTaskHandMapping`)
  .then(res => {
    var PatientTaskHandMapping =res.data; 
    PatientTaskHandMapping=PatientTaskHandMapping.filter(list => list.isImpaired === true);
    //PatientTaskHandMapping = this.shuffleArray(PatientTaskHandMapping);
    PatientTaskHandMapping = PatientTaskHandMapping.slice();
    for (let i = PatientTaskHandMapping.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [PatientTaskHandMapping[i], PatientTaskHandMapping[randomIndex]] = [PatientTaskHandMapping[randomIndex], PatientTaskHandMapping[i]];
    }
    //console.log(PatientTaskHandMapping);
    this.setState({ PatientTaskHandMapping });
  })
}
  render(){
    function navTo(){
      document.getElementsByTagName("ul")[0].style.display="none";
    }
    function navBack(){
      document.getElementsByTagName("ul")[0].style.display="block";
    }
  return (
    <div className="container-fluid">   
    
    <hr width="100%"></hr>  
     <div className="row">
        <div className="col-sm-3">
          <div className="doneTitle" onClick={()=>{
            document.getElementsByClassName("doneTask")[0].style.display='block';
            document.getElementsByClassName("todoTask")[0].style.display='none';
          }}>
            <h1>{this.state.PatientTaskHandMapping.filter(list => list.isSubmitted === true).length}</h1>
            <h3>Tasks Done</h3> 
          </div>
        </div>
        <div className="col-sm-3">
          <div className="todoTitle" onClick={()=>{
            document.getElementsByClassName("doneTask")[0].style.display='none';
            document.getElementsByClassName("todoTask")[0].style.display='block';
          }}>
            <h1>{this.state.PatientTaskHandMapping.filter(list => list.isSubmitted === false && list.taskId <= 4).length}</h1>
            <h3>Tasks To Do</h3> 
          </div>
        </div>
      </div>
      <ul className='todoTask'>
      {
        this.state.PatientTaskHandMapping.filter(list => list.isSubmitted === false && list.taskId <= 4)
        .map
        (
            list=>
            <li key={"PTH"+list.id} >
            <NavLink to={"/Segmentation"+list.id} id={list.id} onClick={()=>{
              // navTo();
              this.setState({display: "none"});
              document.getElementsByTagName("ul")[0].style.display="none";
            }}>
              <h2>Segmentation {list.id}: Patient {list.patientId}, Task {list.taskId}, Hand {list.handId} </h2>
            </NavLink>
            </li>
        )
      } 
        </ul>  
     <ul className='doneTask'>
     {
        this.state.PatientTaskHandMapping.filter(list => list.isSubmitted === true && list.taskId <= 4)
        .map
        (
            list=>
            <li key={"PTH"+list.id} >
            <NavLink to={"/Segmentation"+list.id} id={list.id} onClick={()=>{
              // navTo();
              this.setState({display: "none"});
              document.getElementsByTagName("ul")[0].style.display="none";
            }}>
              <h2>Segmentation {list.id}: Patient {list.patientId}, Task {list.taskId}, Hand {list.handId} <AiOutlineCheck size={30} color="green"/></h2>
              
            </NavLink>
            </li>
        )
      } </ul>
         
    </div>
    );
  }
}

export default Home;
