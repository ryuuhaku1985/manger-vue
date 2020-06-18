# 部署nginx解析静态资源
FROM nginx:latest
# 如果需要替换nginx配置文件 新建一个配置文件COPY过去
# COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html/  

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]