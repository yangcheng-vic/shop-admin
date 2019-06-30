<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          v-model="searchKeywords"
          class="input-with-select"
          @keyup.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="success" plain @click="isAddUserShow">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="userlist" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="toggleState(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="delUser(row.id)"></el-button>
          <el-button type="success" plain icon="el-icon-check" size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      @current-change="currentChange"
    ></el-pagination>
    <!-- 添加模态框 -->
    <el-dialog title="添加用户" :visible.sync="AddUserShow" @close="removeFrom('ruleForm')">
      <el-form :model="userForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" autocomplete="off" show-password type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="userForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AddUserShow=false">取 消</el-button>
        <el-button type="primary" @click="add('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userlist: [],
      total: 0,
      currentPage: 1,
      pageSize: 3,
      searchKeywords: "",
      AddUserShow: false,
      userForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "用户名长度在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码长度在 6 到 15 个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 渲染用户信息列表
    async getUserList() {
      let res = await this.$http({
        url: "users",
        params: {
          query: this.searchKeywords,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      });
      // console.log(res.data.data.users);
      let {
        data: { data, meta }
      } = res;
      if (meta.status === 200) {
        // console.log(data);
        this.userlist = data.users;
        this.total = data.total;
      }
    },
    // 分页器事件
    currentChange(page) {
      this.currentPage = page;
      this.getUserList();
    },
    // 搜索关键字
    search() {
      this.getUserList();
    },
    // 切换用户状态
    async toggleState(row) {
      // console.log(row)
      let res = await this.$http({
        url: `users/${row.id}/state/${row.mg_state}`,
        method: "put"
      });
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: "success",
          duration: 1000
        });
      } else {
        this.$message({
          message: res.data.meta.msg,
          type: "error",
          duration: 1000
        });
        row.mg_state = !row.mg_state;
      }
    },
    // 删除用户信息
    async delUser(id) {
      try {
        await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        let res = await this.$http({
          url: `users/${id}`,
          method: "delete"
        });
        console.log(res);
        if (res.data.meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: 1000
          });
          this.currentPage = 1;
          this.getUserList();
        }
      } catch (err) {
        this.$message({
          message: "已取消删除",
          type: "info",
          duration: 1000
        });
      }
    },
    // 添加用户信息
    //1.显示模态框
    isAddUserShow() {
      this.AddUserShow = true;
    },
    // 2.点击确认按钮添加信息
    async add(formName) {
      try {
        await this.$refs[formName].validate();
        let res = await this.$http({
          url: "users",
          method: "post",
          data: this.userForm
        });
        console.log(res);
        if (res.data.meta.status === 201) {
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: 1000
          });
          this.AddUserShow = false;
          this.getUserList();
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: "error",
            duration: 1000
          });
        }
      } catch (err) {}
    },
    // 3.关闭清除添加模态框内容
    removeFrom(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style>
.el-breadcrumb.breadcrumb {
  background-color: #d4dae0;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  padding-left: 10px;
}
</style>

