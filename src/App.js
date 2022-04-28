import React from "react";
import { Layout} from 'antd';
import { Routes, Route} from "react-router-dom";
import Header from "./components/layout/Header";
import Breadcrumb from "./components/layout/Breadcrumbs";
//import Footer from "./components/layout/Footer";
import Home from "./components/layout/Home";
import SideBar from "./components/layout/SideBar";
//import './App.css';
import Login from "./components/login/login";
import ResetPassword from "./components/login/resetPassword";

import ShowPatients from "./components/patients/ShowPatients";
import PatientDetail from "./components/patients/PatientDetail";
import ShowDoctors from "./components/doctors/ShowDoctors";
import DoctorDetail from "./components/doctors/DoctorDetail";
import ShowDiagnoses from "./components/diagnoses/ShowDiagnoses";
import ShowPrescriptions from "./components/prescriptions/ShowPrescriptions";
import ShowLabTests from "./components/labTests/ShowLabTests";
import ShowVisits from "./components/visits/ShowVisits";
import Profile from "./components/profile/Profile";
import ChangePassword from "./components/profile/ChangePassword";
import ShowUsers from "./components/users/ShowUsers";
import NotFound from "./components/layout/NotFound";

const { Content, Footer } = Layout;

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
                    <Layout>
                        <SideBar/>
                        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
                            <Breadcrumb/>
                            <div style={{ padding: 24, background: "#fff", textAlign: "center" }}>
                                <main style={{ padding: '0 20px' }}>
                                    <Routes>
                                        <Route exact path={"/login/"} element={<Login/>}/>
                        
                                        <Route exact path={"/patient/"} element={<ShowPatients/>}/>
                                        <Route exact path="/patient/:id/" element={<PatientDetail/>} />

                                        <Route exact path={"/doctor/"} element={<ShowDoctors/>}/>
                                        <Route exact path="/doctor/:id/" element={<DoctorDetail/>} />

                                        <Route exact path={"/diagnosis/"} element={<ShowDiagnoses/>}/>

                                        <Route exact path={"/laboratory_test/"} element={<ShowLabTests/>}/>

                                        <Route exact path={"/prescription/"} element={<ShowPrescriptions/>}/>
                                            
                                        <Route exact path={"/visit/"} element={<ShowVisits/>}/>
                                            
                                        <Route exact path={"/settings/"} element={<Profile/>}/>
                                        <Route exact path={"/change_password/"} element={<ChangePassword/>}/>

                                        <Route exact path={"/user/"} element={<ShowUsers/>}/>

                                        {localStorage.getItem('patient_id')==='null' ?
                                        <Route exact path="/" element={<Home/>} />:
                                        <Route exact path="/" element={<Profile/>} />}


                                        <Route exact path="*" element={<NotFound/>} />

                                        <Route exact path="/not_found/" element={<NotFound/>} />
                                    </Routes>
                                </main>
                            </div>
                            <Footer style={{ textAlign: 'center' }}>Copyright &copy; MedEra 2022</Footer>
                        </Content>
                </Layout>
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

                        <Route exact path="/" element={<Login/>} />

                        <Route exact path="*" element={<Login/>} />

                        <Route exact path="/api/password_reset/:uidb64/:token/" element={<ResetPassword/>} />
                        
                       </Routes>
                   </main>
                </div>
            );
        }
        
    }
}

export default App;