import axios from '../../axiosApi';
import React, {useState, useEffect} from 'react';
import { useParams} from 'react-router';
import { Link } from 'react-router-dom';
//import { Card, Row } from 'react-bootstrap';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {notification, Card, Form, Row, Col, Descriptions, Popconfirm, Table, Divider} from 'antd';
import UpdatePatientModal from './UpdatePatientModal';
import AddPatientAllergiesModal from './AddPatientAllergiesModal';
const PatientDetail = () => {

const [patient, setPatient] = useState([])
const [allergies, setAllergies] = useState([])
const [patient_allergies, setPatientAllergies] = useState([])
const [filtered_allergies, setFilteredAllergies] = useState([])
const {id} = useParams();
const [visible_patient, setVisiblePatient] = useState(false);
const [visible_patient_allergies, setVisiblePatientAllergies] = useState(false);
const [visible_visit, setVisibleVisit] = useState(false);

useEffect(() => {
  console.log("-----")
  console.log(allergies)
  console.log(filtered_allergies)
  console.log(filtered_allergies)
  setFilteredAllergies(Object.values(allergies).filter(o1 => !Object.values(patient_allergies).some(o2 => o1.allergy_id === o2.allergy_id)))
  /*allergies.map(function(allergy1, i){
    console.log(allergy1)
    patient_allergies.map(function(allergy2, i){
      console.log(allergy2)
      setFilteredAllergies(Object.values(allergy1).filter(o1 => !Object.values(allergy2).some(o2 => o1.allergy_id === o2.allergy_id)))
    })
  })*/
  console.log("-----")
}, [patient_allergies, allergies]);

useEffect(() => {
    getAllAllergies();
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
                onConfirm={() => confirmHandler(record.allergy_id)}
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

const onAddAllergies = async(values) => {
  const arr1d = [].concat(...Object.values(values));
  var res = Object.keys(arr1d).map(function(name){
    var obj = {};
    obj[`allergy`] = arr1d[name];
    return obj;
  });
  {res.map((allergy, index) => (
     axios.post(`api/patient/${id}/allergy`, JSON.stringify(allergy)).then(response=>{
      console.log(response.data);
      console.log(JSON.stringify(response.data))
      getSinglePatient();
      
    })
  ))}
  notification.success({ message: 'Sėkmingai pridėta!' });
  setVisiblePatientAllergies(false);
};

const getAllAllergies = async () => {
  await axios.get('api/allergy')
     .then((response) => {
      setAllergies(response.data);
     })
    .catch((error)=>{
       console.log(error);
    });
};

const getSinglePatient = async () => {
  await axios.get(`api/patient/${id}`)
     .then((response) => {
      console.log(response.data);
      setPatient(response.data);
      setPatientAllergies(response.data.allergies)
     })
    .catch((error)=>{
       console.log(error);
    });
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
                            className="img-fluid rounded mb-4 mb-lg-0"
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
                        <Descriptions.Item label="Vardas" span={2}>{patient.name}</Descriptions.Item>
                        <Descriptions.Item label="Pavardė" span={2}>{patient.surname}</Descriptions.Item>
                        <Descriptions.Item label="Asmens kodas" span={2}>{patient.personal_code}</Descriptions.Item>
                        <Descriptions.Item label="Gimimo data" span={2}>{patient.birthday ? patient.birthday : '-'}</Descriptions.Item>
                        <Descriptions.Item label="Telefono nr." span={2}>{patient.phone_number}</Descriptions.Item>
                        <Descriptions.Item label="Gydosi iki" span={2}>{patient.termination_date ? patient.termination_date : '-'}</Descriptions.Item>
                        <Descriptions.Item label="Ūgis(cm)">{patient.height ? patient.height : '-'}</Descriptions.Item>
                        <Descriptions.Item label="Svoris(kg)">{patient.weight ? patient.weight : '-'}</Descriptions.Item>
                    </Descriptions>
                    </Card>
                    <Divider></Divider>
                    <Card
                    actions={[
                        <Link style={{fontSize: '125%' }} to={'#'} onClick={() => {setVisiblePatientAllergies(true);}} ><PlusCircleOutlined style={{ color: "#87d068" }}/> Pridėti alergiją</Link>,
                        ]}>
                    <Descriptions title="Alergijos" bordered></Descriptions>
                    <Table  columns={COLUMNS} 
                        dataSource={patient.allergies}
                        size="middle" 
                        rowKey={record => record.allergy_id} 
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
            <AddPatientAllergiesModal
                visible={visible_patient_allergies}
                onCreate={onAddAllergies}
                onCancel={() => {
                setVisiblePatientAllergies(false);
                }}
                allergies={filtered_allergies}
            />
            </Row>
            </Form>
            </Card>
            );
};

export default PatientDetail;