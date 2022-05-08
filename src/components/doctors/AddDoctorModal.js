import React, { useState} from 'react';
import {Modal, Form, Input, Select, InputNumber, Row, Col, Avatar} from "antd";
import DatePicker from "react-datepicker";
import { MedicineBoxOutlined} from "@ant-design/icons";
import lt from "date-fns/locale/lt";

const { Option } = Select;
const AddDoctorModal = ({ visible, onCreate, onCancel }) => {

  const [start_date, setStartDate] = useState(null);
  const [form] = Form.useForm();

  return (
    <Modal visible={visible} title="Pridėti gydytoją" okText="Sukurti"
            cancelText="Atšaukti" onCancel={onCancel}
            onOk={() => {
              form
                .validateFields()
                .then((values) => {
                  form.resetFields();
                  onCreate(values);
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                });
            }}>
      <Form form={form} layout="vertical" name="form_in_modal"> 
      <Row>
      <Col span={6}>
              <Avatar shape="square" size={100} icon={<MedicineBoxOutlined />} />
            </Col>
            <Col span={18}>
        <Form.Item name="name" label="Vardas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite gydytojo vardą!"
                      }
                    ]}>
          <Input placeholder="Vardas"/>
        </Form.Item>
        <Form.Item name="surname" label="Pavardė:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite gydytojo pavardę!"
                      }
                    ]}>
          <Input placeholder="Pavardė"/>
        </Form.Item>
        <Form.Item name="birthday" label="Gimimo data:" >
        <DatePicker
          selected={start_date}
          className="ant-input" 
          onChange={(date) => setStartDate(date)}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dateFormat="yyyy-MM-dd"
          dropdownMode="select"
          placeholderText="Pasirinkite gimimo datą"
          locale={lt}
          maxDate={new Date()}/>
        </Form.Item>
        <Form.Item name="gender" label="Lytis:"
                    rules={[
                      {
                        required: true,
                        message: "Pasirinkite lytį!"
                      }
                    ]}>
          <Select placeholder="Lytis">
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
          <InputNumber
            min={860000000}
            max={869999999}
            style={{
              width: '100%',
            }}
            type="number"
            placeholder="Telefono numeris"/>
        </Form.Item>
        <Form.Item name="specialization" label="Specializacija:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite specializaciją!"
                      }
                    ]}>
          <Input placeholder="Specializacija"/>
        </Form.Item>
        <Form.Item name="room" label="Kabinetas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite kabinetą!"
                      }
                    ]}>
          <InputNumber style={{width: '100%',}} placeholder="Kabinetas" min={1}/>
        </Form.Item>
        </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddDoctorModal;