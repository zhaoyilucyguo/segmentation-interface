import React, {Component, setState} from 'react';
import axios from 'axios';
import './PlayVideo.css'
import { AiFillInfoCircle, AiOutlinePlus, AiOutlineMinus, AiFillPlayCircle } from "react-icons/ai/";
import '../SideBar/Timestamp/Timestamp.css';
// import { ReactPlayer } from 'react-player';


export class PlayVideoCopy extends Component {  
  constructor(props) {
    super(props);
    this.state = {
      VideoSegment: [],
      videos: [],
      recommended_view: [],
      PatientTaskHandMapping: [],
      Camera: [],
      Feedback: [],
      logs: [],
      PatientTaskHandMappingId: this.props.dataParentToChild,
      // PatientTaskHandMappingId: 1,
      TaskId: undefined,
      PatientId: undefined,
      HandId: undefined,
      Segment: 1, // start at IPT
      SegmentJson: [],
      view: "",
      definition: "",
      index: 0,
      cnt: 0,
      currentTime: 0,
      CameraId: 0,
      prevIndex: undefined
    }
    this.render=this.render.bind(this);
  }
  
  componentDidMount() {
    axios.get(`http://localhost:5000/PatientTaskHandMapping`)
    .then(res => {
      const PatientTaskHandMapping =res.data;
      const TaskId = PatientTaskHandMapping.filter(view => view.id === this.state.PatientTaskHandMappingId)[0].TaskId;
      const PatientId = PatientTaskHandMapping.filter(view => view.id === this.state.PatientTaskHandMappingId)[0].PatientId;      
      const HandId = PatientTaskHandMapping.filter(view => view.id === this.state.PatientTaskHandMappingId)[0].HandId;
      this.setState({ PatientTaskHandMapping });
      this.setState({ TaskId });
      this.setState({ PatientId });
      this.setState({ HandId });
    })
    axios.get(`http://localhost:5000/Camera`)
    .then(res => {
      const Camera =res.data;
      this.setState({ Camera });
    })
    axios.get(`http://localhost:5000/Segment`)
    .then(res => {
      const SegmentJson =res.data;
      this.setState({ SegmentJson });
    })

    axios.get(`http://localhost:5000/VideoSegment`)
    .then(res => {
      const data =res.data;
      const VideoSegment = data.filter(view => view.PatientTaskHandMappingId === this.state.PatientTaskHandMappingId);
      const index = VideoSegment[0].id;
      let i = 0;
      while (i < VideoSegment.length) {
        VideoSegment[i]['IsChecked'] = 0;
        i++;
      }
      this.setState({ VideoSegment });
      this.setState({ index });
    })
    axios.get(`http://localhost:5000/FileInfo`)
    .then(res => { 
      const data =res.data;
      const videos = data.filter(view => view.PatientTaskHandMappingId === this.state.PatientTaskHandMappingId);
      console.log(videos);
      this.setState({ videos });
    })
    axios.get(`http://localhost:5000/TaskSegmentCameraMapping`)
    .then(res => {
      const recommended_view =res.data;
      const CameraId = recommended_view.filter(view => view.TaskId === this.state.TaskId && view.SegmentId === this.state.Segment)[0].CameraId;
      const view = this.state.Camera.filter(view => view.id === CameraId).ViewType;
      const definition = recommended_view.filter(view => view.TaskId === this.state.TaskId && view.SegmentId === this.state.Segment)[0].Definition;
      this.setState({ recommended_view });
      this.setState({ CameraId });
      this.setState({ view });
      this.setState({ definition });
    })
    axios.get(`http://localhost:5000/Feedback`)
      .then(res => { 
        const Feedback =res.data;
        this.setState({ Feedback });
    })
    axios.get(`http://localhost:5000/logs`)
      .then(res => { 
        const logs =res.data;
        this.setState({ logs });
    })
    document.getElementById("out").disabled=true;
    document.getElementById("in").disabled=true;
  }
  Next = () => {
    var id = this.state.PatientTaskHandMappingId;
    id=id+1;
    const data=this.state.PatientTaskHandMapping.filter(page => page.id === id);
    if (data.length > 0) {
      const PatientTaskHandMappingId = id;
      localStorage.setItem('id', JSON.stringify(id));
      this.setState({ PatientTaskHandMappingId });
      this.componentDidMount();
    }
    else {
      alert('This is the last page');
    }
  }
  Prev = () => {
    var id = this.state.PatientTaskHandMappingId;
    id=id-1;
    const data=this.state.PatientTaskHandMapping.filter(page => page.id === id);
    if (data.length > 0) {
      const PatientTaskHandMappingId = id;
      localStorage.setItem('id', JSON.stringify(id));
      this.setState({ PatientTaskHandMappingId });
      this.componentDidMount();
    }
    else {
      alert('This is the first page');
    }
  }

