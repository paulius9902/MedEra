import React from "react";
//import "./styles.css";
import axiosInstance from '../../axiosApi';
import { Layout, Menu} from "antd";
import { FileDoneOutlined, AuditOutlined, UserOutlined, ExperimentOutlined, CalendarOutlined, MedicineBoxOutlined, IdcardOutlined} from '@ant-design/icons';
import PropTypes from 'prop-types';
import {Link } from "react-router-dom";

const {Sider } = Layout;
class SideBar extends React.Component {

  constructor(props) {
    super(props)
    const { selectedKeys } = this.props;
    this.logout = this.logout.bind(this);
    this.setSelectedKeys = this.setSelectedKeys.bind(this);

    this.state = {
      logged_in: localStorage.getItem('access_token') ? true : false,
      logged_user_name: '',
      is_superuser: '',
      is_doctor: '',
      is_patient: '',
      collapsed: true,
      selectedKeys
    }
  }
  
  setSelectedKeys(key) {
    this.setState({
      selectedKeys: key,
    });
  }

  logout() {
    axiosInstance.post('api/logout', {refresh_token: localStorage.getItem('refresh_token')});

    localStorage.clear();
    axiosInstance.defaults.headers['Authorization'] = null;
    window.location = "/";
  };

  componentDidMount() {
    const pathName = window.location.pathname
    console.log(window.location.pathname)
    if (pathName.includes("/visit")) {
      this.setState({
        selectedKeys: ["/visit"]
      });
    } else if (pathName.includes("/doctor")) {
      this.setState({
        selectedKeys: ["/doctor"]
      });
    } else if (pathName.includes("/patient")) {
      this.setState({
        selectedKeys: ["/patient"]
      });
    } else if (pathName.includes("/diagnosis")) {
      this.setState({
        selectedKeys: ["/diagnosis"]
      });
    } else if (pathName.includes("/laboratory_test")) {
      this.setState({
        selectedKeys: ["/laboratory_test"]
      });
    } else if (pathName.includes("/prescription")) {
      this.setState({
        selectedKeys: ["/prescription"]
      });
    } else if (pathName.includes("/user")) {
      this.setState({
        selectedKeys: ["/user"]
      });
    } else {
      this.setState({
        selectedKeys: ["0"]
      });
    }
  }

  render() {
    const { selectedKeys } = this.state;
    const iconSize = {
      fontSize: '200%'
    };

    return (
      <Sider
        collapsible
        onCollapse={() => this.setCollapsed(!this.state.collapsed)}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          top: 0,
          left: 0
        }}
      >
        <Menu theme="dark" mode="inline"
            selectedKeys={selectedKeys} >
          {localStorage.getItem('is_patient') === 'true' &&
          <Menu.Item key="/user" onClick={() => { this.setSelectedKeys("/patient_info")}}>
            <Link to={`/patient/${localStorage.getItem('patient_id')}`}>
              <IdcardOutlined style={iconSize}/>
              <span className="nav-text">Paciento kortelė</span>
            </Link>
          </Menu.Item>}
          <Menu.Item  key="/visit" onClick={() => { this.setSelectedKeys("/visit")}}>
              <Link to="/visit">
                <CalendarOutlined style={iconSize}/>
                <span className="nav-text">Vizitai</span>
              </Link>
          </Menu.Item>

          <Menu.Item key="/doctor" onClick={() => { this.setSelectedKeys("/doctor")}}>
            <Link to="/doctor">
              <MedicineBoxOutlined style={iconSize}/>
              <span className="nav-text">Gydytojai</span>
            </Link>
          </Menu.Item>

          {localStorage.getItem('is_patient') === 'false' &&
          <Menu.Item key="/patient" onClick={() => { this.setSelectedKeys("/patient")}}>
            <Link to="/patient">
              <IdcardOutlined style={iconSize}/>
              <span className="nav-text">Pacientai</span>
            </Link>
          </Menu.Item>}

          <Menu.Item key="/diagnosis" onClick={() => { this.setSelectedKeys("/diagnosis")}}>
            <Link to="/diagnosis">
              <FileDoneOutlined style={iconSize}/>
              <span className="nav-text">Diagnozės</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="/laboratory_test" onClick={() => { this.setSelectedKeys("/laboratory_test")}}>
            <Link to="/laboratory_test">
              <ExperimentOutlined style={iconSize}/>
              <span className="nav-text">Lab. tyrimai</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="/prescription" onClick={() => { this.setSelectedKeys("/prescription")}}>
            <Link to="/prescription">
              <AuditOutlined style={iconSize}/>
              <span className="nav-text">Receptai</span>
            </Link>
          </Menu.Item>

          {localStorage.getItem('is_superuser') === 'true' &&
          <Menu.Item key="/user" onClick={() => { this.setSelectedKeys("/user")}}>
            <Link to="/user">
              <UserOutlined style={iconSize}/>
              <span className="nav-text">Vartotojai</span>
            </Link>
          </Menu.Item>}
        </Menu>
      </Sider>
    );
  }
}

SideBar.propTypes = {
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
};

SideBar.defaultProps = {
  selectedKeys: ['0'],
};

export default SideBar;