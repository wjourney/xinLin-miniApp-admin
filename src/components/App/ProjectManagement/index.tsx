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
  Image,
  InputNumber,
  Switch,
} from "antd";
import "./index.scss";
import type { GetProp, UploadFile, UploadProps } from "antd";
import {
  getProjectsList,
  addProject,
  updateProject,
  deleteProject,
  setRecommendProject,
} from "@/api/projectManagement";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { getManager } from "@/api/common";

// SZ-商住;BG-办公;SY-商业;

const { Search } = Input;
const { confirm } = Modal;

const ProjectManagement: react.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isAddOrEditHouseModalVisible, setIsAddOrEditHouseModalVisible] =
    useState(false);
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [modalType, setModalType] = useState(1); // 1是新增，2是编辑
  const [parkImagesFileList, setParkImagesFileList] = useState<UploadFile[]>(
    [],
  );
  const [coverImageFileList, setCoverImageFileList] = useState<UploadFile[]>(
    [],
  );
  const [managerData, setManagerData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // 获取表单实例
  const [selectEditPark, setSelectEditPark] = useState(0);

  const handleGetProjectList = async (pageNum: number, searchValue: string) => {
    setLoading(true);
    const res = await getProjectsList({
      pageNum: pageNum,
      pageSize: 10,
      search: searchValue,
    });
    const { code, data } = res;
    if (code === 200) {
      setListData(data?.list);
      setTotal(data?.total);
    }
    setLoading(false);
  };

  const getManagerData = async () => {
    const res = await getManager();
    const { code, data } = res;
    if (code === 200) {
      setManagerData(
        data?.list?.map((item: any) => ({
          label: item?.name,
          value: item?.id,
        })),
      );
    }
  };

  const handleEditPark = async (id: number) => {
    try {
      // 触发表单校验
      const values = await form.validateFields();
      console.log("valuse", values);
      // 校验通过，获取表单值进行处理
      const parkImagesUrls = values?.images?.map(
        (item: any) => item?.response?.data?.url || item?.url,
      );
      const coverImageUrl = values?.thumbnail?.map(
        (item: any) => item?.response?.data?.url || item?.url,
      );
      const payload = {
        parkId: id,
        address: values?.address,
        company: values?.company,
        managers: values?.managers,
        thumbnail: coverImageUrl?.[0],
        floorHeight: values?.floorHeight,
        introduce: values?.introduce,
        latitude: values?.latitude,
        longitude: values?.longitude,
        images: parkImagesUrls,
        parkName: values?.parkName,
        totalArea: values?.totalArea,
        totalFloor: values?.totalFloor,
        isRecommend: !!values?.isRecommend,
        city: /^(?=.*市)(?!.*市.*市).*$/i.test(values?.city)
          ? values?.city
          : `${values?.city}市`,
        districtName: /^(?=.*区)(?!.*区.*区).*$/i.test(values?.districtName)
          ? values?.districtName
          : `${values?.districtName}区`,
        price: values?.price,
      };

      const res = await updateProject(id, payload);
      const { code, data } = res;
      if (code === 200) {
        message.success("修改项目成功");
        handleGetProjectList(currentPage, searchValue);
        setIsAddOrEditHouseModalVisible(false);
        form.resetFields();
      }
    } catch (errorInfo) {
      // 校验失败时的处理
      console.log("Failed:", errorInfo);
    }
  };

  const handleDeletePark = async (record: any) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `确定删除${record?.parkName}项目吗`,
      onOk() {
        handleConfirmDeletePark(record?.id);
      },
      okText: "确认",
      cancelText: "取消",
    });
  };

  const handleConfirmDeletePark = async (id: number) => {
    const res = await deleteProject(id);
    const { code, data } = res || {};
    if (code === 200) {
      handleGetProjectList(currentPage, searchValue);
    } else {
    }
  };

  useEffect(() => {
    handleGetProjectList(currentPage, searchValue);
  }, [currentPage]);

  useEffect(() => {
    getManagerData();
  }, []);

  const handleSetRecommend = async (id: number, recommend: number) => {
    const res = await setRecommendProject(id, recommend);
    const { code, data } = res;
    if (code === 200) {
      handleGetProjectList(currentPage, searchValue);
      message.success(recommend === 0 ? "取消推荐成功" : "设置推荐成功");
    } else {
      message.success(recommend === 0 ? "取消推荐失败" : "设置推荐失败");
    }
  };

  const handleAddPark = async () => {
    try {
      // 触发表单校验
      const values = await form.validateFields();
      console.log("valuse", values);

      // 校验通过，获取表单值进行处理
      const parkImagesUrls = values?.images?.map(
        (item: any) => item?.response?.data?.url || item?.url,
      );
      const coverImageUrl = values?.thumbnail?.map(
        (item: any) => item?.response?.data?.url || item?.url,
      );
      const payload = {
        address: values?.address,
        company: values?.company,
        managers: values?.managers,
        thumbnail: coverImageUrl?.[0],
        floorHeight: values?.floorHeight,
        introduce: values?.introduce,
        latitude: values?.latitude,
        longitude: values?.longitude,
        images: parkImagesUrls,
        parkName: values?.parkName,
        totalArea: values?.totalArea,
        totalFloor: values?.totalFloor,
        isRecommend: !!values?.isRecommend,
        city: /^(?=.*市)(?!.*市.*市).*$/i.test(values?.city)
          ? values?.city
          : `${values?.city}市`,
        districtName: /^(?=.*区)(?!.*区.*区).*$/i.test(values?.districtName)
          ? values?.districtName
          : `${values?.districtName}区`,
        price: values?.price,
      };
      const res = await addProject(payload);
      const { code, data } = res;
      if (code === 200) {
        message.success("添加项目成功");
        handleGetProjectList(currentPage, searchValue);
        setIsAddOrEditHouseModalVisible(false);
        form.resetFields();
      }
    } catch (errorInfo) {
      // 校验失败时的处理
      console.log("Failed:", errorInfo);
    }
  };

  const handleUploadParkImagesChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => setParkImagesFileList([...parkImagesFileList, ...newFileList]);

  const handleUploadCoverImageChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => setCoverImageFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handelGetSearchValue = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
    handleGetProjectList(currentPage, value);
  };

  const column = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
    },
    {
      title: "园区名",
      dataIndex: "parkName",
      width: 200,
    },
    {
      title: "城市",
      dataIndex: "city",
      width: 200,
    },
    {
      title: "区域",
      dataIndex: "districtName",
      width: 200,
    },
    {
      title: "详细地址",
      dataIndex: "address",
      width: 200,
    },
    {
      title: "经度",
      dataIndex: "latitude",
      width: 80,
    },
    {
      title: "纬度",
      dataIndex: "longitude",
      width: 80,
    },
    {
      title: "公司",
      dataIndex: "company",
      width: 80,
    },
    {
      title: "楼层数",
      dataIndex: "totalFloor",
      width: 80,
    },
    {
      title: "标准层层高",
      dataIndex: "floorHeight",
      width: 80,
    },
    {
      title: "价格范围",
      dataIndex: "price",
      width: 80,
    },
    {
      title: "总面积",
      dataIndex: "totalArea",
      width: 80,
      render: (value) => <div>{value}㎡</div>,
    },
    {
      title: "房源数",
      dataIndex: "totalHouse",
      width: 80,
    },
    {
      title: "招商顾问",
      dataIndex: "managers",
      width: 200,
      render: (_: any, record: any) => (
        <Space direction="vertical">
          {record?.managers?.map((item: any) => (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div>{item?.name}</div>
              <Image style={{ height: 80, width: 80 }} src={item?.thumb} />
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: "介绍",
      dataIndex: "introduce",
      width: 200,
    },
    {
      title: " 创建时间",
      dataIndex: "createdAt",
      width: 100,
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
      title: "园区图片",
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
              setIsAddOrEditHouseModalVisible(true);
              setModalType(2);
              setSelectEditPark(record?.id);

              const formattedImagesFileList = record?.images?.map(
                (url: string, index: number) => ({
                  uid: `-1-${index}`, // 每个文件需要唯一的 uid
                  name: `image-${index}.jpg`, // 自定义一个文件名
                  status: "done", // 表示该文件已经上传完成
                  url, // 图片的 URL
                  thumbUrl: url, // 确保显示缩略图
                }),
              );

              setParkImagesFileList(formattedImagesFileList);
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
                managers: record?.managers?.map((item: any) => item?.id),
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
          <Button type="link" onClick={() => handleDeletePark(record)}>
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
  return (
    <div>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Search
            placeholder="请输入园区名进行搜索"
            // style={{ width: "20rem" }}
            onSearch={(value) => handelGetSearchValue(value)}
            enterButton
          />
        </Col>
        <Col className="gutter-row" span={6}>
          <Button
            type="primary"
            onClick={() => setIsAddOrEditHouseModalVisible(true)}
          >
            新增项目
          </Button>
        </Col>
      </Row>
      <Table
        tableLayout="fixed"
        dataSource={listData}
        style={{ marginTop: 24 }}
        columns={column}
        scroll={{ x: 1000 }} // 设置横向和纵向滚动
        pagination={{
          current: currentPage, // 当前页码
          total: total, // 总条数
          pageSize: 10, // 每页显示条数
          showTotal: (total) => `共 ${total} 条`,
        }}
        loading={loading}
        onChange={(pagination: any) => {
          setCurrentPage(pagination.current); // 设置当前页码
        }}
      />
      <Modal
        open={isAddOrEditHouseModalVisible}
        onCancel={() => {
          setIsAddOrEditHouseModalVisible(false);
          form.resetFields();
          setCoverImageFileList([]);
          setParkImagesFileList([]);
        }}
        title={modalType == 1 ? "新增项目" : "修改项目"}
        width={1300}
        okText="确认"
        cancelText="取消"
        onOk={
          modalType === 1 ? handleAddPark : () => handleEditPark(selectEditPark)
        }
        maskClosable={false}
      >
        <Form
          style={{ width: "100%", padding: "40px 0 0 0" }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          form={form}
        >
          <Form.Item
            label="项目名"
            name="parkName"
            rules={[{ required: true, message: "请输入项目名！" }]}
            validateFirst
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="城市"
            name="city"
            rules={[{ required: true, message: "请输入地址！" }]}
            validateFirst
          >
            <Input placeholder="请输入城市，例如：上海市" />
          </Form.Item>
          <Form.Item
            label="区"
            name="districtName"
            rules={[{ required: true, message: "请输入地址！" }]}
            validateFirst
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="详细地址"
            name="address"
            rules={[{ required: true, message: "请输入地址！" }]}
            validateFirst
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="经度"
            name="latitude"
            rules={[{ required: true, message: "请输入经度！" }]}
            validateFirst
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="纬度"
            name="longitude"
            rules={[{ required: true, message: "请输入纬度！" }]}
            validateFirst
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="公司"
            name="company"
            rules={[{ required: true, message: "请输入公司！" }]}
            validateFirst
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="建筑面积"
            name="totalArea"
            rules={[{ required: true, message: "请输入建筑面积！" }]}
            validateFirst
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="楼层数"
            name="totalFloor"
            rules={[{ required: true, message: "请输入楼层数！" }]}
            validateFirst
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="标准层层高"
            name="floorHeight"
            rules={[{ required: true, message: "请输入标准层层高!" }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="价格范围"
            name="price"
            rules={[
              {
                required: true,
                message: "请输入价格范围！",
              },
              {
                pattern: /^\d+(\.\d+)?(-\d+(\.\d+)?)?$/,
                message:
                  "请请输入正确的价格范围，输入用-符号分隔的字符串，比如1.5-3.5，或者输入一个纯数字输入正确的价格范围",
              },
            ]}
            validateFirst
          >
            <Input placeholder="请请输入正确的价格范围，输入用-符号分隔的字符串，比如1.5-3.5，或者输入一个纯数字输入正确的价格范围" />
          </Form.Item>
          {/* <Form.Item
            label="标签"
            name="label"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input />
          </Form.Item> */}

          <Form.Item
            label="招商顾问"
            name="managers"
            rules={[{ required: true, message: "请选择招商顾问!" }]}
          >
            <Select options={managerData} mode="multiple" />
          </Form.Item>
          <Form.Item
            label="园区介绍"
            name="introduce"
            rules={[{ required: true, message: "请输入园区介绍！" }]}
            validateFirst
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
            label="园区图片"
            valuePropName="fileList"
            name="images"
            rules={[
              {
                required: true,
                message: "请上传园区图(不超过8张)！",
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
              accept="image/*" // 只接受图片文件
              action="/adm/upload_image"
              maxCount={8}
              fileList={parkImagesFileList}
              onChange={handleUploadParkImagesChange}
            >
              {parkImagesFileList.length >= 8 ? null : uploadButton}
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
              accept="image/*" // 只接受图片文件
              fileList={coverImageFileList}
              onChange={handleUploadCoverImageChange}
            >
              {coverImageFileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectManagement;
