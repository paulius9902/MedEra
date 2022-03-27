import React, { useState, useEffect} from 'react';
import { Modal, Form, Input, Row, Col, Avatar} from "antd";
import DatePicker from "react-datepicker";
import lt from "date-fns/locale/lt";
import { CalendarOutlined} from "@ant-design/icons";
import axios from '../../axiosApi';

import "react-datepicker/dist/react-datepicker.css";

const AddVisitModal = ({ visible, onCreate, onCancel }) => {

  const [start_date, setStartDate] = useState(null)
  
  const [doctors, setDoctors] = useState([]);
  const [work_hours, setWorkHours] = useState([]);
  const [doctor_id, setDoctorID] = useState(null)
  
  const [form] = Form.useForm();

  const filterTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  useEffect(() => {
    loadDoctors();
    loadWorkHours();
  },[]);

  const loadDoctors = async () => {
    const result = await axios.get("api/doctor");
    setDoctors(result.data.reverse());
  };

  const loadWorkHours = async () => {
    const result = await axios.get(`api/doctor/${doctor_id}/work_hours`);
    setWorkHours(result.data.reverse());
  };

  return (
    <Modal visible={visible} title="Pridėti vizitą" okText="Pridėti" 
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
              <Avatar shape="square" size={100} icon={<CalendarOutlined />} />
            </Col>
            <Col span={18}>
        <Form.Item name="start_date" label="Data ir laikas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite vizito datą ir laiką!"
                      }
                    ]}>
          <DatePicker
            className="form-control" 
            placeholder="Pasirinkite laiką:"
            selected={start_date}
            filterTime={filterTime}
            onChange={date => setStartDate(date)}
            showTimeSelect
            timeIntervals={30}
            dateFormat="yyyy-MM-dd HH:mm"
            timeFormat="HH:mm"
            timeCaption="Laikas:"
            locale={lt}/>
        </Form.Item>

        <Form.Item name="health_issue" label="Sveikatos problema:">
          <Input type="textarea" />
        </Form.Item>
        </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddVisitModal;