import React, { useEffect, useState} from 'react';
import axios from '../../axiosApi';
import Table from "antd/lib/table";
import {Button, Divider, Popconfirm, notification, Skeleton, Empty, Tooltip} from 'antd';
import { Link } from 'react-router-dom';
import {PlusCircleOutlined, DeleteOutlined} from '@ant-design/icons';
import AddDiagnosisModal from './AddDiagnosisModal';
import UpdateDiagnosisModal from './UpdateDiagnosisModal';
import "./custom.css";
import useGetColumnSearchProps from '../../utils/getColumnSearchProps';
import moment from 'moment';

const ShowDiagnoses = () => {
  const getColumnSearchProps = useGetColumnSearchProps();
  const [diagnoses, setDiagnoses] = useState([]);
  const [visible_create, setVisibleCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDiagnosis();
  }, []);

  const onCreate = async(values) => {
    await axios.post(`api/diagnosis`, values).then(response=>{
      setLoading(true);
      getAllDiagnosis();
      notification.success({ message: 'Sėkmingai sukurta!' });
    })
    setVisibleCreate(false);
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
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmHandler = id => {
    setLoading(true);
    deleteDiagnosis(id);
  };

  const COLUMNS = [
    {
      title: "ID",
      dataIndex: 'diagnosis_id',
      key: "diagnosis_id"
    },
    {
        title: "Data",
        dataIndex: 'creation_date',
        key: "creation_date",
        defaultSortOrder: 'descend',
        sorter: (a, b) => moment(a.creation_date).unix() - moment(b.creation_date).unix(),
        render: (text, record) => text.slice(0, 19).replace('T', ' ')
    },
    {
        title: 'Pacientas',
        dataIndex: ['patient', 'full_name'],
        key: "patient_full_name",
        ...getColumnSearchProps(["patient", "full_name"]),
        render: (text, record) => <Link to={'/patient/' + record.patient.patient_id}>{text}</Link>
    },
    {
        title: 'Gydytojas',
        dataIndex: ['doctor', 'full_name'],
        key: "doctor_full_name",
        ...getColumnSearchProps(["doctor", "full_name"]),
        render: (text, record) => <Link to={'/doctor/' + record.doctor.doctor_id}>{text}</Link>,
    },
    {
        title: "Diagnozė",
        dataIndex: 'name',
        key: "name",
        ...getColumnSearchProps("name"),
    },
    {
      title: "Aprašymas",
      dataIndex: 'description',
      key: "description",
      ...getColumnSearchProps("description"),
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
    title: "Sistolinis/diastolinis kraujospūdis",
    dataIndex: 'systolic_blood_pressure',
    key: "systolic_blood_pressure",
    render: (text, record) => (
      <span>{record.systolic_blood_pressure}/{record.diastolic_blood_pressure}</span>
    )
  },
  {
    title: "Pulsas",
    dataIndex: 'heart_rate',
    key: "heart_rate",
  },
  {
    title: "Temperatūra",
    dataIndex: 'temperature',
    key: "temperature",
  },
  {
      title: "Veiksmai",
      key: "action",
      render: (record) => {
        return (
          localStorage.getItem('is_patient') === 'false' &&
          <React.Fragment>
            {localStorage.getItem('is_doctor') === 'true' &&
            <UpdateDiagnosisModal getAllDiagnosis={getAllDiagnosis} setLoading={setLoading} {...record}/>}
            <Popconfirm
              placement='topLeft'
              title='Ar tikrai norite ištrinti?'
              okText='Taip'
              cancelText='Ne'
              onConfirm={() => confirmHandler(record.diagnosis_id)}
            >
              <DeleteOutlined
                style={{ color: "#ff4d4f", marginLeft: 12, fontSize: '150%'}}
              />
            </Popconfirm>
          </React.Fragment>
        );
      }
  },
  ];
 
  return (
    <>
      <h1>Diagnozės</h1>
      <Divider style={{'backgroundColor':"#08c"}}/>
      {localStorage.getItem('is_doctor') === 'true' &&
      <Button className="mr-2 mb-3" size='large' onClick={() => {setVisibleCreate(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti diagnozę</Button>}

      <Table columns={COLUMNS} 
             dataSource={loading? [] : diagnoses}
              locale={{
              emptyText: loading ? <Skeleton active={true} /> : <Empty />
             }}
             size="middle" 
             rowKey={record => record.diagnosis_id} />
      {localStorage.getItem('is_doctor') === 'true' &&
      <AddDiagnosisModal
        visible={visible_create}
        onCreate={onCreate}
        onCancel={() => {
          setVisibleCreate(false);
        }}
        patient_id={null}
      />}
    </>
  );
};

export default ShowDiagnoses;
