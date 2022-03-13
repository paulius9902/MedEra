import React, { useEffect, useState } from 'react';
import axios from '../../axiosApi';
import Table from "antd/lib/table";
import {Button, Divider, Popconfirm, notification, Tag} from 'antd';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AddPatientModal from './AddPatientModal';
import { trackPromise } from 'react-promise-tracker';
//import { Button } from 'react-bootstrap';


const ShowPatients = () => {

  const [patients, setPatients] = useState([]);
  const [visible, setVisible] = useState(false);

  const onCreate = async(values) => {
    values.birthday = values.birthday.toISOString().split('T')[0]
    console.log(values);
    await axios.post(`api/patient`, values).then(response=>{
      console.log(response.data);
      getAllPatient();
    })
    setVisible(false);
  };

  const deletePatient = async (id) => {
    try {
      await axios.delete(`api/patient/${id}`);
      getAllPatient();
      notification.success({ message: 'Sėkmingai ištrinta!' });
    } catch (error) {
      console.error(error);
    }
  };

  const getAllPatient = async () => {
    try {
      const res = await axios.get('api/patient');
      setPatients(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmHandler = id => {
    deletePatient(id);
  };

  useEffect(() => {
    getAllPatient();
  }, []);

  const COLUMNS = [
    {
      title: "ID",
      dataIndex: 'patient_id',
      key: "patient_id"
    },
    {
      title: "Vardas",
      dataIndex: 'name',
      key: "name"
    },
    {
      title: "Pavardė",
      dataIndex: 'surname',
      key: "surname"
    },
    {
      title: "Gimimo data",
      dataIndex: 'birthday',
      key: "birthday"
    },
    {
      title: "Lytis",
      dataIndex: 'gender',
      key: "gender"
    },
    {
      title: "Telefono nr.",
      dataIndex: 'phone_number',
      key: "phone_number"
    },
    {
      title: "Veiksmai",
      key: "action",
      render: (record) => {
        return (
          <div>
            
            <Link to={`/patient/${record.patient_id}`}>
              <EditOutlined style={{ color: "blue", marginLeft: 5, fontSize: '150%'}}/>
            </Link>
            <Popconfirm
              placement='topLeft'
              title='Ar tikrai norite ištrinti?'
              okText='Taip'
              cancelText='Ne'
              onConfirm={() => confirmHandler(record.patient_id)}
            >
              <DeleteOutlined
                style={{ color: "red", marginLeft: 12, fontSize: '150%'}}
              />
            </Popconfirm>
          </div>
        );
      }
    },
  ];
 

  return (
    <>
      <h1>Pacientai</h1>

      <Button className="mr-2 mb-3" size='large' onClick={() => {setVisible(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti pacientą</Button>

      <Table columns={COLUMNS} dataSource={patients} size="middle" rowKey={record => record.patient_id} />
      <AddPatientModal
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </>
  );
};

export default ShowPatients;
