import React from "react";
import "antd/dist/antd.css";
import "./styles.css";
import { SettingOutlined, UserOutlined, LogoutOutlined} from '@ant-design/icons';
import axiosInstance from '../../axiosApi';
import { Layout, Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";

const { Header } = Layout;

class HeaderMe extends React.Component {
  constructor(props) {
    super(props)

    this.logout = this.logout.bind(this);

    this.state = {
      logged_in: localStorage.getItem('access_token') ? true : false,
      user: localStorage.getItem('doctor') ? localStorage.getItem('doctor') : localStorage.getItem('patient'),
      logged_user_name: '',
      is_superuser: '',
      is_doctor: '',
      is_patient: '',
    }
  }
  
  logout() {
    axiosInstance.post('api/logout', {refresh_token: localStorage.getItem('refresh_token')});

    localStorage.clear();
    axiosInstance.defaults.headers['Authorization'] = null;
    window.location = "/";
  };

  settings() {
    window.location = "/settings";
  };

  render() {
    const rightStyle = { position: 'absolute', top: 0, right: 0 };
    return (
      <Header className="header">
        <h1 className="medera"><a href="/" >MedEra</a></h1>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['6']}>
          <SubMenu key="4" style={rightStyle} title={<span><UserOutlined style={{ fontSize: '150%'}}/> {this.state.user ? this.state.user : 'Administratorius'}</span>}>
            <Menu.Item onClick={this.settings} key="5"><SettingOutlined style={{ fontSize: '150%'}}/> Nustatymai </Menu.Item>
            <Menu.Item  onClick={this.logout} key="6"><LogoutOutlined style={{ fontSize: '150%'}}/> Atsijungti </Menu.Item>
          </SubMenu>
        </Menu>
      </Header>
    );
  }
}

export default HeaderMe;