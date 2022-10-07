import React, {Component} from 'react';
import './SwitchView.css';

export class SwitchView extends Component {
    render(){
        return(
            <div className='container'>
                <h4>Switch View</h4>
                <div className="video-preview">
                    <iframe src="../../../videos/cam1activity1 (1).webm" title="YouTube video" ></iframe>
                    <h5>Transpose</h5>
                </div>
                <div className="video-preview">
                    <iframe src="../../../videos/cam2activity1 (1).webm" title="YouTube video" ></iframe>
                    <h5>Contralateral</h5>
                </div>
            </div>
            
        )
    }
}