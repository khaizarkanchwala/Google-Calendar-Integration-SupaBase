import logo from './logo.svg';
import './App.css';
import './datepicker.css'
import {useSession,useSupabaseClient,useSessionContext} from '@supabase/auth-helpers-react'
import DateTimePicker from 'react-datetime-picker';
import { useState } from 'react';
import '../node_modules/react-datetime-picker/dist/DateTimePicker.css';
import '../node_modules/react-calendar/dist/Calendar.css';
import '../node_modules/react-clock/dist/Clock.css';
function App() {
  const[start,setStart]=useState(new Date());
  const[end,setEnd]=useState(new Date());
  const[eventName,SetEventName]=useState("");
  const[eventDescription,SetEventDesp]=useState("");
  const session=useSession();//tokens,when session exist we have a user
  const supabase=useSupabaseClient();// talk to supabase
  const {isLoading}=useSessionContext();
  if(isLoading){
    return <></>
  }
  async function googleSignin(){
    const {error}=await supabase.auth.signInWithOAuth({
      provider:'google',
      options:{
        scopes:'https://www.googleapis.com/auth/calendar'
      }
    });
    if(error){
      alert("Error Logging in to Google Provider with superbase")
      console.log(error)
    }
  }
  async function signout(){
    await supabase.auth.signOut();
  }
  async function createCalendar(){
    const event={
      'summary':eventName,
      'description':eventDescription,
      'start':{
        'dateTime':start.toISOString(),
        'timeZone':"Asia/Kolkata"
      },
      'end':{
        'dateTime':end.toISOString(),
        'timeZone':"Asia/Kolkata"
      },
    }
    await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events",{
      method:"POST",
      headers:{
        'Authorization':'Bearer '+ session.provider_token
      },
      body:JSON.stringify(event)
    }).then((data)=>{
      return data.json();
    }).then((data)=>{
      console.log(data);
      alert("Event created,check google calendar")
    });
  }
  console.log(session);
  console.log(start);
  console.log(eventName);
  console.log(eventDescription)
  return (
    <div className="App">
      <div style={{width:"400px",margin:"30px auto"}}>
        {session ?
        <>
          <h2>hey there {session.user.email}</h2>
          <p>Start Of Your Event</p>
          <DateTimePicker onChange={setStart} value={start}/>
          <p>End Of Your Event</p>
          <DateTimePicker onChange={setEnd} value={end}/>
          <p>Event Name</p>
          <input type="text" onChange={(e)=>SetEventName(e.target.value)}/>
          <p>Event Description</p>
          <input type="text" onChange={(e)=>SetEventDesp(e.target.value)}/>
          <hr/>
          <button  onClick={()=>createCalendar()}>create calendar Event</button>
          <p></p>
          <button onClick={()=>signout()}>Sign out</button>
        </>
        :
        <>
        <button onClick={()=>googleSignin()}>Sign In</button>
        </>
        }
      </div>
    </div>
  );
}

export default App;