  render() { 
    var { 
      VideoSegment,
      videos,
      recommended_view,
      TaskId,
      PatientId,
      HandId,
      PatientTaskHandMappingId,
      PatientTaskHandMapping,
      definition,
      index, 
      cnt, 
      Camera, 
      Feedback,
      logs,
      CameraId, 
      SegmentJson, 
      prevIndex, 
    } = this.state;
    var currentTime = 0;
    var pauseTime = -1;
      
    function onTimeUpdate(e){
      currentTime = e.target.currentTime;
      if (pauseTime >= 0) {
        if (currentTime >= pauseTime) {
          var vid = document.getElementById("video")
          vid.pause();
          pauseTime = -1;
        }
      }
    }
    function changeColor(cur, next, time) {
      if (next.value !== ''){
        if (parseInt(next.value) !== time) {
          next.style.backgroundColor="yellow";
          cur.style.backgroundColor="yellow";
        }
        else {
          next.style.backgroundColor="white";
          cur.style.backgroundColor="white";
        }
      }
    }
    function IN() {
      var time = currentTime;
      var cur = document.getElementById("IN"+String(index));
      cur.readonly=false;
      cur.value=Math.floor(time*24);
      cur.readonly=true;
      VideoSegment.filter(view => view.id === index)[0].StartTime=Math.floor(time*24);
      var checkBox = document.getElementById("CHECK"+index);
      checkBox.disabled=false;
      document.getElementById("in").disabled=false;
      document.getElementById("out").disabled=false;
      var SegmentId = VideoSegment.filter(view => view.PatientTaskHandMappingId === PatientTaskHandMappingId && view.id === index)[0].SegmentId;
      var Segment = SegmentJson.filter(view => view.id === SegmentId)[0].SegmentLabel;
      if (Segment === "M&TR") {
        var prevprev = document.getElementById("OUT"+String(index-2));
        changeColor(cur, prevprev, time);
      }
      else if (index-VideoSegment[0].id > 1) {
        var prev = document.getElementById("OUT"+String(index-1));
        changeColor(cur, prev, time);
      }
      // check this IN and previous OUT
    }
    function OUT() { 
      var time = currentTime;
      var cur = document.getElementById("OUT"+String(index));
      cur.readonly=false;
      cur.value=Math.floor(time*24);
      cur.readonly=true;
      VideoSegment.filter(view => view.id === index)[0].EndTime=Math.floor(time*24);
      var checkBox = document.getElementById("CHECK"+index);
      checkBox.disabled=false;
      // check ET and IPT
      var SegmentId = VideoSegment.filter(view => view.PatientTaskHandMappingId === PatientTaskHandMappingId && view.id === index)[0].SegmentId;
      var Segment = SegmentJson.filter(view => view.id === SegmentId)[0].SegmentLabel;
      if (Segment === "ET") {
        var prev = document.getElementById("OUT"+String(index-1));
        changeColor(cur, prev, time);
      }
      else if (Segment === "IPT") {
        var next = document.getElementById("OUT"+String(index+1));
        var nextnext = document.getElementById("IN"+String(index+2));
        if (next.value !== '' && parseInt(next.value) !== time) {
          next.style.backgroundColor="yellow";
          cur.style.backgroundColor="yellow";
        }
        changeColor(cur, nextnext, time);
      }
      else if (index-VideoSegment[0].id > 0 && index-VideoSegment[0].id < VideoSegment.length) {
        var next = document.getElementById("IN"+String(index+1));
        changeColor(cur, next, time);
      }
      index=index+1;
      cnt = cnt+1;
      document.getElementById("out").disabled=true;
      document.getElementById("in").disabled=true;
      if (cnt >= VideoSegment.length) {
        document.getElementById("instruction").innerHTML="Please Review the Timestamp Record and then Submit it";
      }
      else {
        document.getElementById("instruction").innerHTML="Please Select the Next Segment";
      }
      
    }
    function onSelect(e) {
      var id=parseInt(e.target.id);
      var count = id-VideoSegment.filter(view => view.PatientTaskHandMappingId === PatientTaskHandMappingId)[0].id;
      if (count > 1 && (VideoSegment[count-2].StartTime === null || VideoSegment[count-2].EndTime === null)) {
        alert("Make sure you have filled out the previous segment entries before you select a new one");
        return;
      }
      index=id;
      cnt = count;
      // background color    
      var row = document.getElementById("ROW"+index);
      console.log(prevIndex);
      if (prevIndex !== undefined && prevIndex !== index) {
        if (VideoSegment[prevIndex-1]['IsChecked']===1) {
          document.getElementById("ROW"+prevIndex).style.backgroundColor="rgb(211, 211, 211)";
        }
        else {
          document.getElementById("ROW"+prevIndex).style.backgroundColor="rgba(0, 0, 0, 0)";
        }         
      }
      row.style.backgroundColor="#AFE1AF";
      prevIndex = index;
      // in and out buttons
      document.getElementById("out").disabled=false;
      document.getElementById("in").disabled=false;
      var SegmentId = VideoSegment.filter(view => view.PatientTaskHandMappingId === PatientTaskHandMappingId && view.id === index)[0].SegmentId;
      var Segment = SegmentJson.filter(view => view.id === SegmentId)[0].SegmentLabel;
      document.getElementById("instruction").innerHTML="Please Select the IN and OUT Points for the Segment "+Segment;
      definition=recommended_view.filter(view => view.TaskId === TaskId && view.SegmentId === SegmentId)[0].Definition;
      CameraId = recommended_view.filter(view => view.TaskId === TaskId && view.SegmentId === SegmentId)[0].CameraId;
      document.getElementById("video").currentTime=document.getElementById("IN"+index).value/24;
    }    
    function selectTimestamp(id) {
      var time = document.getElementById(id);
      document.getElementById("video").currentTime=time.value/24;
    }
    function onPlay(id) {
      var time = document.getElementById("IN"+id);
      var vid = document.getElementById("video")
      vid.currentTime=time.value/24;
      vid.play();
      time = document.getElementById("OUT"+id);
      pauseTime = time.value/24;
    }
    function onCheck(id, StartTime, EndTime) {
      var checkBox = document.getElementById("CHECK"+id);
      if (VideoSegment[id-1].StartTime === null || VideoSegment[id-1].EndTime === null) {
        checkBox.checked=false;
        alert("Make sure you have filled out the segment entries before you check them");
        return;
      }
      // If the checkbox is checked, display the output text
      var row = document.getElementById("ROW"+id);
      let myDivObjBgColor = window.getComputedStyle(row).backgroundColor;
      if (checkBox.checked == true){
        if (myDivObjBgColor === "rgba(0, 0, 0, 0)") {
          row.style.backgroundColor="rgb(211, 211, 211)";
        }
        VideoSegment[id-1].IsChecked=1;  
        var logsId = logs.length+1;
        axios.post('http://localhost:5000/logs/'+String(logsId), {
          "id": logsId,
          "PatientId": PatientId,
          "TaskId": TaskId,
          "CameraId": CameraId, //update onSelect
          "HandId": HandId,
          "SegmentId": id,
          "StartTime": StartTime,
          "EndTime": EndTime,
          "IsSubmitted": 0
        })
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })     
      } else {
        if (myDivObjBgColor === "rgb(211, 211, 211)") {
          row.style.backgroundColor="rgba(0, 0, 0, 0)";
        } 
        VideoSegment[id-1].IsChecked=0;         
      } 
    }
    function switchView(CameraId){
      var logsId = logs.length+1;
      axios.post('http://localhost:5000/logs/'+String(logsId), {
        "id": logsId,
        "PatientId": PatientId,
        "TaskId": TaskId,
        "CameraId": CameraId, //update onSelect
        "HandId": HandId,
        "SegmentId": VideoSegment.filter(view => view.id === index)[0].SegmentId,
        "StartTime": VideoSegment.filter(view => view.id === index)[0].StartTime,
        "EndTime": VideoSegment.filter(view => view.id === index)[0].EndTime,
        "IsSubmitted": 0
      })
      .then(response => {
          console.log(response)
      })
      .catch(error => {
          console.log(error)
      }) 
          
    }
    function submitFeedback(e){
      e.preventDefault();
      var feedback = e.target[0].value;
      if (feedback === '') {
        alert("The feedback box shouldn't be empty.");
        return;
      }
      var feedbackId = Feedback.length+1;
      axios.post('http://localhost:5000/Feedback/'+String(feedbackId), {
        "id": feedbackId,
        "feedback": e.target[0].value,
      })
      .then(response => {
          console.log(response)
      })
      .catch(error => {
          console.log(error)
      })
      alert("You have successfully submitted your feedback!");
    }
    function submit(e) {
      e.preventDefault();
      let j = 0;
      while (j < VideoSegment.length) {
        if (VideoSegment[j]['IsChecked'] === 0){
          alert("Check all entries before you submit!");
          return;
        }
        j++;
      }
      let i = 0;
      var id = VideoSegment[0].id;
      while (i < VideoSegment.length) {
        axios.put('http://localhost:5000/VideoSegment/'+String(id), {
          "id": id,
          "PatientTaskHandMappingId": VideoSegment.filter(view => view.id === id)[0].PatientTaskHandMappingId,
          "SegmentId": VideoSegment.filter(view => view.id === id)[0].SegmentId,
          "StartTime": VideoSegment.filter(view => view.id === id)[0].StartTime,
          "EndTime": VideoSegment.filter(view => view.id === id)[0].EndTime
        })
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })
        var logsId = logs.length+1;
        axios.post('http://localhost:5000/logs/'+String(logsId), {
          "id": logsId,
          "PatientId": PatientId,
          "TaskId": TaskId,
          "CameraId": CameraId, //update onSelect
          "HandId": HandId,
          "SegmentId": id,
          "StartTime": VideoSegment.filter(view => view.id === id)[0].StartTime,
          "EndTime": VideoSegment.filter(view => view.id === id)[0].EndTime,
          "IsSubmitted": 1
        })
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })     
        i++;
        id++;
      }
      axios.put('http://localhost:5000/PatientTaskHandMapping/'+String(PatientTaskHandMappingId), {
        "id": PatientTaskHandMappingId,
        "PatientId": PatientId,
        "TaskId": TaskId,
        "HandId": HandId,
        "IsSubmitted": 1
      })
      .then(response => {
          console.log(response)
      })
      .catch(error => {
          console.log(error)
      })
      alert("You have successfully submitted the timestamp!");
    }
    function ShowDef() {
      alert(definition);
    }
    function ClickMinus(){
      document.getElementsByClassName('plus')[0].style.display='block';
      document.getElementsByClassName('minus')[0].style.display='none';
      document.getElementsByClassName('SideVideos')[0].style.display='none';
    }
    function ClickPlus(){
      document.getElementsByClassName('minus')[0].style.display='block';
      document.getElementsByClassName('plus')[0].style.display='none';
      document.getElementsByClassName('SideVideos')[0].style.display='block';
    }
    function ClickMinusT(){
      document.getElementsByClassName('plusT')[0].style.display='block';
      document.getElementsByClassName('minusT')[0].style.display='none';
      // document.getElementsByClassName('SideVideos')[0].style.display='none';
      document.getElementsByClassName('TimestampTable')[0].style.display='none';
    }
    function ClickPlusT(){
      document.getElementsByClassName('minusT')[0].style.display='block';
      document.getElementsByClassName('plusT')[0].style.display='none';
      // document.getElementsByClassName('SideVideos')[0].style.display='block';
      document.getElementsByClassName('TimestampTable')[0].style.display='block';
    }
    return (
      <div className='container'>  
        {/* <button className='prev' onClick={this.Prev}>Prev</button>  
        <button className='next' onClick={this.Next}>Next</button> */}
        <div className='content'>
        <div className='PlayVideo'>
          
          {
            videos.filter(video => video.CameraId === this.state.CameraId)
            .map(video=>
              <div className="video-play">
                <h2>Patient {PatientId}, Task {TaskId}, {Camera.filter(view => view.id === video.CameraId)[0].ViewType} View</h2>
                <video id="video" src={video.FilePath+video.FileName} onTimeUpdate={onTimeUpdate} controls='controls'></video>
                {/* <ReactPlayer url={video.FilePath+video.FileName}/> */}
              </div>
            )
          }
          <div className='buttons'>
            <button id="in" onClick={IN}>IN</button>
            <div className="instruction">
              <h5 id="instruction" onClick={ShowDef}>
                Please Select a Segment and Start Segmenting
              </h5>              
              <AiFillInfoCircle/>
            </div>          
            <button id="out" onClick={OUT}>OUT</button>
          </div>          
        </div>
        <div className='SideBar'>
          <form className='Feedback' onSubmit={(e)=>{
            submitFeedback(e);
            {this.setState({Feedback})};
          }}>
            <h4>Feedback</h4>
            <textarea placeholder="Write something"></textarea>
            <button type="submit" className='submit'>Submit</button>
          </form>
          <div className='SwitchView'>
            <div className='viewHeader'> 
              <h4>Switch View</h4> 
              <icons>
                <div className='plus'  onClick={ClickPlus}><AiOutlinePlus/></div>
                <div className='minus' onClick={ClickMinus}><AiOutlineMinus/></div>
              </icons>
            </div>
            <div className='SideVideos'>
            {
              videos.filter(video => video.CameraId !== this.state.CameraId)
              .map(video=>
                <div className="video-preview" onClick={() => {
                  switchView(video.CameraId);
                  {this.setState({CameraId: video.CameraId})};
                }}>
                  <video src={video.FilePath+video.FileName} title={video.FilePath+video.FileName} className="sidebarVideo"  id={video.View}></video>
                  <div>
                    <p>Patient {PatientId}, Task {TaskId}, {Camera.filter(view => view.id === video.CameraId)[0].ViewType} View</p>
                  </div>
                  
                </div>
              )
            } 
            </div>                        
          </div>
          <form className='TimeStamp' onSubmit={((e)=>{
            submit(e);
            {this.setState({logs})};
            {this.setState({PatientTaskHandMapping})};
          })}>
            <div className='TimestampHeader'>
              <h4>Timestamp Record</h4>
              <icons>
                <div className='plusT'  onClick={ClickPlusT}><AiOutlinePlus/></div>
                <div className='minusT' onClick={ClickMinusT}><AiOutlineMinus/></div>
              </icons>
            </div>
            <div className='TimestampTable'>
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
                  VideoSegment
                    .map(segment =>
                      <tr  id={"ROW"+segment.id}>
                        <td  id={segment.id} 
                        onClick={(e) => {
                          onSelect(e);
                          {this.setState({CameraId})};
                          {this.setState({definition})};
                          {this.setState({prevIndex})};
                          {this.setState({index})};
                        }
                        }>{SegmentJson.filter(view => view.id === segment.SegmentId)[0].SegmentLabel}</td>
                        <td><input value={segment.StartTime} type="number" id={"IN"+String(segment.id)} onClick={(() => selectTimestamp("IN"+String(segment.id)))} readOnly="readOnly"></input></td>
                        <td><input value={segment.EndTime} type="number" id={"OUT"+String(segment.id)} onClick={(() => selectTimestamp("OUT"+String(segment.id)))} readOnly="readOnly"></input></td>
                        <td><input className="check" type="checkbox" onClick={(() => {
                          onCheck(String(segment.id), segment.StartTime, segment.EndTime);
                          {this.setState({logs})};
                        })} id={"CHECK"+String(segment.id)}/></td>
                        <td><div onClick={(() => onPlay(String(segment.id)))}><AiFillPlayCircle size={30}/></div></td>
                      </tr>
                    )
                }
                </tbody>
              </table>
              <button type="submit" className='submit'>Submit</button>
            </div>
          </form>
          
        </div>
        </div>  
      </div>
    );
  }
}
