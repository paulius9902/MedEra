import { useState, useEffect } from "react";
import axios from '../../axiosApi';
export const useTableSearch = ({ searchVal, retrieve }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [origData, setOrigData] = useState([]);
  const [searchIndex, setSearchIndex] = useState([]);

  const crawl = (user, allValues) => {
    if (!allValues) allValues = [];
    for (var key in user) {
      if (typeof user[key] === "object") {crawl(user[key], allValues);}
      else if (key==='full_name') allValues.push(user[key] + " ");
    }
    return allValues;
  };
  useEffect(() => {
    const fetchData = async () => {
      const { data: users } = await axios.get('api/visit');
      setOrigData(users);
      setFilteredData(users);
      const searchInd = users.map(user => {
        const allValues = crawl(user);
        return { allValues: allValues.toString() };
      });
      setSearchIndex(searchInd);
    };
    fetchData();
  }, [retrieve]);

  useEffect(() => {
    if (searchVal) {
      const reqData = searchIndex.map((user, index) => {
        if (user.allValues.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0)
          return origData[index];
        return null;
      });
      setFilteredData(
        reqData.filter(user => {
          if (user) return true;
          return false;
        })
      );
    } else setFilteredData(origData);
  }, [searchVal, origData, searchIndex]);

  return { filteredData };
};
