#指定基础镜像，node版本，满足宿主环境
FROM node:19-alpine as builder
WORKDIR /app

COPY package.json yarn.lock ./
COPY . ./
RUN yarn config set registry https://registry.npm.taobao.org
RUN yarn --network-timeout 100000

RUN yarn build


#运行阶段
FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf