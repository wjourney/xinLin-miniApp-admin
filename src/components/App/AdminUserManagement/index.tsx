import react, { Fragment, useState, useEffect } from "react";
import {
  Input,
  Space,
  Button,
  Row,
  Col,
  Form,
  message,
  Table,
  Modal,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  getAdminUserList,
  addAdminUser,
  deleteAdminUser,
  updateAdminUser,
} from "@/api/index";

const { confirm } = Modal;

const HouseManagement: react.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isAddOrEditHouseModalVisible, setIsAddOrEditHouseModalVisible] =
    useState(false);
  const [modalType, setModalType] = useState(1); // 1是新增，2是编辑
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 当前页码

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // 获取表单实例
  const [selectEditHouse, setSelectEditHouse] = useState(0);

  const handleGetAdminUserList = async (currentPage: number) => {
    setLoading(true);
    const res = await getAdminUserList({
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

  const handleDeleteAdminUser = async (record: any) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `确定删除${record?.account}后台管理用户吗`,
      onOk() {
        handleConfirmDeleteAdminUser(record?.id);
      },
      okText: "确认",
      cancelText: "取消",
    });
  };

  const handleConfirmDeleteAdminUser = async (id: number) => {
    const res = await deleteAdminUser(id);
    const { code, data } = res || {};
    if (code === 200) {
      handleGetAdminUserList(currentPage);
    } else {
      message.error("删除失败");
    }
  };

  useEffect(() => {
    handleGetAdminUserList(currentPage);
  }, [currentPage]);

  const handleEditAdminUser = async (id: number) => {
    try {
      // 触发表单校验
      const values = await form.validateFields();
      // 校验通过，获取表单值进行处理

      const payload = {
        account: values?.account,
        nickname: values?.nickname,
        password: values?.password,
      };
      const res = await updateAdminUser(id, payload);
      const { code, data } = res;
      if (code === 200) {
        message.success("修改后台管理用户成功");
        handleGetAdminUserList(currentPage);
        setIsAddOrEditHouseModalVisible(false);
        form.resetFields();
      }
    } catch (errorInfo) {
      // 校验失败时的处理
      console.log("Failed:", errorInfo);
    }
  };

  const handleAddAdminUser = async () => {
    try {
      // 触发表单校验
      const values = await form.validateFields();
      // 校验通过，获取表单值进行处理
      console.log("Validated values:", values);

      const payload = {
        account: values?.account,
        nickname: values?.nickname,
        password: values?.password,
      };
      const res = await addAdminUser(payload);
      const { code, data } = res;
      if (code === 200) {
        message.success("添加后台管理用户成功");
        handleGetAdminUserList(currentPage);
        setIsAddOrEditHouseModalVisible(false);
        form.resetFields();
      }
    } catch (errorInfo) {
      // 校验失败时的处理
      console.log("Failed:", errorInfo);
    }
  };

  const column = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "名字",
      dataIndex: "nickname",
    },
    {
      title: "时间",
      dataIndex: "updatedAt",
    },
    {
      title: "账户名",
      dataIndex: "account",
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_: any, record: any) => (
        <Space direction="vertical">
          <Button
            type="link"
            onClick={() => {
              setModalType(2);
              setIsAddOrEditHouseModalVisible(true);
              setSelectEditHouse(record?.id);
              form.setFieldsValue({
                ...record,
              });
            }}
          >
            编辑
          </Button>
          <Button type="link" onClick={() => handleDeleteAdminUser(record)}>
            删除
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
        <Col className="gutter-row" span={6}>
          <Button
            type="primary"
            onClick={() => {
              setIsAddOrEditHouseModalVisible(true);
              setModalType(1);
            }}
          >
            新增后台管理用户
          </Button>
        </Col>
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

      <Modal
        open={isAddOrEditHouseModalVisible}
        onCancel={() => {
          setIsAddOrEditHouseModalVisible(false);
          form.resetFields();
        }}
        title={modalType == 1 ? "新增后台管理用户" : "修改后台管理用户"}
        width={1024}
        okText="确认"
        cancelText="取消"
        onOk={
          modalType === 1
            ? handleAddAdminUser
            : () => handleEditAdminUser(selectEditHouse)
        }
        maskClosable={false}
      >
        <Form
          style={{ width: "100%", padding: "40px 0 0 20px" }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          form={form}
        >
          <Form.Item
            label="账号名"
            name="account"
            rules={[{ required: true, message: "请输入账号名！" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="名字"
            name="nickname"
            rules={[{ required: true, message: "请输入名字！" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码！" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HouseManagement;
