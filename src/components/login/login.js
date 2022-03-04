import React, { Component } from "react";
import {FormGroup, Label, Input } from "reactstrap";
import axiosInstance from '../../axiosApi'
import { Button, Form, Card, Nav } from 'react-bootstrap';
import "./login.css";

 class Home extends Component {
  constructor(props) {
    super(props)

    this.onChangeInput = this.onChangeInput.bind(this);
    this.login = this.login.bind(this);
    //this.componentDidMount = this.componentDidMount.bind(this);

     this.state = {
      errors: '',
      is_instructor: '',
      
      /**
       * User data (/api/token)
       */
      credentials: {
        email: '',
        password: '',
      }
    }
  }

  /**
   * Function for detecting input changes in the form
   *
   * @method
   * @param {Object} e event handler
   */
  onChangeInput(e) {
    const cred = this.state.credentials;
    cred[e.target.name] = e.target.value;
    this.setState({credentials: cred});
    // console.log(cred);
  }

  /**
   * Login function that handles posting the data
   *
   * @method
   * @param {Object} e event handler
   */
  login(e) {
    e.preventDefault();
    const loginUser = this.state.credentials;

    axiosInstance.post('api/token', loginUser, {crossDomain: true})
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        localStorage.setItem('access_token', res.data.access);
				localStorage.setItem('refresh_token', res.data.refresh);
				axiosInstance.defaults.headers['Authorization'] =
					'JWT ' + localStorage.getItem('access_token');
        
        alert("Sėkmingai prisijungėte!");
        
      }
    }).then(() => {
      axiosInstance.get('api/info')
      .then((res) => {
        const isSuperUser = res.data.is_superuser;
        const isDoctor = res.data.is_doctor;
        const isPatient = res.data.is_patient;
        const userID = res.data.id;
        const patientID = res.data.patient;
        const doctorID = res.data.doctor;
        this.setState({is_superuser: isSuperUser});
        this.setState({is_doctor: isDoctor});
        this.setState({is_patient: isPatient});
        this.setState({user_id: userID});
        this.setState({patient_id: patientID});
        this.setState({doctor_id: doctorID});
        localStorage.setItem('is_superuser', isSuperUser)
        localStorage.setItem('is_doctor', isDoctor)
        localStorage.setItem('is_patient', isPatient)
        localStorage.setItem('user_id', userID)
        localStorage.setItem('patient_id', patientID)
        localStorage.setItem('doctor_id', doctorID)

        window.location = "/";
      })
    }).catch(error => {
      if(error.response) { 
        const errm = "Neteisingas slaptažodis arba el. paštas";
        this.setState({errors: errm});
        console.log(error.response.data)
      }
    });
  }

  render() {
    return (
      <div className="background">
        <div className="login-box">
          <div className="container">
            <div class="row app-des">
              <div class="col left-background ">
                <h1 class="white-text">MedEra</h1>
                <p>Prisijunkite prie savo asmeninės MedEra paskyros</p>
              </div>
              <div class="col login-form">
                <form id="userCredentials" onSubmit={this.login}>
                  <h2 className="font-weight-bold mb-4">Prisijungimas</h2>
                  <FormGroup>
                    <Label className="font-weight-bold mb-2">El.paštas</Label>
                    <Form.Control 
                      className="mb-3" 
                      type="email" 
                      placeholder="Įveskite el. paštą"
                      required
                      id="email"
                      name="email"
                      value={this.state.credentials.email}
                      onChange={this.onChangeInput}/>
                    <Label className="font-weight-bold mb-2">Slaptažodis</Label>
                    <Form.Control 
                      className="mb-3" 
                      type="password" 
                      required
                      id="password"
                      name="password"
                      value={this.state.credentials.password}
                      onChange={this.onChangeInput}
                      placeholder="Įveskite slaptažodį" />
                  </FormGroup>
                  <div style={{color:'red', paddingBottom:'10px'}}>{this.state.errors}</div>
                  <Button variant="primary" type="submit" id="userSubmit" className="btn btn-primary mb-3">
                      Prisijungti
                    </Button>
                  <div style={{ marginTop: 8 }}>
                    <a href="/">Užmiršote slaptažodį?</a>
                  </div>
                  <div style={{ marginTop: 8 }}>
                  <a href="/">Neturite paskyros?</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;