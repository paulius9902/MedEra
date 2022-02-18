import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosApi';
import Select from 'react-select';
import Datetime from "react-datetime";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import lt from "date-fns/locale/lt"; // the locale you want


const AddDoctor = () => {

    let navigate = useNavigate();

    const [start_date, setStartDate] = useState(setHours(setMinutes(new Date(), 0), 12))

    const [doctors, setDoctors] = useState([]);
    const [doctor_id, setDoctorID] = useState(null)

    const [patients, setPatients] = useState([]);
    const [patient_id, setPatientID] = useState(null)

    const addNewVisit = async () => {
        let state = {
            start_date : new Date(start_date.getTime() - start_date.getTimezoneOffset() * 60000),
            doctor : doctor_id,
            patient : patient_id
        }
        console.log(start_date)
        await axios({
          method: 'post',
          url:'api/visit',
          data: JSON.stringify(state)
        }).then(response=>{
          console.log(response.data);
          navigate('/patient')
        })
    }

    useEffect(() => {
      loadDoctors();
      loadPatients();
    }, []);
  
    const loadDoctors = async () => {
      const result = await axios.get("api/doctor");
      setDoctors(result.data.reverse());
    };

    const loadPatients = async () => {
        const result = await axios.get("api/patient");
        setPatients(result.data.reverse());
      };
   
    return (
        <div className="container">
            <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Pridėti vizitą</h2>

          <div className="form-group">
            <h5>Pasirinkite laiką: </h5>
              <DatePicker
                className="form-control form-control-lg" 
                placeholder="Pasirinkite laiką"
                selected={start_date}
                onChange={date => setStartDate(date)}
                showTimeSelect
                timeIntervals={30}
                dateFormat="yyyy-MM-dd HH:mm"
                timeFormat="HH:mm"
                timeCaption="Laikas:"
                locale={lt}/>
          </div>
          

          <div className="form-group">
            <h5>Pasirinkite gydytoją: </h5>
            <select  onChange={(e) => setDoctorID(e.target.value)} name="stateName" className="form-control form-control-lg" placeholder="Pasirinkite gydytoją" defaultValue={'DEFAULT'}>
            <option value="DEFAULT" disabled>...</option>
              {doctors.map((doctor, index) => (
                <option value={doctor.doctor_id}>{doctor.name + " " + doctor.surname}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <h5>Pasirinkite pacientą: </h5>
            <select  onChange={(e) => setPatientID(e.target.value)} name="stateName" className="form-control form-control-lg" placeholder="Pasirinkite pacientą" defaultValue={'DEFAULT'}>
            <option value="DEFAULT" disabled>...</option>
              {patients.map((patient, index) => (
                <option value={patient.patient_id}>{patient.name + " " + patient.surname}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary btn-block" onClick={addNewVisit}>Pridėti vizitą</button>
       
      </div>
    </div>
        </div>
    );
};

export default AddDoctor;