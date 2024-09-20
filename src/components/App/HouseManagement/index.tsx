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
  Modal,
} from "antd";

const { Search } = Input;
const HouseManagement: react.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isAddOrEditHouseModalVisible, setIsAddOrEditHouseModalVisible] =
    useState(false);

  const column = [
    {
      title: "房源名字",
      dataIndex: "name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Search />
        </Col>
        <Col className="gutter-row" span={6}>
          <Button
            type="primary"
            onClick={() => setIsAddOrEditHouseModalVisible(true)}
          >
            新增房源
          </Button>
        </Col>
      </Row>
      <Table />
      <Modal
        open={isAddOrEditHouseModalVisible}
        onCancel={() => setIsAddOrEditHouseModalVisible(false)}
      ></Modal>
    </div>
  );
};

export default HouseManagement;
