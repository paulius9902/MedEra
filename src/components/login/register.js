import React, { useState, useEffect} from 'react';
import { Modal, Form, Input, Card, Typography, Row, Col, Avatar, InputNumber, Tooltip} from "antd";
import axios from '../../axiosApi';
import { UserOutlined, InfoCircleOutlined} from "@ant-design/icons";

const Register = ({ visible, onCreate, onCancel }) => {
  const { Title } = Typography;
  const [patients, setPatients] = useState([]);
  const [emails, setEmails] = useState([]);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();
  const [personal_code, setPersonalCode] = useState("");
  const [email, setEmail] = useState("");
  const [patient_id, setPatientID] = useState(null);

  function validatePersonalCode(personal_code) {
    var data = patients.find((patient) => 
        patient.personal_code.indexOf(personal_code) > -1)
    console.log(data)
    if (data) {
      setPatientID(data.patient_id)
      console.log(patient_id)
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
  
    return {
      validateStatus: 'error',
      errorMsg: 'Pacientas su tokiu asmens kodu nerastas!',
    };
  }

  function validateEmail(email_val) {
      console.log(email_val)
    var data = emails.find((email) => 
                   email.email === email_val)

    if (!data) {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
  
    return {
      validateStatus: 'error',
      errorMsg: 'Toks el. paštas jau naudojamas!',
    };
  }

  useEffect(() => {
    loadPatients();
    loadEmails();
  }, []);

  const onPersonalCodeChange = (value) => {
    setPersonalCode({ ...validatePersonalCode(value), value });
  };

  const onEmailChange = (value) => {
      console.log(value)
    setEmail({ ...validateEmail(value), value });
  };

  const loadPatients = async () => {
    const result = await axios.get("api/patient_reg");
    setPatients(result.data.reverse());
  };

  const loadEmails = async () => {
    const result = await axios.get("api/user_reg");
    setEmails(result.data.reverse());
  };

  return (
    <Modal visible={visible} 
            title={<Title level={4}>Registracija</Title>} 
            okText="Registruotis"
            cancelText="Atšaukti" 
            onCancel={onCancel}
            onOk={() => {
              form
                .validateFields()
                .then((values) => {
                  values.patient=patient_id
                  form.resetFields();
                  console.log(values)
                  setConfirmLoading(true);
                  setTimeout(() => {
                    onCreate(values);
                    setConfirmLoading(false);
                  }, 500);
                  
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                });
            }}
            centered
            style={{ height: "80%" }}
            bodyStyle={{ height: "100%", overflowY: "auto", padding: 0 }}
            width={600}
            confirmLoading={confirmLoading}
            mask={true}
            maskClosable={false}
            destroyOnClose={true}>
              <Card bordered={false} size="small" style={{ padding: 15 }}>
      <Form form={form} layout="vertical">
      <Row>
            
            <Col span={6}>
              <Avatar shape="square" size={100} icon={<UserOutlined />} />
            </Col>
            <Col span={18}>
      <Form.Item name="email" label="El. paštas:"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Įveskite korektišką el. paštą!",
                      },
                      {
                        validator(_, value) {
                          if (email.errorMsg === null && personal_code.errorMsg === null) {
                            return Promise.resolve();
                          }
                          return Promise.reject();
                        },
                      },
                    ]}
                    validateStatus={email.validateStatus}
                    help={email.errorMsg}>
          <Input
                onChange={e => onEmailChange(e.target.value)}
                placeholder="El. paštas"
                addonBefore={
                  <Tooltip title="Įveskite asmeninį elektroninį paštą, kurį naudosite prisijungiant">
                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
            />
        </Form.Item>
        <Form.Item name="password" label="Slaptažodis:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite slaptažodį!"
                      },
                      { 
                          min: 8, 
                          message: 'Slaptažodį turi sudaryti bent 8 simboliai!' },
                    ]}>
           <Input
              type="password"
              placeholder="Slaptažodis"
              addonBefore={
                <Tooltip title="Įveskite slaptažodį, kuris būtų ne tik gerai prisimenamas, bet ir sunkiai atspėjamas">
                  <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }
            />
        </Form.Item>
        <Form.Item  name="personal_code" label="Asmens kodas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite asmens kodą!"
                      },
                    ]}
                    validateStatus={personal_code.validateStatus}
                    help={personal_code.errorMsg}>
           <InputNumber
              min={10000000000}
              max={99999999999}
              style={{
                width: '100%',
              }}
              type="number"
              placeholder="Asmens kodas"
              onChange={onPersonalCodeChange}
              addonBefore={
                <Tooltip title="Jei esate užsienio pilietis ir neturite asmens kodo, susisiekite su mumis el. paštu mederasite@gmail.com ir mes sukursime jums paskyrą">
                  <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }
            />
        </Form.Item>
        </Col>
          </Row>
      </Form>
      </Card>
    </Modal>
  );
};

export default Register;