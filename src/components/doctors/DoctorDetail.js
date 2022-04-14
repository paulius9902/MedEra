import axios from '../../axiosApi';
import React, {useState, useEffect} from 'react';
import { useParams} from 'react-router';
import { Link } from 'react-router-dom';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {notification, Card, Form, Row, Col, Descriptions} from 'antd';
import UpdateDoctorModal from './UpdateDoctorModal';
import AddDoctorVisitModal from './AddDoctorVisitModal';
const DoctorDetail = () => {

const [doctor, setDoctor] = useState([])
const {id} = useParams();
const [visible_doctor, setVisibleDoctor] = useState(false);
const [visible_visit, setVisibleVisit] = useState(false);
const [visits, setVisits] = useState([]);

useEffect(() => {
    getSingleDoctor();
    getAllVisit();
},[])

const getAllVisit = async () => {
    try {
      const res = await axios.get('api/visit_dates');
      setVisits(res.data);
    } catch (error) {
      console.error(error);
    }
  };

const onUpdate = async(values) => {
    console.log(values);
    values.full_name = values.name + ' ' + values.surname
    await axios.patch(`api/doctor/${id}`, values).then(response=>{
      console.log(response.data);
      getSingleDoctor();
      notification.success({ message: 'Sėkmingai atnaujinta!' });
    })
    setVisibleDoctor(false);
};

const addVisit = async(values, form) => {
    values.status = 1
    values.start_date=new Date(Math.floor(values.start_date.getTime() - values.start_date.getTimezoneOffset() * 60000))
    values.doctor=id
    console.log(values);
    await axios.post(`api/visit`, values).then(response=>{
      console.log(response.data);
      getSingleDoctor();
      getAllVisit();
      form.resetFields();
      notification.success({ message: 'Vizitas sėkmingai pridėtas!' });
    })
    setVisibleVisit(false);
};

const getSingleDoctor = async () => {
  const  { data } = await axios.get(`api/doctor/${id}`)
  console.log(data);
  setDoctor(data);
}

return (
    <Card bordered={false} size="small" style={{ padding: 15 }}>
    <Form layout="vertical">
        <Row>
            <Col span={6}>
                <Card
                cover={
                    <img
                        src="https://www.shareicon.net/data/512x512/2016/08/18/813849_people_512x512.png"
                        alt=""
                    />
                    }
                actions={[
                    <Link style={{fontSize: '125%' }} onClick={() => {setVisibleDoctor(true);}} to="#"><EditOutlined style={{color: "#2db7f5"}}/> Atnaujinti</Link>,
                    ]}>
                </Card>
            
            </Col>
            <Col span={18}>
                <Card
                actions={[
                    <Link style={{fontSize: '150%'}} to={'#'} onClick={() => {setVisibleVisit(true);}} ><PlusCircleOutlined style={{ color: "#87d068" }}/> Pridėti vizitą</Link>,
                    ]}>
                        <Descriptions title="Gydytojo duomenys" bordered>
                            <Descriptions.Item label="Vardas" span={3}>{doctor.name}</Descriptions.Item>
                            <Descriptions.Item label="Pavardė" span={3}>{doctor.surname}</Descriptions.Item>
                            <Descriptions.Item label="Gimimo data" span={2}>{doctor.birthday ? doctor.birthday : '-'}</Descriptions.Item>
                            <Descriptions.Item label="Telefono nr." span={2}>{doctor.phone_number}</Descriptions.Item>
                        </Descriptions>
                </Card>
            </Col>
        <UpdateDoctorModal
            visible={visible_doctor}
            onCreate={onUpdate}
            onCancel={() => {
            setVisibleDoctor(false);
            }}
        />
        <AddDoctorVisitModal
            visible={visible_visit}
            onCreate={addVisit}
            onCancel={() => {
            setVisibleVisit(false)
            }}
            doctor_id = {id}
            visits = {visits}
        />
        </Row>
        </Form>
        </Card>
            );
};

export default DoctorDetail;