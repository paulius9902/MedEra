import { useState, useEffect } from "react";
import axios from '../../axiosApi';
export const UseTableSearch = ({ searchVal, retrieve }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [origData, setOrigData] = useState([]);
  const [searchIndex, setSearchIndex] = useState([]);

  const crawl = (patient, allValues) => {
    if (!allValues) allValues = [];
    for (var key in patient) {
      if (typeof patient[key] === "object") {crawl(patient[key], allValues);}
      else if (key==='full_name') allValues.push(patient[key] + " ");
    }
    return allValues;
  };
  useEffect(() => {
    const fetchData = async () => {
      const { data: patients } = await axios.get('api/patient');
      setOrigData(patients);
      setFilteredData(patients);
      const searchInd = patients.map(patient => {
        const allValues = crawl(patient);
        return { allValues: allValues.toString() };
      });
      setSearchIndex(searchInd);
    };
    fetchData();
  }, [retrieve]);

  useEffect(() => {
    if (searchVal) {
      const reqData = searchIndex.map((patient, index) => {
        if (patient.allValues.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0)
          return origData[index];
        return null;
      });
      setFilteredData(
        reqData.filter(patient => {
          if (patient) return true;
          return false;
        })
      );
    } else setFilteredData(origData);
  }, [searchVal, origData, searchIndex]);

  return { filteredData };
};
