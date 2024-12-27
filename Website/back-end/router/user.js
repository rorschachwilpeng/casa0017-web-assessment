const express = require("express");
const db = require("../db/index");
const router = express.Router();

/**
 * 用户注册路由
 * @route POST /api/reguser
 */
router.post("/reguser", (req, res) => {
  try {
    // 接收表单数据
    const userinfo = req.body;
    // 判断数据是否合法
    if (!userinfo.username || !userinfo.password) {
      return res.send({
        status: 1,
        msg: "用户名或密码不能为空",
      });
    }

    // 定义sql语句，查询用户名是否被占用
    const sqlStr = "SELECT * FROM ev_users WHERE username=?";
    db.query(sqlStr, userinfo.username, (err, results) => {
      if (err) return res.send({ status: 1, message: err.message }); //sql执行出错
      // 判断用户是否被占用
      if (results.length > 0) {
        return res.send({
          status: 1,
          message: "用户名已被占用，请更换其他用户名",
        });
      }
      // 用户名可用
      // TODO Others
    });
    
  } catch (error) {
    res.status(500).send("注册失败");
  }
});

/**
 * 用户登录路由
 * @route POST /api/login
 */
router.post("/login", (req, res) => {
  try {
    console.log("登录请求体:", req.body);
    // TODO: 添加用户登录逻辑
    res.send("login OK");
  } catch (error) {
    res.status(500).send("登录失败");
  }
});

module.exports = router;