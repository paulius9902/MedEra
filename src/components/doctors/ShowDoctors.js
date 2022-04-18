import axios from '../../axiosApi';
import React, {useState, useEffect} from 'react';
import {Button, Card, Row, Col, Divider, notification, Popconfirm} from 'antd';
import { Link } from 'react-router-dom';
import {PlusCircleOutlined, InfoCircleOutlined, DeleteOutlined, LoginOutlined} from '@ant-design/icons';
import AddDoctorModal from './AddDoctorModal';

const ShowDoctors = () => {
    const [doctors, setDoctors] = useState([])
    const [visible, setVisible] = useState(false);

    const onCreate = async(values) => {
        values.birthday = values.birthday.toISOString().split('T')[0]
        console.log(values);
        console.log(new Date(values.birthday))
        console.log(new Date(new Date().setFullYear(new Date().getFullYear() + 50)))
        if (values.gender==='V' && new Date(values.birthday) > new Date(new Date().setFullYear(new Date().getFullYear() - 50)))
        {
            values.image="https://www.shareicon.net/data/256x256/2016/08/18/813850_people_512x512.png"
        }
        else if (values.gender==='V' && new Date(values.birthday) <= new Date(new Date().setFullYear(new Date().getFullYear() - 50)))
        {
            values.image="https://www.shareicon.net/data/256x256/2016/08/18/813844_people_512x512.png"
        }
        else if (values.gender==='M' && new Date(values.birthday) > new Date(new Date().setFullYear(new Date().getFullYear() - 50)))
        {
            values.image="https://www.shareicon.net/data/256x256/2016/09/01/822733_user_512x512.png"
        }
        else if (values.gender==='M' && new Date(values.birthday) <= new Date(new Date().setFullYear(new Date().getFullYear() - 50)))
        {
            values.image="https://www.shareicon.net/data/256x256/2016/08/18/813847_people_512x512.png"
        }
        values.full_name = values.name + ' ' + values.surname
        await axios.post(`api/doctor`, values).then(response=>{
          console.log(response.data);
          fetchDoctors();
          notification.success({ message: 'Sėkmingai pridėta!' });
        })
        setVisible(false);
    };

    const deleteDoctor = async (id) => {
        try {
          await axios.delete(`api/doctor/${id}`);
          fetchDoctors();
          notification.success({ message: 'Sėkmingai ištrinta!' });
        } catch (error) {
          console.error(error);
        }
    };
    
    const fetchDoctors = async () => {
        const result = await axios.get('api/doctor');
        console.log(result.data)
        setDoctors(result.data)
    }

    const confirmHandler = id => {
        deleteDoctor(id);
      };

    useEffect(() => {
        fetchDoctors();
    }, [])

    return (
        <div>
            <h1>Gydytojai</h1>
            {localStorage.getItem('is_superuser') === 'true' &&
            <React.Fragment>
            <Divider style={{'background-color':"#08c"}}/>
            <Button className="mr-2 mb-3" size='large' onClick={() => {setVisible(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti gydytoją</Button>
            </React.Fragment>}
            <Divider style={{'background-color':"#08c"}}/>
            <div className="main-doctors-show">
            <Row gutter={[70, 24]} span={4}>
            {
                doctors.map((doctor, index) => (
                    <Col>
                    
                    <Card
                        cover={
                        <img
                            src={doctor.image}
                            alt=""
                        />
                        }
                        actions={[
                        localStorage.getItem('is_superuser') === 'true' &&
                        <Popconfirm
                            placement='topLeft'
                            title='Ar tikrai norite ištrinti?'
                            okText='Taip'
                            cancelText='Ne'
                            onConfirm={() => confirmHandler(doctor.doctor_id)}
                            >
                            <DeleteOutlined key="delete" style={{fontSize: '150%', color: '#ff4d4f'}}/>
                        </Popconfirm>,
                        <Link style={{fontSize: '125%', color: '#08c'}} to={`/doctor/${doctor.doctor_id}`}>Plačiau <LoginOutlined key="info" /></Link>,
                        ]}
                    >
                        <h2>{doctor.name} {doctor.surname}</h2>
                        <p style={{fontSize:14}}>{doctor.specialization}</p>
                    </Card>
                    </Col>
                ))
            }
            </Row>
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