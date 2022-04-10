import React, { useState, useEffect} from 'react';
import { Modal, Form, Input, Select, Card, Typography, Row, Col, Avatar} from "antd";
import { AuditOutlined} from "@ant-design/icons";
import axios from '../../axiosApi';
import lt from "date-fns/locale/lt";
import DatePicker from "react-datepicker";

const { Option } = Select;
const AddPrescriptionModal = ({ visible, onCreate, onCancel }) => {
  const { Title } = Typography;
  const [patients, setPatients] = useState([]);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();
  const [prescription_date, setPrescriptionDate] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const result = await axios.get("api/patient");
    setPatients(result.data.reverse());
  };
  return (
    <Modal visible={visible} 
            title={<Title level={4}>Pridėti receptą</Title>} 
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
              <Avatar shape="square" size={100} icon={<AuditOutlined />} />
            </Col>
            <Col span={18}>
      <Form.Item name="patient" label="Pacientas:"
                    rules={[
                      {
                        required: true,
                        message: "Pasirinkite pacientą"
                      }
                    ]}>
          <Select >
            {patients.map((patient, index) => (
                <Option key={index} value={patient.patient_id}>{patient.name + " " + patient.surname + "  |  " + patient.birthday}</Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="date" label="Recepto data:" 
                      rules={[
                      {
                        required: true,
                        message: "Pasirinkite recepto datą!"
                      }]}>
        <DatePicker
          selected={prescription_date}
          className="form-control" 
          onChange={(date) => setPrescriptionDate(date)}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dateFormat="yyyy-MM-dd"
          timeIntervals={5}
          dropdownMode="select"
          placeholder="Pasirinkite tyrimo datą:"
          locale={lt}/>
        </Form.Item>
        <Form.Item name="medicine" label="Vaistas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite vaisto pavadinimą!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
        <Form.Item name="custom_usage" label="Vartojimas:">
          <Input/>
        </Form.Item>
        </Col>
          </Row>
      </Form>
      </Card>
    </Modal>
  );
};

export default AddPrescriptionModal;