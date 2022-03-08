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
    <Modal visible={visible} title="Sukurti vizitą" okText="Sukurti" 
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
            onChange={date => setStartDate(date)}
            showTimeSelect
            timeIntervals={30}
            dateFormat="yyyy-MM-dd HH:mm"
            timeFormat="HH:mm"
            timeCaption="Laikas:"
            locale={lt}/>
        </Form.Item>

        <Form.Item name="doctor" label="Gydytojas"
                    rules={[
                      {
                        required: true,
                        message: "Pasirinkite gydytoją"
                      }
                    ]}>
          <select  onChange={(e) => setDoctorID(e.target.value)} name="stateName" className="form-control" placeholder="Pasirinkite gydytoją" defaultValue={'DEFAULT'}>
            <option value="DEFAULT" disabled>...</option>
              {doctors.map((doctor, index) => (
                <option value={doctor.doctor_id}>{doctor.name + " " + doctor.surname}</option>
              ))}
            </select>
        </Form.Item>

        <Form.Item name="health_issue" label="Sveikatos problema:">
          <Input type="textarea" />
        </Form.Item>
        
      </Form>
    </Modal>
  );
};

export default AddDoctorModal;