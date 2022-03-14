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

  const [patients, setPatients] = useState([]);
  const [patient_id, setPatientID] = useState(null)
  const [start_date, setStartDate] = useState(new Date());
  const [gender, setGender] = useState(null)
  
  const [form] = Form.useForm();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const result = await axios.get("api/patient");
    setPatients(result.data.reverse());
  };
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
      <Form.Item name="patient" label="Pacientas"
                    rules={[
                      {
                        required: true,
                        message: "Pasirinkite pacientą"
                      }
                    ]}>
          <Select onChange={patient => setPatientID(patient)} >
            {patients.map((patient, index) => (
                <Option value={patient.patient_id}>{patient.name + " " + patient.surname + "  |  " + patient.birthday}</Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="description" label="Aprašymas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite aprašymą!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPatientModal;