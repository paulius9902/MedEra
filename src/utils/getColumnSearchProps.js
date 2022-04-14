import { useRef } from 'react';
import { Button, Input, Space } from 'antd';
import { SearchOutlined, RedoOutlined} from '@ant-design/icons';
import get from "lodash.get";

const useGetColumnSearchProps = () => {
    const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm({ closeDropdown: false });
  };

  const handleReset = clearFilters => {
    clearFilters();
  };

  const handleClose = confirm => {
    confirm();
  };

  const getColumnSearchProps = (dataIndex) => {
    return ({
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
                  onClick={() => handleClose(confirm)}
                  size="small"
                  style={{ width: 90, color: "#08c" }}
                >
                  Uždaryti
                </Button>
                <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90, color: "#f50"}} icon={<RedoOutlined />} >
                  Iš naujo
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
    })
  };

  return getColumnSearchProps;
}

export default useGetColumnSearchProps;