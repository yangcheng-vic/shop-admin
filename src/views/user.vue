<template>
  <el-table :data="userlist" stripe style="width: 100%">
    <el-table-column prop="username" label="姓名" width="180"></el-table-column>
    <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
    <el-table-column prop="mobile" label="电话"></el-table-column>
    <el-table-column label="用户状态">
      <template v-slot="{row}">
        <el-switch v-model="row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
      <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
      <el-button type="success" plain icon="el-icon-check" size="mini">分配角色</el-button>
    </el-table-column>
  </el-table>
</template>

<script>
import axios from "axios";
import { constants } from "crypto";
export default {
  data() {
    return {
      userlist: []
    };
  },
  async created() {
    let res = await axios({
      baseURL: "http://localhost:8888/api/private/v1/",
      url: "users",
      params: {
        pagenum: 1,
        pagesize: 5
      },
      headers: {
        Authorization: localStorage.getItem("token")
      }
    });
    console.log(res.data.data.users);
    let {data: {data, meta}} = res
    if (meta.status === 200) {
      this.userlist = data.users;
    }
  }
};
</script>
