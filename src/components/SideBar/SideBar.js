import React, {Component} from 'react';
import './SideBar.css';
import Timestamp from './Timestamp/Timestamp';
import {SwitchView} from './SwitchView/SwitchView';

export class SideBar extends Component {
    render(){
        return(
            <div className='container'>
                <SwitchView />
                <Timestamp />
            </div>
            
        )
    }
}