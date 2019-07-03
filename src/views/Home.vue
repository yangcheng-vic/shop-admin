<template>
  <el-container>
    <el-header>
      <el-row type="flex" class="row-bg" justify="space-between" align="middle">
        <el-col :span="6">
          <img src="../assets/logo.png" alt />
        </el-col>
        <el-col>
          <h1>品优购后台管理系统</h1>
        </el-col>
        <el-col :span="6">
          <div class="logout">
            欢迎39期星耀会员
            <span @click="logout">退出</span>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router="true"
        >
          <el-submenu v-for="menu1 in menusList" :key="menu1.id" :index="menu1.id + ''">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu1.authName}}</span>
            </template>
            <el-menu-item v-for="menu2 in menu1.children" :key="menu2.id" :index=" '/' + menu2.path">
              <i class="el-icon-menu"></i>
              <span slot="title">{{menu2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.el-container .el-header {
  padding: 0;
}
.el-header .row-bg {
  background-color: #b3c1cd;
}
.el-header .row-bg img {
  width: 200px;
}
.el-header .row-bg h1 {
  color: #fff;
  font-size: 28px;
  margin: 0;
  text-align: center;
}
.el-header .row-bg .logout {
  padding-right: 16px;
  font-size: 16px;
  font-weight: 700;
  text-align: right;
}
.el-header .row-bg .logout span {
  color: orange;
  cursor: pointer;
}

.el-container {
  height: 100%;
}
.el-container .el-menu-vertical-demo {
  height: 100%;
}
</style>

<script>
export default {
  data() {
    return {
      menusList: []
    }
  },
  methods: {
    logout() {
      this.$router.push("/login");
      localStorage.removeItem("token");
    }
  },
  async created() {
    let res = await this.$http({
      url: `menus`,
    })
    // console.log(res)
    if(res.data.meta.status === 200) {
      this.menusList = res.data.data
    }
  }
};
</script>


