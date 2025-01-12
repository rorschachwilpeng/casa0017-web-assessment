const express = require("express");
const cors = require("cors");
const path = require("path");

/**
 * 创建 Express 应用实例
 */
const app = express();

/**
 * 配置全局中间件\
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
  next();
});

// 配置静态文件服务
const publicPath = path.join(__dirname, 'public');
console.log('Static files path:', publicPath); // 调试用：打印静态文件路径
app.use(express.static(publicPath));

/**
 * 注册路由模块
 */
const userRouter = require("./router/user");
const moviesRouter = require('./router/movies');
const cinemasRouter = require('./router/cinemas');
const crimesRouter = require('./router/crimes');
const routesRouter = require('./router/routes');
const seatsRouter = require('./router/seats');
const actorsRouter = require('./router/actors');

app.use("/api", userRouter);
app.use('/api', moviesRouter);
app.use('/api', cinemasRouter);
app.use('/api/crimes', crimesRouter);
app.use('/api/routes', routesRouter);
app.use('/api', seatsRouter);
app.use('/api/actors', actorsRouter);

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
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('已注册的路由:');
  console.log('/api/movies/:id - 获取电影详情');
  console.log('/api/movies/:id/reviews - 获取电影评论');
});

