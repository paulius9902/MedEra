import axios from '../../axiosApi';
import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import {Button, Space, notification, Card, Form, Row, Col, Typography, Badge, Descriptions} from 'antd';
import UpdateUserModal from './UpdateUserModal';

const UserDetail = () => {

const [user, setUser] = useState([])
const is_superuser = localStorage.getItem('is_superuser') === 'true';
const [visible_user, setVisibleUser] = useState(false);

const {id} = useParams();
const navigate = useNavigate();

useEffect(() => {
    getUser();
},[])

const onUpdate = async(values) => {
    console.log(values);
    await axios.patch(`api/user/${id}`, values).then(response=>{
      console.log(response.data);
      getUser();
      notification.success({ message: 'Sėkmingai atnaujinta!' });
    })
    setVisibleUser(false);
};

const getUser = async () => {
  const  { data } = await axios.get(`api/info`)
  setUser(data);
  console.log(data);
}
    return (
        <Card bordered={false} size="small" style={{ padding: 15 }}>
        <Form layout="vertical">
            <Row>
                <Col span={6}>
                    <Card
                    cover={
                        <img
                            src="https://www.shareicon.net/data/512x512/2017/02/15/878685_user_512x512.png"
                        />
                        }
                    actions={[
                        <Link style={{fontSize: '125%' }} onClick={() => {setVisibleUser(true);}} to="#"><EditOutlined style={{color: "#2db7f5"}}/> Atnaujinti</Link>,
                        ]}>
                    </Card>
                
                </Col>
                <Col span={18}>
                    <Card>
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
            </Row>
            </Form>
            </Card>
    );
};

export default UserDetail;