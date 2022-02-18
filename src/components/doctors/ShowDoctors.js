import axios from '../../axiosApi';
import React, {useState, useEffect} from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
    Grid
} from '@material-ui/core/';

const ShowDoctors = () => {

    const [doctors, setDoctors] = useState([])

    const fetchDoctors = async () => {
        const result = await axios.get('api/doctor');

        console.log(result.data)
        setDoctors(result.data)
    }

    useEffect(() => {
        fetchDoctors();
    }, [])

    const goToDetail = () => {
        alert("detail page")
    }

    return (
        <div>
            <h1>Gydytojai</h1>
            <Link className="btn btn-primary mr-2" to={`/doctor/create`}>Sukurti naują</Link>
            <div className="main-doctors-show">
            <Grid
                container
                spacing={2}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
            {
                doctors.map((doctor, index) => (
                    <Grid item xs={12} sm={6} md={3} key={doctors.indexOf(index)}>
                    <Card>

                    <Card.Img variant="top" src="https://cdn.pixabay.com/photo/2021/09/17/21/43/doctor-6633763_960_720.png" />

                    <Card.Body>
                        <Card.Title>{doctor.name} {doctor.surname}</Card.Title>
                        <Card.Text> {doctor.birth_date} </Card.Text>
                        <Card.Text> {doctor.phone} </Card.Text>
                        <Card.Text> {doctor.address} </Card.Text>
                        <Link className="btn btn-primary mr-2" to={`/doctor/${doctor.doctor_id}`}>Detaliau</Link>
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

export default ShowDoctors;