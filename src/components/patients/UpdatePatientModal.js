import React, { useState, useEffect} from 'react';
import { Modal, Form, Input, Row, Col, Avatar, InputNumber} from "antd";
import { useParams } from 'react-router-dom';
import axios from '../../axiosApi';
import { IdcardOutlined} from "@ant-design/icons";
import DatePicker from "react-datepicker";
import lt from "date-fns/locale/lt";
const AddPatientModal = ({ visible, onCreate, onCancel}) => {
  
  const { id } = useParams();
  const [patient, setPatient] = useState([]);
  const [name, setName] = useState(null)
  const [termination_date, setTerminationDate] = useState()
  
  const [form] = Form.useForm();

  useEffect(() => {
    loadPatient();
  },[]);

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
                height: patient.height,
                weight: patient.weight,
                termination_date: patient.termination_date,
            }}> 
            <Row>
      <Col span={6}>
              <Avatar shape="square" size={100} icon={<IdcardOutlined />} />
            </Col>
            <Col span={18}>
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
        <Form.Item  name="height" label="Ūgis(cm):">
           <InputNumber
              min={50}
              max={250}
              style={{
                width: '100%',
              }}
              type="number"
              placeholder="Ūgis"
            />
        </Form.Item>
        <Form.Item  name="weight" label="Svoris(kg):">
           <InputNumber
              min={30}
              max={200}
              style={{
                width: '100%',
              }}
              type="number"
              placeholder="Svoris"
            />
        </Form.Item>
        <Form.Item name="termination_date" label="Gydosi iki:" >
        <DatePicker
          selected={termination_date}
          className="ant-input"
          onChange={(date) => setTerminationDate(date)}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dateFormat="yyyy-MM-dd"
          dropdownMode="select"
          placeholderText="Gydosi iki"
          locale={lt}/>
        </Form.Item>
        </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddPatientModal;