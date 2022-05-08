import axios from '../../axiosApi';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import {EditOutlined, CheckCircleOutlined, CloseCircleOutlined, LockOutlined} from '@ant-design/icons';
import {notification, Card, Form, Row, Col, Descriptions, Divider} from 'antd';
import UpdateUserModal from './UpdateUserModal';
import ChangePasswordModal from './ChangePasswordModal';

const UserDetail = () => {

const [user, setUser] = useState([])
const [visible_user, setVisibleUser] = useState(false);
const [visible_change_password, setVisibleChangePassword] = useState(false);
const [error_message, setErrorMsg,] = useState("");

const id = localStorage.getItem('user_id')

useEffect(() => {
    getUser();
},[])

const onUpdate = async(values) => {
    await axios.patch(`api/user/${id}`, values).then(response=>{
      getUser();
      notification.success({ message: 'Sėkmingai atnaujinta!' });
    })
    setVisibleUser(false);
};

const onChangePassword = async(values) => {
    await axios.put(`api/change_password`, values).then(response=>{
        setErrorMsg({errorMsg: ""});
        notification.success({ message: 'Sėkmingai pakeistas slaptažodis!' });
        setVisibleChangePassword(false);
    })
    .catch(error => {
        if(error.response) { 
            setErrorMsg({validateStatus: 'error',
            errorMsg: "Neteisingas dabartinis slaptažodis!"});
            
        }
      });
};

const getUser = async () => {
  const  { data } = await axios.get(`api/info`)
  setUser(data);
}
    return (
        <Card bordered={false} size="small" style={{ padding: 15 }}>
        <Divider style={{'backgroundColor':"#08c"}}/>
        <Form layout="vertical">
            <Row>
                <Col span={6}>
                    <Card
                    cover={
                        <img
                            src="https://www.shareicon.net/data/512x512/2017/02/15/878685_user_512x512.png"
                            alt=''
                        />
                        }
                    actions={[
                        <Link style={{fontSize: '125%' }} onClick={() => {setVisibleUser(true);}} to="#"><EditOutlined style={{color: "#2db7f5"}}/> Atnaujinti</Link>,
                        ]}>
                    </Card>
                
                </Col>
                <Col span={18}>
                    <Card
                        actions={[
                            <Link style={{fontSize: '125%' }} to={'#'} onClick={() => {setVisibleChangePassword(true);}} ><LockOutlined style={{ color: "#2db7f5" }}/>Keisti slaptažodį</Link>,
                            ]}>
                            <Descriptions title="Vartotojo duomenys" bordered>
                                <Descriptions.Item label="El. paštas" span={3}>{user.email}</Descriptions.Item>
                                <Descriptions.Item label="Aktyvus" span={3}>{user.is_active ? 
                                    <CheckCircleOutlined style={{ fontSize: '125%', color:"#52c41a"}}/> : 
                                    <CloseCircleOutlined style={{ fontSize: '125%', color:"#f5222d"}}/>}
                                </Descriptions.Item>
                                <Descriptions.Item label="Administratorius">{user.is_superuser ? 
                                    <CheckCircleOutlined style={{ fontSize: '125%', color:"#52c41a"}}/> : 
                                    <CloseCircleOutlined style={{ fontSize: '125%', color:"#f5222d"}}/>}
                                </Descriptions.Item>
                                <Descriptions.Item label="Gydytojas">{user.is_doctor ? 
                                    <CheckCircleOutlined style={{ fontSize: '125%', color:"#52c41a"}}/> : 
                                    <CloseCircleOutlined style={{ fontSize: '125%', color:"#f5222d"}}/>}
                                </Descriptions.Item>
                                <Descriptions.Item label="Pacientas">{user.is_patient ? 
                                    <CheckCircleOutlined style={{ fontSize: '125%', color:"#52c41a"}}/> : 
                                    <CloseCircleOutlined style={{ fontSize: '125%', color:"#f5222d"}}/>}
                                </Descriptions.Item>
                            </Descriptions>
                    </Card>
                </Col>
            <UpdateUserModal
                visible={visible_user}
                onCreate={onUpdate}
                onCancel={() => {
                setVisibleUser(false);
                }}
            />
            <ChangePasswordModal
                visible={visible_change_password}
                onChangePassword={onChangePassword}
                onCancel={() => {
                    setVisibleChangePassword(false)
                }}
                error_message={error_message}
            />
            </Row>
            </Form>
            <Divider style={{'backgroundColor':"#08c"}}/>
            </Card>
    );
};

export default UserDetail;