import React, { useState, useEffect} from 'react';
import { Modal, Form, Input, Select } from "antd";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import lt from "date-fns/locale/lt";
import axios from '../../axiosApi';
import getDay from "date-fns/getDay";
import "react-datepicker/dist/react-datepicker.css";
const { Option } = Select;

const AddVisitModal = ({ visible, onCreate, onCancel }) => {

  const [start_date, setStartDate] = useState(null)
  
  const [doctors, setDoctors] = useState([]);
  const [doctor_id, setDoctorID] = useState(null)
  
  const [form] = Form.useForm();

  const filterTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const isWeekday = (date) => {
    const day = getDay(date);
    return day !== 0 && day !== 6;
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const result = await axios.get("api/doctor");
    setDoctors(result.data.reverse());
  };

  return (
    <Modal visible={visible} title="Sukurti vizitą" okText="Sukurti" 
            cancelText="Atšaukti" onCancel={onCancel}
            mask={true}
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
        


        <Form.Item name="doctor" label="Gydytojas"
                    rules={[
                      {
                        required: true,
                        message: "Pasirinkite gydytoją"
                      }
                    ]}>
          <Select onChange={doctor => setDoctorID(doctor)} >
            {doctors.map((doctor, index) => (
                <Option value={doctor.doctor_id}>{doctor.name + " " + doctor.surname + "  |  " + doctor.specialization}</Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item name="start_date" label="Data ir laikas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite vizito datą ir laiką!"
                      }
                    ]}>
          <DatePicker
            disabled={!doctor_id}
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
            locale={lt}
            minDate={setHours(setMinutes(new Date(), 0), 12)}
            filterDate={isWeekday}/>
        </Form.Item>

        <Form.Item name="health_issue" label="Sveikatos problema:">
          <Input type="textarea" />
        </Form.Item>
        
      </Form>
    </Modal>
  );
};

export default AddVisitModal;