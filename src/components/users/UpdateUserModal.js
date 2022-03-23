import React, {useCallback} from "react";
import "antd/dist/antd.css";
import { Modal, Typography, notification, Form, Card, Row, Col, Avatar, Input} from "antd";
import { EditOutlined, UserOutlined} from "@ant-design/icons";
import axios from '../../axiosApi';
//import { ShowDiagnoses} from './ShowDiagnoses';

const { Title } = Typography;

function UpdateUser(record, onUpdateRefresh) {
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const onUpdate = async(values) => {
    console.log(values);
    await axios.patch(`api/diagnosis/${record.diagnosis_id}`, values).then(response=>{
      console.log(response.data);
      
      notification.success({ message: 'Sėkmingai atnaujinta!' });
    })
    setVisible(false);
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

  return (
    <>
      <EditOutlined onClick={showModal} style={{ color: "#08c",  fontSize: '150%'}}/>

      <Modal
        centered
        style={{ height: "80%" }}
        bodyStyle={{ height: "100%", overflowY: "auto", padding: 0 }}
        width={800}
        visible={visible}
        onCancel={handleCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              console.log('reiksmes')
              console.log(values)
              console.log('reiksmes')
              handleOk(values);
              //onUpdateRefresh();
              //getAllDiagnosis();
              //ShowDiagnoses.getAllDiagnosis();
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
            //window.location.reload()
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
            description: record.description,
        }}>
          
          <Row>
            <Col span={6}>
              <Avatar shape="square" size={100} icon={<UserOutlined />} />
            </Col>
            <Col span={18}>
              <Form.Item
                label="Diagnozė:"
                rules={[{ required: true }]}
                style={{ width: "70%" }}
                name="description"
              >
                <Input placeholder="Diagnozė" />
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
