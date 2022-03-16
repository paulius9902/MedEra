import React from "react";
import "antd/dist/antd.css";
import { Card, Form, Input, Row, Col, Avatar, Select } from "antd";
import { UserOutlined } from "@ant-design/icons";


const InternalUser = (user) => {
  return (
    <>
      <Card bordered={false} size="small" style={{ padding: 15 }}>
        <Form layout="vertical">
          <Row>
            <Col span={6}>
              <Avatar shape="square" size={100} icon={<UserOutlined />} />
            </Col>
            <Col span={18}>
              <Form.Item
                label="Name"
                rules={[{ required: true }]}
                style={{ width: "70%" }}
              >
                <Input placeholder="Name" value={user.diagnosis_id} />
              </Form.Item>
              <Form.Item
                label="Staff ID"
                rules={[{ required: true }]}
                style={{ width: "70%" }}
              >
                <Input placeholder="Staff ID" value={user.staffId} />
              </Form.Item>
              <Form.Item label="Position" style={{ width: "70%" }}>
                <Input placeholder="Position" value={user.position} />
              </Form.Item>
              <Form.Item
                label="Email"
                rules={[{ required: true }]}
                style={{ width: "70%" }}
              >
                <Input placeholder="Email" value={user.email} />
              </Form.Item>
              <Form.Item label="Phone No." style={{ width: "70%" }}>
                <Input placeholder="Phone No." value={user.phoneNo} />
              </Form.Item>
              <Form.Item label="Department" style={{ width: "70%" }}>
                <Input placeholder="Department" value={user.department} />
              </Form.Item>
              <Form.Item
                label="Roles"
                rules={[{ required: true }]}
                style={{ width: "70%" }}
              >
                <Select mode="multiple" allowClear value={user.roles} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default InternalUser;
