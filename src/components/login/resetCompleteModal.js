import React, { useState, useEffect} from 'react';
import { Modal, Form, Input, Select, Card, Typography, Row, Col, Avatar, Result, Button} from "antd";
import { AuditOutlined} from "@ant-design/icons";
import axios from '../../axiosApi';
const { Option } = Select;
const AddPrescriptionModal = ({ visible, onCreate, onCancel }) => {
  const { Title } = Typography;

  return (
    <Modal visible={visible} 
            centered
            style={{ height: "80%" }}
            bodyStyle={{ height: "100%", overflowY: "auto", padding: 0 }}
            width={600}
            mask={true}
            maskClosable={false}
            destroyOnClose={true}
            footer={null}>
        <Result
            status="success"
            title="Slaptažodis sėkmingai pakeistas!"
            subTitle="Galite prisijungti prie MedEra sistemos su nauju slaptažodžiu."
            extra={[
            <Button type="primary" key="console" href='/login'>
                Prisijungti
            </Button>,
            ]}
        />
    </Modal>
  );
};

export default AddPrescriptionModal;