import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosApi';


const AddPatient = () => {

    let navigate = useNavigate();


    const [old_password, setOldPassword] = useState(null)
    const [new_password, setNewPassword] = useState(null)


    const changePassword = async () => {
        let state = {
            old_password : old_password,
            new_password : new_password
        }

        await axios({
          method: 'put',
          url:'api/change_password',
          data: JSON.stringify(state)
        }).then(response=>{
          console.log(response.data);
          localStorage.clear();
          navigate('/')
        })
    }
   
    return (
        <div className="container">
            <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Slaptažodžio keitimas</h2>

          <div className="form-group">
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Įveskite dabartinį slaptažodį"
              name="old_password"
              value={old_password}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
         
          <div className="form-group">
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Įveskite naują slaptažodį"
              name="new_password"
              value={new_password}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-block" onClick={changePassword}>Keisti slaptažodį</button>
       
      </div>
    </div>
        </div>
    );
};

export default AddPatient;