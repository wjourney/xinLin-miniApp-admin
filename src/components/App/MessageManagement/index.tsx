import react, { Fragment, useState, useEffect } from "react";
import { Table, Modal } from "antd";

import { getMessageList } from "@/api/index";

const HouseManagement: react.FC = () => {
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 当前页码

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleGetMessageList = async (currentPage: number) => {
    setLoading(true);
    const res = await getMessageList({
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

  useEffect(() => {
    handleGetMessageList(currentPage);
  }, [currentPage]);

  const column = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
    },
    {
      title: "时间",
      dataIndex: "created_at",
      width: 150,
      render: (value) => (
        <div>
          {new Date(value)
            .toLocaleString("zh-CN", { hour12: false })
            .replace(/\//g, "-")
            .slice(0, -3)}
        </div>
      ),
    },
    {
      title: "信息内容",
      dataIndex: "message",
      width: 80,
    },
  ];

  return (
    <Table
      tableLayout="fixed"
      dataSource={listData}
      style={{
        marginTop: 24,
        height: "calc(100vh - 200px)",
      }}
      columns={column}
      scroll={{ x: "max-content", y: "calc(100vh - 280px)" }} // 设置横向和纵向滚动
      loading={loading}
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
  );
};

export default HouseManagement;
