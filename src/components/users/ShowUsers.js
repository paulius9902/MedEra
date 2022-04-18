import React, { useEffect, useState } from 'react';
import axios from '../../axiosApi';
import Table from "antd/lib/table";
import {Button, Divider, Popconfirm, notification, Skeleton, Empty} from 'antd';
import {PlusCircleOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import AddUserAdminModal from './AddUserModal';
import UpdateUserModal from './UpdateUserModal';
import useGetColumnSearchProps from '../../utils/getColumnSearchProps';
import { Link } from 'react-router-dom';
//import { Button } from 'react-bootstrap';

const ShowUsers = () => {
  const getColumnSearchProps = useGetColumnSearchProps();
  const [users, setUsers] = useState([]);
  const [visible_create_admin, setVisibleCreateAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers();
  }, []);

  const onCreate = async(values) => {
    console.log(values);
    if (values.role === "A")
    {
      values.is_superuser=true
    }
    else if (values.role === "D") {
      values.is_doctor=true
    } else {
      values.is_patient=true
    }
    await axios.post(`api/user`, values).then(response=>{
      setLoading(true);
      console.log(response.data);
      getAllUsers();
      notification.success({ message: 'Sėkmingai sukurta!' });
    })
    setVisibleCreateAdmin(false);
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`api/user/${id}`);
      getAllUsers();
      notification.success({ message: 'Sėkmingai ištrinta!' });
    } catch (error) {
      console.error(error);
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await axios.get('api/user');
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmHandler = id => {
    deleteUser(id);
  };

  const COLUMNS = [
    {
      title: "ID",
      dataIndex: 'id',
      key: "id"
    },
    {
        title: "El. paštas",
        dataIndex: 'email',
        key: "email",
        ...getColumnSearchProps('email'),
    },
    {
        title: 'Pacientas',
        dataIndex: ['patient', 'full_name'],
        key: "patient_full_name",
        ...getColumnSearchProps(['patient', 'full_name']),
        render: (text, record) => record.patient===null?'':<Link to={'/patient/' + record.patient.patient_id}>{text}</Link>,
    },
    {
        title: 'Gydytojas',
        dataIndex: ['doctor', 'full_name'],
        key: "doctor_full_name",
        ...getColumnSearchProps(['doctor', 'full_name']),
        render: (text, record) => record.doctor===null?'':<Link to={'/doctor/' + record.doctor.doctor_id}>{text}</Link>,
    },
    {
        title: "Administratorius",
        dataIndex: 'is_superuser',
        key: "is_superuser",
        filters: [
          {
            text: 'Taip',
            value: true,
          },
          {
            text: 'Ne',
            value: false,
          },
        ],
        onFilter: (value, record) => record.is_superuser===value,
        render :(is_superuser) => {
          if (is_superuser===true) {
            return (
              <CheckCircleOutlined style={{ fontSize: '125%', color:"#52c41a"}}/>
            )
          } else {
            return (
              <CloseCircleOutlined style={{ fontSize: '125%', color:"#f5222d"}}/>
            )
          }
        }
    },
    {
      title: "Gydytojas",
      dataIndex: 'is_doctor',
      key: "is_doctor",
      filters: [
        {
          text: 'Taip',
          value: true,
        },
        {
          text: 'Ne',
          value: false,
        },
      ],
      onFilter: (value, record) => record.is_doctor===value,
      render :(is_doctor) => {
        if (is_doctor===true) {
          return (
            <CheckCircleOutlined style={{ fontSize: '125%', color:"#52c41a"}}/>
          )
        } else {
          return (
            <CloseCircleOutlined style={{ fontSize: '125%', color:"#f5222d"}}/>
          )
        }
      }
    },
    {
      title: "Pacientas",
      dataIndex: 'is_patient',
      key: "is_patient",
      filters: [
        {
          text: 'Taip',
          value: true,
        },
        {
          text: 'Ne',
          value: false,
        },
      ],
      onFilter: (value, record) => record.is_patient===value,
      render :(is_patient) => {
        if (is_patient===true) {
          return (
            <CheckCircleOutlined style={{ fontSize: '125%', color:"#52c41a"}}/>
          )
        } else {
          return (
            <CloseCircleOutlined style={{ fontSize: '125%', color:"#f5222d"}}/>
          )
        }
      }
    },
    {
      title: "Aktyvus",
      dataIndex: String('is_active'),
      key: "is_active",
      filters: [
        {
          text: 'Taip',
          value: true,
        },
        {
          text: 'Ne',
          value: false,
        },
      ],
      onFilter: (value, record) => record.is_active===value,
      render :(is_active) => {
        if (is_active===true) {
          return (
            <CheckCircleOutlined style={{ fontSize: '125%', color:"#52c41a"}}/>
          )
        } else {
          return (
            <CloseCircleOutlined style={{ fontSize: '125%', color:"#f5222d"}}/>
          )
        }
      }
    },
    {
      title: "Veiksmai",
      key: "action",
      render: (record) => {
        return (
          <div>
            <UpdateUserModal getAllUsers={getAllUsers} setLoading={setLoading} {...record}/>
            <Popconfirm
              placement='topLeft'
              title='Ar tikrai norite ištrinti?'
              okText='Taip'
              cancelText='Ne'
              onConfirm={() => confirmHandler(record.id)}>
              <DeleteOutlined
                style={{ color: "#ff4d4f", marginLeft: 12, fontSize: '150%'}}/>
            </Popconfirm>
          </div>
        );
      }
    },
  ];

  return (
    <>
      <h1>Vartotojai</h1>
      <Divider style={{'background-color':"#08c"}}/>
      <Button className="mr-2 mb-3" size='large' onClick={() => {setVisibleCreateAdmin(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Sukurti vartotoją</Button>
      <Table 
        columns={COLUMNS} 
        dataSource={loading? [] : users}
                locale={{
                emptyText: loading ? <Skeleton active={true} /> : <Empty />
              }} 
        size="middle" 
        rowKey={record => record.id} />
      <AddUserAdminModal
        visible={visible_create_admin}
        onCreate={onCreate}
        onCancel={() => {
          setVisibleCreateAdmin(false);
        }}
      />
    </>
  );
};

export default ShowUsers;