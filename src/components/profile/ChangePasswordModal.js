import React from 'react';
import { Modal, Form, Input, Card, Typography, Row, Col, Avatar} from "antd";
import { LockOutlined} from "@ant-design/icons";
const ChangePasswordModal = ({ visible, onChangePassword, onCancel, error_message}) => {
  const { Title } = Typography;
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();

  return (
    <Modal visible={visible} 
            title={<Title level={4}>Keisti slaptažodį</Title>} 
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
                    onChangePassword(values);
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
              <Avatar shape="square" size={100} icon={<LockOutlined />} />
            </Col>
            <Col span={18}>
                <Form.Item name="old_password" label="Dabartinis slaptažodis:"
                            rules={[
                            {
                                required: true,
                                message: "Įveskite dabartinį slaptažodį!"
                            },
                            ]}
                            help={error_message.errorMsg}
                            validateStatus={error_message.validateStatus}>
                    <Input.Password/>
                </Form.Item>
                    
                <Form.Item name="new_password" label="Naujas slaptažodis:"
                            rules={[
                            {
                                required: true,
                                message: "Įveskite naują slaptažodį!"
                            },
                            { 
                                min: 8, 
                                message: 'Slaptažodį turi sudaryti bent 8 simboliai!' 
                            },
                            ]}>
                    <Input.Password/>
                </Form.Item>
            </Col>
          </Row>
      </Form>
      </Card>
    </Modal>
  );
};

export default ChangePasswordModal;