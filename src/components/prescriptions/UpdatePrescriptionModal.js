import React, {useCallback} from "react";
import "antd/dist/antd.css";
import { Modal, Typography, notification, Form, Card, Row, Col, Avatar, Input, InputNumber} from "antd";
import { EditOutlined, AuditOutlined} from "@ant-design/icons";
import axios from '../../axiosApi';
//import { ShowDiagnoses} from './ShowDiagnoses';

//import "./custom.css";

const { Title } = Typography;

function UpdatePrescription(record, onUpdateRefresh) {
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const onUpdate = async(values, id) => {
    console.log(values);
    await axios.patch(`api/prescription/${id}`, values).then(response=>{
      console.log(response.data);
      
      notification.success({ message: 'Sėkmingai atnaujinta!' });
    })
    
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  

  const handleOk = (values, id) => {
    setConfirmLoading(true);
    setTimeout(() => {
      onUpdate(values, id);
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
        visible={visible}
        onCancel={handleCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              console.log(values)
              handleOk(values, record.prescription_id);
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
        title={<Title level={4}>Atnaujinti receptą</Title>}
      >
        <Card bordered={false} size="small" style={{ padding: 15 }}>
        <Form form={form} layout="vertical"
          initialValues={{
            medicine: record.medicine,
            custom_usage: record.custom_usage,
        }}>
          
          <Row>
            <Col span={6}>
              <Avatar shape="square" size={100} icon={<AuditOutlined />} />
            </Col>
            <Col span={18}>
            <Form.Item
                label="Vaistas:"
                rules={[{ required: true }]}
                style={{ width: "100%" }}
                name="medicine"
              >
                <Input placeholder="Vaistas" />
              </Form.Item>
              <Form.Item
                label="Vartojimas:"
                rules={[{ required: true }]}
                style={{ width: "100%" }}
                name="custom_usage"
              >
                <Input placeholder="Vartojimas" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      </Modal>
    </>
  );
};

export default UpdatePrescription;
