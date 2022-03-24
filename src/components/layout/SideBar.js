import React from "react";
//import "./styles.css";
import axiosInstance from '../../axiosApi';
import { Layout, Menu, Input, Divider, Avatar } from "antd";
import { Navbar, Nav, OverlayTrigger, Tooltip} from 'react-bootstrap';
import SettingsIcon from '@material-ui/icons/Settings';
import SubMenu from "antd/lib/menu/SubMenu";
import { FileDoneOutlined, LineChartOutlined, CarryOutOutlined, AuditOutlined, UserOutlined, IdcardOutlined, ExperimentOutlined, CalendarOutlined, OrderedListOutlined, PlusCircleOutlined, MedicineBoxOutlined, InfoCircleOutlined} from '@ant-design/icons';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { isEqual } from "lodash";
import { connect } from "react-redux";


const { Content, Footer, Sider } = Layout;

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
      selectedKeys,
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
        <Menu theme="dark" mode="inline" selectedKeys={selectedKeys} >
          <Menu.Item  onClick={() => this.setSelectedKeys(['1'])} key="1">
              <Link to="/visit">
                <CalendarOutlined style={iconSize}/>
                <span className="nav-text">Vizitai</span>
              </Link>

          </Menu.Item>

          <Menu.Item key="4" onClick={() => { this.setSelectedKeys("4")}}>
            <Link to="/doctor">
              <MedicineBoxOutlined style={iconSize}/>
              <span className="nav-text">Gydytojai</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="5" onClick={() => { this.setSelectedKeys("5")}}>
            <Link to="/patient">
              <IdcardOutlined style={iconSize}/>
              <span className="nav-text">Pacientai</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="6" onClick={() => { this.setSelectedKeys("6")}}>
            <Link to="/diagnosis">
              <FileDoneOutlined style={iconSize}/>
              <span className="nav-text">Diagnozės</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="7" onClick={() => { this.setSelectedKeys("7")}}>
            <Link to="/laboratory_test">
              <ExperimentOutlined style={iconSize}/>
              <span className="nav-text">Lab. tyrimai</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="8" onClick={() => { this.setSelectedKeys("8")}}>
            <Link to="/prescription">
              <AuditOutlined style={iconSize}/>
              <span className="nav-text">Receptai</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="9" onClick={() => { this.setSelectedKeys("9")}}>
            <Link to="/user">
              <UserOutlined style={iconSize}/>
              <span className="nav-text">Vartotojai</span>
            </Link>
          </Menu.Item>
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