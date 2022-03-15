import React, { useState, useEffect} from 'react';
import { Button, Modal, Form, Input, Radio, Select, InputNumber } from "antd";
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axiosApi';
const UpdateDiagnosisModal = ({ visible, onCreate, onCancel, diagnosis_id}) => {
  
  const { id } = useParams();
  const [diagnosis, setDiagnosis] = useState([]);
  const [name, setName] = useState(null)
  
  const [form] = Form.useForm();

  useEffect(() => {
    loadDiagnosis();
  }, []);

  const loadDiagnosis = async () => {
    const result = await axios.get(`api/diagnosis/${diagnosis_id}`);
    setName(result.data.name);
    setDiagnosis(result.data);
  };

  const handleOk = async (e) => {
    form.resetFields();
};

  return (
    <Modal visible={visible} title="Atnaujinti paciento duomenis" okText="Atnaujinti"
            cancelText="Atšaukti" onCancel={onCancel}
            onOk={() => {
              form
                .validateFields()
                .then((values) => {
                  console.log(values)
                  onCreate(values);
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                });
            }}>
      <Form form={form} layout="vertical" name="form_in_modal" onFinish={handleOk}
            initialValues={{
                name: diagnosis.description,
                surname: diagnosis.temerature
            }}> 
        <Form.Item name="description" label="Vardas:" value={name}
                    rules={[
                      {
                        required: true,
                        message: "Įveskite paciento vardą!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
        <Form.Item name="temperature" label="Pavardė:"
                    rules={[
                      {
                        required: true,
                        message: "Įveskite paciento pavardę!"
                      }
                    ]}>
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateDiagnosisModal;