import React, {useState} from 'react';
import "antd/dist/antd.css";
import axiosInstance from '../../axiosApi'
import "./login.css";
import { Form, Input, Button, notification} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import 'antd/dist/antd.css'; 
import Register from './register';
import ResetPasswordEmail from './resetPasswordEmail';
import { Link } from 'react-router-dom';

const NormalLoginForm = () => {
  const [error, setError] = useState('');
  const [visible_register, setVisibleRegister] = useState(false);
  const [visible_reset, setVisibleReset] = useState(false);
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
      })
      .then(() => {
        if (localStorage.getItem('patient_id')!=='null')
        {
          axiosInstance.get(`api/patient/${localStorage.getItem('patient_id')}`)
          .then((res) => {
            console.log(res.data)
            const patientName = res.data.name;
            const patientSurname = res.data.surname;
            localStorage.setItem('patient', patientName + " " + patientSurname)
          })
          .then(() =>{
            window.location = "/";
          })
        }
        else if (localStorage.getItem('doctor_id')!=='null'){
          axiosInstance.get(`api/doctor/${localStorage.getItem('doctor_id')}`)
          .then((res) => {
            console.log(res.data)
            const doctorName = res.data.name;
            const doctorSurname = res.data.surname;
            localStorage.setItem('doctor', doctorName + " " +doctorSurname)
          })
          .then(() =>{
            window.location = "/";
          })
        }
        else
        {
          window.location = "/";
        }
      })
    })
    .catch(error => {
      if(error.response) { 
        const errm = "Neteisingas el. paštas arba slaptažodis";
        setError(errm)
        console.log(error.response.data)
      }
    });
  };

  const onCreate = async(values) => {
    console.log(values);
    values.is_superuser=false
    values.is_doctor=false
    values.is_patient=true
    await axiosInstance.post(`api/user`, values).then(response=>{
      console.log(response.data);
      notification.success({ message: 'Sėkmingai prisiregistravote!' });
    })
    setVisibleRegister(false);
  };

  const onReset = async(values) => {
    console.log(values);
    await axiosInstance.post(`api/reset_email_request`, values).then(response=>{
      console.log(response.data);
      notification.success({ message: 'Laiškas išsiųstas!' });
    })
    setVisibleReset(false);
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
        <div className="left-background ">
                <h1 className="white-text">MedEra</h1>
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
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
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
                    <Link to={"#"} onClick={() => {setVisibleReset(true);}}>Užmiršote slaptažodį?</Link>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Link to={"#"} onClick={() => {setVisibleRegister(true);}}>Registracija</Link>
          </div>
        </div>
      </Form>
    </div>
    <Register
        visible={visible_register}
        onCreate={onCreate}
        onCancel={() => {
          setVisibleRegister(false);
        }}
      />
    <ResetPasswordEmail
        visible={visible_reset}
        onReset={onReset}
        onCancel={() => {
          setVisibleReset(false);
        }}
      />
    </div>
  );
};

export default NormalLoginForm;
