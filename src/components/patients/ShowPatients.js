import React, { useEffect, useState } from 'react';
import axios from '../../axiosApi';
import Table from "antd/lib/table";
import {Button, Divider, Popconfirm, notification, Empty, Skeleton} from 'antd';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AddPatientModal from './AddPatientModal';
import useGetColumnSearchProps from '../../utils/getColumnSearchProps';


const ShowPatients = () => {
  const getColumnSearchProps = useGetColumnSearchProps();
  const [patients, setPatients] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const onCreate = async(values) => {
    if (values.gender==='V')
    {
      values.image="https://www.shareicon.net/data/512x512/2016/09/01/822711_user_512x512.png"
    }
    else if (values.gender==='M')
    {
      values.image="https://www.shareicon.net/data/512x512/2016/09/01/822726_user_512x512.png"
    }
    values.birthday = values.birthday.toISOString().split('T')[0]
    values.full_name = values.name + ' ' + values.surname
    console.log(values);
    await axios.post(`api/patient`, values)
    .then(response=>{
      setLoading(true);
      console.log(response.data);
      console.log(response.data.patient_id);
      getAllPatient();
      notification.success({ message: 'Sėkmingai pridėta!' });
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
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmHandler = id => {
    setLoading(true);
    deletePatient(id);
  };

  useEffect(() => {
    getAllPatient();
  }, []);

  const COLUMNS = [
    {
      title: "ID",
      dataIndex: 'patient_id',
      key: "patient_id",
    },
    {
      title: "Vardas pavardė",
      dataIndex: 'full_name',
      key: "full_name",
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.surname.localeCompare(b.surname),
      ...getColumnSearchProps('full_name'),
    },
    {
      title: "Gimimo data",
      dataIndex: 'birthday',
      key: "birthday"
    },
    {
      title: "Lytis",
      dataIndex: 'gender',
      key: "gender",
      filters: [
        {
          text: 'Vyras',
          value: 'V',
        },
        {
          text: 'Moteris',
          value: 'M',
        },
      ],
      onFilter: (value, record) => record.gender.toString()===value,
      render: (text, record) => record.gender === 'V' ? 'Vyras' : 'Moteris'
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
              <EditOutlined style={{ color: "#08c", marginLeft: 5, fontSize: '150%'}}/>
            </Link>
            <Popconfirm
              placement='topLeft'
              title='Ar tikrai norite ištrinti?'
              okText='Taip'
              cancelText='Ne'
              onConfirm={() => confirmHandler(record.patient_id)}
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
      <h1>Pacientai</h1>
      <Divider style={{'background-color':"#08c"}}/>
      {localStorage.getItem('is_patient') === 'false' &&
      <Button className="mr-2 mb-3" size='large' onClick={() => {setVisible(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti pacientą</Button>}
      <Table columns={COLUMNS} 
             dataSource={loading? [] : patients}
             locale={{
              emptyText: loading ? <Skeleton active={true} /> : <Empty />
             }}
             size="middle" 
             rowKey={record => record.patient_id} />
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
