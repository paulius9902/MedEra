import React, { useEffect, useState } from 'react';
import axios from '../../axiosApi';
import Table from "antd/lib/table";
import {Button, Divider, Popconfirm, notification, Skeleton, Empty} from 'antd';
import {PlusCircleOutlined, DeleteOutlined} from '@ant-design/icons';
import AddDiagnosisModal from './AddDiagnosisModal';
import UpdateDiagnosisModal from './UpdateDiagnosisModal';
import "./custom.css";
//import { Button } from 'react-bootstrap';

const ShowDiagnoses = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [visible_create, setVisibleCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDiagnosis();
  }, []);

  const onCreate = async(values) => {
    console.log(values);
    await axios.post(`api/diagnosis`, values).then(response=>{
      setLoading(true);
      console.log(response.data);
      getAllDiagnosis();
      notification.success({ message: 'Sėkmingai sukurta!' });
    })
    setVisibleCreate(false);
  };

  const deleteDiagnosis = async (id) => {
    try {
      await axios.delete(`api/diagnosis/${id}`);
      getAllDiagnosis();
      notification.success({ message: 'Sėkmingai ištrinta!' });
    } catch (error) {
      console.error(error);
    }
  };

  const getAllDiagnosis = async () => {
    try {
      const res = await axios.get('api/diagnosis');
      setDiagnoses(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmHandler = id => {
    setLoading(true);
    deleteDiagnosis(id);
  };

  const COLUMNS = [
    {
      title: "ID",
      dataIndex: 'diagnosis_id',
      key: "diagnosis_id"
    },
    {
        title: "Data",
        dataIndex: 'creation_date',
        key: "creation_date"
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
        title: "Vizito priežastis",
        dataIndex: ['visit', 'health_issue'],
        key: "visit_health_issue"
    },
    {
        title: "Diagnozė",
        dataIndex: 'description',
        key: "description"
    },
    {
      title: "Veiksmai",
      key: "action",
      render: (record) => {
        return (
          <div>
            
            
            <UpdateDiagnosisModal getAllDiagnosis={getAllDiagnosis} setLoading={setLoading} {...record}/>
            <Popconfirm
              placement='topLeft'
              title='Ar tikrai norite ištrinti?'
              okText='Taip'
              cancelText='Ne'
              onConfirm={() => confirmHandler(record.diagnosis_id)}
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
      <h1>Diagnozės</h1>
      <Divider></Divider>
      <Button className="mr-2 mb-3" size='large' onClick={() => {setVisibleCreate(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti diagnozę</Button>

      <Table columns={COLUMNS} 
             dataSource={loading? [] : diagnoses}
              locale={{
              emptyText: loading ? <Skeleton active={true} /> : <Empty />
             }}
             size="middle" 
             rowKey={record => record.diagnosis_id} />
      <AddDiagnosisModal
        visible={visible_create}
        onCreate={onCreate}
        onCancel={() => {
          setVisibleCreate(false);
        }}
      />
    </>
  );
};

export default ShowDiagnoses;
