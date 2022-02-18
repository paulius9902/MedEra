import axios from '../../axiosApi';
import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const PatientDetail = () => {

const [patient, setSetudent] = useState([])

const {id} = useParams();
const navigate = useNavigate();

useEffect(() => {
    getSinglePatient();
},[])


const getSinglePatient = async () => {
  const  { data } = await axios.get(`api/patient/${id}`)
  console.log(data);
  setSetudent(data);
}

const deleteUser = async (id) => {
    await axios.delete(`api/patient/${id}`)
    navigate('/')
}



    return (
        <div className="full-patient-detail">
        <div class="container">
        <div class="row align-items-center my-5">
            <div class="col-lg-7">
            <img
                class="img-fluid rounded mb-4 mb-lg-0"
                src="https://cdn.pixabay.com/photo/2021/02/06/09/03/man-5987447_960_720.jpg"
                alt=""
            />
            </div>
            <div class="col-lg-5">
            <h1 class="font-weight-light">Paciento duomenys:</h1>
            <div className="patient-detail">
                    <p>Vardas: {patient.name}</p>
                    <p>Pavardė: {patient.surname}</p>
                    <p>Gimimo data: {patient.birth_date}</p>
                </div> 
            </div>
            <Link className="btn btn-outline-primary mr-2" to={`/patient/${patient.patient_id}/update`}>Atnaujinti</Link>
            <Link className="btn btn-danger" to="/patient" onClick={() => deleteUser(patient.patient_id)}>Ištrinti</Link>
        </div>
        </div>
        </div>
    );
};

export default PatientDetail;