import React from "react";
import "antd/dist/antd.css";
//import "./styles.css";
import Icon from '@ant-design/icons';
import axiosInstance from '../../axiosApi';
import { Layout, Menu, Input, Divider, Avatar } from "antd";
import { Navbar, Nav, OverlayTrigger, Tooltip} from 'react-bootstrap';
import SettingsIcon from '@material-ui/icons/Settings';

const { Header } = Layout;

class HeaderMe extends React.Component {
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
    return (
      <Header className="header">
        <h2 className="medera"><a href="/" >MedEra</a></h2>

        <Menu
          theme="dark" mode="horizontal" defaultSelectedKeys={['4']}
        >
          <Menu.Item onClick={this.visits} key="1">Vizitai</Menu.Item>
          <Menu.Item onClick={this.doctors} key="2">Gydytojai</Menu.Item>
          <Menu.Item onClick={this.about} key="3">Apie mus</Menu.Item>
          <Menu.Item onClick={this.logout} key="4">Atsijungti</Menu.Item>
          <Menu.Item href="/settings/" key="5"><Settings/></Menu.Item>
        </Menu>
      </Header>
    );
  }
}

export default HeaderMe;

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