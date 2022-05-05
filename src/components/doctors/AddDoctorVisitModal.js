import React, { useState} from 'react';
import { Modal, Form, Input, Row, Col, Avatar} from "antd";
import DatePicker from "react-datepicker";
import lt from "date-fns/locale/lt";
import { CalendarOutlined} from "@ant-design/icons";
import { addDays, isSameDay, parseISO, addMonths } from "date-fns";
import setMinutes from "date-fns/setMinutes";
import setHours from "date-fns/setHours";
import getDay from "date-fns/getDay";

import "react-datepicker/dist/react-datepicker.css";

const AddVisitModal = ({ visible, onCreate, onCancel, doctor_id, visits}) => {

  const [start_date, setStartDate] = useState(null)
  
  const [form] = Form.useForm();

  const filterTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  let results = visits.filter((visit) => visit.doctor_id === Number(doctor_id)).map(
    (visit) => new Date(parseISO(visit.start_date))
  );

  const getExcludeTimesForDate = (date) =>
    results.filter((time) => isSameDay(date, time));

  const [excludeTimes, setExcludeTimes] = useState(
    getExcludeTimesForDate(start_date)
  );

  const isWeekday = (date) => {
    const day = getDay(date);
    return day !== 0 && day !== 6;
  };

  return (
    <Modal visible={visible} title="Pridėti vizitą" okText="Pridėti" 
            cancelText="Atšaukti" onCancel={onCancel}
            onOk={() => {
              form
                .validateFields()
                .then((values) => {
                  form.resetFields()
                  console.log(values)
                  onCreate(values, form)
                  setStartDate(null)
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

        <Form.Item name="health_issue" label="Sveikatos problema:">
          <Input.TextArea placeholder="Vizito priežasties aprašymas" showCount maxLength={500}/>
        </Form.Item>
        </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddVisitModal;