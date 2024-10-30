import react, { Fragment, useState, useEffect } from "react";
import {
  Radio,
  Input,
  Space,
  Button,
  Row,
  Col,
  Form,
  message,
  Table,
  Modal,
  Upload,
  Image,
} from "antd";
import "./index.scss";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";

import {
  getManagers,
  addManager,
  updateManager,
  deleteManager,
} from "@/api/index";

const { Search } = Input;
const { confirm } = Modal;

const HouseManagement: react.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isAddOrEditManagerModalVisible, setIsAddOrEditManagerModalVisible] =
    useState(false);
  const [modalType, setModalType] = useState(1); // 1是新增，2是编辑
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 当前页码

  const [avatarImageFileList, setAvatarImageFileList] = useState<UploadFile[]>(
    [],
  );
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // 获取表单实例
  const [selectEditHouse, setSelectEditHouse] = useState(0);

  const handleGetManagerList = async (currentPage: number) => {
    const res = await getManagers({
      pageNum: currentPage,
      pageSize: 10,
    });
    const { code, data } = res;
    if (code === 200) {
      setListData(data?.list);
      setTotal(data?.total);
    }
  };

  const handleDeleteManager = async (record: any) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `确定删除${record?.name}招商顾问吗`,
      onOk() {
        handleConfirmDeleteHouse(record?.id);
      },
      okText: "确认",
      cancelText: "取消",
    });
  };

  const handleConfirmDeleteHouse = async (id: number) => {
    const res = await deleteManager(id);
    const { code, data } = res || {};
    if (code === 200) {
      handleGetManagerList(currentPage);
    } else {
      message.error("删除失败");
    }
  };

  useEffect(() => {
    handleGetManagerList(currentPage);
  }, [currentPage]);

  const handleEditManager = async (id: number) => {
    try {
      // 触发表单校验
      const values = await form.validateFields();
      // 校验通过，获取表单值进行处理

      const avatarImageUrl = values?.thumbnail?.map(
        (item: any) => item?.response?.data?.url || item?.url,
      );

      const payload = {
        thumb: avatarImageUrl?.[0],
        name: values?.name,
        phone: values?.phone,
      };
      const res = await updateManager(id, payload);
      const { code, data } = res;
      if (code === 200) {
        message.success("修改招商顾问成功");
        handleGetManagerList(currentPage);
        setIsAddOrEditManagerModalVisible(false);
        form.resetFields();
      }
    } catch (errorInfo) {
      // 校验失败时的处理
      console.log("Failed:", errorInfo);
    }
  };

  const handleAddManager = async () => {
    try {
      // 触发表单校验
      const values = await form.validateFields();
      // 校验通过，获取表单值进行处理
      const avatarImageUrl = values?.thumbnail?.map(
        (item: any) => item?.response?.data?.url || item?.url,
      );

      const payload = {
        thumb: avatarImageUrl?.[0],
        name: values?.name,
        phone: values?.phone,
      };
      const res = await addManager(payload);
      const { code, data } = res;
      if (code === 200) {
        message.success("添加招商顾问成功");
        handleGetManagerList(currentPage);
        setIsAddOrEditManagerModalVisible(false);
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
      width: 100,
    },
    {
      title: "姓名",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "电话",
      dataIndex: "phone",
      width: 100,
    },

    {
      title: "照片",
      dataIndex: "thumb",
      render: (_: any, record: any) => (
        <Image
          style={{ width: 150, height: 150, objectFit: "cover" }}
          src={record?.thumb}
        />
      ),
      width: 160,
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
              setIsAddOrEditManagerModalVisible(true);
              setSelectEditHouse(record?.id);

              setAvatarImageFileList([
                {
                  uid: `-1`, // 每个文件需要唯一的 uid
                  name: `image-${1}.jpg`, // 自定义一个文件名
                  status: "done", // 表示该文件已经上传完成
                  url: record?.thumb, // 图片的 URL
                  thumbUrl: record?.thumb, // 确保显示缩略图
                },
              ]);
              form.setFieldsValue({
                ...record,
                thumbnail: [
                  {
                    uid: `-1`, // 每个文件需要唯一的 uid
                    name: `image-${1}.jpg`, // 自定义一个文件名
                    status: "done", // 表示该文件已经上传完成
                    url: record?.thumb, // 图片的 URL
                    thumbUrl: record?.thumb, // 确保显示缩略图
                  },
                ],
              });
            }}
          >
            编辑
          </Button>
          <Button type="link" onClick={() => handleDeleteManager(record)}>
            删除
          </Button>
        </Space>
      ),
      width: 100,
      fixed: "right", // 固定操作列在右侧
    },
  ];

  const handleUploadCoverImageChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => setAvatarImageFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

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
              setIsAddOrEditManagerModalVisible(true);
              setModalType(1);
            }}
          >
            新增招商顾问
          </Button>
        </Col>
      </Row>
      <div style={{ width: "100%", overflowX: "auto" }}>
        <Table
          tableLayout="fixed"
          dataSource={listData}
          style={{
            marginTop: 24,
            height: "calc(100vh - 180px)",
          }}
          columns={column}
          scroll={{ x: "max-content", y: "calc(100vh - 300px)" }} // 设置横向和纵向滚动
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
      </div>

      <Modal
        open={isAddOrEditManagerModalVisible}
        onCancel={() => {
          setIsAddOrEditManagerModalVisible(false);
          form.resetFields();
          setAvatarImageFileList([]);
        }}
        title={modalType == 1 ? "新增招商顾问" : "修改招商顾问"}
        width={1024}
        okText="确认"
        cancelText="取消"
        onOk={
          modalType === 1
            ? handleAddManager
            : () => handleEditManager(selectEditHouse)
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
            label="姓名"
            name="name"
            rules={[{ required: true, message: "请输入姓名！" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="电话"
            name="phone"
            rules={[{ required: true, message: "请输入城市！" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="照片"
            valuePropName="fileList"
            name="thumbnail"
            rules={[
              {
                required: true,
                message: "请上传封面图！",
              },
            ]}
            getValueFromEvent={(e: any) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload
              listType="picture-card"
              name="file"
              action="/adm/upload_image"
              maxCount={1}
              fileList={avatarImageFileList}
              onChange={handleUploadCoverImageChange}
              accept="image/*" // 只接受图片文件
            >
              {avatarImageFileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HouseManagement;
