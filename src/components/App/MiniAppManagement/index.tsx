import react, { Fragment, useState, useEffect } from "react";
import {
  Radio,
  Input,
  Button,
  Row,
  message,
  Table,
  Modal,
  Image,
  Space,
} from "antd";
import { deleteHouse } from "@/api/houseManagement";
import "./index.scss";
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  getMiniAppUserList,
  deleteMiniAppUser,
  checkUpdateMiniAppUserInfo,
} from "@/api/index";

const { Search } = Input;
const { confirm } = Modal;

const HouseManagement: react.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleGetMiniAppUSerList = async (currentPage: number) => {
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
        handleConfirmMiniAppUser(record?.id);
      },
      okText: "确认",
      cancelText: "取消",
    });
  };

  const handleConfirmMiniAppUser = async (id: number) => {
    const res = await deleteMiniAppUser(id);
    const { code, data } = res || {};
    if (code === 200) {
      handleGetMiniAppUSerList(currentPage);
    } else {
      message.error("删除失败");
    }
  };

  useEffect(() => {
    handleGetMiniAppUSerList(currentPage);
  }, [currentPage]);

  // 审核用户信息修改接口
  const handleCheck = async (record: any, status: any) => {
    const res = await checkUpdateMiniAppUserInfo(
      record?.id,
      record?.userUpdates?.[0]?.id,
      status,
    );
    const { code } = res;
    if (code === 200) {
      message.success("审核成功");
      handleGetMiniAppUSerList(currentPage);
    }
  };

  const column = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "电话",
      dataIndex: "phone",
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "头像",
      dataIndex: "avatar",
      render: (_: any, record: any) => (
        <Image
          style={{ width: 150, height: 150, objectFit: "cover" }}
          src={record?.avatar}
        />
      ),
      width: 200,
    },
    {
      title: "修改的用户名",
      dataIndex: "username",
      render: (_, record) => (
        <div>{record?.userUpdates?.[0]?.newValue?.username}</div>
      ),
    },
    {
      title: "修改的头像",
      dataIndex: "avatar",
      render: (_: any, record: any) =>
        !!record?.userUpdates?.[0]?.newValue?.avatar ? (
          <Image
            style={{ width: 150, height: 150, objectFit: "cover" }}
            src={record?.userUpdates?.[0]?.newValue?.avatar}
          />
        ) : null,
      width: 200,
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_: any, record: any) => (
        <Space direction="vertical">
          <Button
            disabled={record?.userUpdates?.[0]?.status !== 0}
            type="link"
            onClick={() => handleCheck(record, 2)}
          >
            审核不通过
          </Button>
          <Button
            disabled={record?.userUpdates?.[0]?.status !== 0}
            type="link"
            onClick={() => handleCheck(record, 1)}
          >
            审核通过
          </Button>
          <Button type="link" onClick={() => handleDeleteUser(record)}>
            注销该用户
          </Button>
        </Space>
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
