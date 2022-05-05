import React, { useState, useEffect} from 'react';
import { Modal, Form, Input, Select, Row, Col, Avatar, InputNumber} from "antd";
import DatePicker from "react-datepicker";
import lt from "date-fns/locale/lt";
import { IdcardOutlined} from "@ant-design/icons";
import axios from '../../axiosApi';

const { Option } = Select;
const AddPatientModal = ({ visible, onCreate, onCancel }) => {

  const [start_date, setStartDate] = useState(null);
  const [personal_code, setPersonalCode] = useState("");
  const [patients, setPatients] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    loadPatients();
  }, []);

  function validatePersonalCode(personal_code) {
    var data = patients.find((patient) => 
        patient.personal_code.indexOf(personal_code) > -1)
    console.log(data)
    if (!data) {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
  
    return {
      validateStatus: 'error',
      errorMsg: 'Pacientas su tokiu asmens kodu jau yra pridėtas!',
    };
  }

  const onPersonalCodeChange = (value) => {
    setPersonalCode({ ...validatePersonalCode(value), value });
  };

  const loadPatients = async () => {
    const result = await axios.get("api/patient_reg");
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
          <Input placeholder="Vardas"/>
        </Form.Item>
        <Form.Item name="surname" label="Pavardė:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite paciento pavardę!"
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
              placeholder="Telefono numeris"
            />
        </Form.Item>
        <Form.Item  name="personal_code" label="Asmens kodas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite asmens kodą!"
                      },
                    ]}
                    validateStatus={personal_code.validateStatus}
                    help={personal_code.errorMsg}>
           <InputNumber
              min={10000000000}
              max={99999999999}
              style={{
                width: '100%',
              }}
              type="number"
              placeholder="Asmens kodas"
              onChange={onPersonalCodeChange}
            />
        </Form.Item>
        <Form.Item  name="height" label="Ūgis(cm):">
           <InputNumber
              min={50}
              max={250}
              style={{
                width: '100%',
              }}
              type="number"
              placeholder="Ūgis"
            />
        </Form.Item>
        <Form.Item  name="weight" label="Svoris(kg):">
           <InputNumber
              min={30}
              max={200}
              style={{
                width: '100%',
              }}
              type="number"
              placeholder="Svoris"
            />
        </Form.Item>
        </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddPatientModal;