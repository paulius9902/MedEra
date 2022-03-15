import React, { useEffect, useState } from 'react';
import axios from '../../axiosApi';
import Table from "antd/lib/table";
import {Button, Popconfirm, notification, Tag} from 'antd';
import {PlusCircleOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, SyncOutlined, CloseCircleOutlined, CheckCircleOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AddVisitModal from './AddVisitModal';


const ShowVisits = () => {

  const [visits, setVisits] = useState([]);
  const [visible, setVisible] = useState(false);

  const onCreate = async(values) => {
    console.log(values);
    values.status = 1
    values.start_date=new Date(Math.floor(values.start_date.getTime() - values.start_date.getTimezoneOffset() * 60000))

    await axios.post(`api/visit`, values).then(response=>{
      console.log(response.data);
      getAllVisit();
    })
    setVisible(false);
  };

  const deleteVisit = async (id) => {
    try {
      await axios.delete(`api/visit/${id}`);
      getAllVisit();
      notification.success({ message: 'Sėkmingai ištrinta!' });
    } catch (error) {
      console.error(error);
    }
  };

  const confirmVisit = async (id) => {
    try {
      const status = { status: '2' };
      await axios.patch(`api/visit/${id}`, status);
      getAllVisit();
      notification.success({ message: 'Vizitas patvirtintas!' });
    } catch (error) {
      console.error(error);
    }
  };

  const cancelVisit = async (id) => {
    try {
      const status = { status: '3' };
      await axios.patch(`api/visit/${id}`, status);
      getAllVisit();
      notification.error({ message: 'Vizitas atšauktas!' });
    } catch (error) {
      console.error(error);
    }
  };

  const getAllVisit = async () => {
    try {
      const res = await axios.get('api/visit');
      setVisits(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmHandler = id => {
    deleteVisit(id);
  };

  useEffect(() => {
    getAllVisit();
  }, []);

  const COLUMNS = [
    {
      title: "ID",
      dataIndex: 'visit_id',
      key: "visit_id"
    },
    {
      title: "Vizito data",
      dataIndex: 'start_date',
      key: "start_date"
    },
    {
      title: "Kabinetas",
      dataIndex: ['doctor', 'room'],
      key: "room_number"
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
      title: "Vizito priežastis",
      dataIndex: 'health_issue',
      key: "health_issue"
    },
    {
      title: "Statusas",
      dataIndex: ['status', 'status_id'],
      key: "status_id",
      render :(status_id) => {
        if (status_id===1) {
          return (
            <Tag icon={<SyncOutlined spin />} color="processing" key={status_id}>
              Laukiama patvirtinimo
            </Tag>
          )
        } else if (status_id===2) {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Patvirtintas
            </Tag>
          )
        } else {
          return (
            <Tag icon={<CloseCircleOutlined />} color="error" key={status_id}>
              Atšauktas
            </Tag>
          )
        }
      }
    },
    {
      title: "Veiksmai",
      key: "action",
      render: (record) => {
        if (record.status.status_id===1) {
          return (
            <div>
              <Link to={`/visit/`} onClick={() => confirmVisit(record.visit_id)}>
                <CheckOutlined style={{color: "green", fontSize: '150%'}}/>
              </Link>
              <Link to={`/visit/`} onClick={() => cancelVisit(record.visit_id)}>
                <CloseOutlined style={{color: "red", fontSize: '150%'}}/>
              </Link>
            </div>
          );
        }
        else {
          return (
            <>
              <Popconfirm
                placement='topLeft'
                title='Ar tikrai norite ištrinti?'
                okText='Taip'
                cancelText='Ne'
                onConfirm={() => confirmHandler(record.visit_id)}
              >
                <DeleteOutlined
                  style={{ color: "red", marginLeft: 12, fontSize: '150%'}}
                />
              </Popconfirm>
            </>
          );
        }
      }
    },
  ];

  return (
    <>
      <h1>Vizitai</h1>

      <Button className="mr-2 mb-3" size='large' onClick={() => {setVisible(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti vizitą</Button>

      <Table columns={COLUMNS} dataSource={visits} size="middle" rowKey={record => record.visit_id} />
      <AddVisitModal
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </>
  );
};

export default ShowVisits;
