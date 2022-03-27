import React, { useState, useEffect} from 'react';
import { MedicineBoxOutlined} from "@ant-design/icons";
import { Modal, Form, Input, InputNumber, Row, Col, Avatar} from "antd";
import { useParams } from 'react-router-dom';
import axios from '../../axiosApi';
const AddDoctorModal = ({ visible, onCreate, onCancel}) => {
  
  const { id } = useParams();
  const [doctor, setDoctor] = useState([]);
  const [name, setName] = useState(null)
  
  const [form] = Form.useForm();

  useEffect(() => {
    loadDoctor();
  }, []);

  const loadDoctor = async () => {
    const result = await axios.get(`api/doctor/${id}`);
    setName(result.data.name);
    setDoctor(result.data);
  };

  const handleOk = async (e) => {
    form.resetFields();
};

  return (
    <Modal visible={visible} title="Atnaujinti gydytojo duomenis" okText="Atnaujinti"
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
                name: doctor.name,
                surname: doctor.surname,
                phone_number: doctor.phone_number,
                specialization: doctor.specialization,
                room: doctor.room,
            }}> 
        <Row>
      <Col span={6}>
              <Avatar shape="square" size={100} icon={<MedicineBoxOutlined />} />
            </Col>
            <Col span={18}>
        <Form.Item name="name" label="Vardas:" value={name}
                    rules={[
                      {
                        required: true,
                        message: "Įveskite gydytojo vardą!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
        <Form.Item name="surname" label="Pavardė:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite gydytojo pavardę!"
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
        <Form.Item name="specialization" label="Specializacija:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite specializaciją!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
        <Form.Item name="room" label="Kabinetas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite kabinetą!"
                      }
                    ]}>
          <InputNumber className="form-control" style={{width: '100%',}}/>
        </Form.Item>
        </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddDoctorModal;