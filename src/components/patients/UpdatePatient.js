import axios from '../../axiosApi';
import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdatePatient = () => {

    let navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState(null)
    const [surname, setSurname] = useState(null)
    const [birth_date, setBirthDate] = useState(null)


    useEffect(() => {
        loadPatients();
    }, [])


   let loadPatients = async () => {
    const result = await axios.get(`api/patient/${id}`);
    console.log(result.data.name);

    setName(result.data.name);
    setSurname(result.data.surname);
    setBirthDate(result.data.birth_date);
   }


   const updateSinglePatient = async () => {
        let state = {
            name : name,
            surname : surname,
            birth_date : birth_date
        }

        await axios({
            method: 'PATCH',
            url: `api/patient/${id}`,
            data: JSON.stringify(state)
        }).then(response => {
            console.log(response.data);
            navigate("/");
        })
    }
    return (
       
        <div className="container">
  <div className="w-75 mx-auto shadow p-5">
    <h2 className="text-center mb-4">Atnaujinti paciento duomenis</h2>
      <div className="form-group">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Įveskite vardą: "
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
     
      <div className="form-group">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Įveskite pavardę:"
          name="surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="date"
          className="form-control form-control-lg"
          placeholder="Įveskite gimimo datą:"
          name="birth_date"
          value={birth_date}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>
      <button onClick={updateSinglePatient} className="btn btn-primary btn-block">Atnaujinti</button>
   
  </div>
</div>
 
    );
};

export default UpdatePatient;