import './App.css';
// import { Container } from 'react-bootstrap';
import { Component } from 'react';

import { AiOutlineCheck } from "react-icons/ai/";
import { PlayVideoCopy } from './components/PlayVideo/PlayVideoCopy';
import { Route, Routes, NavLink } from "react-router-dom";
import axios from 'axios';


class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      PatientTaskHandMapping: []
    }
    this.render=this.render.bind(this);
}
componentDidMount() {
    axios.get(`http://localhost:5000/PatientTaskHandMapping`)
    .then(res => {
      const PatientTaskHandMapping =res.data;
      console.log(PatientTaskHandMapping);
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
    <div className='container'>   
    <h1><NavLink to="/" onClick={navBack}>ARAT Segmentation</NavLink></h1>
    <hr width="100%"></hr>  
    <Routes> 
        {
        this.state.PatientTaskHandMapping
        .map
        (
            list=>
            <>
            <Route path={"/Segmentation"+list.id} element={
            <PlayVideoCopy 
            PTHID={list.id} 
            HANDID={list.HandId}
            PATIENTID={list.PatientId}
            TASKID={list.TaskId}
            />
            }/>
            </>
        )
        }
     </Routes>  
     <ul>
     {
        this.state.PatientTaskHandMapping.filter(list => list.IsSubmitted === 1)
        .map
        (
            list=>
            <li>
            <NavLink to={"/Segmentation"+list.id} id={list.id} onClick={navTo}>
              Segmentation {list.id}: Patient {list.PatientId}, Task {list.TaskId}, Hand {list.HandId} 
              <AiOutlineCheck size={30} color="green"/>
            </NavLink>
            </li>
        )
      } 
      {
        this.state.PatientTaskHandMapping.filter(list => list.IsSubmitted === 0)
        .map
        (
            list=>
            <li>
            <NavLink to={"/Segmentation"+list.id} id={list.id} onClick={navTo}>
              Segmentation {list.id}: Patient {list.PatientId}, Task {list.TaskId}, Hand {list.HandId} 
            </NavLink>
            </li>
        )
      } 
        </ul>     
    </div>
    );
  }
}

export default App;
