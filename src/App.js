import React, { Component} from "react";
import { Layout, Menu, Input, Divider, Avatar, Breadcrumb} from 'antd';
import { Routes, Route, Redirect} from "react-router-dom";
import Header from "./components/layout/Header";
//import Footer from "./components/layout/Footer";
import Home from "./components/layout/Home";
import SideBar from "./components/layout/SideBar";
import './App.css';
import Login from "./components/login/login";
import Icon from '@ant-design/icons';

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

const { SubMenu } = Menu;
const { Content, Sider, Footer } = Layout;

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
                <Layout>
                    <Header/>
                    <Content>
                    <Layout className="site-layout" >
                        <SideBar/>
                        <Layout style={{ padding: '0 24px 24px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item >Home</Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb>
                        <main style={{ padding: '0 20px' }}>
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
                        </Layout>
                    </Layout>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Copyright &copy; MedEra 2021</Footer>
                </Layout>
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
                </div>
            );
        }
        
    }
}

export default App;