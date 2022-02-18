import axios from '../../axiosApi';
import React, {useState, useEffect} from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
    Grid
} from '@material-ui/core/';

const ShowPatients = () => {

    const [patients, setPatients] = useState([])

    const fetchPatients = async () => {
        const result = await axios.get('api/patient');

        console.log(result.data)
        setPatients(result.data)
    }

    useEffect(() => {
        fetchPatients();
    }, [])

    const goToDetail = () => {
        alert("detail page")
    }

    return (
        <div>
            <h1>Pacientai</h1>
            <Link className="btn btn-primary mr-2" to={`/patient/create`}>Sukurti naują</Link>
            <div className="main-patients-show">
            <Grid
                container
                spacing={2}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
            {
                patients.map((patient, index) => (
                    <Grid item xs={12} sm={6} md={3} key={patients.indexOf(index)}>
                    <Card>

                    <Card.Img variant="top" src="https://cdn.pixabay.com/photo/2021/02/06/09/03/man-5987447_960_720.jpg" />

                    <Card.Body>
                        <Card.Title>{patient.name} {patient.surname}</Card.Title>
                        <Card.Text> {patient.birth_date} </Card.Text>
                        <Card.Text> {patient.phone} </Card.Text>
                        <Card.Text> {patient.address} </Card.Text>
                        <Link className="btn btn-primary mr-2" to={`/patient/${patient.patient_id}`}>Detaliau</Link>
                    </Card.Body>
                    </Card>
                    </Grid>
                ))

            }
            </Grid>
            </div>
           
            
        </div>
    );
};

export default ShowPatients;