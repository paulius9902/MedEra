import React, { Component } from "react";
import { Button, Form, Card, Nav } from 'react-bootstrap';
import axiosInstance from '../../axiosApi'
import Container from '@material-ui/core/Container';

/**
 * Login Form
 *
 * @component
 */
class LogIn extends Component {
  constructor(props) {
    super(props)

    this.onChangeInput = this.onChangeInput.bind(this);
    this.login = this.login.bind(this);

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

        window.location = "/";
      }
    })
    .catch(error => {
      if(error.response) { 
        const errm = "Neteisingas slaptažodis arba el. paštas";
        this.setState({errors: errm});
        console.log(error.response.data)
      }
    });
  }

  render() {
    return (
      <>
        <Container component="main" maxWidth="md">
          <div className="login">
            <h2 className="welcome-text" style={{textAlign:'center'}}>Prisijunkite!</h2>
            
            <div className="box" style={{textAlign:'center'}}>
              
              <Card id="forms">
                <Card.Header>
                  <Nav variant="tabs">
                    <Nav.Item>
                      <Nav.Link href="/" className="active">Prisijungimas</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                
                <Card.Body>
                  <Form id="userCredentials" onSubmit={this.login}>
                    <Form.Group>
                      <Form.Control 
                        className="form-control form-control-lg"
                        required
                        type="email"
                        id="email"
                        name="email"
                        value={this.state.credentials.email}
                        onChange={this.onChangeInput}
                        placeholder="El. paštas"/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Control 
                        className="form-control form-control-lg"
                        required
                        type="password"
                        id="password"
                        name="password"
                        value={this.state.credentials.password}
                        onChange={this.onChangeInput}
                        placeholder="Slaptažodis"/>
                    </Form.Group>

                    <div style={{color:'red', paddingBottom:'10px'}}>{this.state.errors}</div>

                    <Button variant="primary" type="submit" id="userSubmit" className="btn btn-primary mb-3">
                      Prisijungti
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </div>
          </Container>
      </>
    );
  }
}

export default LogIn;