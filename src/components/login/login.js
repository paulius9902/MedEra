import React, {useState, useEffect, Fragment} from 'react';
import "antd/dist/antd.css";
import axiosInstance from '../../axiosApi'
import "./login.css";
import { Form, Input, Button, Checkbox, Badge } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import 'antd/dist/antd.css'; 
//import poto from "./poto.png";
//import logo from "./logo.png";
const NormalLoginForm = () => {
  const [error, setError] = useState('');
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    axiosInstance.post('api/token', values, {crossDomain: true})
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        localStorage.setItem('access_token', res.data.access);
				localStorage.setItem('refresh_token', res.data.refresh);
				axiosInstance.defaults.headers['Authorization'] =
					'JWT ' + localStorage.getItem('access_token');
      }
    }).then(() => {
      axiosInstance.get('api/info')
      .then((res) => {
        const isSuperUser = res.data.is_superuser;
        const isDoctor = res.data.is_doctor;
        const isPatient = res.data.is_patient;
        const userID = res.data.id;
        const patientID = res.data.patient;
        const doctorID = res.data.doctor;
        localStorage.setItem('is_superuser', isSuperUser)
        localStorage.setItem('is_doctor', isDoctor)
        localStorage.setItem('is_patient', isPatient)
        localStorage.setItem('user_id', userID)
        localStorage.setItem('patient_id', patientID)
        localStorage.setItem('doctor_id', doctorID)

        window.location = "/";
      })
    }).catch(error => {
      if(error.response) { 
        const errm = "Neteisingas el. paštas arba slaptažodis";
        setError(errm)
        console.log(error.response.data)
      }
    });
  };

  return (
    <div className="background">
    <div className="container">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
      >
        <div class="left-background ">
                <h1 class="white-text">MedEra</h1>
                <p>Prisijunkite prie savo asmeninės MedEra paskyros</p>
        </div>
        <div className="login-form-container">
          <h1>Prisijungimas</h1>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Įveskite elektroninį paštą!"
              }
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="El. paštas"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Įveskite slaptažodį!"
              }
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Slaptažodis"
              size="large"
            />
          </Form.Item>
          <div style={{color:'red', paddingBottom:'10px'}}>{error}</div>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
            >
              Prisijungti
            </Button>
          </Form.Item>
          <div style={{ marginTop: 8 }}>
                    <a href="/">Užmiršote slaptažodį?</a>
                  </div>
                  <div style={{ marginTop: 8 }}>
                  <a href="/">Neturite paskyros?</a>
          </div>
        </div>
      </Form>
    </div>
    </div>
  );
};

export default NormalLoginForm;
