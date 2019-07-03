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
              <el-tag closable @close="deleteRights(row, level1.id)">{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col>
              <el-row class="level2" type="flex" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="deleteRights(row, level2.id)"
                  >{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col>
                  <el-tag
                    type="warning"
                    class="level3"
                    closable
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    @close="deleteRights(row, level3.id)"
                  >{{level3.authName}}</el-tag>
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
        <template v-slot="{row}">
          <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
          <el-button
            type="success"
            plain
            icon="el-icon-check"
            size="mini"
            @click="RoleAuthorization(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限模态框 -->
    <el-dialog title="角色授权" :visible.sync="RoleAuthorizationShow">
      <el-tree
        :data="RoleAuthorizationList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="checked"
        :props="defaultProps"
        ref="RoleAuthorizationTree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="RoleAuthorizationShow=false">取 消</el-button>
        <el-button type="primary" @click="UpDataRoleAuthorization">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesData: [],
      RoleAuthorizationShow: false,
      RoleAuthorizationList: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      checked: [],
      currentId: -1
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
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.rolesData = res.data.data;
      }
    },
    // 分配权限
    // 1.点击分配权限按钮弹出模态框，渲染数据
    async RoleAuthorization(row) {
      this.currentId = row.id;
      // console.log(row);
      this.RoleAuthorizationShow = true;
      let res = await this.$http({
        url: `rights/tree`
      });
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.RoleAuthorizationList = res.data.data;
      }
      // 2.默认选中已有的权限
      let level1Id = [];
      let level2Id = [];
      let level3Id = [];
      row.children.forEach(level1 => {
        level1Id.push(level1.id);
        level1.children.forEach(level2 => {
          level2Id.push(level2.id);
          level2.children.forEach(level3 => {
            level3Id.push(level3.id);
          });
        });
      });
      this.checked = [...level3Id];
    },
    // 点击确认重新渲染权限
    async UpDataRoleAuthorization() {
      let ids = [
        ...this.$refs.RoleAuthorizationTree.getCheckedKeys(),
        ...this.$refs.RoleAuthorizationTree.getHalfCheckedKeys()
      ].join();
      let res = await this.$http({
        url: `roles/${this.currentId}/rights`,
        data: {
          rids: ids
        },
        method: "post"
      });
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        this.RoleAuthorizationShow = false;
        this.getRolesList();
      }
    },
    // 删除权限
    async deleteRights(row, id) {
      // console.log(row, id);
      let level1Id = [];
      let level2Id = [];
      let level3Id = [];
      row.children.forEach(level1 => {
        level1Id.push(level1.id)
        level1.children.forEach(level2 => {
          level2Id.push(level2.id)
          level2.children.forEach(level3 => {
            level3Id.push(level3.id)
          })
        })
      })
      let ids = [...level1Id, ...level2Id, ...level3Id]
      ids = ids.filter(v => v !== id).join()
      let res = await this.$http({
        url: `roles/${row.id}/rights`,
        method: "post",
        data: {
          rids: ids
        }
      })
      if(res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        this.getRolesList();
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


