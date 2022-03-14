import React, { useState, useEffect} from 'react';
import { Button, Modal, Form, Input, Radio, Select, InputNumber } from "antd";
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axiosApi';
const AddPatientModal = ({ visible, onCreate, onCancel}) => {
  
  const { id } = useParams();
  const [patient, setPatient] = useState([]);
  const [name, setName] = useState(null)
  
  const [form] = Form.useForm();

  useEffect(() => {
    loadPatient();
  }, []);

  const loadPatient = async () => {
    const result = await axios.get(`api/patient/${id}`);
    setName(result.data.name);
    setPatient(result.data);
  };

  const handleOk = async (e) => {
    form.resetFields();
};

  return (
    <Modal visible={visible} title="Atnaujinti paciento duomenis" okText="Atnaujinti"
            cancelText="Atšaukti" onCancel={onCancel}
            onOk={() => {
              form
                .validateFields()
                .then((values) => {
                  console.log(values)
                  onCreate(values);
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                });
            }}>
      <Form form={form} layout="vertical" name="form_in_modal" onFinish={handleOk}
            initialValues={{
                name: patient.name,
                surname: patient.surname,
                phone_number: patient.phone_number,
                specialization: patient.specialization,
                room: patient.room,
            }}> 
        <Form.Item name="name" label="Vardas:" value={name}
                    rules={[
                      {
                        required: true,
                        message: "Įveskite paciento vardą!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
        <Form.Item name="surname" label="Pavardė:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite paciento pavardę!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
        <Form.Item name="phone_number" label="Telefono nr.:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite telefono numerį!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPatientModal;