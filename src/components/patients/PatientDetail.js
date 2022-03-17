import axios from '../../axiosApi';
import React, {useState, useEffect, Fragment} from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
//import { Card, Row } from 'react-bootstrap';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined} from '@ant-design/icons';
import {Button, Space, notification, Card, Form, Row, Col, Typography} from 'antd';
import UpdatePatientModal from './UpdatePatientModal';
import { CardColumns } from 'reactstrap';
const { Title, Text} = Typography;
const PatientDetail = () => {

const [patient, setPatient] = useState([])
const [work_hours, setWorkHours] = useState([])
const {id} = useParams();
const [visible_patient, setVisiblePatient] = useState(false);
const [visible_visit, setVisibleVisit] = useState(false);

useEffect(() => {
    getSinglePatient();
},[])

const onUpdate = async(values) => {
    console.log(values);
    await axios.patch(`api/patient/${id}`, values).then(response=>{
      console.log(response.data);
      getSinglePatient();
      notification.success({ message: 'Sėkmingai atnaujinta!' });
    })
    setVisiblePatient(false);
};

const getSinglePatient = async () => {
  const  { data } = await axios.get(`api/patient/${id}`)
  console.log(data);
  setPatient(data);
}

const deletePatient = async (id) => {
    try {
        await axios.delete(`api/patient/${id}`)
        notification.success({ message: 'Sėkmingai ištrinta!' });
    } catch (error) {
        console.error(error);
    }
}
return (
    <Card bordered={false} size="small" style={{ padding: 15 }}>
        <Form layout="vertical">
            <Row>
                <Col span={6}>
                    <Card
                    cover={
                        <img
                            class="img-fluid rounded mb-4 mb-lg-0"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/2048px-User_font_awesome.svg.png"
                            alt=""
                        />
                        }
                    actions={[
                        <Link style={{fontSize: '150%' }} onClick={() => {setVisiblePatient(true);}} to="#"><EditOutlined style={{color: "#2db7f5"}}/> Atnaujinti</Link>,
                        <Link style={{fontSize: '150%' }} to="/patient" onClick={() => deletePatient(patient.patient_id)}><DeleteOutlined style={{color: "#f50"}}/> Ištrinti</Link>,
                        ]}>
                    </Card>
                
                </Col>
                <Col span={18}>
                    <Card
                    actions={[
                        <Link style={{fontSize: '175%' }} to={'#'} onClick={() => {setVisibleVisit(true);}} ><PlusCircleOutlined style={{ color: "#87d068" }}/> Pridėti diagnozę</Link>,
                        <Link style={{fontSize: '175%' }} to={'#'} onClick={() => {setVisibleVisit(true);}} ><PlusCircleOutlined style={{ color: "#87d068" }}/> Pridėti lab. tyrimą</Link>,
                        <Link style={{fontSize: '175%' }} to={'#'} onClick={() => {setVisibleVisit(true);}} ><PlusCircleOutlined style={{ color: "#87d068" }}/> Pridėti receptą</Link>,
                        ]}>
                    <Title>Paciento duomenys</Title>
                            <Title level={4} type='secondary'>Vardas: {patient.name}</Title>
                            <p>Pavardė: {patient.surname}</p>
                            <p>Gimimo data: {patient.birthday}</p>
                    </Card>
                </Col>
            <UpdatePatientModal
                visible={visible_patient}
                onCreate={onUpdate}
                onCancel={() => {
                setVisiblePatient(false);
                }}
            />
            </Row>
            </Form>
            </Card>
            );
};

export default PatientDetail;