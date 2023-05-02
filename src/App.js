import './App.css';
// import { Container } from 'react-bootstrap';
import { Component } from 'react';

import { AiOutlineCheck } from "react-icons/ai/";
import { PlayVideoCopy } from './components/PlayVideo/PlayVideoCopy';
import { Route, Routes, NavLink } from "react-router-dom";
import axios from 'axios';
import Home from './Home';


class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      PatientTaskHandMapping: [],
      display: "block"
    }
    // this.render=this.render.bind(this);
}
shuffleArray(array) {
  // Copy the original array to avoid modifying the original array
  const shuffledArray = array.slice();

  // Loop through the array from the end to the beginning
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i (inclusive)
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // Swap the elements at positions i and randomIndex
    [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
  }

  return shuffledArray;
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
    <h1 className="display-1"><NavLink to="/" onClick={()=>{
      this.setState({display: "block"})
      document.getElementsByTagName("ul")[0].style.display="block";
    }}>ARAT Segmentation</NavLink></h1>
    <hr width="100%"></hr>  
    <Routes> 
      <Route path='/' element={
      <Home/>} />
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
            PatientTaskHandMapping={this.state.PatientTaskHandMapping}
            // PATIENTCODE={list['patient']['patientCode']}
            TASKID={list.taskId}
            IsSubmitted={list.IsSubmitted}
            />
            }/>
        )
        }
     </Routes>  
    </div>
    );
  }
}

export default App;
