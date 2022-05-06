import React from 'react';
import { Modal, Form, Select, Row, Col, Avatar} from "antd";
import { IdcardOutlined} from "@ant-design/icons";

const { Option } = Select;
const AddPatientAllergiesModal = ({ visible, onCreate, onCancel, allergies }) => {
  const [form] = Form.useForm();

  return (
    <Modal visible={visible} title="Pridėti pacientą" okText="Sukurti"
            cancelText="Atšaukti" onCancel={onCancel}
            onOk={() => {
              form
                .validateFields()
                .then((values) => {
                  form.resetFields();
                  console.log(values)
                  onCreate(values);
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                });
            }}>
      <Form form={form} layout="vertical" name="form_in_modal"> 
      <Row>
      <Col span={6}>
              <Avatar shape="square" size={100} icon={<IdcardOutlined />} />
            </Col>
            <Col span={18}>
        <Form.Item name="allergy" label="Alergijos:">
          <Select 
            placeholder="Alergijos" 
            mode="multiple" 
            showSearch
            filterOption={(inputValue, option) =>
              option.props.children
                .toString()
                .toLowerCase()
                .includes(inputValue.toLowerCase())
            }>
            {allergies.map((allergy, index) => (
                <Option key={allergy.allergy_id}>{allergy.code + ' ' + allergy.name}</Option>
              ))}
          </Select>
        </Form.Item>
        </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddPatientAllergiesModal;