import React from "react";
import { Link, useHistory } from 'react-router-dom'
import Nav from '../Nav'

const MyTasks = () => {
    const history = useHistory()
    
    return (
        <>
            <Nav fixed="top" style={{ position: 'fixed', top: 0 }} />
            <h1>Staff Profiles</h1>
            <p>Staff Profiles page content goes here...</p>
            <button onClick={() => history.goBack()}>Back</button>
        </>
    )
}
  
  export default MyTasks;