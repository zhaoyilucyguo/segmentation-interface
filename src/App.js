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
    // this.render=this.render.bind(this);
}
componentDidMount() {
  // axios.get('https://localhost:44305/api/Segmentation/GetPatientTaskInformation',{ crossdomain: true })
    axios.get(`http://localhost:5000/PatientTaskHandMapping`)
    .then(res => {
      const PatientTaskHandMapping =res.data;
      console.log(PatientTaskHandMapping);
      this.setState({ PatientTaskHandMapping });
    })
}

  render(){
    // const response = fetch("https://localhost:44305/api/Segmentation/GetPatientTaskInformation", {
    //     method: "GET",
    //     mode: "cors",
    //     headers: {
    //       'content-type': 'application/json; charset=utf-8 ',
    //       'date': 'Mon,07 Nov 2022 18:57:39 GMT ',
    //       'server': 'Microsoft-IIS/10.0 ',
    //       'x-powered-by': 'ASP.NET '
    //     },
    //     body: JSON.stringify(data),
    // });
    // console.log(response.json());

    function navTo(){
      document.getElementsByTagName("ul")[0].style.display="none";
    }
    function navBack(){
      document.getElementsByTagName("ul")[0].style.display="block";
    }
  return (
    <div className="container-fluid">   
    <h1 className="display-1"><NavLink to="/" onClick={navBack}>ARAT Segmentation</NavLink></h1>
    <hr width="100%"></hr>  
    <Routes> 
      <Route path='/' element={null} />
        {
        this.state.PatientTaskHandMapping
        .map
        (
            list=>
            <Route  key={"PTH"+list.id} path={"/Segmentation"+list.id} element={
            <PlayVideoCopy 
            PTHID={list.id} 
            HANDID={list.handId}
            PATIENTID={list.patientId}
            TASKID={list.taskId}
            IsSubmitted={list.IsSubmitted}
            />
            }/>
        )
        }
     </Routes>  
     <ul>
     {/* {
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
      }  */}
      {
        this.state.PatientTaskHandMapping//.filter(list => list.IsSubmitted === 0)
        .map
        (
            list=>
            <li key={"PTH"+list.id}>
            <NavLink to={"/Segmentation"+list.id} id={list.id} onClick={navTo}>
              <h2>Segmentation {list.id}: Patient {list.patientId}, Task {list.taskId}, Hand {list.handId} </h2>
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
