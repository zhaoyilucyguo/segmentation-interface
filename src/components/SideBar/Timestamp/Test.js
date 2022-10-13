import React, { Component } from 'react';
import './Timestamp.css';
import axios from 'axios';


class Test extends Component { 
    constructor(props) {
      super(props)
    
      this.state = {
         name:'',
         date:'',
         number:''
      }
    }
     
    submitHandler = e => {
        e.preventDefault()
        console.log(this.state)
        axios.post('http://localhost:5000/test', this.state)
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })
    }
    render(){
        const { name, date, number } = this.state
        return(
            <form onSubmit={this.submitHandler}>
                <input onChange={this.changeHandler} id="name" value={name} placeholder="name" type="text"></input>
                <input onChange={this.changeHandler} id="date" value={date} placeholder="date" type="text"></input>
                <input onChange={this.changeHandler} id="number" value={number} placeholder="number" type="text"></input>
                <button type="submit">Submit</button>
            </form>
        )
    }
    
}
export default Test;