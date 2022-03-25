import React, { useState, useEffect, useCallback} from 'react';
import "antd/dist/antd.css";
import { Modal, Typography, notification, Form, Card, Row, Col, Avatar, Input, Select} from "antd";
import { EditOutlined, UserOutlined} from "@ant-design/icons";
import axios from '../../axiosApi';
const { Option } = Select;
const { Title } = Typography;

const UpdateUser = ({getAllUsers, ...record}) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const onUpdate = async(values) => {
    console.log(values);
    await axios.patch(`api/user/${record.id}`, values).then(response=>{
      console.log(response.data);
    })
    notification.success({ message: 'Sėkmingai atnaujinta!' });
    setVisible(false);
    getAllUsers();
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = (values) => {
    setConfirmLoading(true);
    setTimeout(() => {
      onUpdate(values);
    }, 2000);
    setConfirmLoading(false);
  };

  const onNumberChange = (value) => {
    setEmail({ ...validatePrimeNumber(value), value });
  };

  function validatePrimeNumber(number) {
    if (number === record.email) {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
  
    return {
      validateStatus: 'error',
      errorMsg: 'The prime between 8 and 12 is 11!',
    };
  }

  return (
    <>
      <EditOutlined onClick={showModal} style={{ color: "#08c",  fontSize: '150%'}}/>
      <Modal
        centered
        style={{ height: "80%" }}
        bodyStyle={{ height: "100%", overflowY: "auto", padding: 0 }}
        visible={visible}
        onCancel={handleCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              console.log(values)
              handleOk(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            })
          }}
        confirmLoading={confirmLoading}
        cancelText="Atšaukti"
        okText="Atnaujinti"
        mask={true}
        maskClosable={false}
        destroyOnClose={true}
        title={<Title level={4}>Atnaujinti diagnozę</Title>}
      >
        <Card bordered={false} size="small" style={{ padding: 15 }}>
        <Form form={form} layout="vertical"
          initialValues={{
            email: record.email,
            is_active: record.is_active,
        }}>
          
          <Row>
            <Col span={6}>
              <Avatar shape="square" size={100} icon={<UserOutlined />} />
            </Col>
            <Col span={18}>
              <Form.Item
                label="El. paštas:"
                rules={[{ required: true }]}
                style={{ width: "100%" }}
                name="email"
                validateStatus={email.validateStatus}
                help={email.errorMsg}
              >
                <Input onChange={onNumberChange}/>
              </Form.Item>
              <Form.Item
                label="Aktyvus:"
                rules={[{ required: true }]}
                style={{ width: "100%" }}
                name="is_active"
              >
                <Select >
                  <Option value={true}>Taip</Option>
                  <Option value={false}>Ne</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      </Modal>
    </>
  );
};

export default UpdateUser;
