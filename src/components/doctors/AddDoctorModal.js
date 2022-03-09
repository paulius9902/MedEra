import React, { useState, useEffect} from 'react';
import ReactDOM from "react-dom";
import { Button, Modal, Form, Input, Radio } from "antd";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import lt from "date-fns/locale/lt";
import axios from '../../axiosApi';

const AddDoctorModal = ({ visible, onCreate, onCancel }) => {

  const [start_date, setStartDate] = useState(setHours(setMinutes(new Date(), 0), 12))
  const [doctors, setDoctors] = useState([]);
  const [doctor_id, setDoctorID] = useState(null)
  
  const [form] = Form.useForm();


  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const result = await axios.get("api/doctor");
    setDoctors(result.data.reverse());
  };

  return (
    <Modal visible={visible} title="Pridėti gydytoją" okText="Sukurti"
            cancelText="Cancel" onCancel={onCancel}
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
        <Form.Item name="birthday" label="Gimimo data:">
        <DatePicker
          selected={start_date}
          className="form-control" 
          onChange={(date) => setStartDate(date)}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          placeholder="Pasirinkite gimimo datą:"
          dateFormat="yyyy-MM-dd"
          locale={lt}
        />
        </Form.Item>
        
      </Form>
    </Modal>
  );
};

export default AddDoctorModal;