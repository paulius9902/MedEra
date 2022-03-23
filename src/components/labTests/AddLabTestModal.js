import React, { useState, useEffect} from 'react';
import ReactDOM from "react-dom";
import { Button, Modal, Form, Input, Radio, Select, Card, Typography, InputNumber, Row, Col } from "antd";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import lt from "date-fns/locale/lt";
import axios from '../../axiosApi';
const { Option } = Select;
const AddLaboratoryTestModal = ({ visible, onCreate, onCancel }) => {
  const { Title } = Typography;
  const [patients, setPatients] = useState([]);
  const [patient, setPatientID] = useState(null)
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const result = await axios.get("api/patient");
    setPatients(result.data.reverse());
  };
  return (
    <Modal visible={visible} 
            title={<Title level={4}>Pridėti lab. tyrimą</Title>} 
            okText="Sukurti"
            cancelText="Atšaukti" 
            onCancel={onCancel}
            onOk={() => {
              form
                .validateFields()
                .then((values) => {
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
      <Form.Item name="patient" label="Pacientas:"
                    rules={[
                      {
                        required: true,
                        message: "Pasirinkite pacientą"
                      }
                    ]}>
          <Select onChange={patient => setPatientID(patient)} >
            {patients.map((patient, index) => (
                <Option key={index} value={patient.patient_id}>{patient.name + " " + patient.surname + "  |  " + patient.birthday}</Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="name" label="Pavadinimas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite pavadinimą!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
        <Form.Item name="value_text" label="Tyrimas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite tyrimą!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
        <Form.Item name="value_numeric" label="Tyrimo reikšmė:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite tyrimo reikšmę!"
                      }
                    ]}>
          <InputNumber
            min="0"
            step="0.01"
            stringMode
            style={{width: '100%',}}
          />
        </Form.Item>
      </Form>
      </Card>
    </Modal>
  );
};

export default AddLaboratoryTestModal;