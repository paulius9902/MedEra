import axios from '../../axiosApi';
import React, {useState, useEffect, Fragment} from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
//import { Card, Row } from 'react-bootstrap';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined} from '@ant-design/icons';
import {Button, Space, notification, Card} from 'antd';
import UpdateDoctorModal from './UpdateDoctorModal';
import AddDoctorVisitModal from './AddDoctorVisitModal';

const DoctorDetail = () => {

const [doctor, setDoctor] = useState([])
const [work_hours, setWorkHours] = useState([])
const {id} = useParams();
const [visible_doctor, setVisibleDoctor] = useState(false);
const [visible_visit, setVisibleVisit] = useState(false);

const tabList = [
    {
      key: 'tab1',
      tab: 'tab1',
    },
    {
      key: 'tab2',
      tab: 'tab2',
    },
  ];

const contentList = {
    tab1: <p>content1</p>,
    tab2: <p>content2</p>,
  };

useEffect(() => {
    getSingleDoctor();
    getWorkHours();
},[])

const onUpdate = async(values) => {
    console.log(values);
    await axios.patch(`api/doctor/${id}`, values).then(response=>{
      console.log(response.data);
      getSingleDoctor();
      notification.success({ message: 'Sėkmingai atnaujinta!' });
    })
    setVisibleDoctor(false);
};

const addVisit = async(values) => {
    values.status = 1
    values.start_date=new Date(Math.floor(values.start_date.getTime() - values.start_date.getTimezoneOffset() * 60000))
    values.doctor=id
    console.log(values);
    await axios.post(`api/visit`, values).then(response=>{
      console.log(response.data);
      getSingleDoctor();
      notification.success({ message: 'Vizitas sėkmingai pridėtas!' });
    })
    setVisibleVisit(false);
};

const getSingleDoctor = async () => {
  const  { data } = await axios.get(`api/doctor/${id}`)
  console.log(data);
  setDoctor(data);
}

const getWorkHours = async () => {
    const  { data } = await axios.get(`api/doctor/${id}/work_hours`)
    console.log(data);
    setWorkHours(data);
  }

const deleteDoctor = async (id) => {
    try {
        await axios.delete(`api/doctor/${id}`)
        notification.success({ message: 'Sėkmingai ištrinta!' });
    } catch (error) {
        console.error(error);
    }
}
return (
    <div>
        <div class="row align-items-center">
            
            <Card>
                <img
                    class="img-fluid rounded mb-4 mb-lg-0"
                    src="https://www.shareicon.net/data/256x256/2016/08/18/813849_people_512x512.png"
                    alt=""
                />
            </Card>
                <Card>
                    <Button size='large' onClick={() => {setVisibleVisit(true);}} style={{float: 'right', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti vizitą</Button>
                    <h1 class="font-weight-light">Gydytojo duomenys:</h1>
                    <div className="doctor-detail">
                            <p>Vardas: {doctor.name}</p>
                            <p>Pavardė: {doctor.surname}</p>
                            <p>Gimimo data: {doctor.birthday}</p>
                            <h1 class="font-weight-light">Darbo laikas:</h1>
                            <table className="table table-stripped">
                            <thead>
                                <tr>
                                <th>Savaitės diena</th>
                                <th>Pradžia</th>
                                <th>Pabaiga</th>
                                </tr>
                            </thead>
                            <tbody>
                            {work_hours.sort((first, second) => {
                            return first.week_day > second.week_day ? 1 : -1;
                            }).map((day, index) => {   
                                    return (
                                    <tr key="">
                                        <th scope="row">{day.week_day}</th>
                                        <td> {day.start_time}</td>
                                        <td>{day.end_time}</td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                            </table>
                        </div> 
                        <Link className="btn btn-primary" onClick={() => {setVisibleDoctor(true);}} to="#"><EditOutlined style={{fontSize: '125%'}}/> Atnaujinti</Link>
                        <Link className="btn btn-danger" to="/doctor" onClick={() => deleteDoctor(doctor.doctor_id)}><DeleteOutlined style={{fontSize: '125%'}}/> Ištrinti</Link>
                    </Card>
            </div>
            <UpdateDoctorModal
                visible={visible_doctor}
                onCreate={onUpdate}
                onCancel={() => {
                setVisibleDoctor(false);
                }}
            />
            <AddDoctorVisitModal
                visible={visible_visit}
                onCreate={addVisit}
                onCancel={() => {
                setVisibleVisit(false);
                }}
            />
            </div>
            );
};

export default DoctorDetail;