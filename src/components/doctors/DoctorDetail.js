import axios from '../../axiosApi';
import React, {useState, useEffect, Fragment} from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const DoctorDetail = () => {

const [doctor, setDoctors] = useState([])
const [work_hours, setWorkHours] = useState([])

const {id} = useParams();
const navigate = useNavigate();

const isSuperUser = localStorage.getItem('is_superuser');


useEffect(() => {
    getSingleDoctor();
    getWorkHours();
},[])


const getSingleDoctor = async () => {
  const  { data } = await axios.get(`api/doctor/${id}`)
  console.log(data);
  setDoctors(data);
}

const getWorkHours = async () => {
    const  { data } = await axios.get(`api/doctor/${id}/work_hours`)
    console.log(data);
    setWorkHours(data);
  }

const deleteUser = async (id) => {
    await axios.delete(`api/doctor/${id}`)
    navigate('/')
}
        return (
            <Fragment>
            <div className="full-doctor-detail">
            <div class="container">
            <div class="row align-items-center my-5">
                <div class="col-lg-7">
                <img
                    class="img-fluid rounded mb-4 mb-lg-0"
                    src="https://cdn.pixabay.com/photo/2021/09/17/21/43/doctor-6633763_960_720.png"
                    alt=""
                />
                </div>
                <div class="col-lg-5">
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
                </div>
                <Link className="btn btn-outline-primary mr-2" to={`/doctor/${doctor.doctor_id}/update`}>Atnaujinti</Link>
                <Link className="btn btn-danger" to="/doctor" onClick={() => deleteUser(doctor.doctor_id)}>Ištrinti</Link>
                
            </div>
            </div>
            </div>
            </Fragment>
            );
};

export default DoctorDetail;