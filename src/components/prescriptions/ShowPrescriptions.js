import React, { useEffect, useState } from 'react';
import axios from '../../axiosApi';
import Table from "antd/lib/table";
import {Button, Divider, Popconfirm, notification, Skeleton, Empty} from 'antd';
import {PlusCircleOutlined, DeleteOutlined, FilePdfOutlined} from '@ant-design/icons';
import AddPrescriptionModal from './AddPrescriptionModal';
import UpdatePrescriptionModal from './UpdatePrescriptionModal';
import callpdf from "./callpdf";
import { Link } from 'react-router-dom';
import useGetColumnSearchProps from '../../utils/getColumnSearchProps';
import moment from 'moment';

const ShowPrescriptions = () => {
  const getColumnSearchProps = useGetColumnSearchProps();
  const [prescriptions, setPrescriptions] = useState([]);
  const [visible_create, setVisibleCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPrescriptions();
  }, []);

  const onCreate = async(values) => {
    console.log(values)
    await axios.post(`api/prescription`, values).then(response=>{
      setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmHandler = id => {
    setLoading(true);
    deletePrescription(id);
  };

  const COLUMNS = [
    {
      title: "ID",
      dataIndex: 'prescription_id',
      key: "prescription_id"
    },
    {
      title: 'Išrašymo data',
      dataIndex: 'date',
      key: "date",
      defaultSortOrder: 'descend',
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      render: (text, record) => text.slice(0, 10).replace('T', ' ')
  },
    {
        title: 'Pacientas',
        dataIndex: ['patient', 'full_name'],
        key: "patient_full_name",
        ...getColumnSearchProps(['patient', 'full_name']),
        render: (text, record) => <Link to={'/patient/' + record.doctor.doctor_id}>{text}</Link>,
    },
    {
        title: 'Gydytojas',
        dataIndex: ['doctor', 'full_name'],
        key: "doctor_full_name",
        ...getColumnSearchProps(['doctor', 'full_name']),
        render: (text, record) => <Link to={'/doctor/' + record.doctor.doctor_id}>{text}</Link>,
    },
    {
        title: "Vaistas",
        dataIndex: 'medicine',
        key: "medicine",
        ...getColumnSearchProps('medicine'),
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
      title: "Veiksmas",
      key: "action",
      render: (record) => {
        return (
          <div>
            <FilePdfOutlined onClick={() => callpdf(record)} style={{ marginRight: 12, fontSize: '150%'}}/>
            {localStorage.getItem('is_doctor') === 'true' &&
            <UpdatePrescriptionModal getAllPrescriptions={getAllPrescriptions} setLoading={setLoading} {...record}/>}
            {localStorage.getItem('is_patient') === 'false' &&
            <Popconfirm
              placement='topLeft'
              title='Ar tikrai norite ištrinti?'
              okText='Taip'
              cancelText='Ne'
              onConfirm={() => confirmHandler(record.prescription_id)}
            >
              <DeleteOutlined
                style={{ color: "#ff4d4f", marginLeft: 12, fontSize: '150%'}}
              />
            </Popconfirm>}
          </div>
        );
      }
    },
  ];
 

  return (
    <>
      <h1>Receptai</h1>
      <Divider style={{'backgroundColor':"#08c"}}/>
      {localStorage.getItem('is_doctor') === 'true' &&
      <Button className="mr-2 mb-3" size='large' onClick={() => {setVisibleCreate(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti receptą</Button>}

      <Table 
        columns={COLUMNS} 
        dataSource={loading? [] : prescriptions}
                locale={{
                emptyText: loading ? <Skeleton active={true} /> : <Empty />
              }} 
        size="middle" 
        rowKey={record => record.prescription_id} />
      <AddPrescriptionModal
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

export default ShowPrescriptions;
