import React, { useState, useEffect} from 'react';
import { Modal, Form, Input, Card, Typography, Row, Col, Avatar} from "antd";
import axios from '../../axiosApi';
import { UserOutlined} from "@ant-design/icons";

const Register = ({ visible, onReset, onCancel }) => {
  const { Title } = Typography;
  const [emails, setEmails] = useState([]);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");

  function validateEmail(email_val) {
    var data = emails.find((email) => 
                   email.email === email_val)

    if (data) {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
  
    return {
      validateStatus: 'error',
      errorMsg: 'El. paštas nerastas!',
    };
  }

  useEffect(() => {
    loadEmails();
  }, []);

  const onEmailChange = (value) => {
    setEmail({ ...validateEmail(value), value });
  };

  const loadEmails = async () => {
    const result = await axios.get("api/user_reg");
    setEmails(result.data.reverse());
  };

  return (
    <Modal visible={visible} 
            title={<Title level={4}>Slaptažodžio atkūrimas</Title>} 
            okText="Patvirtinti"
            cancelText="Atšaukti" 
            onCancel={onCancel}
            onOk={() => {
              form
                .validateFields()
                .then((values) => {
                  form.resetFields();
                  setConfirmLoading(true);
                  setTimeout(() => {
                    onReset(values);
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
      <Form.Item name="email" label="El. paštas:"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Įveskite korektišką el. paštą!",
                      },
                      {
                        validator(_, value) {
                          if (email.errorMsg === null) {
                            return Promise.resolve();
                          }
                          return Promise.reject();
                        },
                      },
                    ]}
                    validateStatus={email.validateStatus}
                    help={email.errorMsg}>
          <Input
                onChange={e => onEmailChange(e.target.value)}
                placeholder="Įveskite el. paštą, į kurį gausite atkūrimo nurodą"
            />
        </Form.Item>
        </Col>
          </Row>
      </Form>
      </Card>
    </Modal>
  );
};

export default Register;