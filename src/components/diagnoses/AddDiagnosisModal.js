import React, { useState, useEffect} from 'react';
import { Modal, Form, Input, Select, Card, Typography, Row, Col, Avatar} from "antd";
import { FileDoneOutlined} from "@ant-design/icons";
import axios from '../../axiosApi';
const { Option } = Select;
const AddDiagnosisModal = ({ visible, onCreate, onCancel, patient_id}) => {
  const { Title } = Typography;
  const [patients, setPatients] = useState([]);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (patient_id === null)
    {
      loadPatients();
    }
  }, []);

  const loadPatients = async () => {
    const result = await axios.get("api/patient");
    setPatients(result.data.reverse());
  };
  return (
    <Modal visible={visible} 
            title={<Title level={4}>Pridėti diagnozę</Title>} 
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
      <Row>
            <Col span={6}>
              <Avatar shape="square" size={100} icon={<FileDoneOutlined />} />
            </Col>
            <Col span={18}>
      {patient_id===null &&
      <Form.Item name="patient" label="Pacientas:"
                    rules={[
                      {
                        required: true,
                        message: "Pasirinkite pacientą"
                      }
                    ]}>
          <Select showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} placeholder="Pasirinkite pacientą" >
            {patients.map((patient, index) => (
                <Option key={index} value={patient.patient_id}>{patient.name + " " + patient.surname + "  |  " + patient.birthday}</Option>
              ))}
          </Select>
        </Form.Item>}
        <Form.Item name="name" label="Diagnozė:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite diagnozę!"
                      }
                    ]}>
          <Input placeholder="Diagnozės pavadinimas"/>
        </Form.Item>
        <Form.Item name="description" label="Aprašymas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite diagnozės aprašymą!"
                      }
                    ]}>
          <Input.TextArea placeholder="Diagnozės aprašymas" showCount maxLength={500}/>
        </Form.Item>
        </Col>
          </Row>
      </Form>
      </Card>
    </Modal>
  );
};

export default AddDiagnosisModal;