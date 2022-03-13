import axios from '../../axiosApi';
import React, {useState, useEffect, Fragment} from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Card, Row } from 'react-bootstrap';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined} from '@ant-design/icons';
import {Button, Space, notification} from 'antd';
import UpdatePatientModal from './UpdatePatientModal';

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
    <div class="container">
        <div class="row align-items-center my-5">
            
            <div class="col-lg-6">
            <Card>
                <img
                    class="img-fluid rounded mb-4 mb-lg-0"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/2048px-User_font_awesome.svg.png"
                    alt=""
                />
                </Card>
            </div>
            <div class="col-lg-6">
                <Card>
                    <h1 class="font-weight-light">Paciento duomenys:</h1>
                    <div className="patient-detail">
                            <p>Vardas: {patient.name}</p>
                            <p>Pavardė: {patient.surname}</p>
                            <p>Gimimo data: {patient.birthday}</p>
                        </div> 
                        <Button size='large' onClick={() => {setVisibleVisit(true);}} style={{float: 'right', background: '#6c757d', color: 'white', borderColor: 'white'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti diagnozę</Button>
                        <Button size='large' onClick={() => {setVisibleVisit(true);}} style={{float: 'right', background: '#6c757d', color: 'white', borderColor: 'white'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti lab. tyrimą</Button>
                        <Button size='large' onClick={() => {setVisibleVisit(true);}} style={{float: 'right', background: '#6c757d', color: 'white', borderColor: 'white'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti receptą</Button>
                        <br/>
                        <Link className="btn btn-primary" onClick={() => {setVisiblePatient(true);}} to="#"><EditOutlined style={{fontSize: '125%'}}/> Atnaujinti</Link>
                        <Link className="btn btn-danger" to="/patient" onClick={() => deletePatient(patient.patient_id)}><DeleteOutlined style={{fontSize: '125%'}}/> Ištrinti</Link>
                    </Card>
                </div>
            </div>
            <UpdatePatientModal
                visible={visible_patient}
                onCreate={onUpdate}
                onCancel={() => {
                setVisiblePatient(false);
                }}
            />
            </div>
            );
};

export default PatientDetail;