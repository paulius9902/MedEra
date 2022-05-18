import axios from '../../axiosApi';
import React, {useState, useEffect} from 'react';
import { useParams} from 'react-router';
import { Link } from 'react-router-dom';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, FilePdfOutlined} from '@ant-design/icons';
import {notification, Card, Form, Row, Col, Descriptions, Popconfirm, Table, Divider, Tag, Tooltip, Empty, Skeleton, Button} from 'antd';
import UpdatePatientModal from './UpdatePatientModal';
import AddPatientAllergiesModal from './AddPatientAllergiesModal';
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import callpdf from "../prescriptions/callpdf";
import AddDiagnosisModal from '../diagnoses/AddDiagnosisModal';
import AddLabTestModal from '../labTests/AddLabTestModal';
import AddPrescriptionModal from '../prescriptions/AddPrescriptionModal';

const PatientDetail = () => {

  const navigate = useNavigate();
  const [patient, setPatient] = useState([])
  const [allergies, setAllergies] = useState([])
  const [patient_allergies, setPatientAllergies] = useState([])
  const [filtered_allergies, setFilteredAllergies] = useState([])

  const [visits, setVisits] = useState([])
  const [loading_visits, setLoadingVisits] = useState(true);

  const [diagnoses, setDiagnoses] = useState([])
  const [loading_diagnoses, setLoadingDiagnoses] = useState(true);
  const [visible_diagnoses_create, setVisibleDiagnosesCreate] = useState(false);

  const [lab_tests, setLabTests] = useState([])
  const [loading_lab_tests, setLoadingLabTests] = useState(true);
  const [visible_lab_test_create, setVisibleLabTestCreate] = useState(false);

  const [prescriptions, setPrescriptions] = useState([])
  const [loading_prescriptions, setLoadingPrescriptions] = useState(true);
  const [visible_prescription_create, setVisiblePrescriptionCreate] = useState(false);

  const {id} = useParams();
  const [visible_patient, setVisiblePatient] = useState(false);
  const [visible_patient_allergies, setVisiblePatientAllergies] = useState(false);

  useEffect(() => {
    setFilteredAllergies(Object.values(allergies).filter(o1 => !Object.values(patient_allergies).some(o2 => o1.allergy_id === o2.allergy_id)))
  }, [patient_allergies, allergies]);

  useEffect(() => {
      getAllAllergies();
      getSinglePatient();
      getAllVisits();
      getAllDiagnoses();
      getAllLabTests();
      getAllPrescriptions();
  },[])

const COLUMNS_ALLERGIES = [
    {
      title: "Kodas",
      dataIndex: 'code',
      key: "code"
    },
    {
      title: "Pavadinimas",
      dataIndex: 'name',
      key: "name",
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
    title: "Aprašymas",
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
      title: "Veiksmai",
      key: "action",
      render: (record) => {
        
          return (
            <>
              {localStorage.getItem('is_doctor') === 'true' &&
              <Popconfirm
                placement='topLeft'
                title='Ar tikrai norite ištrinti?'
                okText='Taip'
                cancelText='Ne'
                onConfirm={() => confirmHandler(record.allergy_id)}
              >
                <DeleteOutlined
                  style={{ color: "#f50", marginLeft: 12, fontSize: '150%'}}
                />
              </Popconfirm>}
            </>
          );
      }
    },
  ];

  const COLUMNS_VISITS = [
    {
      title: "Vizito data",
      dataIndex: 'start_date',
      key: "start_date",
      onFilter: (value, record) => record.start_date.indexOf(value) === 0,
      defaultSortOrder: 'descend',
      sorter: (a, b) => moment(a.start_date).unix() - moment(b.start_date).unix(),
      render: (text, record) => text.slice(0, 16).replace('T', ' ')
    },
    {
      title: 'Gydytojas',
      dataIndex: ['doctor', 'full_name'],
      key: "doctor_name",
      render: (text, record) => <Link to={'/doctor/' + record.doctor.doctor_id}>{text}</Link>,
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
  ];

  const COLUMNS_DIAGNOSES = [
    {
        title: "Data",
        dataIndex: 'creation_date',
        key: "creation_date",
        defaultSortOrder: 'descend',
        sorter: (a, b) => moment(a.creation_date).unix() - moment(b.creation_date).unix(),
        render: (text, record) => text.slice(0, 19).replace('T', ' ')
    },
    {
        title: 'Gydytojas',
        dataIndex: ['doctor', 'full_name'],
        key: "doctor_full_name",
        render: (text, record) => <Link to={'/doctor/' + record.doctor.doctor_id}>{text}</Link>,
    },
    {
      title: "Diagnozė",
      dataIndex: 'name',
      key: "name",
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
      title: "Aprašymas",
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
      title: "Veiksmai",
      key: "action",
      render: (record) => {
        return (
          localStorage.getItem('is_patient') === 'false' &&
          <React.Fragment>
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


  const COLUMNS_LAB_TESTS = [
    {
      title: "Tyrimo data",
      dataIndex: 'test_date',
      key: "test_date",
      defaultSortOrder: 'descend',
      sorter: (a, b) => moment(a.test_date).unix() - moment(b.test_date).unix(),
      render: (text, record) => text.slice(0, 19).replace('T', ' ')
    },
    {
        title: 'Gydytojas',
        dataIndex: ['doctor', 'full_name'],
        key: "doctor_full_name",
        render: (text, record) => <Link to={'/doctor/' + record.doctor.doctor_id}>{text}</Link>,
    },
    {
      title: "Pavadinimas",
      dataIndex: 'name',
      key: "name",
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

  const COLUMNS_PRESCRIPTIONS = [
    {
      title: 'Išrašymo data',
      dataIndex: 'date',
      key: "date",
      defaultSortOrder: 'descend',
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      render: (text, record) => text.slice(0, 10).replace('T', ' ')
    },
    {
        title: 'Gydytojas',
        dataIndex: ['doctor', 'full_name'],
        key: "doctor_full_name",
        render: (text, record) => <Link to={'/doctor/' + record.doctor.doctor_id}>{text}</Link>,
    },
    {
      title: "Vaistas",
      dataIndex: 'medicine',
      key: "medicine",
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
        title: "Kiekis",
        dataIndex: 'quantity',
        key: "quantity"
    },
    {
      title: "Vartojimas",
      dataIndex: 'custom_usage',
      key: "custom_usage",
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
            <FilePdfOutlined onClick={() => callpdf(record)} style={{ marginRight: 12, fontSize: '150%'}}/>
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

  const deleteAllergy = async (allergy_id) => {
    try {
      await axios.delete(`api/patient/${id}/allergy/${allergy_id}`);
      getSinglePatient();
      notification.success({ message: 'Sėkmingai ištrinta!' });
    } catch (error) {
      console.error(error);
    }
  };

  const confirmHandler = id => {
    deleteAllergy(id);
  };

const onUpdate = async(values) => {
    values.full_name = values.name + ' ' + values.surname
    values.termination_date = values.termination_date ? values.termination_date.toISOString().split('T')[0] : values.termination_date
    await axios.patch(`api/patient/${id}`, values).then(response=>{
      getSinglePatient();
      notification.success({ message: 'Sėkmingai atnaujinta!' });
    })
    setVisiblePatient(false);
};

const onAddAllergies = async(values) => {
  const arr1d = [].concat(...Object.values(values));
  var res = Object.keys(arr1d).map(function(name){
    var obj = {};
    obj[`allergy`] = arr1d[name];
    return obj;
  });
  {res.map((allergy, index) => (
     axios.post(`api/patient/${id}/allergy`, JSON.stringify(allergy)).then(response=>{
      getSinglePatient();
      
    })
  ))}
  notification.success({ message: 'Sėkmingai pridėta!' });
  setVisiblePatientAllergies(false);
};

const getAllAllergies = async () => {
  await axios.get('api/allergy')
     .then((response) => {
      setAllergies(response.data);
     })
    .catch((error)=>{
       console.log(error);
    });
};

const getAllVisits = async () => {
  await axios.get(`api/patient/${id}/visit`)
     .then((response) => {
      setVisits(response.data);
      setLoadingVisits(false);
     })
    .catch((error)=>{
       console.log(error);
       setLoadingVisits(false);
    });
};

const getAllDiagnoses = async () => {
  await axios.get(`api/patient/${id}/diagnosis`)
     .then((response) => {
      setDiagnoses(response.data);
      setLoadingDiagnoses(false);
     })
    .catch((error)=>{
       console.log(error);
       setLoadingDiagnoses(false);
    });
};

const onCreateDiagnosis = async(values) => {
  values.patient = id
  await axios.post(`api/diagnosis`, values).then(response=>{
    setLoadingDiagnoses(true);
    getAllDiagnoses();
    notification.success({ message: 'Sėkmingai sukurta!' });
    setVisibleDiagnosesCreate(false)
  })
  setLoadingDiagnoses(false);
};

const onCreateLabTest = async(values) => {
  values.patient = id
  values.test_date=new Date(Math.floor(values.test_date.getTime() - values.test_date.getTimezoneOffset() * 60000))
  console.log(values);
  await axios.post(`api/laboratory_test`, values).then(response=>{
    setLoadingLabTests(true);
    getAllLabTests();
    notification.success({ message: 'Sėkmingai sukurta!' });
  })
  setVisibleLabTestCreate(false);
};

const onCreatePrescription = async(values) => {
  values.patient = id
  console.log(values);
  await axios.post(`api/prescription`, values).then(response=>{
    setLoadingPrescriptions(true);
    getAllPrescriptions();
    notification.success({ message: 'Sėkmingai sukurta!' });
  })
  setVisiblePrescriptionCreate(false);
};

const getAllLabTests = async () => {
  await axios.get(`api/patient/${id}/lab_test`)
     .then((response) => {
      setLabTests(response.data);
      setLoadingLabTests(false);
     })
    .catch((error)=>{
       console.log(error);
       setLoadingLabTests(false);
    });
};

const getAllPrescriptions = async () => {
  await axios.get(`api/patient/${id}/prescription`)
     .then((response) => {
      setPrescriptions(response.data);
      setLoadingPrescriptions(false);
     })
    .catch((error)=>{
       console.log(error);
       setLoadingPrescriptions(false);
    });
};

const getSinglePatient = async () => {
  await axios.get(`api/patient/${id}`)
     .then((response) => {
      setPatient(response.data);
      setPatientAllergies(response.data.allergies)
     })
    .catch((error)=>{
      console.log(error);
      navigate('/not_found');
    });
}

const deletePatient = async (id) => {
    try {
        await axios.delete(`api/patient/${id}`)
        notification.success({ message: 'Sėkmingai ištrinta!' });
    } catch (error) {
        console.error(error);
    }
}
return (
    <Card bordered={false} size="small" style={{ padding: 15 }}>
      <Divider style={{'backgroundColor':"#08c"}}/>
        <Form layout="vertical">
            <Row>
                <Col span={6}>
                    <Card
                    cover={
                        <img
                            className="img-fluid rounded mb-4 mb-lg-0"
                            src={patient.image}
                            alt=""
                        />
                        }
                    actions={localStorage.getItem('is_patient') === 'false' &&[
                        <Link style={{fontSize: '125%' }} onClick={() => {setVisiblePatient(true);}} to="#"><EditOutlined style={{color: "#2db7f5"}}/> Atnaujinti</Link>,
                        <Link style={{fontSize: '125%' }} to="/patient" onClick={() => deletePatient(patient.patient_id)}><DeleteOutlined style={{color: "#f50"}}/> Ištrinti</Link>,
                        ]}>
                    </Card>
                
                </Col>
                <Col span={18}>
                    <Card>
                        <Descriptions title="Paciento duomenys" bordered>
                        <Descriptions.Item label="Vardas" span={2}>{patient.name}</Descriptions.Item>
                        <Descriptions.Item label="Pavardė" span={2}>{patient.surname}</Descriptions.Item>
                        <Descriptions.Item label="Asmens kodas" span={2}>{patient.personal_code}</Descriptions.Item>
                        <Descriptions.Item label="Gimimo data" span={2}>{patient.birthday ? patient.birthday : '-'}</Descriptions.Item>
                        <Descriptions.Item label="Telefono nr." span={2}>{patient.phone_number}</Descriptions.Item>
                        <Descriptions.Item label="Gydosi iki" span={2}>{patient.termination_date ? patient.termination_date : '-'}</Descriptions.Item>
                        <Descriptions.Item label="Ūgis(cm)">{patient.height ? patient.height : '-'}</Descriptions.Item>
                        <Descriptions.Item label="Svoris(kg)">{patient.weight ? patient.weight : '-'}</Descriptions.Item>
                    </Descriptions>
                    </Card>
                </Col>
            <UpdatePatientModal
                visible={visible_patient}
                onCreate={onUpdate}
                onCancel={() => {
                setVisiblePatient(false);
                }}
            />
            <AddPatientAllergiesModal
                visible={visible_patient_allergies}
                onCreate={onAddAllergies}
                onCancel={() => {
                setVisiblePatientAllergies(false);
                }}
                allergies={filtered_allergies}
            />
            </Row>
            <Divider style={{'backgroundColor':"#08c"}}/>
            <Row>
              <Col span={12}>
                <Card>
                        <Descriptions title="Vizitai" bordered></Descriptions>
                        <Table  columns={COLUMNS_VISITS} 
                            dataSource={loading_visits? [] : visits}
                              locale={{
                              emptyText: loading_visits ? <Skeleton active={true} /> : <Empty />
                            }}
                            size="middle" 
                            rowKey={record => record.visit_id} 
                            style={{ whiteSpace: 'pre'}}/>
                        
                </Card>
              </Col>
              <Col span={11} offset={1}>
                <Card
                    actions={localStorage.getItem('is_doctor') === 'true' &&[
                        <Link style={{fontSize: '125%' }} to={'#'} onClick={() => {setVisiblePatientAllergies(true);}} ><PlusCircleOutlined style={{ color: "#87d068" }}/> Pridėti alergiją</Link>,
                        ]}>
                    <Descriptions title="Alergijos" bordered></Descriptions>
                    <Table  columns={COLUMNS_ALLERGIES} 
                        dataSource={patient.allergies}
                        size="middle" 
                        rowKey={record => record.allergy_id} 
                        style={{ whiteSpace: 'pre'}}/>
                    
                    </Card>
              </Col>
            </Row>
            <Divider style={{'backgroundColor':"#08c"}}/>
            <Row>
              <Col span={12}>
              <Card
                    actions={localStorage.getItem('is_doctor') === 'true' &&[
                        <Link style={{fontSize: '125%' }} to={'#'} onClick={() => {setVisibleDiagnosesCreate(true);}} ><PlusCircleOutlined style={{ color: "#87d068" }}/> Pridėti diagnozę</Link>,
                        ]}>
                        <Descriptions title="Diagnozės" bordered></Descriptions>
                        <Table  columns={COLUMNS_DIAGNOSES} 
                            dataSource={loading_diagnoses? [] : diagnoses}
                              locale={{
                              emptyText: loading_diagnoses ? <Skeleton active={true} /> : <Empty />
                            }}
                            size="middle" 
                            rowKey={record => record.diagnosis_id} 
                            style={{ whiteSpace: 'pre'}}/>
                        
                </Card>
              </Col>
              <Col span={11} offset={1}>
              <Card
                    actions={localStorage.getItem('is_doctor') === 'true' &&[
                        <Link style={{fontSize: '125%' }} to={'#'} onClick={() => {setVisibleLabTestCreate(true);}} ><PlusCircleOutlined style={{ color: "#87d068" }}/> Pridėti lab. tyrimą</Link>,
                        ]}>
                    <Descriptions title="Laboratoriniai tyrimai" bordered></Descriptions>
                    <Table  columns={COLUMNS_LAB_TESTS} 
                        dataSource={loading_lab_tests? [] : lab_tests}
                          locale={{
                          emptyText: loading_lab_tests ? <Skeleton active={true} /> : <Empty />
                        }}
                        size="middle" 
                        rowKey={record => record.test_id} 
                        style={{ whiteSpace: 'pre'}}/>
                    
                    </Card>
              </Col>
            </Row>
            <Divider style={{'backgroundColor':"#08c"}}/>
            <Row>
              <Col span={12}>
              <Card
                    actions={localStorage.getItem('is_doctor') === 'true' &&[
                        <Link style={{fontSize: '125%' }} to={'#'} onClick={() => {setVisiblePrescriptionCreate(true);}} ><PlusCircleOutlined style={{ color: "#87d068" }}/> Pridėti receptą</Link>,
                        ]}>
                        <Descriptions title="Receptai" bordered></Descriptions>
                        <Table  columns={COLUMNS_PRESCRIPTIONS} 
                            dataSource={loading_prescriptions? [] : prescriptions}
                              locale={{
                              emptyText: loading_prescriptions ? <Skeleton active={true} /> : <Empty />
                            }}
                            size="middle" 
                            rowKey={record => record.prescription_id} 
                            style={{ whiteSpace: 'pre'}}/>
                        
                </Card>
              </Col>
            </Row>
            <Divider style={{'backgroundColor':"#08c"}}/>
                    
            </Form>
            {localStorage.getItem('is_doctor') === 'true' &&
            <React.Fragment>
              <AddDiagnosisModal
                visible={visible_diagnoses_create}
                onCreate={onCreateDiagnosis}
                onCancel={() => {
                  setVisibleDiagnosesCreate(false);
                }}
                patient_id = {id}
              />
              <AddLabTestModal
                visible={visible_lab_test_create}
                onCreate={onCreateLabTest}
                onCancel={() => {
                  setVisibleLabTestCreate(false);
                }}
                patient_id = {id}
              />
              <AddPrescriptionModal
                visible={visible_prescription_create}
                onCreate={onCreatePrescription}
                onCancel={() => {
                  setVisiblePrescriptionCreate(false);
                }}
                patient_id = {id}
              />
              </React.Fragment>}
            </Card>
            );
};

export default PatientDetail;