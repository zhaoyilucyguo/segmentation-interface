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
      PatientTaskHandMapping: [],
      display: "block"
    }
    // this.render=this.render.bind(this);
}
componentDidMount() {
  // axios.get('https://localhost:44305/api/Segmentation/GetPatientTaskInformation',{ crossdomain: true })
    axios.get(`http://localhost:5000/PatientTaskHandMapping`)
    .then(res => {
      const PatientTaskHandMapping =res.data;
      this.setState({ PatientTaskHandMapping });
      console.log(PatientTaskHandMapping.filter(list => list.isSubmitted === true));
    })
    // axios.get('http://localhost:5016/api/Segmentation/GetPatientTaskInformation', {
    //   "Access-Control-Allow-Origin": "http://localhost:3000/"  
    // })
    // .then(res => {
    //     console.log(res.data)
    //     var PatientTaskHandMapping =res.data;
    //     this.setState({ PatientTaskHandMapping });
    // })
    // let url = 'http://localhost:5016/api/Segmentation/GetPatientTaskInformation';
    // let headers = new Headers();

    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    // // headers.append('Authorization', 'Basic ' + base64.encode(username + ":" +  password));
    // headers.append('Origin','http://localhost:3000');
    // fetch(url, {
    //   method: "GET",
    //   mode: 'cors',
    //   headers: headers
    // })
    // .then(res => res.json())
    // .then(out =>
    //   console.log('Checkout this JSON! ', out))
    // .catch(err => { throw err });
   
 
}

  render(){
    var {
      display
    } = this.state;
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
    <h1 className="display-1"><NavLink to="/" onClick={()=>{
      this.setState({display: "block"})
      document.getElementsByTagName("ul")[0].style.display="block";
    }}>ARAT Segmentation</NavLink></h1>
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
            PATIENTCODE={list['patient']['patientCode']}
            TASKID={list.taskId}
            IsSubmitted={list.IsSubmitted}
            />
            }/>
        )
        }
     </Routes>  
     <ul>
     {
        this.state.PatientTaskHandMapping.filter(list => list.isSubmitted === true)
        .map
        (
            list=>
            <li key={"PTH"+list.id} >
            <NavLink to={"/Segmentation"+list.id} id={list.id} onClick={()=>{
              // navTo();
              this.setState({display: "none"});
              document.getElementsByTagName("ul")[0].style.display="none";
            }}>
              <h2>Segmentation {list.id}: Patient {list['patient']['patientCode']}, Task {list.taskId}, Hand {list.handId} <AiOutlineCheck size={30} color="green"/></h2>
              
            </NavLink>
            </li>
        )
      } 
      {
        this.state.PatientTaskHandMapping.filter(list => list.isSubmitted === false)
        .map
        (
            list=>
            <li key={"PTH"+list.id} >
            <NavLink to={"/Segmentation"+list.id} id={list.id} onClick={()=>{
              // navTo();
              this.setState({display: "none"});
              document.getElementsByTagName("ul")[0].style.display="none";
            }}>
              <h2>Segmentation {list.id}: Patient {list['patient']['patientCode']}, Task {list.taskId}, Hand {list.handId} </h2>
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
