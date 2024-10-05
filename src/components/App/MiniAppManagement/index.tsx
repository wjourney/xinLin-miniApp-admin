import react, { Fragment, useState, useEffect } from "react";
import { Radio, Input, Button, Row, message, Table, Modal, Image } from "antd";
import { deleteHouse } from "@/api/houseManagement";
import "./index.scss";
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { getMiniAppUserList } from "@/api/index";

const { Search } = Input;
const { confirm } = Modal;

const HouseManagement: react.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleGetHouseList = async (currentPage: number) => {
    setLoading(true);
    const res = await getMiniAppUserList({
      pageNum: currentPage,
      pageSize: 10,
    });
    const { code, data } = res;
    if (code === 200) {
      setListData(data?.list);
      setTotal(data?.total);
    }
    setLoading(false);
  };

  const handleDeleteUser = async (record: any) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `确定删除${record?.username}用户吗`,
      onOk() {
        handleConfirmDeleteHouse(record?.id);
      },
      okText: "确认",
      cancelText: "取消",
    });
  };

  const handleConfirmDeleteHouse = async (id: number) => {
    const res = await deleteHouse(id);
    const { code, data } = res || {};
    if (code === 200) {
      handleGetHouseList(currentPage);
    } else {
      message.error("删除失败");
    }
  };

  useEffect(() => {
    handleGetHouseList(currentPage);
  }, [currentPage]);

  const column = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "电话",
      dataIndex: "phone",
    },
    {
      title: "头像",
      dataIndex: "avatar",
      render: (_: any, record: any) => (
        <Image
          style={{ width: 150, height: 150, objectFit: "cover" }}
          src={record?.thumbnail}
        />
      ),
      width: 200,
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleDeleteUser(record)}>
          注销
        </Button>
      ),
      width: 100,
      fixed: "right", // 固定操作列在右侧
    },
  ];

  return (
    <div>
      <Row gutter={16}>
        {/* <Col className="gutter-row" span={6}>
          <Search />
        </Col> */}
      </Row>
      <div style={{ width: "100%", overflowX: "auto" }}>
        <Table
          tableLayout="fixed"
          dataSource={listData}
          style={{ marginTop: 24 }}
          columns={column}
          loading={loading}
          scroll={{ x: 1000 }} // 设置横向和纵向滚动
          pagination={{
            current: currentPage,
            total: total,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
          onChange={(pagination: any) => {
            setCurrentPage(pagination.current);
          }}
        />
      </div>
    </div>
  );
};

export default HouseManagement;
