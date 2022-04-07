import React, { useEffect, useState } from 'react';
import axios from '../../axiosApi';
import Table from "antd/lib/table";
import {Button, Divider, Popconfirm, notification, Skeleton, Empty} from 'antd';
import {PlusCircleOutlined, DeleteOutlined, FilePdfOutlined} from '@ant-design/icons';
import AddLabTestModal from './AddLabTestModal';
import UpdateLabTestModal from './UpdateLabTestModal';
//import "./custom.css";
//import { Button } from 'react-bootstrap';

const ShowLabTests = () => {
  const [lab_tests, setLabTests] = useState([]);
  const [visible_create, setVisibleCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllLabTests();
  }, []);

  const onCreate = async(values) => {
    values.test_date=new Date(Math.floor(values.test_date.getTime() - values.test_date.getTimezoneOffset() * 60000))
    console.log(values);
    await axios.post(`api/laboratory_test`, values).then(response=>{
      setLoading(true);
      console.log(response.data);
      getAllLabTests();
      notification.success({ message: 'Sėkmingai sukurta!' });
    })
    setVisibleCreate(false);
  };

  const deleteLabTest = async (id) => {
    try {
      await axios.delete(`api/laboratory_test/${id}`);
      getAllLabTests();
      notification.success({ message: 'Sėkmingai ištrinta!' });
    } catch (error) {
      console.error(error);
    }
  };

  const getAllLabTests = async () => {
    try {
      const res = await axios.get('api/laboratory_test');
      setLabTests(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmHandler = id => {
    setLoading(true);
    deleteLabTest(id);
  };

  const COLUMNS = [
    {
      title: "ID",
      dataIndex: 'test_id',
      key: "test_id"
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
        title: "Pavadinimas",
        dataIndex: 'name',
        key: "name"
    },
    {
        title: "Rodiklis",
        dataIndex: 'value_text',
        key: "value_text"
    },
    {
      title: "Reikšmė",
      dataIndex: 'value_numeric',
      key: "value_numeric"
  },
    {
      title: "Veiksmas",
      key: "action",
      render: (record) => {
        return (
          <div>
            <Button type="text" href='http://127.0.0.1:8000/static/meniu.pdf'>
              <FilePdfOutlined style={{ marginRight: 12, fontSize: '150%'}}/>
            </Button>
            <UpdateLabTestModal getAllLabTests={getAllLabTests} setLoading={setLoading} {...record}/>
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
      <h1>Laboratoriniai tyrimai</h1>
      <Divider></Divider>
      <Button className="mr-2 mb-3" size='large' onClick={() => {setVisibleCreate(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti lab. tyrimą</Button>

      <Table 
        columns={COLUMNS} 
        dataSource={loading? [] : lab_tests}
                locale={{
                emptyText: loading ? <Skeleton active={true} /> : <Empty />
              }} 
        size="middle" 
        rowKey={record => record.test_id} />
      <AddLabTestModal
        visible={visible_create}
        onCreate={onCreate}
        onCancel={() => {
          setVisibleCreate(false);
        }}
      />
    </>
  );
};

export default ShowLabTests;
