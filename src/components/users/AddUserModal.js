import React, { useState, useEffect} from 'react';
import { Modal, Form, Input, Select, Card, Typography, Row, Col, Avatar} from "antd";
import axios from '../../axiosApi';
import { UserOutlined} from "@ant-design/icons";
const { Option } = Select;
const AddUserModal = ({ visible, onCreate, onCancel }) => {
  const { Title } = Typography;
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadPatients();
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const result = await axios.get("api/doctor");
    setDoctors(result.data.reverse());
  };

  const loadPatients = async () => {
    const result = await axios.get("api/patient");
    setPatients(result.data.reverse());
  };
  return (
    <Modal visible={visible} 
            title={<Title level={4}>Sukurti vartotoją</Title>} 
            okText="Sukurti"
            cancelText="Atšaukti" 
            onCancel={onCancel}
            onOk={() => {
              form
                .validateFields()
                .then((values) => {
                  form.resetFields();
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
      <Form.Item name="role" label="Vartotojo tipas:"
                    rules={[
                      {
                        required: true,
                        message: "Pasirinkite vartotojo tipą!"
                      }
                    ]}>
          <Select>
            <Option value="A">Administratorius</Option>
            <Option value="D">Gydytojas</Option>
            <Option value="P">Pacientas</Option>
          </Select>
      </Form.Item>
      <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
        >
          {({ getFieldValue }) =>
            getFieldValue('role') === 'D' ? (
              <Form.Item name="doctor" label="Pasirinkite gydytoją:"
                    rules={[
                      {
                        required: true,
                        message: "Pasirinkite gydytoją!"
                      }
                    ]}>
                <Select placeholder="Gydytojas">
                  {doctors.map((doctor, index) => (
                      <Option value={doctor.doctor_id}>{doctor.name + " " + doctor.surname + "  |  " + doctor.specialization}</Option>
                    ))}
                </Select>
              </Form.Item>
                  ) : null
                }
      </Form.Item>
      <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
        >
          {({ getFieldValue }) =>
            getFieldValue('role') === 'P' ? (
              <Form.Item name="patient" label="Pasirinkite pacientą:"
                    rules={[
                      {
                        required: true,
                        message: "Pasirinkite pacientą!"
                      }
                    ]}>
                <Select placeholder="Pacientas">
                  {patients.map((patient, index) => (
                      <Option value={patient.patient_id}>{patient.name + " " +patient.surname + "  |  " + patient.birthday}</Option>
                    ))}
                </Select>
              </Form.Item>
                  ) : null
                }
      </Form.Item>
      <Form.Item name="email" label="El. paštas:"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Įveskite el. paštą!"
                      }
                    ]}>
          <Input

              placeholder="El. paštas"
            />
        </Form.Item>
        <Form.Item name="password" label="Slaptažodis:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite slaptažodį!"
                      }
                    ]}>
           <Input
              type="password"
              placeholder="Slaptažodis"
            />
        </Form.Item>
        </Col>
          </Row>
      </Form>
      </Card>
    </Modal>
  );
};

export default AddUserModal;