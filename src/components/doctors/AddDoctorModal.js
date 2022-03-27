import React, { useState} from 'react';
import {Modal, Form, Input, Select, InputNumber, Row, Col, Avatar} from "antd";
import DatePicker from "react-datepicker";
import { MedicineBoxOutlined} from "@ant-design/icons";
import lt from "date-fns/locale/lt";

const { Option } = Select;
const AddDoctorModal = ({ visible, onCreate, onCancel }) => {

  const [start_date, setStartDate] = useState(new Date());
  const [form] = Form.useForm();

  return (
    <Modal visible={visible} title="Pridėti gydytoją" okText="Sukurti"
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
          <Input/>
        </Form.Item>
        <Form.Item name="surname" label="Pavardė:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite gydytojo pavardę!"
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
          <Select >
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
        <Form.Item name="specialization" label="Specializacija:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite specializaciją!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
        <Form.Item name="room" label="Kabinetas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite kabinetą!"
                      }
                    ]}>
          <InputNumber className="form-control" style={{width: '100%',}}/>
        </Form.Item>
        </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddDoctorModal;