import axios from '../../axiosApi';
import React, {useState, useEffect, Fragment} from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Card, Row } from 'react-bootstrap';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined} from '@ant-design/icons';
import {Button, Space, notification} from 'antd';

const DoctorDetail = () => {

const [doctor, setDoctor] = useState([])
const [doctors, setDoctors] = useState([])
const [work_hours, setWorkHours] = useState([])

const {id} = useParams();
const navigate = useNavigate();

const [visits, setVisits] = useState([]);
const [visible, setVisible] = useState(false);

const isSuperUser = localStorage.getItem('is_superuser');


useEffect(() => {
    getSingleDoctor();
    getWorkHours();
},[])


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
        window.location.reload(false);
        notification.success({ message: 'Sėkmingai ištrinta!' })
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
                    <Button size='large' onClick={() => {setVisible(true);}} style={{float: 'right', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti vizitą</Button>
                    <h1 class="font-weight-light">Gydytojo duomenys:</h1>
                    <div className="doctor-detail">
                            <p>Vardas: {doctor.name}</p>
                            <p>Pavardė: {doctor.surname}</p>
                            <p>Gimimo data: {doctor.birth_date}</p>
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
                        <Link className="btn btn-primary" to={`/doctor/${doctor.doctor_id}/update`}><EditOutlined style={{fontSize: '125%'}}/> Atnaujinti</Link>
                        <Link className="btn btn-danger" to="/doctor" onClick={() => deleteDoctor(doctor.doctor_id)}><DeleteOutlined style={{fontSize: '125%'}}/> Ištrinti</Link>
                    </Card>
                </div>
            </div>
            </div>
            
            );
};

export default DoctorDetail;