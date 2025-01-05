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

// 解析 application/json 格式的请求体
app.use(express.json());

// 解析 application/x-www-form-urlencoded 格式的请求体
app.use(express.urlencoded({ extended: false }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method !== 'GET') {
    console.log('Request Body:', req.body);
  }
  next();
});

// 提供静态文件访问
app.use('/posters', express.static(path.join(__dirname, 'public/posters')));

/**
 * 注册路由模块
 */
const userRouter = require("./router/user");
const moviesRouter = require('./router/movies');
const cinemasRouter = require('./router/cinemas');
const crimesRouter = require('./router/crimes');
const routesRouter = require('./router/routes');

app.use("/api", userRouter);
app.use('/api', moviesRouter);
app.use('/api', cinemasRouter);
app.use('/api/crimes', crimesRouter);
app.use('/api/routes', routesRouter);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    status: 1,
    message: 'Internal Server Error',
    error: err.message
  });
});

/**
 * 启动服务器
 */
const PORT = 3007;
app.listen(PORT, () => {
    console.log(`API 服务器运行在 http://127.0.0.1:${PORT}`);
});


