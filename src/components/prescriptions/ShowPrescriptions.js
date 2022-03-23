import React, { useEffect, useState } from 'react';
import axios from '../../axiosApi';
import { useParams, useNavigate } from 'react-router';
import Table from "antd/lib/table";
import {Button, Divider, Popconfirm, notification, Tag} from 'antd';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AddPrescriptionModal from './AddPrescriptionModal';
import UpdatePrescriptionModal from './UpdatePrescriptionModal';
import { trackPromise } from 'react-promise-tracker';
//import "./custom.css";
//import { Button } from 'react-bootstrap';

const ShowPrescriptions = () => {
  const {id} = useParams();
  const [prescription_id, setPrescriptionID] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [visible_create, setVisibleCreate] = useState(false);
  const [visible_update, setVisibleUpdate] = useState(false);

  useEffect(() => {
    getAllPrescriptions();
  }, []);

  const onCreate = async(values) => {
    console.log(values);
    await axios.post(`api/prescription`, values).then(response=>{
      console.log(response.data);
      getAllPrescriptions();
      notification.success({ message: 'Sėkmingai sukurta!' });
    })
    setVisibleCreate(false);
  };

  const deletePrescription = async (id) => {
    try {
      await axios.delete(`api/prescription/${id}`);
      getAllPrescriptions();
      notification.success({ message: 'Sėkmingai ištrinta!' });
    } catch (error) {
      console.error(error);
    }
  };

  const getAllPrescriptions = async () => {
    try {
      const res = await axios.get('api/prescription');
      setPrescriptions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmHandler = id => {
    deletePrescription(id);
  };

  const COLUMNS = [
    {
      title: "ID",
      dataIndex: 'prescription_id',
      key: "prescription_id"
    },
    {
        title: 'Pacientas',
        children: [
          {
            title: "Vardas",
            dataIndex: ['patient', 'name'],
            key: "patient_name"
          },
          {
            title: "Pavardė",
            dataIndex: ['patient', 'surname'],
            key: "patient_surname"
          }
        ]
    },
    {
        title: 'Gydytojas',
        children: [
          {
            title: "Vardas",
            dataIndex: ['doctor', 'name'],
            key: "doctor_name"
          },
          {
            title: "Pavardė",
            dataIndex: ['doctor', 'surname'],
            key: "doctor_surname"
          }
        ]
    },
    {
        title: "Vaistas",
        dataIndex: 'medicine',
        key: "medicine"
    },
    {
        title: "Kiekis",
        dataIndex: 'quantity',
        key: "quantity"
    },
    {
      title: "Vartojimas",
      dataIndex: 'custom_usage',
      key: "custom_usage"
    },
    {
      title: "Diagnozė",
      dataIndex: ['diagnosis', 'description'],
      key: "doctor_surname"
    },
    {
      title: "Veiksmas",
      key: "action",
      render: (record) => {
        return (
          <div>
            
            
            <UpdatePrescriptionModal {...record} onUpdateRefresh={() => {
                                    getAllPrescriptions();
                                  }}/>
            <Popconfirm
              placement='topLeft'
              title='Ar tikrai norite ištrinti?'
              okText='Taip'
              cancelText='Ne'
              onConfirm={() => confirmHandler(record.test_id)}
            >
              <DeleteOutlined
                style={{ color: "#ff4d4f", marginLeft: 12, fontSize: '150%'}}
              />
            </Popconfirm>
          </div>
        );
      }
    },
  ];
 

  return (
    <>
      <h1>Receptai</h1>
      <Divider></Divider>
      <Button className="mr-2 mb-3" size='large' onClick={() => {setVisibleCreate(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti receptą</Button>

      <Table columns={COLUMNS} dataSource={prescriptions} size="middle" rowKey={record => record.test_id} />
      <AddPrescriptionModal
        visible={visible_create}
        onCreate={onCreate}
        onCancel={() => {
          setVisibleCreate(false);
        }}
      />
    </>
  );
};

export default ShowPrescriptions;
