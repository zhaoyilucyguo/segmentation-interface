import React, {Component} from 'react';
import axios from 'axios';
import './PlayVideo.css'
import { AiFillPlayCircle } from "react-icons/ai/";
import '../SideBar/Timestamp/Timestamp.css';
import { Video } from '../Video/Video';


export class PlayVideoCopy extends Component {  
  constructor(props) {
    super(props);
    this.state = {
      VideoSegment: [],
      segmentHistories: [],
      GetSegment: {},
      videos: [],
      recommended_view: [],
      PatientTaskHandMapping1: [],
      Camera: [],
      Feedback: [],
      PatientTaskHandMappingId: this.props.PTHID,
      TaskId: this.props.TASKID,
      PatientId: this.props.PATIENTID,
      HandId: this.props.HANDID,
      IsSubmitted: this.props.IsSubmitted,
      segmentId: 1, // start at IPT
      SegmentJson: [],
      view: "",
      // definition: "",
      currentTime: 0,
      cameraId: 0,
      prevSegmentId: 1,
      instruction: "Please Select the IN and OUT Points for the Segment IPT",
      timeEnd: -1,
      Update: 0
    }
    
    // this.render=this.render.bind(this);
    
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
        this.setState({ cameraId: 4 });
      })
    }
    
    axios.get(`http://localhost:5000/Segment`)
    .then(res => {
      const SegmentJson =res.data;
      this.setState({ SegmentJson });
    })

    axios.get(`http://localhost:5000/VideoSegment/`+this.state.PatientTaskHandMappingId)
    .then(res => {
      const GetSegment =res.data;
      if (GetSegment.length){
        var VideoSegment = GetSegment;
        let i = 0;
        while ( i < VideoSegment.length) {
          VideoSegment[i]['IsChecked']=0;
          VideoSegment[i]['inColor']="white";
          VideoSegment[i]['outColor']="white";
          VideoSegment[i]['color']="white";
          i++;
        }
        VideoSegment[0]["color"]="#AFE1AF";
        this.setState({ VideoSegment });
        this.setState({Update: 1});
      }
    })
    axios.get(`http://localhost:5000/TaskSegmentCameraMapping/`+this.state.PatientTaskHandMappingId)
    .then(res => {
      const data =res.data;
      const recommended_view = data['taskSegmentHandCameraMapping'];
      // const recommended_view = da ta['rec_view'].filter(view => view.taskId === this.state.TaskId);
      const videos = data['files'];
      this.setState({ videos });
      var VideoSegment = this.state.VideoSegment;
      // if (this.state.IsSubmitted === 0){
      if (VideoSegment.length === 0){
        let i = 0;
        while (i < recommended_view.length) {
          VideoSegment.push({
            "patientTaskHandMappingId": this.state.PatientTaskHandMappingId,
            "segmentId": recommended_view[i].segmentId,
            "start":"",
            "end":"",
            "IsChecked": 0,
            "inColor": "white",
            "outColor": "white",
            "color": "white"
          });
          i++;
        }
        VideoSegment[0]["color"]="#AFE1AF";
        this.setState({ VideoSegment });
      }      
      const cameraId = recommended_view.filter(view => view.segmentId === this.state.segmentId)[0].cameraId;
      const view = this.state.Camera.filter(view => view.id === cameraId).ViewType;
      // const definition = recommended_view.filter(view => view.segmentId === this.state.segmentId)[0].Definition;
      // const definition = "undefined";
      this.setState({ recommended_view });
      this.setState({ cameraId });
      this.setState({ view });
      // this.setState({ definition });
    })
    axios.get(`http://localhost:5000/Feedback`)
      .then(res => { 
        const Feedback =res.data;
        this.setState({ Feedback });
    })
  }
  getTime = (currentTime) => {
    this.setState({currentTime: currentTime});
    if (this.state.timeEnd > -1 && this.state.timeEnd <= currentTime) {
      this.setState({timeEnd: -1});
      var vid = document.getElementsByClassName("react-video-player")[0];
      vid.pause();
    }

  }
  render() { 
    
    var { 
      VideoSegment,
      segmentHistories,
      videos,
      recommended_view,
      TaskId,
      PatientId,
      HandId,
      PatientTaskHandMappingId,
      PatientTaskHandMapping,
      // definition,
      segmentId,
      Camera, 
      Feedback,
      cameraId, 
      SegmentJson, 
      prevSegmentId, 
      IsSubmitted,
      currentTime,
      instruction,
      timeEnd,
      Update
    } = this.state;
   
    function changeColor(id1, btn1, id2, btn2) {
      var segment1 = VideoSegment.filter(segment=> segment.segmentId === id1)[0];
      var segment2 = VideoSegment.filter(segment=> segment.segmentId === id2)[0];
      var val1 = segment1.start;
      if (btn1 === "OUT") val1 = segment1.end;
      var val2 = segment2.start;
      if (btn2 === "OUT") val2 = segment2.end;
      if (val2){
        if (Math.abs(val1 - val2) > 2) {
          if (btn1 === "OUT") VideoSegment.filter(segment=> segment.segmentId === id1)[0]['outColor'] = "yellow";
          else VideoSegment.filter(segment=> segment.segmentId === id1)[0]['inColor'] = "yellow";
          if (btn2 === "OUT") VideoSegment.filter(segment=> segment.segmentId === id2)[0]['outColor'] = "yellow";
          else VideoSegment.filter(segment=> segment.segmentId === id2)[0]['inColor'] = "yellow";
        }
        else {
          if (btn1 === "OUT") VideoSegment.filter(segment=> segment.segmentId === id1)[0]['outColor'] = "white";
          else VideoSegment.filter(segment=> segment.segmentId === id1)[0]['inColor'] = "white";
          if (btn2 === "OUT") VideoSegment.filter(segment=> segment.segmentId === id2)[0]['outColor'] = "white";
          else VideoSegment.filter(segment=> segment.segmentId === id2)[0]['inColor'] = "white";
        }
      }
    }
    function cancelCheck(id) {
      var checkBox = document.getElementById("CHECK"+id);
      var check = VideoSegment.filter(segment=> segment.segmentId === id)[0].IsChecked;
      if (check === 1) {
        checkBox.checked=false;
        VideoSegment.filter(segment=> segment.segmentId === id)[0].IsChecked = 0;
      }
    }
    function IN() {
      cancelCheck(segmentId);
      var time = currentTime;
      VideoSegment.filter(view => view.segmentId === segmentId)[0].start=Math.floor(time*30);
      if (segmentId === 3) {
        changeColor(segmentId, "IN", segmentId-2, "OUT");
      }
      if (segmentId > 3) {
        if (VideoSegment.length > 4) {
          if (segmentId === 6) changeColor(segmentId, "IN", 3, "OUT");
          else if (segmentId === 5) changeColor(segmentId, "IN", 6, "OUT");
          else if (segmentId === 4) changeColor(segmentId, "IN", 5, "OUT");
        }
        else changeColor(segmentId, "IN", segmentId-1, "OUT");
      }
    }
    function OUT() { 
      cancelCheck(segmentId);
      var time = currentTime;
      console.log(segmentId, VideoSegment.filter(view => view.segmentId === segmentId));
      VideoSegment.filter(view => view.segmentId === segmentId)[0]["end"]=Math.floor(time*30);
      if (segmentId === 1) {
        changeColor(segmentId, "OUT", segmentId+1, "OUT");
        changeColor(segmentId, "OUT", segmentId+2, "IN");
      }
      else if (segmentId === 2) {
        changeColor(segmentId, "OUT", segmentId-1, "OUT");
      }
      else if (segmentId> 1) {
        if (VideoSegment.length > 4) {
          if (segmentId === 3) changeColor(segmentId, "OUT", 6, "IN");
          else if (segmentId === 6) changeColor(segmentId, "OUT", 5, "IN");
          else if (segmentId === 5) changeColor(segmentId, "OUT", 4, "IN");
        }
        else {
          if (segmentId < VideoSegment.length-1) changeColor(segmentId, "OUT", segmentId+1, "IN");
        }
      }
    }
    function onSelect(id) {
      if (id > 1){
        var check = undefined;
        if (id === 6) check=3;
        else if (id === 5) check=6;
        else if (id === 4) {
          if (VideoSegment.length > 4) check=5;
          else check=id-1;
        }
        else check = id-1;
        var segment = VideoSegment.filter(segment => segment.segmentId === check)[0];
        if (segment.start === "" || segment.end === "") {
          alert("Make sure you have filled out the previous segment entries before you select a new one");
          segmentId = id-1;
          return;
        }
      } 
      segmentId = id;
      // background color  
      if (prevSegmentId !== segmentId) {
        if (VideoSegment.filter(segment => segment.segmentId === prevSegmentId)[0]['IsChecked']===1) {
          VideoSegment.filter(segment => segment.segmentId === prevSegmentId)[0]['color']="rgb(211, 211, 211)";
        }
        else {
          VideoSegment.filter(segment => segment.segmentId === prevSegmentId)[0]['color']="rgba(0, 0, 0, 0)";
        }         
      }
      VideoSegment.filter(segment => segment.segmentId === segmentId)[0]['color']="#AFE1AF";
      prevSegmentId = segmentId;
      // in and out buttons
      // document.getElementById("out").disabled=false;
      // document.getElementById("in").disabled=false;
      var Segment = SegmentJson.filter(view => view.id === parseInt(segmentId))[0].SegmentLabel;
      instruction="Please Select the IN and OUT Points for the Segment "+Segment;
      // definition=recommended_view.filter(view => view.segmentId === segmentId)[0].Definition;
      cameraId = recommended_view.filter(view => view.segmentId === parseInt(segmentId))[0].cameraId;
    }    
    function selectTimestamp(position, id) {
      var time = VideoSegment.filter(segment => segment.segmentId === id)[0][position];
      if (time === "") {
        alert("Cannot find the frame of the video with an empty timestamp!");
        return;
      }
      document.getElementsByClassName("react-video-player")[0].currentTime=time/30;
    }
    function onPlayback(segmentId) {
      var start = VideoSegment.filter(segment => segment.segmentId === segmentId)[0]['start'];
      var end = VideoSegment.filter(segment => segment.segmentId === segmentId)[0]['end'];
      console.log("start at ", start/30, " end at ", end/30);
      timeEnd = (end-9)/30;
      var vid = document.getElementsByClassName("react-video-player")[0];
      vid.currentTime = start/30;
      vid.play();
    }
    function onCheck(id, start, end) {
      var segment = VideoSegment.filter(segment => segment.segmentId === id)[0];
      var checkBox = document.getElementById("CHECK"+id);
      if (segment.start === "" || segment.end === "") {
        checkBox.checked=false;
        alert("Make sure you have filled out the segment entries before you check them");
        return;
      }
      if (segment.IsChecked === 0){
        if (segment.color === "white") {
          VideoSegment.filter(segment => segment.segmentId === id)[0]['color']="rgb(211, 211, 211)";
        }
        VideoSegment.filter(segment => segment.segmentId === id)[0].IsChecked=1;  
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
        if (segment.color === "rgb(211, 211, 211)") {
          VideoSegment.filter(segment => segment.segmentId === id)[0]['color']="white";
        } 
        VideoSegment.filter(segment => segment.segmentId === id)[0].IsChecked=0;         
      } 
    }
    function switchView(cameraId){
      // var logsId = GetSegment.length+1;
      segmentHistories.push({
        // "id": logsId,
        "patientId": PatientId,
        "taskId": TaskId,
        "cameraId": cameraId, //update onSelect
        "handId": HandId,
        "segmentId": segmentId,
        "start": VideoSegment.filter(view => view.segmentId === segmentId)[0].start,
        "end": VideoSegment.filter(view => view.segmentId === segmentId)[0].end,
        "isSubmitted": 0
      })
      // var vid = document.getElementsByClassName("react-video-player")[0];
      // vid.currentTime=0;
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
        "segmentId": segmentId,
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
      console.log(VideoSegment);
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
      console.log('post model', model);
      axios.post('http://localhost:5000/VideoSegment/', model);
      alert("You have successfully submitted the timestamp!");
    }
    
    return (
      
        <div className='content' key='content'>
          <div className='PlayVideo' key='PlayVideo'>
            {
              videos.filter(video => video.cameraId === this.state.cameraId)
              .map(video=>
                <div className="video-play" key={video.fileName}>
                  <h1>Patient {PatientId}, Task {TaskId}, {Camera.filter(view => view.id === video.cameraId)[0].ViewType} View</h1>
                  {/* <h2>Patient {PatientId}, Task {TaskId}</h2> */}
                  {/* <video id="video" src={"./Videos/"+video.fileName} onTimeUpdate={onTimeUpdate} controls='controls'></video> */}
                  <Video url={"./Videos/"+video.fileName} sendTime={this.getTime}></Video>
                </div>
              )
            }
            <div className='buttons'>
              <button id="in" onClick={()=>{
                IN();
                this.setState({VideoSegment});
              }}>IN</button>
              <div className="instruction">
                <h2 id="instruction">
                {instruction}
                </h2>              
              </div>          
              <button id="out" onClick={()=>{
                OUT();
                this.setState({VideoSegment});
              }}>OUT</button>
            </div> 
            {/* <p>{definition}</p>          */}
          </div>
          <div className='SideBar' key='SideBar'>
            <div className='SwitchView'>
              <div className='viewHeader'> 
                <h1 >Switch View</h1> 
             
              </div>
              <div className='SideVideos'>
              {
                videos.filter(video => video.cameraId !== this.state.cameraId)
                .map(video=>
                  <div className="video-preview"  key={video.fileName} onClick={() => {
                    switchView(video.cameraId);
                    this.setState({cameraId: video.cameraId});
                  }}>
                    <video src={"./Videos/"+video.fileName} title={"./Videos/"+video.fileName} className="sidebarVideo"  id={video.View}></video>
                    <div>
                      <h2>Patient {PatientId}, Task {TaskId}, {Camera.filter(view => view.id === video.cameraId)[0].ViewType} View</h2>
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
                <h1>Timestamp Record</h1>
              
              </div>
              <div>
                <table className='TimestampTable'>
                  <thead>
                      <tr>
                          <th className="text-center" >Segment</th>
                          <th className="text-center" >IN</th>
                          <th className="text-center" >OUT</th>
                          <th></th>
                      </tr>
                  </thead>
                  <tbody>
                  {
                    VideoSegment
                      .map(segment =>
                        <tr  id={"ROW"+segment.segmentId}  key={segment.segmentId} style={{"backgroundColor": segment.color}}>
                          <td  id={segment.segmentId} 
                          onClick={() => {
                            onSelect(segment.segmentId);
                            this.setState({cameraId});
                            // this.setState({definition});
                            this.setState({instruction});
                            this.setState({prevSegmentId});
                            this.setState({segmentId});
                          }
                          }>{SegmentJson.filter(view => view.id === segment.segmentId)[0].SegmentLabel}</td>
                          <td><input className="text-center" value={segment.start} type="number" id={"IN"+String(segment.segmentId)} onClick={(() => {
                            selectTimestamp("start", segment.segmentId);
                          })} readOnly="readOnly" style={{"backgroundColor": segment.inColor}}></input></td>
                          <td><input className="text-center" value={segment.end} type="number" id={"OUT"+String(segment.segmentId)} onClick={(() => {
                            selectTimestamp("end", segment.segmentId)
                          })} readOnly="readOnly" style={{"backgroundColor": segment.outColor}}></input></td>
                          <td><input className="check" type="checkbox" onClick={(() => {
                            onCheck(segment.segmentId, segment.start, segment.end);
                            this.setState({segmentHistories});
                            this.setState({VideoSegment});
                          })} id={"CHECK"+String(segment.segmentId)}/></td>
                          <td><div onClick={
                            () => {
                              onPlayback(segment.segmentId);
                              this.setState({timeEnd});
                            }}><AiFillPlayCircle size={30}/></div></td>
                        </tr>
                      )
                  }
                  <tr><td colSpan="5"><textarea placeholder="Looks like you segmented this task before. Why do you want to update it?"></textarea></td></tr>
                  <tr><td colSpan="5"><button type="submit" className='submit'>SUBMIT</button></td></tr>
                  </tbody>
                </table>
              </div>
            </form>
            </div>
            <div className='feedback'>
            <form className='Feedback' onSubmit={(e)=>{
              submitFeedback(e);
              this.setState({Feedback});
            }}>
              <div className='feedbackHeader'>
              <h1>Feedback</h1>
                </div>
              <table className='feedbackTable'>
                <tbody>
                  <tr><td><textarea placeholder="How was you experience using this interface?"></textarea></td></tr>
                  <tr><td colSpan="5"><button type="submit" className='submitFeedback'>SUBMIT</button></td></tr>
                  </tbody>
              </table>
            </form>
            </div>
          </div>
        </div>  
    );
  }
}
