import React from "react";
import "antd/dist/antd.css";
import { Modal, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

import "./custom.css";
import InternalUser from "./Diagnosis";

const { Title } = Typography;

const UpdateUser = (record) => {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };

  return (
    <>
      <EditOutlined onClick={showModal} style={{ fontSize: "18px" }} />

      <Modal
        centered
        style={{ height: "80%" }}
        bodyStyle={{ height: "100%", overflowY: "auto", padding: 0 }}
        width={800}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        cancelText="Cancel"
        okText="Submit"
        mask={true}
        maskClosable={false}
        destroyOnClose={true}
        title={<Title level={4}>Atnaujinti diagnozę</Title>}
      >
        <InternalUser {...record} />
      </Modal>
    </>
  );
};

export default UpdateUser;
