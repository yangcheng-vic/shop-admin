<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表格 -->
    <el-table :data="rolesData" stripe style="width: 100%">
      <el-table-column type="expand">
        <template v-slot="{row}">
          <el-row class="level1" type="flex" v-for="level1 in row.children" :key="level1.id">
            <el-col :span="6">
              <el-tag closable>{{level1.authName}}</el-tag>
            </el-col>
            <el-col>
              <el-row class="level2" type="flex" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="6">
                  <el-tag type="success" closable>{{level2.authName}}</el-tag>
                </el-col>
                <el-col>
                  <el-tag type="warning" class="level3" closable v-for="level3 in level2.children" :key="level3.id">{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
          <el-button type="success" plain icon="el-icon-check" size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesData: []
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      let res = await this.$http({
        url: "roles"
      });
      console.log(res);
      if (res.data.meta.status === 200) {
        this.rolesData = res.data.data;
      }
    }
  }
};
</script>

<style scoped>
.level1 {
  padding: 20px 0;
  border-bottom: 1px dashed #ccc;
}
.level1:last-child {
  border-bottom: none;
}
.level2 {
  margin-bottom: 10px;
}
.level3 {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>


