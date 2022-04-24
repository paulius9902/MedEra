import React from "react";
import "antd/dist/antd.css";
import { Modal, Typography, notification, Form, Card, Row, Col, Avatar, Input, InputNumber} from "antd";
import { EditOutlined, FileDoneOutlined} from "@ant-design/icons";
import axios from '../../axiosApi';
//import { ShowDiagnoses} from './ShowDiagnoses';

import "./custom.css";

const { Title } = Typography;

function UpdateUser({getAllDiagnosis, setLoading, ...record}) {
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const onUpdate = async(values) => {
    console.log(values);
    await axios.patch(`api/diagnosis/${record.diagnosis_id}`, values).then(response=>{
      setLoading(true);
      console.log(response.data);
      
      notification.success({ message: 'Sėkmingai atnaujinta!' });
      setVisible(false);
      getAllDiagnosis();
    })
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
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };

  return (
    <>
      <EditOutlined onClick={showModal} style={{ color: "#08c",  fontSize: '150%'}}/>

      <Modal
        centered
        style={{ height: "80%" }}
        bodyStyle={{ height: "100%", overflowY: "auto", padding: 0 }}
        width={600}
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
            });
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
            name: record.name,
            temperature: record.temperature,
            systolic_blood_pressure: record.systolic_blood_pressure,
            diastolic_blood_pressure: record.diastolic_blood_pressure,
            heart_rate: record.heart_rate,
        }}>
          
          <Row>
            <Col span={6}>
              <Avatar shape="square" size={100} icon={<FileDoneOutlined />} />
            </Col>
            <Col span={18}>
              <Form.Item
                label="Diagnozė:"
                rules={[
                  {
                    required: true,
                    message: "Įveskite diagnozę!"
                  }
                ]}
                style={{ width: "100%" }}
                name="name"
              >
                <Input placeholder="Diagnozė" />
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
              <Form.Item  name="temperature" label="Temperatūra:">
           <InputNumber
              min={30}
              max={45}
              style={{
                width: '100%',
              }}
              type="number"
              placeholder="Temperatūra"
              step="0.1"
            />
        </Form.Item>
        <Form.Item  name="systolic_blood_pressure" label="Sistolinis kraujospūdis:">
           <InputNumber
              min={80}
              max={220}
              style={{
                width: '100%',
              }}
              type="number"
              placeholder="Sistolinis kraujospūdis"
            />
        </Form.Item>
        <Form.Item  name="diastolic_blood_pressure" label="Diastolinis kraujospūdis:">
           <InputNumber
              min={50}
              max={160}
              style={{
                width: '100%',
              }}
              type="number"
              placeholder="Diastolinis kraujospūdis"
            />
        </Form.Item>
        <Form.Item  name="heart_rate" label="Pulsas:">
           <InputNumber
              min={30}
              max={45}
              style={{
                width: '100%',
              }}
              type="number"
              placeholder="Pulsas"
            />
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
