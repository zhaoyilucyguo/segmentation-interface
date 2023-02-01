import React, {Component} from 'react';
import axios from 'axios';
import './PlayVideo.css'
import { AiFillPlayCircle } from "react-icons/ai/";
import { Video } from '../Video/Video';
import { PlayBack } from '../PlayBack/PlayBack';

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
      PatientCode: this.props.PATIENTCODE,
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
      Update: 0,
      showPlayBack: false,
      start: undefined,
      end: undefined,
      bars: [],
      activeImageIndex: 0,
      frames: [],
      test: 1,
      notCalled: true,
      loaded: false,      
    }

    // this.render=this.render.bind(this);

  }
  checkColor(VideoSegment){
    let i = 0;
        while ( i < VideoSegment.length) {
          VideoSegment[i]['IsChecked']=true;
          VideoSegment[i]['cameraId']=undefined;
          if (VideoSegment[i].segmentId === 2) {
            var out1 = VideoSegment[i-1].end;
            var out2 = VideoSegment[i].end;
            if (Math.abs(out1 - out2) > 2) {
              VideoSegment[i-1]['outColor']="yellow";
              VideoSegment[i]['outColor']="yellow";
            }
            else {
              VideoSegment[i]['inColor']="white";
              VideoSegment[i]['outColor']="white";
            }
          }
          else if (VideoSegment[i].segmentId === 3) {
            out1 = VideoSegment[i-2].end;
            out2 = VideoSegment[i].start;
            if (Math.abs(out1 - out2) > 2) {
              VideoSegment[i-2]['outColor']="yellow";
              VideoSegment[i]['inColor']="yellow";
            }
            else {
              VideoSegment[i]['inColor']="white";
              VideoSegment[i]['outColor']="white";
            }
          }
          else if (i > 0) {
            out1 = VideoSegment[i-1].end;
            out2 = VideoSegment[i].start;
            if (Math.abs(out1 - out2) > 2) {
              VideoSegment[i-1]['outColor']="yellow";
              VideoSegment[i]['inColor']="yellow";
            }
            else {
              VideoSegment[i]['inColor']="white";
              VideoSegment[i]['outColor']="white";
            }
          }
          VideoSegment[i]['color']="rgb(211, 211, 211)";
          i++;
          
        }
  }
  async componentDidMount() {
    if (this.state.HandId === 1) {
      await axios.get(`http://localhost:5000/CameraLeft`)
      .then(res => {
        const Camera =res.data;
        this.setState({ Camera });
      })
      if (this.state.TaskId >= 17) this.setState({ cameraId: 1 });
      else this.setState({ cameraId: 2 });
    }
    else {
      await axios.get(`http://localhost:5000/CameraRight`)
      .then(res => {
        const Camera =res.data;
        this.setState({ Camera });
      })
      if (this.state.TaskId >= 17) this.setState({ cameraId: 4});
      else this.setState({ cameraId: 2 });
    }

    await axios.get(`http://localhost:5000/Segment`)
    .then(res => {
      const SegmentJson =res.data;
      this.setState({ SegmentJson });
    })

    await axios.get(`http://localhost:5000/VideoSegment/`+this.state.PatientTaskHandMappingId)
    .then(res => {
      const GetSegment =res.data;
      if (GetSegment.length){
        var VideoSegment = GetSegment;
        
        this.checkColor(VideoSegment);
        VideoSegment[0]["color"]="#AFE1AF";
        this.setState({ VideoSegment });
        this.setState({Update: 1});
      }
    })
    await axios.get(`http://localhost:5000/TaskSegmentCameraMapping/`+this.state.PatientTaskHandMappingId)
    .then(res => {
      const data =res.data;
      const recommended_view = data['taskSegmentHandCameraMapping'];
      // const recommended_view = da ta['rec_view'].filter(view => view.taskId === this.state.TaskId);
      const videos = data['files'];
      this.setState({ videos });
      
      var cameraId = 0;
      var view = '';
      if (this.state.TaskId >= 17) {
        this.setState({ segmentId: 7 });
        this.setState({ prevSegmentId: 7 });
        cameraId = recommended_view.filter(view => view.segmentId === 7)[0].cameraId;
        view = recommended_view.filter(view => view.segmentId === 7)[0].viewType;
      }
      else {
        cameraId = recommended_view.filter(view => view.segmentId === this.state.segmentId)[0].cameraId;
        view = recommended_view.filter(view => view.segmentId === this.state.segmentId)[0].viewType;
      }
      // const definition = recommended_view.filter(view => view.segmentId === this.state.segmentId)[0].Definition;
      // const definition = "undefined";
      this.setState({ recommended_view });
      this.setState({ cameraId });
      this.setState({ view });
      // this.setState({ definition });'
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
            "IsChecked": false,
            "inColor": "white",
            "outColor": "white",
            "color": "white",
            "cameraId": undefined
          });
          i++;
        }
        VideoSegment[0]["color"]="#AFE1AF";

        this.setState({ VideoSegment });
      }
    })
    await axios.get(`http://localhost:5000/Feedback`)
      .then(res => {
        const Feedback =res.data;
        this.setState({ Feedback });
    })
  }
  getTime = (currentTime) => {
    if (currentTime === undefined) currentTime=0;
    this.setState({currentTime: currentTime});
  }
  
  getPlay = (showPlayBack) => {
    this.setState({showPlayBack: showPlayBack});
  }
  render() {

    var {
      VideoSegment,
      segmentHistories,
      videos,
      recommended_view,
      TaskId,
      PatientId,
      PatientCode,
      HandId,
      PatientTaskHandMapping,
      // definition,
      segmentId,
      Camera,
      Feedback,
      cameraId,
      view,
      SegmentJson,
      prevSegmentId,
      IsSubmitted,
      currentTime,
      instruction,
      showPlayBack,
      start,
      end,
      bars,
      activeImageIndex,
      frames,
      test,
      notCalled,
      loaded,
    } = this.state;
    const values={
      start,
      end,
      bars,
      activeImageIndex,
      frames,
      test,
      notCalled,
      loaded,
    }
    
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
      var check = VideoSegment.filter(segment=> segment.segmentId === id)[0].IsChecked;
      if (check) {
        VideoSegment.filter(segment=> segment.segmentId === id)[0].IsChecked = false
      }
    }
    function IN() {
      cancelCheck(segmentId);
      var time = document.getElementsByClassName("react-video-player")[0].currentTime;
      VideoSegment.filter(view => view.segmentId === segmentId)[0].start=Math.round(time*30);
      VideoSegment.filter(view => view.segmentId === segmentId)[0].cameraId = cameraId;
      if (segmentId === 3) {
        changeColor(segmentId, "IN", segmentId-2, "OUT");
      }
      if (segmentId > 3) {
        if (VideoSegment.length > 4) {
          if (segmentId === 6) changeColor(segmentId, "IN", 3, "OUT");
          else if (segmentId === 5) changeColor(segmentId, "IN", 6, "OUT");
          else if (segmentId === 4) changeColor(segmentId, "IN", 5, "OUT");
        }
        else if (VideoSegment.length < 4) {
          if (segmentId === 6) changeColor(segmentId, "IN", 8, "OUT");
          else if (segmentId === 8) changeColor(segmentId, "IN", segmentId-1, "OUT");
        }
        else changeColor(segmentId, "IN", segmentId-1, "OUT");
      }
    }
    function OUT() {
      cancelCheck(segmentId);
      var time = document.getElementsByClassName("react-video-player")[0].currentTime;
      VideoSegment.filter(view => view.segmentId === segmentId)[0]["end"]=Math.round(time*30);
      VideoSegment.filter(view => view.segmentId === segmentId)[0].cameraId = cameraId;
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
        else if (VideoSegment.length < 4) {
          if (segmentId === 8) changeColor(segmentId, "OUT", 6, "IN");
          else if (segmentId === 7) changeColor(segmentId, "OUT", 8, "IN");
        }
        else {
          if (segmentId < VideoSegment.length-1) changeColor(segmentId, "OUT", segmentId+1, "IN");
        }
      }
    }
    function onSelect(id) {
      if (id > 1 && id !== 7){
        var check = undefined;
        if (id === 6) {
          if (VideoSegment.length < 4) check=8;
          else check=3;
        }
        else if (id === 5) check=6;
        else if (id === 4) {
          if (VideoSegment.length > 4) check=5;
          else check=id-1;
        }
        else check = id-1;
        var segment = VideoSegment.filter(segment => segment.segmentId === check)[0];
        if (segment.start === "" || segment.end === "") {
          alert("Make sure you have filled out the previous segment entries before you select a new one");
          // segmentId = id-1;
          return;
        }
      }
      segmentId = id;
      // background color
      if (prevSegmentId !== segmentId) {
        if (VideoSegment.filter(segment => segment.segmentId === prevSegmentId)[0]['IsChecked']) {
          VideoSegment.filter(segment => segment.segmentId === prevSegmentId)[0]['color']="rgb(211, 211, 211)";
        }
        else {
          VideoSegment.filter(segment => segment.segmentId === prevSegmentId)[0]['color']="rgba(0, 0, 0, 0)";
        }
      }
      VideoSegment.filter(segment => segment.segmentId === segmentId)[0]['color']="#AFE1AF";
      prevSegmentId = segmentId;
      var Segment = SegmentJson.filter(view => view.id === parseInt(segmentId))[0].SegmentLabel;
      instruction="Please Select the IN and OUT Points for the Segment "+Segment;
      // definition=recommended_view.filter(view => view.segmentId === segmentId)[0].Definition;
      cameraId = recommended_view.filter(view => view.segmentId === parseInt(segmentId))[0].cameraId;
      VideoSegment.filter(segment => segment.segmentId === prevSegmentId)[0].cameraId = cameraId;
      view = recommended_view.filter(view => view.segmentId === parseInt(segmentId))[0].viewType;
    }
    function selectTimestamp(position, id) {
      var time = VideoSegment.filter(segment => segment.segmentId === id)[0][position];
      if (time === "") {
        // alert("Cannot find the frame of the video with an empty timestamp!");
        return;
      }
      document.getElementsByClassName("react-video-player")[0].currentTime=time/30;
      currentTime = time/30;
    }
    function changeTimestamp(e, position, id) {
      cancelCheck(id);
      VideoSegment.filter(segment => segment.segmentId === id)[0][position] = parseInt(e.target.value);
    }
    function changeTimestampColor(position, id){
      // VideoSegment.filter(segment => segment.segmentId === id)[0][position] = parseInt(e.target.value);
      if (position === "start"){
        console.log("Start");
        if (id === 1) {
          changeColor(id, "OUT", id+1, "OUT");
          changeColor(id, "OUT", id+2, "IN");
        }
        else if (id === 2) {
          changeColor(id, "OUT", id-1, "OUT");
        }
        else if (id> 1) {
          if (id.length > 4) {
            if (id === 3) changeColor(id, "OUT", 6, "IN");
            else if (id === 6) changeColor(id, "OUT", 5, "IN");
            else if (id === 5) changeColor(id, "OUT", 4, "IN");
          }
          else if (VideoSegment.length < 4) {
            if (id === 8) changeColor(id, "OUT", 6, "IN");
            else if (id === 7) changeColor(id, "OUT", 8, "IN");
          }
          else {
            if (id < VideoSegment.length-1) changeColor(id, "OUT", id+1, "IN");
          }
        }
      }
      else {
        console.log("end");
        if (id === 3) {
          changeColor(id, "IN", id-2, "OUT");
        }
        if (id > 3) {
          if (VideoSegment.length > 4) {
            if (id === 6) changeColor(id, "IN", 3, "OUT");
            else if (id === 5) changeColor(id, "IN", 6, "OUT");
            else if (id === 4) changeColor(id, "IN", 5, "OUT");
          }
          else if (VideoSegment.length < 4) {
            if (id === 6) changeColor(id, "IN", 8, "OUT");
            else if (id === 8) changeColor(id, "IN", id-1, "OUT");
          }
          else changeColor(id, "IN", id-1, "OUT");
        }
      }
    }
    function onPlayback(segmentId) {
      start = VideoSegment.filter(segment => segment.segmentId === segmentId)[0]['start'];
      end = VideoSegment.filter(segment => segment.segmentId === segmentId)[0]['end'];
    }
    function onCheck(id, start, end) {
      var segment = VideoSegment.filter(segment => segment.segmentId === id)[0];
      var checkBox = document.getElementById("CHECK"+id);
      console.log(VideoSegment.filter(segment => segment.segmentId === id)[0].cameraId);
      console.log(cameraId);
      if (segment.start === "" || segment.end === "") {
        checkBox.checked=false;
        alert("Make sure you have filled out the segment entries before you check them");
        return;
      }
      if (segment.IsChecked === false){
        if (segment.color === "white") {
          VideoSegment.filter(segment => segment.segmentId === id)[0]['color']="rgb(211, 211, 211)";
        }
        VideoSegment.filter(segment => segment.segmentId === id)[0].IsChecked=true;
        var logsId = segmentHistories.length+1;
        segmentHistories.push({
          "id": logsId,
          "patientId": PatientId,
          // "patientCode": PatientCode,
          "taskId": TaskId,
          "cameraId": VideoSegment.filter(segment => segment.segmentId === id)[0].cameraId === undefined ? cameraId : VideoSegment.filter(segment => segment.segmentId === id)[0].cameraId, 
          "handId": HandId,
          "segmentId": id,
          "start": start==='' ? 0 : start,
          "end": end === '' ? 0: end,
          "createdAt": new Date(),
          "isSubmitted": false
        })
      } else {
        if (segment.color === "rgb(211, 211, 211)") {
          VideoSegment.filter(segment => segment.segmentId === id)[0]['color']="white";
        }
        VideoSegment.filter(segment => segment.segmentId === id)[0].IsChecked=false;
      }
    }
    function switchView(id){
      console.log(id);
      var logsId = segmentHistories.length+1;
      segmentHistories.push({
        "id": logsId,
        "patientId": PatientId,
        // "patientCode": PatientCode,
        "taskId": TaskId,
        "cameraId": cameraId, 
        "handId": HandId,
        "segmentId": segmentId,
        "start": VideoSegment.filter(view => view.segmentId === segmentId)[0].start === ''? 0: VideoSegment.filter(view => view.segmentId === segmentId)[0].start,
        "end": VideoSegment.filter(view => view.segmentId === segmentId)[0].end === '' ? 0: VideoSegment.filter(view => view.segmentId === segmentId)[0].end,
        "createdAt": new Date(),
        "isSubmitted": false
      })
      segmentHistories.push({
        "id": logsId,
        "patientId": PatientId,
        // "patientCode": PatientCode,
        "taskId": TaskId,
        "cameraId": id, 
        "handId": HandId,
        "segmentId": segmentId,
        "start": VideoSegment.filter(view => view.segmentId === segmentId)[0].start === ''? 0: VideoSegment.filter(view => view.segmentId === segmentId)[0].start,
        "end": VideoSegment.filter(view => view.segmentId === segmentId)[0].end === '' ? 0: VideoSegment.filter(view => view.segmentId === segmentId)[0].end,
        "createdAt": new Date(),
        "isSubmitted": false
      })
      view = Camera.filter(view => view.id === id)[0].ViewType;
      VideoSegment.filter(view => view.segmentId === segmentId)[0].cameraId = id;
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
        // "patientCode": PatientCode,
        "taskId": TaskId,
        "cameraId": cameraId, 
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
    async function submit(e) {
      e.preventDefault();
      let j = 0;
      var submittedSegments = [];
      while (j < VideoSegment.length) {
        if (VideoSegment[j]['IsChecked'] === false){
          alert("Check all entries before you submit!");
          return;
        }
        submittedSegments.push({
          "id": VideoSegment[j]['id'] ? VideoSegment[j]['id'] : 0,
          "patientTaskHandMappingId": VideoSegment[j]['patientTaskHandMappingId'],
          "segmentId": VideoSegment[j]['segmentId'],
          "start": VideoSegment[j]['start']==='' ? 0: VideoSegment[j]['start'],
          "end": VideoSegment[j]['end']==='' ? 0: VideoSegment[j]['end']
        })
        j++;
        
      }

      let model = { 'submittedSegments' : submittedSegments, 'segmentHistories': segmentHistories}
      await axios.post('http://localhost:5000/VideoSegment/', model);
      await window.location.reload(false); 
    }
    return (

        <div className='content' key='content'>
          
          <div className='PlayVideo' key='PlayVideo'>
            {
              videos.filter(video => video.cameraId === this.state.cameraId)
              .map(video=>
                <div className="video-play" key={video.fileName}>
                  <h1>Patient {PatientCode}, Task {TaskId}, {Camera.filter(view => view.id === video.cameraId)[0].ViewType} View, Frame {document.getElementsByClassName("react-video-player")[0] ? Math.round(document.getElementsByClassName("react-video-player")[0].currentTime*30) : Math.round(currentTime*30)}</h1>
                  <Video url={"./Videos/"+video.fileName} sendTime={this.getTime}></Video>
                </div>
              )
            }
            <div className='buttons'>
              <button id="in" onClick={()=>{
                this.setState({showPlayBack: false});
                IN();
                this.setState({VideoSegment});
              }}>IN</button>
              <div className="instruction">
                <h2 id="instruction">
                {instruction}
                </h2>
              </div>
              <button id="out" onClick={()=>{
                this.setState({showPlayBack: false});
                OUT();
                this.setState({VideoSegment});

              }}>OUT</button>
              
            </div>
            {/* <p>{definition}</p>          */}
            {/* url: "./Videos/"+this.props.url,
        showPlayBack: this.props.showPlayBack,
        startFrame: this.props.startFrame,
        endFrame: this.props.endFrame,
        bars: [],
        activeImageIndex: 0,
        frames: [],
        test: 1,
        notCalled: true,
        loaded: false, */}
          </div>
          { showPlayBack ? 
          <PlayBack 
          url={videos.filter(video => video.cameraId === this.state.cameraId)[0].fileName} 
          sendPlay={this.getPlay}
          values={values}
          // startFrame={start} 
          // endFrame={end} 
          // bars={[]}
          // activeImageIndex={0}
          // frames={[]}
          // test={1}
          // notCalled={true}
          // loaded={false}
          />: null}
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
                    this.setState({showPlayBack: false});
                    switchView(video.cameraId);
                    this.setState({cameraId: video.cameraId});
                    this.setState({segmentHistories});
                    this.setState({view});
                    this.setState({currentTime: 0});
                    this.setState({VideoSegment});
                  }}>
                    <video src={"./Videos/"+video.fileName} title={"./Videos/"+video.fileName} className="sidebarVideo"  id={video.View}></video>
                    <div>
                      <h2>Patient {PatientCode}, Task {TaskId}, {Camera.filter(view => view.id === video.cameraId)[0].ViewType} View</h2>
                    </div>
                  </div>
                )
              }
              </div>
            </div>
            <div className='timestamp'>
            <form className='TimeStamp' onSubmit={((e)=>{
              this.setState({showPlayBack: false});
              submit(e);
              // this.setState({segmentHistories});
              // segmentHistories = [];
              
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
                            this.setState({showPlayBack: false});
                            onSelect(segment.segmentId);
                            this.setState({cameraId});
                            this.setState({view});
                            // this.setState({definition});
                            this.setState({instruction});
                            this.setState({prevSegmentId});
                            this.setState({segmentId});
                          }
                          }>{SegmentJson.filter(view => view.id === segment.segmentId)[0].SegmentLabel}</td>
                          <td><input className="text-center" value={segment.start} type="number" id={"IN"+String(segment.segmentId)} 
                          onChange={((e) => {
                            changeTimestamp(e, "start", segment.segmentId);
                            this.setState({VideoSegment});
                            changeTimestampColor("start", segment.segmentId);
                            this.setState({VideoSegment});
                          })}
                          onClick={(() => {
                            this.setState({showPlayBack: false});
                            selectTimestamp("start", segment.segmentId);
                            this.setState({currentTime});
                          })} style={{"backgroundColor": segment.inColor}}></input></td>
                          <td><input className="text-center" value={segment.end} type="number" id={"OUT"+String(segment.segmentId)} 
                          onChange={((e) => {
                            changeTimestamp(e, "end", segment.segmentId);
                            this.setState({VideoSegment});
                            changeTimestampColor("end", segment.segmentId);
                            this.setState({VideoSegment});
                          })}
                          onClick={(() => {
                            this.setState({showPlayBack: false});
                            selectTimestamp("end", segment.segmentId);
                            this.setState({currentTime});
                          })} style={{"backgroundColor": segment.outColor}}></input></td>
                          <td><input className="check" type="checkbox" onChange={(() => {
                            this.setState({showPlayBack: false});
                            onCheck(segment.segmentId, segment.start, segment.end);
                            this.setState({segmentHistories});
                            this.setState({VideoSegment});
                          })} id={"CHECK"+String(segment.segmentId)} checked={segment.IsChecked}/></td>
                          <td><div onClick={
                            () => {
                              if (showPlayBack) this.setState({showPlayBack: false});
                              else {
                                onPlayback(segment.segmentId);
                                this.setState({start});
                                this.setState({end});
                                if (start !== "" && end !== "") this.setState({showPlayBack: true});
                                else alert("The IN and OUT points are empty!")
                              }
                                
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
              this.setState({showPlayBack: false});
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
