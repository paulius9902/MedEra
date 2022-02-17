import React from "react";
import { Navbar, Nav, OverlayTrigger, Tooltip} from 'react-bootstrap';
import SettingsIcon from '@material-ui/icons/Settings';
import axiosInstance from 'axios';

/**
 * Navbar component
 *
 * @component
 */
class Header extends React.Component {
  constructor(props) {
    super(props)

    this.logout = this.logout.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

    /**
     * User state
     */
    this.state = {
      logged_in: localStorage.getItem('access_token') ? true : false,
      logged_user_name: '',
      is_superuser: '',
      is_doctor: '',
      is_patient: '',
    }
  }
  
  /**
   * Logout method
   *
   * @method
   */
  logout() {
    axiosInstance.post('api/logout', {refresh_token: localStorage.getItem('refresh_token')});

    localStorage.clear();
    axiosInstance.defaults.headers['Authorization'] = null;
    window.location = "/";
  };

  login() {
    window.location = "/login";
  };

  patients() {
    window.location = "/patient";
  };

  visits() {
    window.location = "/visit";
  };

  doctors() {
    window.location = "/doctor";
  };

  about() {
    window.location = "/about";
  };

  componentDidMount(event) {
    if (this.state.logged_in)
    {
      axiosInstance.get('api/info')
      .then((res) => {
        const isSuperUser = res.data.is_superuser;
        const isDoctor = res.data.is_doctor;
        const isPatient = res.data.is_patient;
        const firstName = res.data.first_name;
        const userID = res.data.id;
        this.setState({logged_user_name: firstName});
        this.setState({is_superuser: isSuperUser});
        this.setState({is_doctor: isDoctor});
        this.setState({is_patient: isPatient});
        this.setState({user_id: userID});
        localStorage.setItem('is_superuser', isSuperUser)
        localStorage.setItem('is_doctor', isDoctor)
        localStorage.setItem('is_patient', isPatient)
        localStorage.setItem('first_name', firstName)
        localStorage.setItem('user_id', userID)
      })
      .catch(error => {if(error.response){console.log(error.response.data);}});
    }
  } 
  
  render() {
    if (this.state.logged_in)
    {
      return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" id="customNav">
          <Navbar.Brand href="/" style={{paddingRight:'10px'}}>MedEra</Navbar.Brand>
          <Navbar.Text>Sveiki! {this.state.logged_user_name}</Navbar.Text>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto"></Nav>
            <Nav> 
              <Nav.Link onClick={this.visits}>Vizitai</Nav.Link>
              <Nav.Link onClick={this.doctors}>Gydytojai</Nav.Link>
              <Nav.Link onClick={this.about}>Apie mus</Nav.Link>
              <Nav.Link onClick={this.logout}>Atsijungti</Nav.Link>
              <Nav.Link href="/settings"><Settings/></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );   
    } 
    else
    {      
      return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" id="customNav">
          <Navbar.Brand href="/" style={{paddingRight:'10px'}}>MedEra</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto"></Nav>
            <Nav>
              <Nav.Link onClick={this.about}>Apie mus</Nav.Link>
              <Nav.Link onClick={this.login}>Prisijungti</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
    }
  }
}

export default Header;

/**
 * Account Settings component
 *
 * @memberof Header
 * @component
 */
class Settings extends React.Component {
  render() {
    return(
      <OverlayTrigger
        key="bottom"
        placement="bottom"
        overlay={
          <Tooltip id="tooltip-bottom">
            Account Settings
          </Tooltip>
        }>
        <SettingsIcon/>
      </OverlayTrigger>
    );
  }
}