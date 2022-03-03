import React, { useEffect, useState } from 'react';
import axios from '../../axiosApi';
import Table from "antd/lib/table";
import { Button, Divider, Popconfirm, notification} from 'antd';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom';


const ShowVisits = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [visits, setVisits] = useState([]);

  const deleteVisit = async (id) => {
    try {
      await axios.delete(`api/visit/${id}`);
      getAllVisit();
      notification.success({ message: 'Sėkmingai ištrinta!' });
    } catch (error) {
      console.error(error);
    }
  };

  const getAllVisit = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('api/visit');
      setVisits(res.data);
      setIsLoading(false);
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
      dataIndex: ['room', 'number'],
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
      dataIndex: ['status', 'name'],
      key: "status"
    },
    {
      key: "action",
      title: "Veiksmai",
      render: (record) => {
        return (
          <div>
            <Link to={`/visit/${record.visit_id}`}>
              <EditOutlined style={{fontSize: '150%'}}/>
            </Link>
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
          </div>
        );
      },
    },
  ];
 

  return (
    <div>
      <h1>Vizitai</h1>
      <Button type="primary" style={{ float: 'left', marginBottom: 10 }}>
        <PlusCircleOutlined style={{fontSize: '125%'}}/>
        Pridėti vizitą
      </Button>
      <Table columns={COLUMNS} dataSource={visits} size="middle" rowKey={record => record.visit_id} />
    </div>
  );
};

export default ShowVisits;
