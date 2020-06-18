# 介绍

基于vue、element-ui构建开发的后台管理前端功能

# 功能

```
- 登录/退出 (接口数据交互)
- 管理员列表 (接口数据交互)
- 角色管理 (接口数据交互)
- 菜单管理 (接口数据交互)
- SQL监控 (接口数据交互)
- 定时任务 (接口数据交互)
- 参数管理 (接口数据交互)
- 文件上传 (接口数据交互)
- 系统日志 (接口数据交互)
- 前后端分离，通过token进行数据交互，可独立部署
- 主题定制，通过scss变量统一一站式定制
- 动态菜单，通过菜单管理统一管理访问路由
- 数据切换，通过mock配置对接口数据／mock模拟数据进行切换
- 发布时，可动态配置CDN静态资源／切换新旧版本
- 更多，持续迭代中...
```

# 技术栈

你需要在本地安装 nodejs，提前了解和学习这些知识会对使用本项目有很大的帮助。

- [nodejs](http://nodejs.org/)
- [ES6](http://es6.ruanyifeng.com/)
- [vue-cli](https://github.com/vuejs/vue-cli)
- [vue](https://cn.vuejs.org/index.html)
- [vue-router](https://github.com/vuejs/vue-router)
- [vuex](https://github.com/vuejs/vuex)
- [axios](https://github.com/axios/axios)
- [vue-cookie](https://github.com/alfhen/vue-cookie)
- [element-ui](https://github.com/ElemeFE/element)
- [iconfont](http://www.iconfont.cn/)

# 目录结构

本项目已经通过vue-cli脚手架为你生产完整的开发框架（有根据业务需求做调整修改），下面是整个项目的目录结构。

```bash
├── dist                       // 构建打包生成部署文件
│   ├── config                 // 配置
│   ├── index.html             // index.html入口
├── build                      // 构建相关
├── config                     // 构建配置相关
├── src                        // 源代码
│   ├── assets                 // 静态资源
│   ├── components             // 全局公用组件
│   ├── element-ui             // element-ui组件配置
│   ├── element-ui-theme       // element-ui组件主题配置
│   ├── icons                  // 所有 svg icons
│   ├── mock                   // mock 模拟数据
│   ├── router                 // 路由
│   ├── store                  // 全局 store管理
│   ├── utils                  // 全局公用方法
│   ├── views                  // view
│   ├── App.vue                // 入口组件
│   ├── main.js                // 入口
├── static                     // 第三方不打包资源
│   ├── config                 // 全局变量配置
│   ├── plugins                // 插件
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json
```

# 安装
注意：需要Node v10.16.3

安装过程中，可能会出现安装过慢、报错等情况，请尝试以下2种方式：
```bash

# 安装依赖
npm install

# 启动服务
npm run dev
```


```bash

# 安装依赖
# 1
npm install -g cnpm --registry=https://registry.npm.taobao.org
# 2
cnpm install

# 启动服务
npm run dev

# 打包
npm run build
```

启动完成后会自动打开浏览器访问 http://localhost:8001


# mock/api数据切换

在前后端分离的情况下，往往前后台是并行开发的！两队先讨论商议确定接口名称、请求类型、请求参数、返回数据等后，就可以暂时并行开发了。为了让前端更加灵活的、更快捷的进行业务逻辑开发，这里提供通过mockJs本地接口拦截，返回模拟数据功能。

#### 开启mock本地模拟数据

1. 通过设置[/src/mock/index.js)]()文件中```fnCreate(common, [false])```[]中括号中为true／false开启关闭当前模块mock本地模拟数据功能。（默认关闭）
2. 通过设置[/src/mock/modules/]()文件下模块```isOpen: [false]```[]中括号中为```true／false```开启关闭当前api接口mock本地模拟数据功能。（默认关闭）

> 具体模拟数据请参考：[mockJs](https://github.com/nuysoft/Mock)


# docker 打包发布原理
# 注意修改package.json : scripts.deploy 修改公有云docker地址和用户名密码
# build时 需要根据不同环境修改后端请求地址 static/config/index-prod.js
# 环境指定请参照 gulpfile.js 60行 ，然后修改package.json的 build_docker_test
``` shell
# 执行脚本 发布测试镜像
npm run build_docker_test
# 执行脚本 发布线上镜像
npm run build_docker_online
```
# 该脚本会在本地编译出vue生产环境所需要的静态文件 然后COPY到NGINX root目录
# Nginx对外开放端口为80端口
# 注意：  1. 本地node版本为8.15时 可以编译成功，其他未知。
#        2. 未完成 api转发工作 目前api请求不成功
