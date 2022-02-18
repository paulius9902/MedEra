import axios from '../../axiosApi';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

const ShowVisits = () => {

  const [visits, setVisits] = useState([])

  const fetchVisits = async () => {
      const result = await axios.get('api/visit');

      console.log(result.data)
      setVisits(result.data)
  }

  const deleteVisit = async (id) => {
    await axios.delete(`api/visit/${id}`)
    window.location.reload(false);
}

  useEffect(() => {
      fetchVisits();
  }, [])

    return (

        <div>
          <h1>Vizitai</h1>
          <Link className="btn btn-primary mr-2" to={`/visit/create`}>Sukurti naują vizitą</Link>
          <table className="table table-stripped">
          <thead>
              <tr>
              <th>ID</th>
              <th>Gydytojas</th>
              <th>Pacientas</th>
              <th>Vizito laikas</th>
              <th>Veiksmas</th>
              </tr>
          </thead>
          <tbody>
          {visits.map((visit, index) => { 
                  return (
                    <tr>
                      <th scope="row">{visit.visit_id}</th>
                      <td>{visit.doctor.name} {visit.doctor.surname}</td>
                      <td>{visit.patient.name} {visit.patient.surname}</td>
                      <td>{visit.start_date}</td>
                      <td>
                        <Link className="btn btn-primary mr-2" to={`/visit/${visit.visit_id}`} >Detaliau &nbsp;</Link>
                        <Link className="btn btn-danger" to="/visit" onClick={() => deleteVisit(visit.visit_id)}>Ištrinti &nbsp;</Link>
                      </td>
                    </tr>
                  );

                })}
          </tbody>
          </table>
        </div>
    );
};

export default ShowVisits;