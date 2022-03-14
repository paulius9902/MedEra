import React, { useEffect, useState } from 'react';
import axios from '../../axiosApi';
import Table from "antd/lib/table";
import {Button, Divider, Popconfirm, notification, Tag} from 'antd';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AddDiagnosisModal from './AddDiagnosisModal';
import { trackPromise } from 'react-promise-tracker';
//import { Button } from 'react-bootstrap';


const ShowDiagnoses = () => {

  const [diagnoses, setDiagnoses] = useState([]);
  const [visible, setVisible] = useState(false);

  const onCreate = async(values) => {
    values.birthday = values.birthday.toISOString().split('T')[0]
    console.log(values);
    await axios.post(`api/diagnosis`, values).then(response=>{
      console.log(response.data);
      getAllDiagnosis();
    })
    setVisible(false);
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
    } catch (error) {
      console.error(error);
    }
  };

  const confirmHandler = id => {
    deleteDiagnosis(id);
  };

  useEffect(() => {
    getAllDiagnosis();
  }, []);

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
            
            <Link to={`/diagnosis/${record.diagnosis_id}`}>
              <EditOutlined style={{ color: "blue", marginLeft: 5, fontSize: '150%'}}/>
            </Link>
            <Popconfirm
              placement='topLeft'
              title='Ar tikrai norite ištrinti?'
              okText='Taip'
              cancelText='Ne'
              onConfirm={() => confirmHandler(record.diagnosis_id)}
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
      <h1>Diagnozės</h1>

      <Button className="mr-2 mb-3" size='large' onClick={() => {setVisible(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti diagnozę</Button>

      <Table columns={COLUMNS} dataSource={diagnoses} size="middle" rowKey={record => record.diagnosis_id} />
      <AddDiagnosisModal
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </>
  );
};

export default ShowDiagnoses;
