import React, { useEffect, useState} from 'react';
import axios from '../../axiosApi';
import Table from "antd/lib/table";
import {Button, Popconfirm, notification, Tag, Divider, Skeleton, Empty, Tooltip} from 'antd';
import {PlusCircleOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, SyncOutlined, CloseCircleOutlined, CheckCircleOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AddVisitModal from './AddVisitModal';
import UpdateVisitModal from './UpdateVisitModal';
import moment from 'moment';
import useGetColumnSearchProps from '../../utils/getColumnSearchProps';

const ShowVisits = () => {
  const getColumnSearchProps = useGetColumnSearchProps();
  const [visits, setVisits] = useState([]);
  const [visits_dates, setVisitsDates] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading_data, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);

  const onCreate = async(values, form) => {
    values.status = 1
    values.start_date=new Date(Math.floor(values.start_date.getTime() - values.start_date.getTimezoneOffset() * 60000))
    await axios.post(`api/visit`, values).then(response=>{
      setLoading(true);
      form.resetFields();
      getAllVisitDates();
      getAllVisit();
      notification.success({ message: 'Vizitas sukurtas!' });
    })
    setVisible(false);
  };

  const deleteVisit = async (id) => {
    try {
      await axios.delete(`api/visit/${id}`);
      getAllVisitDates();
      getAllVisit();
      notification.success({ message: 'Sėkmingai ištrinta!' });
    } catch (error) {
      console.error(error);
    }
  };

  const confirmVisit = async (id) => {
    try {
      setLoading(true);
      const status = { status: '2' };
      await axios.patch(`api/visit/${id}`, status);
      await axios.get(`api/visit_confirm_email/${id}`);
      getAllVisit();
      notification.success({ message: 'Vizitas patvirtintas!' });
    } catch (error) {
      console.error(error);
    }
  };

  const cancelVisit = async (id) => {
    try {
      setLoading(true);
      const status = { status: '3' };
      await axios.patch(`api/visit/${id}`, status);
      await axios.get(`api/visit_cancel_email/${id}`);
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
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllVisitDates = async () => {
    try {
      const res = await axios.get('api/visit_dates');
      setVisitsDates(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDoctors = async () => {
    const result = await axios.get("api/doctor");
    setDoctors(result.data.reverse());
  };

  const confirmHandler = id => {
    setLoading(true);
    deleteVisit(id);
  };

  useEffect(() => {
    getAllVisitDates();
    loadDoctors();
    getAllVisit();
  }, []);

  const COLUMNS = [
    {
      title: "ID",
      dataIndex: 'visit_id',
      key: "visit_id",
    },
    {
      title: "Vizito data",
      dataIndex: 'start_date',
      key: "start_date",
      filters: [
        {
          text: 'Vakar',
          value: moment().subtract(1, 'days').format("YYYY-MM-DD"),
        },
        {
          text: 'Šiandien',
          value: moment().format("YYYY-MM-DD"),
        },
        {
          text: 'Ryt',
          value: moment().add(1, 'days').format("YYYY-MM-DD"),
        },
        {
          text: 'Poryt',
          value: moment().add(2, 'days').format("YYYY-MM-DD"),
        },
      ],
      onFilter: (value, record) => record.start_date.indexOf(value) === 0,
      defaultSortOrder: 'descend',
      sorter: (a, b) => moment(a.start_date).unix() - moment(b.start_date).unix(),
      render: (text, record) => text.slice(0, 16).replace('T', ' ')
    },
    {
      title: "Kabinetas",
      dataIndex: ['doctor', 'room'],
      key: 'room_number',
    },
    {
      title: 'Gydytojas',
      dataIndex: ['doctor', 'full_name'],
      key: "doctor_name",
      filters: [
        {
          text: 'Mano vizitai',
          value: localStorage.getItem('doctor_id'),
        },
      ],
      ...getColumnSearchProps(['doctor', 'full_name']),
      render: (text, record) => <Link to={'/doctor/' + record.doctor.doctor_id}>{text}</Link>,
    },
    {
      title: 'Pacientas',
      dataIndex: ['patient', 'full_name'],
      key: "patient_name",
      ...getColumnSearchProps(['patient', 'full_name']),
      render: (text, record) => <Link to={'/patient/' + record.patient.patient_id}>{text}</Link>
    },
    {
      title: "Vizito priežastis",
      dataIndex: 'health_issue',
      key: "health_issue",
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
      title: "Komentaras",
      dataIndex: 'description',
      key: "description",
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
      title: "Statusas",
      dataIndex: ['status', 'status_id'],
      key: "status_id",
      filters: [
        {
          text: 'Laukiama patvirtinimo',
          value: 1,
        },
        {
          text: 'Patvirtintas',
          value: 2,
        },
        {
          text: 'Atšauktas',
          value: 3,
        },
      ],
      onFilter: (value, record) => record.status.status_id===value,
      render :(status_id) => {
        if (status_id===1) {
          return (
            <Tag style={{ fontSize: '100%'}} icon={<SyncOutlined spin />} color="processing">
              Laukiama patvirtinimo
            </Tag>
          )
        } else if (status_id===2) {
          return (
            <Tag style={{ fontSize: '100%'}}icon={<CheckCircleOutlined />} color="success">
              Patvirtintas
            </Tag>
          )
        } else {
          return (
            <Tag style={{ fontSize: '100%'}}icon={<CloseCircleOutlined />} color="error">
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
              {localStorage.getItem('is_patient') === 'false' &&
              <React.Fragment>
                <Link to={`/visit/`} onClick={() => confirmVisit(record.visit_id)}>
                  <CheckOutlined style={{color: "#87d068", fontSize: '150%'}} />
                </Link>
                <Link to={`/visit/`} onClick={() => cancelVisit(record.visit_id)} >
                  <CloseOutlined style={{color: "#f50", fontSize: '150%', marginLeft: 8,}} />
                </Link>
                </React.Fragment>}
              <Popconfirm
                placement='topLeft'
                title='Ar tikrai norite ištrinti?'
                okText='Taip'
                cancelText='Ne'
                onConfirm={() => confirmHandler(record.visit_id)}
              >
                <DeleteOutlined
                  style={{ color: "#f50", marginLeft: 8, fontSize: '150%'}}
                />
              </Popconfirm>
            </div>
          );
        }
        else if(record.status.status_id!==1){
          return (
            <>
              {localStorage.getItem('is_doctor') === 'true' &&
              <UpdateVisitModal getAllVisit={getAllVisit} setLoading={setLoading} {...record}/>}
              {localStorage.getItem('is_patient') === 'false' &&
              <Popconfirm
                placement='topLeft'
                title='Ar tikrai norite ištrinti?'
                okText='Taip'
                cancelText='Ne'
                onConfirm={() => confirmHandler(record.visit_id)}
              >
                <DeleteOutlined
                  style={{ color: "#f50", marginLeft: 8, fontSize: '150%'}}
                />
              </Popconfirm>}
              {(localStorage.getItem('is_patient') === 'true' && moment(record.start_date).unix() > moment().unix() && record.status.status_id === 2) &&
                <Link to={`/visit/`} onClick={() => cancelVisit(record.visit_id)} >
                  <CloseOutlined style={{color: "#f50", fontSize: '150%', marginLeft: 8,}} />
                </Link>}
            </>
          );
        }
      }
    },
  ];

  return (
    <>
      <h1>Vizitai</h1>
      <Divider style={{'backgroundColor':"#08c"}}/>
      {localStorage.getItem('is_patient') === 'true' &&
      <Button className="mr-2 mb-3" size='large' onClick={() => {setVisible(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti vizitą</Button>}
      <Table  columns={COLUMNS} 
              dataSource={loading_data? [] : visits}
                locale={{
                emptyText: loading_data ? <Skeleton active={true} /> : <Empty />
              }}
              size="middle" 
              rowKey={record => record.visit_id} 
              style={{ whiteSpace: 'pre'}}/>
      <AddVisitModal
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
        visits={visits_dates}
        doctors = {doctors}
      />
    </>
  );
};

export default ShowVisits;
