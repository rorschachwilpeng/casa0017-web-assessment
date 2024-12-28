const express = require("express");
const cors = require("cors");
const path = require("path");

/**
 * 创建 Express 应用实例
 */
const app = express();

/**
 * 配置全局中间件
 */
// 允许跨域请求
app.use(cors());
// 解析 application/x-www-form-urlencoded 格式的请求体
app.use(express.urlencoded({ extended: false }));
// 解析 application/json 格式的请求体
app.use(express.json());
// 提供静态文件访问
app.use('/posters', express.static(path.join(__dirname, 'public/posters')));

/**
 * 注册路由模块
 */
const userRouter = require("./router/user");
const moviesRouter = require('./router/movies');

app.use("/api", userRouter);
app.use('/api', moviesRouter);

/**
 * 启动服务器
 */
const PORT = 3007;
app.listen(PORT, () => {
    console.log(`API 服务器运行在 http://127.0.0.1:${PORT}`);
});


