import React, { useEffect, useState, useRef } from 'react';
import axios from '../../axiosApi';
import Table from "antd/lib/table";
import {Button, Divider, Popconfirm, notification, Skeleton, Empty, Tooltip, Input, Space} from 'antd';
import { Link } from 'react-router-dom';
import {PlusCircleOutlined, DeleteOutlined, SearchOutlined} from '@ant-design/icons';
import AddDiagnosisModal from './AddDiagnosisModal';
import UpdateDiagnosisModal from './UpdateDiagnosisModal';
import Highlighter from 'react-highlight-words';
import "./custom.css";
import get from "lodash.get";
import isequal from "lodash.isequal";

const ShowDiagnoses = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [visible_create, setVisibleCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    getAllDiagnosis();
  }, []);

  const onCreate = async(values) => {
    console.log(values);
    await axios.post(`api/diagnosis`, values).then(response=>{
      setLoading(true);
      console.log(response.data);
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

  const  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm({ closeDropdown: false });
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex)
   
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
  };

  const handleClose = confirm => {
    confirm();
  };

  const getColumnSearchProps = dataIndex => ({

    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Paieška...`}
          value={selectedKeys[0]}
          onPressEnter={() => handleClose(confirm)}
          onChange={e => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            handleSearch(selectedKeys, confirm, dataIndex);}}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleClose(confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Uždaryti
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Ištrinti
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      get(record, dataIndex)
        ? get(record, dataIndex).toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
        if (visible) {    setTimeout(() => searchInput.current.select());   }
    },
    render: text =>
      isequal(searchedColumn, dataIndex) ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

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
        title: "Vizito priežastis",
        dataIndex: ['visit', 'health_issue'],
        key: "visit_health_issue",
        ...getColumnSearchProps(['visit', 'health_issue']),
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
      <Divider></Divider>
      {localStorage.getItem('is_doctor') === 'true' &&
      <Button className="mr-2 mb-3" size='large' onClick={() => {setVisibleCreate(true);}} style={{float: 'left', background: '#28a745', color: 'white', borderColor: '#28a745'}}><PlusCircleOutlined style={{fontSize: '125%' }}/> Pridėti diagnozę</Button>}

      <Table columns={COLUMNS} 
             dataSource={loading? [] : diagnoses}
              locale={{
              emptyText: loading ? <Skeleton active={true} /> : <Empty />
             }}
             size="middle" 
             rowKey={record => record.diagnosis_id} />
      {localStorage.getItem('is_patient') === 'false' &&
      <AddDiagnosisModal
        visible={visible_create}
        onCreate={onCreate}
        onCancel={() => {
          setVisibleCreate(false);
        }}
      />}
    </>
  );
};

export default ShowDiagnoses;
