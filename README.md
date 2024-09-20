## 秒画管理平台

### 技术栈vite + react

### ui库:

- antd:https://ant.design/components/overview-cn
- antd-pro:https://procomponents.ant.design/components

### 部署：

1. 本地打镜像，
   `docker image build -t registry.sensetime.com/aigame/miaohua-admin-fe:latest .`
2. 本地测试镜像
   `docker run -p 8080:80 registry.sensetime.com/aigame/miaohua-admin-fe:latest`，后打开`http://localhost:8080/`网址
3. push镜像
   `docker push registry.sensetime.com/aigame/miaohua-admin-fe:latest`

4. 到数据堡垒：https://opencloud.sensetime.com/#/blj?682c9vozr=768e414467744b848bc5789cb2460a41
   - 进入机器10.5.64.49
   - 进入k8s文件，将k8s的deploy.yaml文件apply一下（如果已经applay，可忽略）
   - 测试环境：bd命名空间，端口号30889，对应k8s文件夹下的`service-test.yaml`文件，`deploy.yaml`同生产环境
     `kubectl -n bd apply -f deploy.yaml`
     `kubectl -n bd apply -f service.yaml`
   - 生产环境：admin命名空间，端口号30888，对应k8s文件夹下的`service.yaml`文件
     `kubectl -n admin apply -f deploy.yaml`
     `kubectl -n admin apply -f service.yaml`
   - 重新启动服务，一般更新完镜像，重新启动服务
     - 测试环境：`kubectl -n bd rollout restart deployment miaohua-admin-fe`
     - 开发环境：`kubectl -n admin rollout restart deployment miaohua-admin-fe`
