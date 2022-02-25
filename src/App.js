import React, { Component} from "react";
import { Layout, Menu, Breadcrumb } from 'antd';
import { Routes, Route, Redirect} from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/layout/Home";
import SideBar from "./components/layout/SideBar";
import './App.css';
import Login from "./components/login/login";

import ShowPatients from "./components/patients/ShowPatients";
import PatientDetail from "./components/patients/PatientDetail";
import UpdatePatient from "./components/patients/UpdatePatient";
import AddPatient from "./components/patients/AddPatient";
import ShowDoctors from "./components/doctors/ShowDoctors";
import DoctorDetail from "./components/doctors/DoctorDetail";
import UpdateDoctor from "./components/doctors/UpdateDoctor";
import AddDoctor from "./components/doctors/AddDoctor";
import ShowVisits from "./components/visits/ShowVisits";
import AddVisit from "./components/visits/AddVisit";
import VisitDetail from "./components/visits/VisitDetail";
import Profile from "./components/profile/Profile";
import ChangePassword from "./components/profile/ChangePassword";
import About from "./components/about/About";
import ShowUsers from "./components/users/ShowUsers";
import AddUsers from "./components/users/AddUser";

const {Content, Sider } = Layout;
const { SubMenu } = Menu;

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          logged_in: localStorage.getItem('access_token') ? true : false,
          is_superuser: localStorage.getItem('is_superuser') ? true : false,
          is_doctor: localStorage.getItem('is_doctor') ? true : false,
          is_patient: localStorage.getItem('is_patient') ? true : false,
        }
      }
    
    render() {
        if (this.state.logged_in)
        {

            return (
                <div className="site">
                    <Layout style={{ minHeight: '100vh' }}>
                    <SideBar/>
                    <Layout className="site-layout">
                        <Header/>
                        <main>
                            <Routes>
                                <Route exact path={"/login/"} element={<Login/>}/>
                
                                <Route exact path={"/patient/"} element={<ShowPatients/>}/>
                                <Route exact path={"/patient/create"} element={<AddPatient/>}/>
                                <Route exact path="/patient/:id/" element={<PatientDetail/>} />
                                <Route exact path="/patient/:id/update" element={<UpdatePatient/>} />

                                <Route exact path={"/doctor/"} element={<ShowDoctors/>}/>
                                <Route exact path={"/doctor/create"} element={<AddDoctor/>}/>
                                <Route exact path="/doctor/:id/" element={<DoctorDetail/>} />
                                <Route exact path="/doctor/:id/update" element={<UpdateDoctor/>} />
                                    
                                <Route exact path={"/visit/"} element={<ShowVisits/>}/>
                                <Route exact path={"/visit/create"} element={<AddVisit/>}/>
                                <Route exact path={"/visit/test/"} element={<VisitDetail/>}/>
                                    
                                <Route exact path={"/settings/"} element={<Profile/>}/>
                                <Route exact path={"/change_password/"} element={<ChangePassword/>}/>

                                <Route exact path={"/user/"} element={<ShowUsers/>}/>
                                <Route exact path={"/user/create"} element={<AddUsers/>}/>

                                <Route exact path={"/about/"} element={<About/>}/>

                                <Route exact path="/" element={<Home/>} />

                                <Route exact path="*" element={<Home/>} />
                            </Routes>
                        </main>
                        <Footer/>
                        </Layout>
                        </Layout>
                </div>
            );
        }
        else
        {
            return (
                <div className="site">
                    
                    <main>
                        <Routes>
                        <Route exact path={"/login/"} element={<Login/>}/>
    
                        <Route exact path={"/about/"} element={<About/>}/>

                        <Route exact path="/" element={<Login/>} />

                        <Route exact path="*" element={<Login/>} />
                       </Routes>
                   </main>
                   <Footer/>
                </div>
            );
        }
        
    }
}

export default App;