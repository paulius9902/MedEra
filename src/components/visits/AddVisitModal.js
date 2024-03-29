import React, { useState} from 'react';
import { Modal, Form, Input, Select, Row, Col, Avatar} from "antd";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import { CalendarOutlined} from "@ant-design/icons";
import setMinutes from "date-fns/setMinutes";
import { addDays, isSameDay, parseISO, addMonths } from "date-fns";
import lt from "date-fns/locale/lt";
import getDay from "date-fns/getDay";
import "react-datepicker/dist/react-datepicker.css";
const { Option } = Select;

const AddVisitModal = ({ visible, onCreate, onCancel, visits, doctors}) => {

  const [start_date, setStartDate] = useState(null)
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

  let results = visits.filter((visit) => visit.doctor_id === doctor_id).map(
    (visit) => new Date(parseISO(visit.start_date))
  );

  const getExcludeTimesForDate = (date) =>
    results.filter((time) => isSameDay(date, time));

  const [excludeTimes, setExcludeTimes] = useState(
    getExcludeTimesForDate(start_date)
  );

  return (
    <Modal visible={visible} title="Sukurti vizitą" okText="Sukurti" 
            cancelText="Atšaukti" onCancel={onCancel}
            mask={true}
            onOk={() => {
              form
                .validateFields()
                .then((values) => {
                  onCreate(values, form);
                  setDoctorID(null)
                  setStartDate(null)
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                })
                }}>
      <Form form={form} layout="vertical" name="form_in_modal"> 
      <Row>
      <Col span={6}>
              <Avatar shape="square" size={100} icon={<CalendarOutlined />} />
            </Col>
            <Col span={18}>
        <Form.Item name="doctor" label="Pasirinkite gydytoją:"
                    rules={[
                      {
                        required: true,
                        message: "Pasirinkite gydytoją!"
                      }
                    ]}>
          <Select onChange={doctor => {setDoctorID(doctor); setStartDate(null)}} placeholder="Gydytojas" showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
            {doctors.map((doctor, index) => (
                <Option key={doctor.doctor_id} value={doctor.doctor_id}>{doctor.name + " " + doctor.surname + "  |  " + doctor.specialization}</Option>
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
            className="ant-input"
            placeholderText="Pasirinkite vizito datą ir laiką"
            selected={start_date}
            filterTime={filterTime}
            onChange={(date) => {
              setStartDate(date);
              setExcludeTimes(getExcludeTimesForDate(date));
            }}
            showTimeSelect
            timeIntervals={30}
            dateFormat="yyyy-MM-dd HH:mm"
            timeFormat="HH:mm"
            timeCaption="Laikas:"
            locale={lt}
            minDate={addDays(new Date(), 1)}
            maxDate={addMonths(new Date(), 1)}
            minTime={setHours(setMinutes(new Date(), 0), 8)}
            maxTime={setHours(setMinutes(new Date(), 0), 18)}
            filterDate={isWeekday}
            excludeTimes={excludeTimes}
            onKeyDown={(e) => {
              e.preventDefault();
           }}/>
        </Form.Item>

        <Form.Item name="health_issue" label="Vizito priežastis:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite vizito priežastį!"
                      }
                    ]}>
          <Input.TextArea placeholder="Vizito priežasties aprašymas" showCount maxLength={500}/>
        </Form.Item>
        </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddVisitModal;