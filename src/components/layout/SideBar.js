import React from "react";
import "antd/dist/antd.css";
//import "./styles.css";
import axiosInstance from '../../axiosApi';
import { Layout, Menu, Input, Divider, Avatar } from "antd";
import { Navbar, Nav, OverlayTrigger, Tooltip} from 'react-bootstrap';
import SettingsIcon from '@material-ui/icons/Settings';
import SubMenu from "antd/lib/menu/SubMenu";
import { LaptopOutlined, CloudUploadOutlined, CalendarOutlined, OrderedListOutlined, PlusCircleOutlined, MedicineBoxOutlined, InfoCircleOutlined} from '@ant-design/icons';
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
    const subIconSize = {
      fontSize: '150%'
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
          <SubMenu  onClick={() => this.setSelectedKeys(['1'])}
                    key="1"
                    title={<span><CalendarOutlined style={iconSize}/> <span className="nav-text">Vizitai</span> </span>}>
            
            <Menu.Item key="2" onClick={() =>  this.setSelectedKeys("2")}>
              <Link to="/visit">
                <OrderedListOutlined style={subIconSize}/>
                <span className="nav-text">Visi</span>
              </Link>
            </Menu.Item>
            
            <Menu.Item key="3" onClick={() =>  this.setSelectedKeys("3")}>
              <Link to="/visit/create">
                <PlusCircleOutlined style={subIconSize}/>
                <span className="nav-text">Pridėti</span>
              </Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="4" onClick={() => { this.setSelectedKeys("4")}}>
            <Link to="/doctor">
              <MedicineBoxOutlined style={iconSize}/>
              <span className="nav-text">Gydytojai</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="5" onClick={() => { this.setSelectedKeys("5")}}>
            <Link to="/about">
              <InfoCircleOutlined style={iconSize}/>
              <span className="nav-text">Apie mus</span>
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