import Register from './Register'
import React from "react"
import { Container } from 'react-bootstrap'
import { AuthProvider } from '../contexts/AuthContexts'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './managerPages/Dashboard'
import Login from './Login'
import PrivateRoute from './PrivateRoute';
import ForgotPassword from './ForgotPassword';
import UpdateProfile from './UpdateProfile';
import { StaffProfileProvider } from '../contexts/StaffProfileContext';
import MyTasks from './managerPages/MyTasks'
import RoomAssignments from './managerPages/RoomAssignments'
import RoomProfiles from './managerPages/RoomProfiles'
import Roster from './managerPages/Roster'
import StaffProfiles from './managerPages/StaffProfiles'
import TrainingMode from './managerPages/TrainingMode'
import AddStaff from './managerPages/AddStaff';
import AddRooms from './managerPages/AddRooms';
import CSVUpload from './managerPages/CsvUpload';

function App() {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh"}}>
      <div className="w-100" style={{maxWidth: "400px"}}>
        <Router>
          <AuthProvider>
            <StaffProfileProvider>
              <Switch>
                <PrivateRoute exact path="/" component={Dashboard} />
                <PrivateRoute exact path="/updateprofile" component={UpdateProfile}/>
                <PrivateRoute exact path="/managerPages/MyTasks" component={MyTasks}/>
                <PrivateRoute exact path="/managerPages/RoomAssignments" component={RoomAssignments}/>
                <PrivateRoute exact path="/managerPages/RoomProfiles" component={RoomProfiles}/>
                <PrivateRoute exact path="/managerPages/Roster" component={Roster}/>
                <PrivateRoute exact path="/managerPages/StaffProfiles" component={StaffProfiles}/>
                <PrivateRoute exact path="/managerPages/TrainingMode" component={TrainingMode}/>
                <PrivateRoute exact path="/managerPages/AddStaff" component={AddStaff}/>
                <PrivateRoute exact path="/managerPages/AddRooms" component={AddRooms}/>
                <PrivateRoute exact path="/managerPages/CSVUpload" component={CSVUpload}/>
                <Route path="/register" component={Register}/>
                <Route path="/login" component={Login}/>
                <Route path="/forgot-password" component={ForgotPassword}/>
              </Switch>
            </StaffProfileProvider>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  )
}

export default App;