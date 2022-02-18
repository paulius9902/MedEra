import axios from '../../axiosApi';
import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const UserDetail = () => {

const [user, setUser] = useState([])
const is_superuser = localStorage.getItem('is_superuser') === 'true';

const {id} = useParams();
const navigate = useNavigate();

useEffect(() => {
    getUser();
},[])


const getUser = async () => {
  const  { data } = await axios.get(`api/info`)
  setUser(data);
  console.log(data);
}
    return (
        <div className="full-user-detail">
        <div class="container">
        <div class="row align-items-center my-5">
            <div class="col-lg-7">
            <img
                class="img-fluid rounded mb-4 mb-lg-0"
                src="https://d29fhpw069ctt2.cloudfront.net/icon/image/37746/preview.svg"
                alt=""
            />
            </div>
            <div class="col-lg-5">
            <h1 class="font-weight-light">Prisijungęs vartotojas:</h1>
            <div className="user-detail">
                    <p>Vardas: {user.first_name}</p>
                    <p>El. paštas: {user.email}</p>
                    <p>Administratorius: {String(user.is_superuser)}</p>
                    <p>Gydytojas: {String(user.is_doctor)}</p>
                    <p>Pacientas: {String(user.is_patient)}</p>
                </div> 
            </div>
            <Link className="btn btn-outline-primary mr-2" to={`/change_password/`}>Keisti slaptažodį</Link>
            
            {is_superuser &&
                <>
                    <Link className="btn btn-outline-primary mr-2" to={`/user/`}>Visi vartotojai</Link>
                    <Link className="btn btn-outline-primary mr-2" to={`/patient/`}>Pacientai</Link>
                </>
            }
        </div>
        </div>
        </div>
    );
};

export default UserDetail;