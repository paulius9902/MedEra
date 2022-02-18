import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosApi';


const AddPatient = () => {

    let navigate = useNavigate();


    const [name, setName] = useState(null)
    const [surname, setSurname] = useState(null)
    const [birth_date, setBirthDate] = useState(null)


    const addNewPatient = async () => {
        let state = {
            name : name,
            surname : surname,
            birth_date : birth_date
        }

        await axios({
          method: 'post',
          url:'api/patient',
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
        <h2 className="text-center mb-4">Pridėti pacientą</h2>

          <div className="form-group">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Įveskite vardą"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
         
          <div className="form-group">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Įveskite pavardę"
              name="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="date"
              className="form-control form-control-lg"
              placeholder="Įveskite gimimo datą"
              name="birth_date"
              value={birth_date}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-block" onClick={addNewPatient}>Pridėti pacientą</button>
       
      </div>
    </div>
        </div>
    );
};

export default AddPatient;