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
import "./index.scss";
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { addNews, getNewsList, updateNews, deleteNews } from "@/api/index";

const { Search } = Input;
const { confirm } = Modal;

const HouseManagement: react.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isAddOrEditHouseModalVisible, setIsAddOrEditNewsModalVisible] =
    useState(false);
  const [modalType, setModalType] = useState(1); // 1是新增，2是编辑
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  // const [houseImagesFileList, setHouseImagesFileList] = useState<UploadFile[]>(
  //   []
  // );
  const [coverImageFileList, setCoverImageFileList] = useState<UploadFile[]>(
    []
  );
  const [managerData, setManagerData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // 获取表单实例
  const [allProjectOptions, setAllProjectOptions] = useState([]);
  const [selectEditHouse, setSelectEditHouse] = useState(0);

  const handleGetNews = async (currentPage: number) => {
    const res = await getNewsList({
      pageNum: currentPage,
      pageSize: 10,
    });
    const { code, data } = res;
    if (code === 200) {
      setListData(data?.list);
      setTotal(data?.total);
    }
  };

  const handleDeleteNews = async (record: any) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `确定删除${record?.title}新闻吗`,
      onOk() {
        handleConfirmDeleteNews(record?.id);
      },
      okText: "确认",
      cancelText: "取消",
    });
  };

  const handleConfirmDeleteNews = async (id: number) => {
    const res = await deleteNews(id);
    const { code, data } = res || {};
    if (code === 200) {
      handleGetNews(currentPage);
    } else {
      message.error("删除失败");
    }
  };

  useEffect(() => {
    handleGetNews(currentPage);
  }, [currentPage]);

  const handleEditNews = async (id: number) => {
    try {
      // 触发表单校验
      const values = await form.validateFields();
      // 校验通过，获取表单值进行处理

      const coverImageUrl = values?.thumbnail?.map(
        (item: any) => item?.response?.data?.url || item?.url
      );

      const payload = {
        image: coverImageUrl?.[0],
        url: values?.url,
        category: values?.category,
        title: values?.title,
      };
      const res = await updateNews(id, payload);
      const { code, data } = res;
      if (code === 200) {
        message.success("修改新闻成功");
        handleGetNews(currentPage);
        setIsAddOrEditNewsModalVisible(false);
        form.resetFields();
      }
    } catch (errorInfo) {
      // 校验失败时的处理
      console.log("Failed:", errorInfo);
    }
  };

  const handleAddNews = async () => {
    try {
      // 触发表单校验
      const values = await form.validateFields();
      // 校验通过，获取表单值进行处理
      console.log("Validated values:", values);
      // const parkImagesUrls = values?.images?.map(
      //   (item: any) => item?.response?.data?.url || item?.url
      // );
      const coverImageUrl = values?.thumbnail?.map(
        (item: any) => item?.response?.data?.url || item?.url
      );

      const payload = {
        image: coverImageUrl?.[0],
        url: values?.url,
        category: values?.category,
        title: values?.title,
      };
      const res = await addNews(payload);
      const { code, data } = res;
      if (code === 200) {
        message.success("添加房源成功");
        handleGetNews(currentPage);
        setIsAddOrEditNewsModalVisible(false);
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
      title: "类别",
      dataIndex: "category",
      width: 100,
    },
    {
      title: "标题",
      dataIndex: "title",
      width: 200,
    },
    {
      title: "图片",
      dataIndex: "image",
      width: 160,
      render: (value: string) => (
        <Image
          style={{ width: 150, height: 150, objectFit: "cover" }}
          src={value}
        />
      ),
    },
    {
      title: "链接",
      dataIndex: "url",
      width: 200,
    },
    {
      title: "时间",
      dataIndex: "updatedAt",
      width: 100,
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
              setIsAddOrEditNewsModalVisible(true);
              // setCoverImageFileList([record?.thumbnail]);
              setSelectEditHouse(record?.id);

              // const formattedImagesFileList = record?.images?.map(
              //   (url: string, index: number) => ({
              //     uid: `-1-${index}`, // 每个文件需要唯一的 uid
              //     name: `image-${index}.jpg`, // 自定义一个文件名
              //     status: "done", // 表示该文件已经上传完成
              //     url, // 图片的 URL
              //     thumbUrl: url, // 确保显示缩略图
              //   })
              // );

              // setHouseImagesFileList(formattedImagesFileList);
              setCoverImageFileList([
                {
                  uid: `-1`, // 每个文件需要唯一的 uid
                  name: `image-${1}.jpg`, // 自定义一个文件名
                  status: "done", // 表示该文件已经上传完成
                  url: record?.thumbnail, // 图片的 URL
                  thumbUrl: record?.thumbnail, // 确保显示缩略图
                },
              ]);
              form.setFieldsValue({
                ...record,
                // images: formattedImagesFileList,
                // managers: record?.managers?.[0]?.id,
                // labels: record?.labels?.join("，"),
                thumbnail: [
                  {
                    uid: `-1`, // 每个文件需要唯一的 uid
                    name: `image-${1}.jpg`, // 自定义一个文件名
                    status: "done", // 表示该文件已经上传完成
                    url: record?.image, // 图片的 URL
                    thumbUrl: record?.image, // 确保显示缩略图
                  },
                ],
              });
            }}
          >
            编辑
          </Button>
          <Button type="link" onClick={() => handleDeleteNews(record)}>
            删除
          </Button>
          {/* <Button
            type="link"
            onClick={() =>
              handleSetRecommend(record?.id, !!record?.isRecommend ? 0 : 1)
            }
          >
            {!!record?.isRecommend ? "取消推荐" : "设为推荐"}
          </Button> */}
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
        {/* <Col className="gutter-row" span={6}>
          <Search />
        </Col> */}
        <Col className="gutter-row" span={6}>
          <Button
            type="primary"
            onClick={() => {
              setIsAddOrEditNewsModalVisible(true);
              setModalType(1);
            }}
          >
            新增新闻
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
          setIsAddOrEditNewsModalVisible(false);
          form.resetFields();
        }}
        title={modalType == 1 ? "新增新闻" : "修改新闻"}
        width={1024}
        okText="确认"
        cancelText="取消"
        onOk={
          modalType === 1
            ? handleAddNews
            : () => handleEditNews(selectEditHouse)
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
            rules={[{ required: true, message: "请选择标题！" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="类别"
            name="category"
            rules={[{ required: true, message: "请输入类别！" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="链接" name="url">
            <Input placeholder="请输入链接" />
          </Form.Item>

          <Form.Item
            label="封面图"
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
