import axios from '../../axiosApi';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

const ShowUsers = () => {

  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
      const result = await axios.get('api/user');

      console.log(result.data)
      setUsers(result.data)
  }

  const deleteUser = async (id) => {
    await axios.delete(`api/user/${id}`)
    window.location.reload(false);
}

  useEffect(() => {
      fetchUsers();
  }, [])

    return (

        <div>
          <h1>Vartotojai</h1>
          <Link className="btn btn-primary mr-2" to={`/user/create`}>Sukurti naują vartotoją</Link>
          <table className="table table-stripped">
          <thead>
              <tr>
              <th>ID</th>
              <th>Vardas</th>
              <th>El. paštas</th>
              <th>Administratorius</th>
              <th>Gydytojas</th>
              <th>Pacientas</th>
              </tr>
          </thead>
          <tbody>
          {users.map((user, index) => { 
                  return (
                    <tr>
                      <th scope="row">{user.id}</th>
                      <td>{user.first_name}</td>
                      <td>{user.email}</td>
                      <td>{String(user.is_superuser)}</td>
                      <td>{String(user.is_doctor)}</td>
                      <td>{String(user.is_patient)}</td>
                      <Link className="btn btn-danger" to="/user" onClick={() => deleteUser(user.id)}>Ištrinti</Link>
                    </tr>
                  );

                })}
          </tbody>
          </table>
        </div>
    );
};

export default ShowUsers;