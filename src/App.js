import React, { Component} from "react";
import { Routes, Route} from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Home from "./layout/Home";
import './App.css';

class App extends Component{
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
                    <Header/>
                    <main>
                        <Routes>
                            <Route exact path="/" element={<Home/>} />
                        </Routes>
                    </main>
                    <Footer/>
                       
                </div>
            );
        }
        else
        {
            return (
                <div className="site">
                    <Header/>
                    <main>
                        <Routes>
                            <Route exact path="/" element={<Home/>} />
                       </Routes>
                   </main>
                   <Footer/>
                   
                </div>
            );
        }
        
    }
}

export default App;