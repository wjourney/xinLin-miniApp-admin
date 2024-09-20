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
} from "antd";

const ProjectManagement: react.FC = () => {
  //加了搜索框之后获取搜索值
  const [prompt, setPrompt] = useState<string>("");
  const [userName, setUserName] = useState("");
  const { Search } = Input;
  const [selectPlatform, setSelectPlatform] = useState("miaohua");

  return (
    <Fragment>
      <div>
        <Row>
          <Col span={3}>
            <Radio.Group
              defaultValue="miaohua"
              buttonStyle="solid"
              onChange={(e) => setSelectPlatform(e.target.value)}
              style={{ marginBottom: "2rem" }}
            >
              <Radio.Button value="miaohua">秒画</Radio.Button>
              <Radio.Button value="remagi">Remagi</Radio.Button>
            </Radio.Group>
          </Col>
          <Col span={6}>
            <Search
              placeholder="请输入prompt"
              size="large"
              onSearch={(value, e) => setPrompt(value)}
              enterButton
            />
          </Col>
          <Col span={6}>
            <Search
              placeholder="请输入用户名"
              size="large"
              onSearch={(value, e) => setUserName(value)}
              enterButton
            />
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default ProjectManagement;
