import React, { useEffect, useState } from 'react';
import axios from '../../axiosApi';
import { useParams, useNavigate } from 'react-router';
import Table from "antd/lib/table";
import {Button, Divider, Popconfirm, notification, Tag, Menu, Dropdown} from 'antd';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, DownOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AddUserAdminModal from './AddUserModal';
import UpdateUserModal from './UpdateUserModal';
import { trackPromise } from 'react-promise-tracker';
//import { Button } from 'react-bootstrap';

const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const [visible_create_admin, setVisibleCreateAdmin] = useState(false);

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
        key: "email"
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
        title: "Administratorius",
        dataIndex: 'is_superuser',
        key: "is_superuser",
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
            <UpdateUserModal getAllUsers={getAllUsers} {...record}/>
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
      <Divider></Divider>
      <Button className="mr-2 mb-3" size='large' onClick={() => {setVisibleCreateAdmin(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Sukurti vartotoją</Button>
      <Table columns={COLUMNS} dataSource={users} size="middle" rowKey={record => record.id} />
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