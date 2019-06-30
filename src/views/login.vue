<template>
  <el-row type="flex" class="row-bg" justify="center" align="middle">
    <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6" class="login">
      <el-form ref="loginForm" :model="loginForm" :rules="rules" label-width="80px" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style>
  .row-bg {
    height: 100%;
    background-color: #2d434c;
  }
  .login {
    background-color: #fff;
    padding: 30px 20px;
    border-radius: 10px;
  }
</style>


<script>
import { constants } from 'crypto'

import axios from 'axios'

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios({
            method: "post",
            data: this.loginForm,
            url: "http://localhost:8888/api/private/v1/login"
          }).then(({data: {data, meta}}) => {
            // console.log(data,meta)
            if(meta.status === 200) {
              localStorage.setItem("token", data.token)
              this.$router.push("/home")
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

