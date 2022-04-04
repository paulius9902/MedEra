import React, { useState} from 'react';
import { Modal, Form, Input, Select, Row, Col, Avatar, InputNumber} from "antd";
import DatePicker from "react-datepicker";
import lt from "date-fns/locale/lt";
import { IdcardOutlined} from "@ant-design/icons";

const { Option } = Select;
const AddPatientModal = ({ visible, onCreate, onCancel, allergies }) => {

  const [start_date, setStartDate] = useState(null);
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
        <Form.Item name="name" label="Vardas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite paciento vardą!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
        <Form.Item name="surname" label="Pavardė:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite paciento pavardę!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
        <Form.Item name="birthday" label="Gimimo data:" >
        <DatePicker
          selected={start_date}
          className="form-control" 
          onChange={(date) => setStartDate(date)}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dateFormat="yyyy-MM-dd"
          dropdownMode="select"
          placeholder="Pasirinkite gimimo datą:"
          locale={lt}/>
        </Form.Item>
        <Form.Item name="gender" label="Lytis:"
                    rules={[
                      {
                        required: true,
                        message: "Pasirinkite lytį!"
                      }
                    ]}>
          <Select>
            <Option value="V">Vyras</Option>
            <Option value="M">Moteris</Option>
          </Select>
        </Form.Item>
        <Form.Item name="phone_number" label="Telefono nr.:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite telefono numerį!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
        <Form.Item  name="personal_code" label="Asmens kodas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite asmens kodą!"
                      },
                    ]}>
           <InputNumber
              min={10000000000}
              max={99999999999}
              style={{
                width: '100%',
              }}
              type="number"
              placeholder="Asmens kodas"
            />
        </Form.Item>
        <Form.Item name="allergies" label="Alergijos:">
          <Select placeholder="Alergijos" mode="multiple">
            {allergies.map((allergy, index) => (
                <Option key={allergy.allergy_id} value={allergy.allergy_id}>{allergy.name}</Option>
              ))}
          </Select>
        </Form.Item>
        </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddPatientModal;