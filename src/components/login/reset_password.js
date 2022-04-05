import React, {useState} from 'react';
import { useParams} from 'react-router';
import "antd/dist/antd.css";
import axiosInstance from '../../axiosApi'
import "./login.css";
import { Form, Input, Button, notification} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import 'antd/dist/antd.css'; 
import ResetCompleteModal from './resetCompleteModal';

const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const [error, setError] = useState('');
  const [visible_reset_complete, setVisibleResetComplete] = useState(false);

  const onFinish = (values) => {
    values.uidb64=uidb64;
    values.token=token;
    console.log(values);
    axiosInstance.patch('api/password_reset_complete', values, {crossDomain: true})
    .then((res) => {
      console.log(res);
      notification.success({ message: 'Sėkmingai pakeitėte slaptažodį!'});
    })
    .catch(error => {
      if(error.response) { 
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
        <div className="login-form-container">
          <h1>Slaptažodžio keitimas</h1>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Įveskite slaptažodį!"
              },
              { 
                min: 8, 
                message: 'Slaptažodį turi sudaryti bent 8 simboliai!' 
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Slaptažodis"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password_repeat"
            rules={[
              {
                required: true,
                message: "Pakartokite slaptažodį!"
              },
              { 
                min: 8, 
                message: 'Slaptažodį turi sudaryti bent 8 simboliai!' 
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Pakartokite slaptažodį!"
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
              Patvirtinti
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
    <ResetCompleteModal
        visible={visible_reset_complete}
      />
    </div>
  );
};

export default ResetCompleteModal;
