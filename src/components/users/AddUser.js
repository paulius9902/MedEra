import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosApi';


const AddUser = () => {

    let navigate = useNavigate();

    const [email, setEmail] = useState(null)
    const [is_superuser, setIsSuperuser] = React.useState(true)
    const [is_doctor, setIsDoctor] = React.useState(true)
    const [is_patient, setIsPatient] = React.useState(true)
    const [password, setPassword] = useState(null)


    const addNewUser = async () => {
        let state = {
            email : email,
            is_superuser : is_superuser,
            is_doctor : is_doctor,
            is_patient : is_patient,
            password : password


        }

        await axios({
          method: 'post',
          url:'api/user',
          data: JSON.stringify(state)
        }).then(response=>{
          console.log(response.data);
          navigate('/')
        })
    }
   
    return (
        <div className="container">
            <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Pridėti naują vartotoją</h2>
            
            <div className="form-group">
                <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Įveskite el. paštą"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <input type="checkbox"
                    defaultChecked={is_superuser}
                    onChange={() => setIsSuperuser(!is_superuser)}
                />
                Administratorius
            </div>
            <div>
                <input type="checkbox"
                    defaultChecked={is_doctor}
                    onChange={() => setIsDoctor(!is_doctor)}
                />
                Gydytojas
            </div>
            <div>
                <input type="checkbox"
                    defaultChecked={is_patient}
                    onChange={() => setIsPatient(!is_patient)}
                />
                Pacientas
            </div>
            <div className="form-group">
                <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Įveskite slaptažodį"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
          <button className="btn btn-primary btn-block" onClick={addNewUser}>Pridėti vartotoją</button>
       
      </div>
    </div>
        </div>
    );
};

export default AddUser;