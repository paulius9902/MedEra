import axios from '../../axiosApi';
import React, {useState, useEffect} from 'react';
import { Card } from 'react-bootstrap';
import {Button} from 'antd';
import { Link } from 'react-router-dom';
import {
    Grid
} from '@material-ui/core/';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined} from '@ant-design/icons';
import AddDoctorModal from './AddDoctorModal';

const ShowDoctors = () => {

    const [doctors, setDoctors] = useState([])
    const [visible, setVisible] = useState(false);

    const onCreate = async(values) => {
        console.log(values);
        values.status = 1
        values.start_date=new Date(Math.floor(values.start_date.getTime() - values.start_date.getTimezoneOffset() * 60000))
    
        await axios.post(`api/visit`, values).then(response=>{
          console.log(response.data);
          fetchDoctors();
        })
        setVisible(false);
    };

    const fetchDoctors = async () => {
        const result = await axios.get('api/doctor');
        console.log(result.data)
        setDoctors(result.data)
    }

    useEffect(() => {
        fetchDoctors();
    }, [])

    return (
        <div>
            <h1>Gydytojai</h1>
            <Button className="mr-2 mb-3" size='large' onClick={() => {setVisible(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti gydytoją</Button>
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

                    <Card.Img variant="top" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/2048px-User_font_awesome.svg.png" />

                    <Card.Body>
                        <Card.Title>{doctor.name} {doctor.surname}</Card.Title>
                        <Card.Text> {doctor.specialization} </Card.Text>
                        <Link style={{ float: 'right'}} className="btn btn-primary mr-2" to={`/doctor/${doctor.doctor_id}`}><InfoCircleOutlined style={{fontSize: '125%'}}/> Detaliau</Link>
                    </Card.Body>
                    </Card>
                    </Grid>
                ))

            }
            </Grid>
            </div>
            <AddDoctorModal
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                setVisible(false);
                }}
            />
        </div>
    );
};

export default ShowDoctors;