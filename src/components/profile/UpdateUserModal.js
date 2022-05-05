import React, { useState, useEffect} from 'react';
import { UserOutlined} from "@ant-design/icons";
import { Modal, Form, Input, Row, Col, Avatar} from "antd";
import axios from '../../axiosApi';
const UpdateUserModal = ({ visible, onCreate, onCancel}) => {
  
  const id = localStorage.getItem('user_id')
  const [user, setUser] = useState([]);
  
  const [form] = Form.useForm();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const result = await axios.get(`api/user/${id}`);
    setUser(result.data);
    console.log(result.data)
  };

  const handleOk = async (e) => {
    form.resetFields();
};

  return (
    <Modal visible={visible} title="Atnaujinti profilį" okText="Atnaujinti"
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
                email: user.email,
            }}> 
        <Row>
      <Col span={6}>
              <Avatar shape="square" size={100} icon={<UserOutlined />} />
            </Col>
            <Col span={18}>
        <Form.Item name="email" label="El. paštas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite el. paštą!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
        </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;