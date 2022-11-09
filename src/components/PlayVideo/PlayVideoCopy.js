import React, {Component, setState} from 'react';
import axios from 'axios';
import './PlayVideo.css'
import { AiFillInfoCircle, AiOutlinePlus, AiOutlineMinus, AiFillPlayCircle } from "react-icons/ai/";
import '../SideBar/Timestamp/Timestamp.css';


export class PlayVideoCopy extends Component {  
  constructor(props) {
    super(props);
    this.state = {
      VideoSegment: [],
      segmentHistories: [],
      GetSegment: {},
      videos: [],
      recommended_view: [],
      // PatientTaskHandMapping: [],
      PatientTaskHandMapping1: [],
      Camera: [],
      Feedback: [],
      PatientTaskHandMappingId: this.props.PTHID,
      // PatientTaskHandMappingId: 1,
      TaskId: this.props.TASKID,
      PatientId: this.props.PATIENTID,
      HandId: this.props.HANDID,
      IsSubmitted: this.props.IsSubmitted,
      Segment: 1, // start at IPT
      SegmentJson: [],
      view: "",
      definition: "",
      index: 0,
      cnt: 0,
      currentTime: 0,
      cameraId: 0,
      prevIndex: undefined,
      timeStart: 0,
    }
    
    this.render=this.render.bind(this);
    
  }
  
