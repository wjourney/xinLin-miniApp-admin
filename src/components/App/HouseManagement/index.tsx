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
  getHouseList,
  updateHouse,
  setRecommendHouse,
  deleteHouse,
} from "@/api/houseManagement";
import "./index.scss";
import TextArea from "antd/es/input/TextArea";
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { getManager } from "@/api/common";
import { addHouse } from "@/api/houseManagement";
import {
  getAllProjectsList,
  addProject,
  updateProject,
} from "@/api/projectManagement";

const { Search } = Input;
const { confirm } = Modal;

const businessOptions = [
  {
    label: "商住",
    value: "SZ",
  },
  {
    label: "办公",
    value: "BG",
  },
  {
    label: "商业",
    value: "SY",
  },
];

const HouseManagement: react.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isAddOrEditHouseModalVisible, setIsAddOrEditHouseModalVisible] =
    useState(false);
  const [modalType, setModalType] = useState(1); // 1是新增，2是编辑
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [houseImagesFileList, setHouseImagesFileList] = useState<UploadFile[]>(
    []
  );
  const [coverImageFileList, setCoverImageFileList] = useState<UploadFile[]>(
    []
  );
  const [managerData, setManagerData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // 获取表单实例
  const [allProjectOptions, setAllProjectOptions] = useState([]);
  const [selectEditHouse, setSelectEditHouse] = useState(0);

  const handleGetHouseList = async (currentPage: number) => {
    const res = await getHouseList({
      pageNum: currentPage,
      pageSize: 10,
    });
    const { code, data } = res;
    if (code === 200) {
      setListData(data?.data);
      setTotal(data?.total);
    }
  };

  const getManagerData = async () => {
    setLoading(true);
    const res = await getManager();
    const { code, data } = res;
    if (code === 200) {
      setManagerData(
        data?.map((item: any) => ({
          label: item?.name,
          value: item?.id,
        }))
      );
    }
    setLoading(false);
  };

  const handleDeleteHouse = async (record: any) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `确定删除${record?.parkName}房源吗`,
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

  useEffect(() => {
    getManagerData();
    handleGetAllProject();
  }, []);

  const handleEditHouse = async (id: number) => {
    try {
      // 触发表单校验
      const values = await form.validateFields();
      // 校验通过，获取表单值进行处理
      const parkImagesUrls = values?.images?.map(
        (item: any) => item?.response?.data?.url || item?.url
      );
      const coverImageUrl = values?.thumbnail?.map(
        (item: any) => item?.response?.data?.url || item?.url
      );
      const labels =
        values.labels
          .split("，")
          .map((item: string) => item)
          ?.filter((item1: string) => !!item1) || [];
      const payload = {
        parkId: values?.parkId,
        address: values?.address,
        price: values?.price,
        wuyeFee: values?.wuyeFee,
        floor: values?.floor,
        zhxiu: values?.zhxiu,
        managers: [values?.managers],
        thumbnail: coverImageUrl?.[0],
        floorHeight: values?.floorHeight,
        detail: values?.detail,
        latitude: values?.latitude,
        longitude: values?.longitude,
        images: parkImagesUrls,
        parkName: values?.parkName,
        totalArea: values?.totalArea,
        totalFloor: values?.totalFloor,
        isRecommend: !!values?.isRecommend,
        labels: labels,
        phone: values?.phone,
      };
      const res = await updateHouse(id, payload);
      const { code, data } = res;
      if (code === 200) {
        message.success("修改房源成功");
        handleGetHouseList(currentPage);
        setIsAddOrEditHouseModalVisible(false);
        form.resetFields();
      }
    } catch (errorInfo) {
      // 校验失败时的处理
      console.log("Failed:", errorInfo);
    }
  };

  const handleAddHouse = async () => {
    try {
      // 触发表单校验
      const values = await form.validateFields();
      // 校验通过，获取表单值进行处理
      console.log("Validated values:", values, houseImagesFileList);
      const parkImagesUrls = values?.images?.map(
        (item: any) => item?.response?.data?.url || item?.url
      );
      const coverImageUrl = values?.thumbnail?.map(
        (item: any) => item?.response?.data?.url || item?.url
      );
      const labels =
        values.labels
          .split("，")
          .map((item: string) => item)
          ?.filter((item1: string) => !!item1) || [];
      const payload = {
        parkId: values?.parkId,
        address: values?.address,
        price: values?.price,
        wuyeFee: values?.wuyeFee,
        floor: values?.floor,
        zhxiu: values?.zhxiu,
        managers: [values?.managers],
        thumbnail: coverImageUrl?.[0],
        floorHeight: values?.floorHeight,
        detail: values?.detail,
        latitude: values?.latitude,
        longitude: values?.longitude,
        images: parkImagesUrls,
        parkName: values?.parkName,
        totalArea: values?.totalArea,
        totalFloor: values?.totalFloor,
        isRecommend: !!values?.isRecommend,
        labels: labels,
        phone: values?.phone,
      };
      const res = await addHouse(payload);
      const { code, data } = res;
      if (code === 200) {
        message.success("添加房源成功");
        handleGetHouseList(currentPage);
        setIsAddOrEditHouseModalVisible(false);
        form.resetFields();
      }
    } catch (errorInfo) {
      // 校验失败时的处理
      console.log("Failed:", errorInfo);
    }
  };

  const handleGetAllProject = async () => {
    const res = await getAllProjectsList();
    const { code, data } = res;
    if (code === 200) {
      setAllProjectOptions(
        data?.map((item: any) => ({
          label: item?.parkName,
          value: item?.id,
        }))
      );
    }
  };

  const handleSetRecommend = async (id: number, recommend: number) => {
    const res = await setRecommendHouse(id, recommend);
    const { code, data } = res;
    if (code === 200) {
      handleGetHouseList(currentPage);
      message.success(recommend === 0 ? "取消推荐成功" : "设置推荐成功");
    } else {
      message.success(recommend === 0 ? "取消推荐失败" : "设置推荐失败");
    }
  };

  const column = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
    },
    {
      title: "详细地址",
      dataIndex: "address",
      render: (_, record: any) => (
        <div>
          {record?.city}
          {record?.address}
        </div>
      ),
      width: 200,
    },
    {
      title: "面积",
      dataIndex: "totalArea",
      width: 80,
    },
    {
      title: "所在楼层",
      dataIndex: "floor",
      width: 80,
    },
    {
      title: "标准层高",
      dataIndex: "floorHeight",
      width: 80,
    },
    {
      title: "价格(元/㎡/天)",
      dataIndex: "price",
      width: 80,
    },
    {
      title: "物业费(元/㎡/月)",
      dataIndex: "wuyeFee",
      width: 80,
    },
    {
      title: "所属项目",
      dataIndex: "parkName",
      width: 200,
    },
    {
      title: "标准层层高",
      dataIndex: "floorHeight",
      width: 80,
    },
    {
      title: "招商顾问",
      dataIndex: "managers",
      width: 200,
      render: (_: any, record: any) => (
        <Space direction="vertical">
          {record?.managers?.map((item: any) => <div>{item?.name}</div>)}
        </Space>
      ),
    },
    {
      title: "标签",
      dataIndex: "labels",
      width: 80,
      render: (_: any, record: any) =>
        record?.labels?.length === 0 || !record?.labels ? (
          "-"
        ) : (
          <Space direction="vertical">
            {record?.labels?.map((item: string) => (
              <Tag color="green">{item}</Tag>
            ))}
          </Space>
        ),
    },
    {
      title: "时间",
      dataIndex: "createdAt",
      width: 150,
    },
    {
      title: "房源图片",
      dataIndex: "latitude",
      render: (_: any, record: any) => (
        <div style={{ width: 306, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {record?.images?.map((item: string) => (
            <Image
              style={{ width: 150, height: 150, objectFit: "cover" }}
              src={item}
            />
          ))}
        </div>
      ),
      width: 320,
    },
    {
      title: "封面图",
      dataIndex: "thumbnail",
      render: (_: any, record: any) => (
        <Image
          style={{ width: 150, height: 150, objectFit: "cover" }}
          src={record?.thumbnail}
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
              setIsAddOrEditHouseModalVisible(true);
              // setCoverImageFileList([record?.thumbnail]);
              setSelectEditHouse(record?.id);

              const formattedImagesFileList = record?.images?.map(
                (url: string, index: number) => ({
                  uid: `-1-${index}`, // 每个文件需要唯一的 uid
                  name: `image-${index}.jpg`, // 自定义一个文件名
                  status: "done", // 表示该文件已经上传完成
                  url, // 图片的 URL
                  thumbUrl: url, // 确保显示缩略图
                })
              );

              setHouseImagesFileList(formattedImagesFileList);
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
                images: formattedImagesFileList,
                managers: record?.managers?.[0]?.id,
                labels: record?.labels?.join("，"),
                thumbnail: [
                  {
                    uid: `-1`, // 每个文件需要唯一的 uid
                    name: `image-${1}.jpg`, // 自定义一个文件名
                    status: "done", // 表示该文件已经上传完成
                    url: record?.thumbnail, // 图片的 URL
                    thumbUrl: record?.thumbnail, // 确保显示缩略图
                  },
                ],
              });
            }}
          >
            编辑
          </Button>
          <Button type="link" onClick={() => handleDeleteHouse(record)}>
            删除
          </Button>
          <Button
            type="link"
            onClick={() =>
              handleSetRecommend(record?.id, !!record?.isRecommend ? 0 : 1)
            }
          >
            {!!record?.isRecommend ? "取消推荐" : "设为推荐"}
          </Button>
        </Space>
      ),
      width: 100,
      fixed: "right", // 固定操作列在右侧
    },
  ];
  const handleUploadHouseImagesChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setHouseImagesFileList(newFileList);
  };

  const handleUploadCoverImageChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => setCoverImageFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const validateCommaSeparatedNumbers = (_: any, value: string) => {
    if (!value || value.length === 0) {
      return Promise.resolve(); // 如果没有输入内容，则不进行验证
    }

    const regex = /^([^,]+(,[^,]+)*)?$/; // 匹配用逗号分隔的数字
    if (!regex.test(value)) {
      return Promise.reject(new Error("请输入有效的标签(逗号分隔)"));
    }
    return Promise.resolve();
  };

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
            新增房源
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
        onCancel={() => setIsAddOrEditHouseModalVisible(false)}
        title={modalType == 1 ? "新增房源" : "修改房源"}
        width={1024}
        okText="确认"
        cancelText="取消"
        onOk={
          modalType === 1
            ? handleAddHouse
            : () => handleEditHouse(selectEditHouse)
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
            label="所属项目"
            name="parkId"
            rules={[{ required: true, message: "请选择所属项目！" }]}
          >
            <Select options={allProjectOptions} />
          </Form.Item>
          <Form.Item
            label="电话"
            name="phone"
            rules={[{ required: true, message: "请输入城市！" }]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            label="区域"
            name="districtName"
            rules={[{ required: true, message: "请输入区域！" }]}
            validateFirst
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="详细地址"
            name="address"
            rules={[{ required: true, message: "请输入详细地址！" }]}
            validateFirst
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            label="业态"
            name="businessType"
            rules={[{ required: true, message: "请选择业态！" }]}
            validateFirst
          >
            <Select options={businessOptions} />
          </Form.Item>
          <Form.Item
            label="装修水平"
            name="zhxiu"
            rules={[{ required: true, message: "请选择装修水平！" }]}
            validateFirst
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="面积"
            name="totalArea"
            rules={[{ required: true, message: "请输入面积！" }]}
            validateFirst
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="价格"
            name="price"
            rules={[{ required: true, message: "请输入价格！" }]}
            validateFirst
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="物业费"
            name="wuyeFee"
            rules={[{ required: true, message: "请输入物业费！" }]}
            validateFirst
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="标准层高"
            name="floorHeight"
            rules={[{ required: true, message: "请输入标准层高！" }]}
            validateFirst
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="楼层"
            name="totalFloor"
            rules={[{ required: true, message: "请输入楼层！" }]}
            validateFirst
          >
            <InputNumber />
          </Form.Item>
          {/* <Form.Item
            label="房源图片"
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            label="标签"
            name="labels"
            rules={[
              { required: true, message: "请输入标签(逗号作为标签分割符)" },
              { validator: validateCommaSeparatedNumbers },
            ]}
            validateFirst
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            label="招商顾问"
            name="managers"
            rules={[{ required: true, message: "请选择招商顾问!" }]}
          >
            <Select options={managerData} />
          </Form.Item>

          <Form.Item
            label="详细信息"
            name="detail"
            rules={[{ required: false, message: "请选择招商顾问!" }]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            label="是否设为推荐"
            name="isRecommend"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="房源图片"
            valuePropName="fileList"
            name="images"
            getValueProps={(value) => ({
              fileList: value,
            })}
            rules={[
              {
                required: true,
                message: "请上传园区图(不超过8张)！",
              },
              // { validator: validateImages },
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
              // headers= {
              //   authorization: "authorization-text"
              // }
              maxCount={8}
              accept="image/*" // 只接受图片文件
              fileList={houseImagesFileList}
              onChange={handleUploadHouseImagesChange}
            >
              {houseImagesFileList.length >= 8 ? null : uploadButton}
            </Upload>
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
