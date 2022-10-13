import React, { useState } from 'react';
import './Timestamp.css';
import axios from 'axios';


export default function Timestamp({currentTime}) { 
    const url="http://localhost:5000/test"
    const [data, setData] = useState({
      name:"",
      date:"",
      number:""
    }); 
    function submit(e) {
        e.preventDefault();
        axios.post(url,{
            name: data.name,
            date: data.date,
            number: parseInt(data.number)
        }, {
            headers:{
                'content-type': 'text/json'
            }
        })
        .then(res=>{
            console.log(res.data)
        })
    }
    function handle(e) {
        const newdata={...data}
        newdata[e.target.id] = e.target.value
        setData(newdata)
        console.log(newdata)
    }  
    return(
        <form onSubmit={((e)=>submit(e))}>
            <input onChange={(e)=>handle(e)} id="name" value={data.name} placeholder="name" type="text"></input>
            <input onChange={(e)=>handle(e)} id="date" value={data.date} placeholder="date" type="date"></input>
            <input onChange={(e)=>handle(e)} id="number" value={data.number} placeholder="number" type="number"></input>
            <button>Submit</button>
        </form>
    )
}