  async componentDidMount() {
    if (this.state.HandId === 1) {
      axios.get(`http://localhost:5000/CameraLeft`)
      .then(res => {
        const Camera =res.data;
        this.setState({ Camera });
        this.setState({ cameraId: 1 });
      })
    }
    else {
      axios.get(`http://localhost:5000/CameraRight`)
      .then(res => {
        const Camera =res.data;
        this.setState({ Camera });
        this.setState({ cameraId: 1 });
      })
    }
    
    axios.get(`http://localhost:5000/Segment`)
    .then(res => {
      const SegmentJson =res.data;
      this.setState({ SegmentJson });
    })

    axios.get(`http://localhost:5000/VideoSegment/`+this.state.PatientTaskHandMappingId)
    .then(res => {
      console.log("pthid", this.state.PatientTaskHandMappingId);
      const GetSegment =res.data;
      console.log('video segment', GetSegment);
      var index = undefined;
      // const VideoSegment = data.filter(view => view.PatientTaskHandMappingId === this.state.PatientTaskHandMappingId);
      
      // if (this.state.IsSubmitted===1){
      if (GetSegment.length){
        var VideoSegment = GetSegment;
        // var segmentHistories = GetSegment['segmentHistories'];
        let i = 0;
        while ( i < VideoSegment.length) {
          VideoSegment[i]['IsChecked']=0;
          i++;
        }
        this.setState({ VideoSegment });
        // this.setState({ segmentHistories });
        this.setState({ GetSegment });
        index = VideoSegment[0].id;
      }
      else {
        index = 0;
      }
      console.log(VideoSegment);
      this.setState({ index });
    })
    // axios.get(`http://localhost:5000/FileInfo`)
    // .then(res => { 
    //   const data =res.data;
    //   const videos = data.filter(view => view.PatientTaskHandMappingId === this.state.PatientTaskHandMappingId);
    //   console.log(videos);
    //   this.setState({ videos });
    // })
    axios.get(`http://localhost:5000/TaskSegmentCameraMapping/`+this.state.PatientTaskHandMappingId)
    // axios.get('https://localhost:44305/api/Segmentation/GetFiles/'+this.state.PatientTaskHandMappingId)
    .then(res => {
      console.log("pthid", this.state.PatientTaskHandMappingId);
      const data =res.data;
      const recommended_view = data['taskSegmentHandCameraMapping'];//.filter(view => view.taskId === this.state.TaskId);
      console.log("recommendedview", recommended_view);
      const videos = data['files'];
      console.log('files', videos);
      this.setState({ videos });
      // if (this.state.IsSubmitted === 0){
      if (this.state.GetSegment.length === 0){
        let i = 0;
        var VideoSegment = [];
        while (i < recommended_view.length) {
          VideoSegment.push({
            // "id": this.state.index+i,
            "patientTaskHandMappingId": this.state.PatientTaskHandMappingId,
            "segmentId": recommended_view[i].segmentId,
            "start":null,
            "end":null,
            "IsChecked": 0
          });
          i++;
        }
        console.log('videosegment', VideoSegment);
        this.setState({ VideoSegment });
      }      
      const cameraId = recommended_view.filter(view => view.segmentId === this.state.Segment)[0].cameraId;
      console.log('cameraid', cameraId);
      const view = this.state.Camera.filter(view => view.id === cameraId).ViewType;
      // const definition = recommended_view.filter(view => view.TaskId === this.state.TaskId && view.segmentId === this.state.Segment)[0].Definition;
      const definition = "undefined";
      this.setState({ recommended_view });
      this.setState({ cameraId });
      this.setState({ view });
      this.setState({ definition });
    })
    axios.get(`http://localhost:5000/Feedback`)
      .then(res => { 
        const Feedback =res.data;
        this.setState({ Feedback });
    })
    
    // axios.get(`http://localhost:5000/logs`)
    //   .then(res => { 
    //     const logs =res.data;
    //     this.setState({ logs });
    // })    
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
      segmentHistories,
      // submittedSegments,
      GetSegment,
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
      cameraId, 
      SegmentJson, 
      prevIndex, 
      IsSubmitted,
      currentTime,
      timeStart
    } = this.state;
    var pauseTime = -1;
    var fps=30;
    var controls = ['Play', 'Time', 'Progress', 'Volume', 'FullScreen', 'NextFrame', 'LastFrame'];
    function onTimeUpdate(e){
      currentTime = e.target.currentTime;
      if (pauseTime >= 0) {
        if (currentTime >= pauseTime) {
          var vid = document.getElementById("video");
          vid.pause();
          pauseTime = -1;
        }
      }
    }
    function changeColor(cur, next, time) {
      if (next.value){
        if (Math.abs(parseFloat(next.value) - parseFloat(cur.value)) > 2) {
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
      console.log(currentTime);
      var time = currentTime;
      var cur = document.getElementById("IN"+String(index));
      cur.readonly=false;
      cur.value=Math.floor(time*30);
      // cur.value=time*30;
      cur.readonly=true;
      VideoSegment.filter(view => view.id === index)[0].start=Math.floor(time*30);
      // VideoSegment.filter(view => view.id === index)[0].start=time*30;
      var checkBox = document.getElementById("CHECK"+index);
      checkBox.disabled=false;
      document.getElementById("in").disabled=false;
      document.getElementById("out").disabled=false;
      var segmentId = VideoSegment.filter(view => view.id === index)[0].segmentId;
      console.log("segmentid", segmentId);
      var Segment = SegmentJson.filter(view => view.id === segmentId)[0].SegmentLabel;
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
      cur.value=Math.floor(time*30);
      // cur.value=time*30;
      cur.readonly=true;
      VideoSegment.filter(view => view.id === index)[0].end=Math.floor(time*30);
      // VideoSegment.filter(view => view.id === index)[0].end=time*30;
      var checkBox = document.getElementById("CHECK"+index);
      checkBox.disabled=false;
      // check ET and IPT
      var segmentId = VideoSegment.filter(view => view.id === index)[0].segmentId;
      var Segment = SegmentJson.filter(view => view.id === segmentId)[0].SegmentLabel;
      if (Segment === "ET") {
        var prev = document.getElementById("OUT"+String(index-1));
        changeColor(cur, prev, time);
      }
      else if (Segment === "IPT") {
        var next = document.getElementById("OUT"+String(index+1));
        var nextnext = document.getElementById("IN"+String(index+2));
        console.log(next.value);
        if (next.value) {
          if (parseInt(next.value) !== time) {
            next.style.backgroundColor="yellow";
            cur.style.backgroundColor="yellow";
          }
        }
        changeColor(cur, nextnext, time);
      }
      else if (index-VideoSegment[0].id > 0 && index-VideoSegment[0].id < VideoSegment.length) {
        var next = document.getElementById("IN"+String(index+1));
        changeColor(cur, next, time);
      }
    }
    function onSelect(id) {
      // var id=parseInt(e.target.id);
      var count = id-VideoSegment[0].id;
      if (count >= 1 && (VideoSegment[count-1].start === null || VideoSegment[count-1].end === null)) {
        alert("Make sure you have filled out the previous segment entries before you select a new one");
        return;
      }
      index=parseInt(id);
      cnt = count;
      // background color    
      var row = document.getElementById("ROW"+index);
      
      if (prevIndex !== undefined && prevIndex !== index) {
        if (VideoSegment[prevIndex-VideoSegment[0].id]['IsChecked']===1) {
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
      
      var segmentId = VideoSegment.filter(view => view.id === index)[0].segmentId;
      console.log(segmentId);
      var Segment = SegmentJson.filter(view => view.id === segmentId)[0].SegmentLabel;
      document.getElementById("instruction").innerHTML="Please Select the IN and OUT Points for the Segment "+Segment;
      // definition=recommended_view.filter(view => view.TaskId === TaskId && view.segmentId === segmentId)[0].Definition;
      cameraId = recommended_view.filter(view => view.segmentId === segmentId)[0].cameraId;
      console.log('onSelect cameraId', cameraId);
      document.getElementById("video").currentTime=document.getElementById("IN"+index).value/30;
    }    
    function selectTimestamp(position, id) {
      onSelect(id);
      var time = document.getElementById(position+String(id));
      console.log(document.getElementById("video").currentTime);
      document.getElementById("video").currentTime=time.value/30;
    }
    function onPlayback(id) {
      var time = document.getElementById("IN"+id);
      var vid = document.getElementById("video");
      vid.currentTime=time.value/30;
      // timeStart = time.value/30;
      vid.play();
      // console.log(time.value);
      time = document.getElementById("OUT"+id);
      pauseTime = time.value/30;
      console.log('pausetime', pauseTime);
    }
    function onCheck(id, start, end) {
      var checkBox = document.getElementById("CHECK"+id);
      if (VideoSegment[id-VideoSegment[0].id].start === null || VideoSegment[id-VideoSegment[0].id].end === null) {
        checkBox.checked=false;
        alert("Make sure you have filled out the segment entries before you check them");
        return;
      }
      // If the checkbox is checked, display the output text
      var row = document.getElementById("ROW"+id);
      let myDivObjBgColor = window.getComputedStyle(row).backgroundColor;
      if (checkBox.checked === true){
        if (myDivObjBgColor === "rgba(0, 0, 0, 0)") {
          row.style.backgroundColor="rgb(211, 211, 211)";
        }
        VideoSegment[id-VideoSegment[0].id].IsChecked=1;  
        var logsId = segmentHistories.length+1;
        segmentHistories.push({
          "id": logsId,
          "patientId": PatientId,
          "taskId": TaskId,
          "cameraId": cameraId, //update onSelect
          "handId": HandId,
          "segmentId": id,
          "start": start,
          "end": end,
          "isSubmitted": false
        })   
      } else {
        if (myDivObjBgColor === "rgb(211, 211, 211)") {
          row.style.backgroundColor="rgba(0, 0, 0, 0)";
        } 
        VideoSegment[id-VideoSegment[0].id].IsChecked=0;         
      } 
      console.log(segmentHistories);
    }
    function switchView(cameraId){
      // var logsId = GetSegment.length+1;
      console.log("camera id", cameraId);
      segmentHistories.push({
        // "id": logsId,
        "patientId": PatientId,
        "taskId": TaskId,
        "cameraId": cameraId, //update onSelect
        "handId": HandId,
        "segmentId": VideoSegment.filter(view => view.id === index)[0].segmentId,
        "start": VideoSegment.filter(view => view.id === index)[0].start,
        "end": VideoSegment.filter(view => view.id === index)[0].end,
        "isSubmitted": 0
      })
      var vid = document.getElementById("video");
      vid.currentTime=0;
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
        "patientId": PatientId,
        "taskId": TaskId,
        "cameraId": cameraId, //update onSelect
        "handId": HandId,
        "segmentId": index,
        "feedback": e.target[0].value
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
      var submittedSegments = [];
      while (j < VideoSegment.length) {
        if (VideoSegment[j]['IsChecked'] === 0){
          alert("Check all entries before you submit!");
          return;
        }
        submittedSegments.push({
          "id": VideoSegment[j]['id'] ? VideoSegment[j]['id'] : 0,
          "patientTaskHandMappingId": VideoSegment[j]['patientTaskHandMappingId'],
          "segmentId": VideoSegment[j]['segmentId'],
          "start": VideoSegment[j]['start'],
          "end": VideoSegment[j]['end']
        })
        j++;
      }
      
      let model = { 'submittedSegments' : submittedSegments, 'segmentHistories': segmentHistories}
      // GetSegment['submittedSegments']=submittedSegments;
      // GetSegment['segmentHistories']=segmentHistories;
      console.log('post model', model);
      
      axios.post('http://localhost:5000/VideoSegment/', model);
      // axios.put('http://localhost:5000/PatientTaskHandMapping/'+String(PatientTaskHandMappingId), {
      //   "id": PatientTaskHandMappingId,
      //   "PatientId": PatientId,
      //   "TaskId": TaskId,
      //   "HandId": HandId,
      //   "IsSubmitted": 1
      // })
      // .then(response => {
      //     console.log(response)
      // })
      // .catch(error => {
      //     console.log(error)
      // })
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
    function ClickMinusF(){
      document.getElementsByClassName('plusF')[0].style.display='block';
      document.getElementsByClassName('minusF')[0].style.display='none';
      // document.getElementsByClassName('SideVideos')[0].style.display='none';
      document.getElementsByClassName('feedbackTable')[0].style.display='none';
    }
    function ClickPlusF(){
      document.getElementsByClassName('minusF')[0].style.display='block';
      document.getElementsByClassName('plusF')[0].style.display='none';
      // document.getElementsByClassName('SideVideos')[0].style.display='block';
      document.getElementsByClassName('feedbackTable')[0].style.display='block';
    }
    return (
      <div className='container'>  
        {/* <button className='prev' onClick={this.Prev}>Prev</button>  
        <button className='next' onClick={this.Next}>Next</button> */}
        <div className='content' key='content'>
          <div className='PlayVideo' key='PlayVideo'>
            {
              videos.filter(video => video.cameraId === this.state.cameraId)
              .map(video=>
                <div className="video-play">
                  <h2>Patient {PatientId}, Task {TaskId}, {Camera.filter(view => view.id === video.cameraId)[0].ViewType} View</h2>
                  {/* <h2>Patient {PatientId}, Task {TaskId}</h2> */}
                  <video id="video" src={"./Videos/"+video.fileName} onTimeUpdate={onTimeUpdate} controls='controls'></video>
                </div>
              )
            }
            <div className='buttons'>
              <button id="in" onClick={IN}>IN</button>
              <div className="instruction">
                <h5 id="instruction" onClick={ShowDef}>
                Please Select the IN and OUT Points for the Segment IPT

                </h5>              
                <AiFillInfoCircle/>
              </div>          
              <button id="out" onClick={OUT}>OUT</button>
            </div>          
          </div>
          <div className='SideBar' key='SideBar'>
          
            <div className='SwitchView'>
              <div className='viewHeader'> 
                <h4>Switch View</h4> 
                <div>
                  <div className='plus'  onClick={ClickPlus}><AiOutlinePlus/></div>
                  <div className='minus' onClick={ClickMinus}><AiOutlineMinus/></div>
                </div>
              </div>
              <div className='SideVideos'>
              {
                videos.filter(video => video.cameraId !== this.state.cameraId)
                .map(video=>
                  <div className="video-preview" onClick={() => {
                    switchView(video.cameraId);
                    {this.setState({cameraId: video.cameraId})};
                  }}>
                    <video src={"./Videos/"+video.fileName} title={"./Videos/"+video.fileName} className="sidebarVideo"  id={video.View}></video>
                    <div>
                      <p>Patient {PatientId}, Task {TaskId}, {Camera.filter(view => view.id === video.cameraId)[0].ViewType} View</p>
                    </div>
                  </div>
                )
              } 
              </div>                        
            </div>
            <div className='timestamp'>
            <form className='TimeStamp' onSubmit={((e)=>{
              submit(e);
              this.setState({segmentHistories});
              this.setState({PatientTaskHandMapping});
            })}>
              <div className='TimestampHeader'>
                <h4>Timestamp Record</h4>
                <div>
                  <div className='plusT'  onClick={ClickPlusT}><AiOutlinePlus/></div>
                  <div className='minusT' onClick={ClickMinusT}><AiOutlineMinus/></div>
                </div>
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
                            onSelect(e.target.id);
                            this.setState({cameraId});
                            this.setState({definition});
                            this.setState({prevIndex});
                            this.setState({index});
                          }
                          }>{SegmentJson.filter(view => view.id === segment.segmentId)[0].SegmentLabel}</td>
                          <td><input value={segment.start} type="number" id={"IN"+String(segment.id)} onClick={(() => selectTimestamp("IN", segment.id))} readOnly="readOnly"></input></td>
                          <td><input value={segment.end} type="number" id={"OUT"+String(segment.id)} onClick={(() => selectTimestamp("OUT", segment.id))} readOnly="readOnly"></input></td>
                          <td><input className="check" type="checkbox" onClick={(() => {
                            onCheck(String(segment.id), segment.start, segment.end);
                            this.setState({segmentHistories});
                          })} id={"CHECK"+String(segment.id)}/></td>
                          <td><div onClick={
                            () => {
                              onPlayback(String(segment.id));
                              // this.setState({timeStart});
                              // this.setState({timeStart: 0});
                            }}><AiFillPlayCircle size={30}/></div></td>
                        </tr>
                      )
                  }
                  <td colSpan="5"><button type="submit" className='submit'>Submit</button></td>
                  
                  </tbody>
                </table>
                
              </div>
            </form>
            </div>
            <div className='feedback'>
            <form className='Feedback' onSubmit={(e)=>{
              submitFeedback(e);
              {this.setState({Feedback})};
            }}>
              <div className='feedbackHeader'>
              <h4>Feedback</h4>
              <div>
                  <div className='plusF'  onClick={ClickPlusF}><AiOutlinePlus/></div>
                  <div className='minusF' onClick={ClickMinusF}><AiOutlineMinus/></div>
                </div>
                </div>
              <table className='feedbackTable'>
                  <tr><td><textarea placeholder="Write something"></textarea></td></tr>
                  <tr><td colSpan="5"><button type="submit" className='submitFeedback'>Submit</button></td></tr>
              </table>
            </form>
            </div>
          </div>
        </div>  
      </div>
    );
  }
}
