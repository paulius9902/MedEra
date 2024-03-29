import React, { useEffect, useState } from 'react';
import axios from '../../axiosApi';
import Table from "antd/lib/table";
import {Button, Divider, Popconfirm, notification, Skeleton, Empty, Tooltip} from 'antd';
import {PlusCircleOutlined, DeleteOutlined, FilePdfOutlined} from '@ant-design/icons';
import AddLabTestModal from './AddLabTestModal';
import { Link } from 'react-router-dom';
import useGetColumnSearchProps from '../../utils/getColumnSearchProps';
import moment from 'moment';

const ShowLabTests = () => {
  const getColumnSearchProps = useGetColumnSearchProps();
  const [lab_tests, setLabTests] = useState([]);
  const [visible_create, setVisibleCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllLabTests();
  }, []);

  const onCreate = async(values) => {
    values.test_date=new Date(Math.floor(values.test_date.getTime() - values.test_date.getTimezoneOffset() * 60000))
    await axios.post(`api/laboratory_test`, values).then(response=>{
      setLoading(true);
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
        title: "Pridėjimo data",
        dataIndex: 'creation_date',
        key: "creation_date",
        render: (text, record) => text.slice(0, 19).replace('T', ' ')
    },
    {
      title: "Tyrimo data",
      dataIndex: 'test_date',
      key: "test_date",
      defaultSortOrder: 'descend',
      sorter: (a, b) => moment(a.test_date).unix() - moment(b.test_date).unix(),
      render: (text, record) => text.slice(0, 19).replace('T', ' ')
    },
    {
        title: 'Pacientas',
        dataIndex: ['patient', 'full_name'],
        key: "patient_full_name",
        ...getColumnSearchProps(['patient', 'full_name']),
        render: (text, record) => <Link to={'/patient/' + record.patient.patient_id}>{text}</Link>
    },
    {
        title: 'Gydytojas',
        dataIndex: ['doctor', 'full_name'],
        key: "doctor_full_name",
        ...getColumnSearchProps(['doctor', 'full_name']),
        render: (text, record) => <Link to={'/doctor/' + record.doctor.doctor_id}>{text}</Link>,
    },
    {
      title: "Pavadinimas",
      dataIndex: 'name',
      key: "name",
      ...getColumnSearchProps("name"),
      onCell: () => {
        return {
           style: {
              whiteSpace: 'nowrap',
              maxWidth: 150,
           }
        }
     },
     render: (text) => (
        <Tooltip title={text} placement="topLeft">
           <div style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{text}</div>
        </Tooltip>
     )
  },
    {
      title: "Veiksmas",
      key: "action",
      render: (record) => {
        return (
          <div>
            <Button type="text" href={record.docfile}>
              <FilePdfOutlined style={{  fontSize: '150%'}}/>
            </Button>
            {localStorage.getItem('is_patient') === 'false' &&
            <Popconfirm
              placement='topLeft'
              title='Ar tikrai norite ištrinti?'
              okText='Taip'
              cancelText='Ne'
              onConfirm={() => confirmHandler(record.test_id)}
            >
              <DeleteOutlined
                style={{ color: "#ff4d4f", fontSize: '150%'}}
              />
            </Popconfirm>}
          </div>
        );
      }
    },
  ];
 

  return (
    <>
      <h1>Laboratoriniai tyrimai</h1>
      <Divider style={{'backgroundColor':"#08c"}}/>
      {localStorage.getItem('is_doctor') === 'true' &&
      <Button className="mr-2 mb-3" size='large' onClick={() => {setVisibleCreate(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti lab. tyrimą</Button>
      }
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
        patient_id={null}
      />
    </>
  );
};

export default ShowLabTests;
