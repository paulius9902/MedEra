import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosApi';
import Select from 'react-select';


const AddDoctor = () => {

    let navigate = useNavigate();


    const [name, setName] = useState(null)
    const [surname, setSurname] = useState(null)
    const [birth_date, setBirthDate] = useState(null)
    const [users, setUser] = useState([]);
    const [user_id, setUserID] = useState(null)

    const addNewDoctor = async () => {
        let state = {
            name : name,
            surname : surname,
            birth_date : birth_date,
            user : user_id
        }

        await axios({
          method: 'post',
          url:'api/doctor',
          data: JSON.stringify(state)
        }).then(response=>{
          console.log(response.data);
          navigate('/')
        })
    }

    useEffect(() => {
      loadUsers();
    }, []);
  
    const loadUsers = async () => {
      const result = await axios.get("api/user");
      setUser(result.data.reverse());
    };
   
    return (
        <div className="container">
            <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Pridėti gydytoją</h2>

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
            <h5>Įveskite gimimo datą: </h5>
            <input
              type="date"
              className="form-control form-control-lg"
              placeholder="Įveskite gimimo datą"
              name="birth_date"
              value={birth_date}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <h5>Pasirinkite vartotoją: </h5>
            <select  onChange={(e) => setUserID(e.target.value)} name="stateName" className="form-control form-control-lg" placeholder="Pasirinkite vartotoją">
              {users.map((user, index) => (
                <option value={user.id}>{user.email}</option>
              ))}
            </select>
        </div>

          <button className="btn btn-primary btn-block" onClick={addNewDoctor}>Pridėti gydytoją</button>
       
      </div>
    </div>
        </div>
    );
};

export default AddDoctor;