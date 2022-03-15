import axios from '../../axiosApi';
import React, {useState, useEffect} from 'react';
import {Button, Card, Row, Col, Divider, notification, Popconfirm} from 'antd';
import { Link } from 'react-router-dom';
import {PlusCircleOutlined, SettingOutlined, InfoCircleOutlined, DeleteOutlined} from '@ant-design/icons';
import AddDoctorModal from './AddDoctorModal';

const ShowDoctors = () => {
    const { Meta } = Card;
    const [doctors, setDoctors] = useState([])
    const [visible, setVisible] = useState(false);
    var photos = ["https://www.shareicon.net/data/256x256/2016/09/01/822733_user_512x512.png",
                "https://www.shareicon.net/data/256x256/2016/09/01/822712_user_512x512.png",
                "https://www.shareicon.net/data/256x256/2016/08/18/813846_people_512x512.png",
                "https://www.shareicon.net/data/256x256/2016/08/18/813849_people_512x512.png"];
    const onCreate = async(values) => {
        values.birthday = values.birthday.toISOString().split('T')[0]
        console.log(values);
        await axios.post(`api/doctor`, values).then(response=>{
          console.log(response.data);
          fetchDoctors();
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
            <Divider></Divider>
            <Button className="mr-2 mb-3" size='large' onClick={() => {setVisible(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti gydytoją</Button>
            <Divider></Divider>
            <div className="main-doctors-show">
            <Row gutter={[16, 24]} span={4}>
            {
                doctors.map((doctor, index) => (
                    <Col>
                    
                    <Card
                        cover={
                        <img
                            alt="example"
                            src={photos[Math.floor(Math.random()*photos.length)]}
                        />
                        }
                        actions={[
                        <Link to={`/doctor/${doctor.doctor_id}`}><InfoCircleOutlined key="info" style={{fontSize: '175%', color: '#08c'}}/></Link>,
                        <Popconfirm
                            placement='topLeft'
                            title='Ar tikrai norite ištrinti?'
                            okText='Taip'
                            cancelText='Ne'
                            onConfirm={() => confirmHandler(doctor.doctor_id)}
                            >
                            <DeleteOutlined key="delete" style={{fontSize: '175%', color: '#ff4d4f'}}/>
                        </Popconfirm>,
                        ]}
                    >
                        <h4>{doctor.name} {doctor.surname}</h4>
                        <p style={{fontSize:18}}>{doctor.specialization}</p>
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