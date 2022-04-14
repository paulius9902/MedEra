import React, { useState, useEffect} from 'react';
import { Modal, Form, Input, Select, Card, Typography, InputNumber, Row, Col, Avatar, Upload, Button, message} from "antd";
import { ExperimentOutlined, UploadOutlined, InboxOutlined} from "@ant-design/icons";
import axios from '../../axiosApi';
import lt from "date-fns/locale/lt";
import DatePicker from "react-datepicker";
import { storage } from "../../utils/Firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";


const { Option } = Select;
const { Dragger } = Upload;
const AddLaboratoryTestModal = ({ visible, onCreate, onCancel }) => {
  const { Title } = Typography;
  const [patients, setPatients] = useState([]);
  const [test_date, setTestDate] = useState(null);
  const [file_url, setFileUrl] = useState(null);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();
  const [document, setDocument] = useState([]);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const result = await axios.get("api/patient");
    setPatients(result.data.reverse());
  };

  const onChange = (info) => {
    if (info.file.type !== "application/pdf") {
      message.error("Įkelkite PDF formato dokumentą.");
      setDocument([]);
    } else {
      setDocument(info.fileList);
    }
  };

  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const uploadDocument = (file) => {
    if (!file) return;
    const sotrageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(sotrageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log(prog)
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setFileUrl(downloadURL);
        });
      }
    );
  };

  return (
    <Modal visible={visible} 
            title={<Title level={4}>Pridėti lab. tyrimą</Title>} 
            okText="Sukurti"
            cancelText="Atšaukti" 
            onCancel={onCancel}
            onOk={() => {
              form
                .validateFields()
                .then((values) => {
                  form.resetFields();
                  console.log(values)
                  setConfirmLoading(true);
                  setTimeout(() => {
                    console.log('failas: '+values.document.file.originFileObj)
                    uploadDocument(values.document.file.originFileObj);
                    values.docfile = file_url;
                    console.log('duomenys: '+ values.data)
                    onCreate(values);
                    setConfirmLoading(false);
                  }, 500);
                  
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                });
            }}
            centered
            style={{ height: "80%" }}
            bodyStyle={{ height: "100%", overflowY: "auto", padding: 0 }}
            width={600}
            confirmLoading={confirmLoading}
            mask={true}
            maskClosable={false}
            destroyOnClose={true}>
              <Card bordered={false} size="small" style={{ padding: 15 }}>
      <Form form={form} layout="vertical">
      <Row>
            <Col span={6}>
              <Avatar shape="square" size={100} icon={<ExperimentOutlined />} />
            </Col>
            <Col span={18}>
      <Form.Item name="patient" label="Pacientas:"
                    rules={[
                      {
                        required: true,
                        message: "Pasirinkite pacientą"
                      }
                    ]}>
          <Select >
            {patients.map((patient, index) => (
                <Option key={index} value={patient.patient_id}>{patient.name + " " + patient.surname + "  |  " + patient.birthday}</Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="test_date" label="Tyrimo data:" 
                      rules={[
                      {
                        required: true,
                        message: "Pasirinkite tyrimo datą!"
                      }]}>
        <DatePicker
          selected={test_date}
          className="ant-input"
          onChange={(date) => setTestDate(date)}
          peekNextMonth
          showTimeSelect
          showMonthDropdown
          showYearDropdown
          dateFormat="yyyy-MM-dd HH:mm"
          timeIntervals={5}
          dropdownMode="select"
          placeholder="Pasirinkite tyrimo datą:"
          locale={lt}/>
        </Form.Item>
        <Form.Item name="name" label="Pavadinimas:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite pavadinimą!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
        <Form.Item name="document" label="Failas"
                    rules={[
                      {
                        required: true,
                        message: "Pridėkite tyrimo failą!"
                      }
                    ]}>
          <Dragger
            onChange={onChange}
            customRequest={dummyRequest}
            multiple={false}
            fileList={document}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Užtemkite arba paspauskite norėdami įkelti failą</p>
            <p className="ant-upload-hint">PDF dokumentas</p>
          </Dragger>
        </Form.Item>
        </Col>
          </Row>
      </Form>
      </Card>
    </Modal>
  );
};

export default AddLaboratoryTestModal;