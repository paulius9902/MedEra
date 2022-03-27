import axios from '../../axiosApi';
import React, {useState, useEffect, Fragment} from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
//import { Card, Row } from 'react-bootstrap';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined} from '@ant-design/icons';
import {Button, Space, notification, Card, Form, Row, Col, Typography, Descriptions, Popconfirm, Table, Skeleton, Empty, Divider} from 'antd';
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

const COLUMNS = [
    {
      title: "Pavadinimas",
      dataIndex: 'name',
      key: "name"
    },
    {
        title: "Aprašymas",
        dataIndex: 'description',
        key: "description"
      },
    {
      title: "Veiksmai",
      key: "action",
      render: (record) => {
        
          return (
            <>
              <Popconfirm
                placement='topLeft'
                title='Ar tikrai norite ištrinti?'
                okText='Taip'
                cancelText='Ne'
                onConfirm={() => confirmHandler(record.visit_id)}
              >
                <DeleteOutlined
                  style={{ color: "#f50", marginLeft: 12, fontSize: '150%'}}
                />
              </Popconfirm>
            </>
          );
      }
    },
  ];

  const deleteAllergy = async (allergy_id) => {
    try {
      await axios.delete(`api/patient/${id}/allergy/${allergy_id}`);
      getSinglePatient();
      notification.success({ message: 'Sėkmingai ištrinta!' });
    } catch (error) {
      console.error(error);
    }
  };

  const confirmHandler = id => {
    deleteAllergy(id);
  };

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
                            src={patient.image}
                            alt=""
                        />
                        }
                    actions={[
                        <Link style={{fontSize: '125%' }} onClick={() => {setVisiblePatient(true);}} to="#"><EditOutlined style={{color: "#2db7f5"}}/> Atnaujinti</Link>,
                        <Link style={{fontSize: '125%' }} to="/patient" onClick={() => deletePatient(patient.patient_id)}><DeleteOutlined style={{color: "#f50"}}/> Ištrinti</Link>,
                        ]}>
                    </Card>
                
                </Col>
                <Col span={18}>
                    <Card
                    actions={[
                        <Link style={{fontSize: '125%' }} to={'#'} onClick={() => {setVisibleVisit(true);}} ><PlusCircleOutlined style={{ color: "#87d068" }}/> Pridėti diagnozę</Link>,
                        <Link style={{fontSize: '125%' }} to={'#'} onClick={() => {setVisibleVisit(true);}} ><PlusCircleOutlined style={{ color: "#87d068" }}/> Pridėti lab. tyrimą</Link>,
                        <Link style={{fontSize: '125%' }} to={'#'} onClick={() => {setVisibleVisit(true);}} ><PlusCircleOutlined style={{ color: "#87d068" }}/> Pridėti receptą</Link>,
                        ]}>
                        <Descriptions title="Paciento duomenys" bordered>
                        <Descriptions.Item label="Vardas" span={3}>{patient.name}</Descriptions.Item>
                        <Descriptions.Item label="Pavardė" span={3}>{patient.surname}</Descriptions.Item>
                        <Descriptions.Item label="Gimimo data" span={2}>{patient.birthday ? patient.birthday : '-'}</Descriptions.Item>
                        <Descriptions.Item label="Telefono nr." span={2}>{patient.phone_number}</Descriptions.Item>
                        <Descriptions.Item label="Ūgis(cm)">{patient.height ? patient.height : '-'}</Descriptions.Item>
                        <Descriptions.Item label="Svoris(kg)">{patient.weight ? patient.weight : '-'}</Descriptions.Item>
                        <Descriptions.Item label="Gydosi iki">{patient.termination_date ? patient.termination_date : '-'}</Descriptions.Item>
                    </Descriptions>
                    </Card>
                    <Divider></Divider>
                    <Card
                    actions={[
                        <Link style={{fontSize: '125%' }} to={'#'} onClick={() => {setVisibleVisit(true);}} ><PlusCircleOutlined style={{ color: "#87d068" }}/> Pridėti alergiją</Link>,
                        ]}>
                    <Descriptions title="Alergijos" bordered></Descriptions>
                    <Table  columns={COLUMNS} 
                        dataSource={patient.allergies}
                        size="middle" 
                        rowKey={record => record.visit_id} 
                        style={{ whiteSpace: 'pre'}}/>
                    
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