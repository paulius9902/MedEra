import React, { useState, useEffect} from 'react';
import ReactDOM from "react-dom";
import { Button, Modal, Form, Input, Radio, Select, InputNumber } from "antd";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import lt from "date-fns/locale/lt";
import axios from '../../axiosApi';
const { Option } = Select;
const AddPatientModal = ({ visible, onCreate, onCancel }) => {

  const [start_date, setStartDate] = useState(new Date());
  const [gender, setGender] = useState(null)
  
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
          <Select onChange={(gender) => setGender(gender)} className="form-control" >
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
      </Form>
    </Modal>
  );
};

export default AddPatientModal;