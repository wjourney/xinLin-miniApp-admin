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
  Upload,
  Image,
} from "antd";
import "./index.scss";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { getBanners, addBanner, updateBanner, deleteBanner } from "@/api/index";

const { confirm } = Modal;

const HouseManagement: react.FC = () => {
  const [isAddOrEditHouseModalVisible, setIsAddOrEditBannerModalVisible] =
    useState(false);
  const [modalType, setModalType] = useState(1); // 1是新增，2是编辑
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [coverImageFileList, setCoverImageFileList] = useState<UploadFile[]>(
    [],
  );
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // 获取表单实例
  const [selectEditBanner, setSelectEditHouse] = useState(0);

  const handleGetBanners = async () => {
    const res = await getBanners("news");
    const { code, data } = res;
    if (code === 200) {
      setListData(data?.list);
      setTotal(data?.total);
    }
  };

  const handleDeleteBanner = async (record: any) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `确定删除这条轮博图吗`,
      onOk() {
        handleConfirmDeleteBanner(record?.id);
      },
      okText: "确认",
      cancelText: "取消",
    });
  };

  const handleConfirmDeleteBanner = async (id: number) => {
    const res = await deleteBanner(id);
    const { code, data } = res || {};
    if (code === 200) {
      handleGetBanners();
    } else {
      message.error("删除失败");
    }
  };

  useEffect(() => {
    handleGetBanners();
  }, [currentPage]);

  const handleEditBanner = async (id: number) => {
    try {
      // 触发表单校验
      const values = await form.validateFields();
      // 校验通过，获取表单值进行处理
      const coverImageUrl = values?.thumbnail?.map(
        (item: any) => item?.response?.data?.url || item?.url,
      );

      const payload = {
        title: values?.title,
        url: coverImageUrl?.[0],
        category: "news",
      };
      const res = await updateBanner(id, payload);
      const { code, data } = res;
      if (code === 200) {
        message.success("修改轮博图成功");
        handleGetBanners();
        setIsAddOrEditBannerModalVisible(false);
        form.resetFields();
      }
    } catch (errorInfo) {
      // 校验失败时的处理
      console.log("Failed:", errorInfo);
    }
  };

  const handleAddBanner = async () => {
    try {
      // 触发表单校验
      const values = await form.validateFields();
      // 校验通过，获取表单值进行处理
      console.log("Validated values:", values);

      const coverImageUrl = values?.thumbnail?.map(
        (item: any) => item?.response?.data?.url || item?.url,
      );
      const payload = {
        title: values?.title,
        url: coverImageUrl?.[0],
        category: "news",
      };
      const res = await addBanner(payload);
      const { code, data } = res;
      if (code === 200) {
        message.success("添加轮博图成功");
        handleGetBanners();
        setIsAddOrEditBannerModalVisible(false);
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
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "图片",
      dataIndex: "url",
      render: (_: any, record: any) => (
        <div style={{ width: 306, display: "flex", flexWrap: "wrap", gap: 6 }}>
          <Image
            style={{ width: 150, height: 150, objectFit: "cover" }}
            src={record?.url}
          />
        </div>
      ),
      width: 320,
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
              setIsAddOrEditBannerModalVisible(true);
              setSelectEditHouse(record?.id);
              setCoverImageFileList([
                {
                  uid: `-1`, // 每个文件需要唯一的 uid
                  name: `image-${1}.jpg`, // 自定义一个文件名
                  status: "done", // 表示该文件已经上传完成
                  url: record?.url, // 图片的 URL
                  thumbUrl: record?.url, // 确保显示缩略图
                },
              ]);
              form.setFieldsValue({
                ...record,
                thumbnail: [
                  {
                    uid: `-1`, // 每个文件需要唯一的 uid
                    name: `image-${1}.jpg`, // 自定义一个文件名
                    status: "done", // 表示该文件已经上传完成
                    url: record?.url, // 图片的 URL
                    thumbUrl: record?.url, // 确保显示缩略图
                  },
                ],
              });
            }}
          >
            编辑
          </Button>
          <Button type="link" onClick={() => handleDeleteBanner(record)}>
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
  }) => setCoverImageFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Button
            type="primary"
            onClick={() => {
              setIsAddOrEditBannerModalVisible(true);
              setModalType(1);
            }}
          >
            新增资讯页轮播图
          </Button>
        </Col>
      </Row>
      <div style={{ width: "100%", overflowX: "auto" }}>
        <Table
          tableLayout="fixed"
          dataSource={listData}
          style={{
            marginTop: 24,
            height: "calc(100vh - 200px)",
          }}
          columns={column}
          scroll={{ x: "max-content", y: "calc(100vh - 320px)" }} // 设置横向和纵向滚动
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
        open={isAddOrEditHouseModalVisible}
        onCancel={() => {
          setIsAddOrEditBannerModalVisible(false);
          form.resetFields();
          setCoverImageFileList([]);
        }}
        title={modalType == 1 ? "新增轮博图" : "修改轮博图"}
        width={1024}
        okText="确认"
        cancelText="取消"
        onOk={
          modalType === 1
            ? handleAddBanner
            : () => handleEditBanner(selectEditBanner)
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
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入标题内容" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="图片"
            valuePropName="fileList"
            name="thumbnail"
            rules={[
              {
                required: true,
                message: "请上传轮博图图片！",
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
              fileList={coverImageFileList}
              onChange={handleUploadCoverImageChange}
              accept="image/*" // 只接受图片文件
            >
              {coverImageFileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HouseManagement;
