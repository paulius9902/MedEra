import React, { useState, useEffect} from 'react';
import { Modal, Form, Input, Select, Card, Typography, Row, Col, Avatar, Result, Button} from "antd";
import { AuditOutlined} from "@ant-design/icons";
import axios from '../../axiosApi';
const { Option } = Select;
const AddPrescriptionModal = ({ visible, onCreate, onCancel }) => {
  const { Title } = Typography;
  const [patients, setPatients] = useState([]);
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
        <Result
            status="success"
            title="Successfully Purchased Cloud Server ECS!"
            subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
            extra={[
            <Button type="primary" key="console">
                Go Console
            </Button>,
            <Button key="buy">Buy Again</Button>,
            ]}
        />
    </Modal>
  );
};

export default AddPrescriptionModal;