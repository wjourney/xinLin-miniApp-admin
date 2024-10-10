import react, { Fragment, useState, useEffect } from "react";
import {
  Radio,
  Input,
  Space,
  Popover,
  Button,
  Row,
  Col,
  Divider,
  Checkbox,
  Form,
  message,
  RadioChangeEvent,
  Table,
  Select,
  Modal,
  Upload,
  InputNumber,
  Image,
  Switch,
  Tag,
} from "antd";
import {
  // getHouseList,
  // updateHouse,
  // setRecommendHouse,
  // deleteHouse,
  getReserveList,
  updateReserveStatus,
} from "@/api/index";
import "./index.scss";
import TextArea from "antd/es/input/TextArea";
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";

const { Search } = Input;
const { confirm } = Modal;

export const ReserveType = {
  0: {
    text: "待确认",
    color: "rgba(255, 101, 101, 1)",
  },
  1: {
    text: "待看房",
    color: "rgba(255, 101, 101, 1)",
  },
  2: {
    text: "已看房",
    color: "rgba(255, 101, 101, 1)",
  },
  3: {
    text: "已作废",
    color: "rgba(255, 101, 101, 1)",
  },
};

const HouseManagement: react.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 当前页码

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleGetReserveList = async (currentPage: number) => {
    setLoading(true);
    const res = await getReserveList({
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
    handleGetReserveList(currentPage);
  }, [currentPage]);

  const handleSwitchReserveStatus = async (id: number, status: number) => {
    const res = await updateReserveStatus(id, status);
    const { code } = res;
    if (code === 200) {
      handleGetReserveList(currentPage);
    }
  };

  const column = [
    {
      title: "园区ID",
      dataIndex: "parkId",
      width: 100,
    },
    {
      title: "房源ID",
      dataIndex: "houseId",
      width: 100,
    },
    {
      title: "园区名",
      dataIndex: "parkName",
      width: 100,
    },
    {
      title: "详细地址",
      dataIndex: "address",
      render: (_, record: any) => (
        <div>
          {record?.address}
          {record?.floor}楼
        </div>
      ),
      width: 200,
    },
    {
      title: "预约人联系电话",
      dataIndex: "contact",
      width: 100,
    },
    {
      title: "预约时间",
      dataIndex: "reservTime",
      width: 100,
    },
    {
      title: "预约状态",
      dataIndex: "confirm",
      width: 100,
      render: (value: number) => <div>{ReserveType?.[value]?.text}</div>,
    },
    {
      title: "招商顾问联系电话",
      dataIndex: "managerPhone",
      width: 100,
    },
    {
      title: "招商顾问",
      dataIndex: "manager",
      width: 100,
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_: any, record: any) => (
        <Space direction="vertical">
          <Button
            type="link"
            onClick={() => handleSwitchReserveStatus(record?.id, 0)}
            disabled={record?.confirm === 0}
          >
            设置为待确认
          </Button>
          <Button
            type="link"
            onClick={() => handleSwitchReserveStatus(record?.id, 1)}
            disabled={record?.confirm === 1}
          >
            设置为已确认
          </Button>
          <Button
            type="link"
            onClick={() => handleSwitchReserveStatus(record?.id, 2)}
            disabled={record?.confirm === 2}
          >
            设置为已看房
          </Button>
          <Button
            type="link"
            onClick={() => handleSwitchReserveStatus(record?.id, 3)}
            disabled={record?.confirm === 3}
          >
            取消这个预定
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
