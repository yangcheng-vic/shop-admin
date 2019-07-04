<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加分类按钮 -->
    <el-button type="success" plain style="margin-top: 10px" @click="addCategories">添加分类</el-button>
    <!-- 表格 -->
    <el-table :data="categoriesList" stripe style="width: 100%">
      <!-- file-icon指的就是叶子节点的图标
            folder-icon指的就是可展开的项的图标
            prop 指的就是当前列要显示的数据的属性名称
            label 指的就是表头 
            treeKey 节点的唯一表示
            parentKey 数据的父节点id
            childKey 当前节点的所有子节点存放的属性的名字 默认是children

            indent-size是用来设置每个层级之间的缩进距离的
            设置indent-size 需要同时制定 层级属性

            level-key:    设置为数据中标识层级的属性名即可
      -->
      <el-table-tree-column
        file-icon="el-icon-document"
        folder-icon="el-icon-folder"
        prop="cat_name"
        label="分类名称"
        width="220"
        tree-key="cat_id"
        parent-key="cat_pid"
        :indent-size="20"
        level-key="cat_level"
      ></el-table-tree-column>
      <el-table-column label="是否有效" width="180">
        <template v-slot="{row}">
          <span>{{row.cat_deleted ? "否" : "是"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="层级">
        <template v-slot="{row}">
          <span>{{row.cat_level | levelFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="delCate(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="pagenum"
      :page-size="pagesize"
      @current-change="changePage"
    ></el-pagination>
    <!-- 添加分类模态框 -->
    <el-dialog title="添加分类" :visible.sync="isAddCateShow">
      <el-form :model="cateList" label-width="100px" ref="addCateForm">
        <el-form-item label="分类名称">
          <el-input v-model="cateList.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader :props="defaultProps" v-model="cateList.parentArr" :options="cateOptions"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddCateShow = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
var ElTreeGrid = require("element-tree-grid");
export default {
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  },
  data() {
    return {
      categoriesList: [],
      pagesize: 5,
      pagenum: 1,
      total: 0,
      isAddCateShow: false,
      cateList: {
        cat_name: "",
        parentArr: []
      },
      cateOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        checkStrictly: true
      }
    };
  },
  methods: {
    async getCategoriesList() {
      let res = await this.$http({
        url: `categories`,
        params: {
          type: 3,
          pagesize: this.pagesize,
          pagenum: this.pagenum
        }
      });
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.total = res.data.data.total;
        this.categoriesList = res.data.data.result;
      }
    },
    changePage(page) {
      this.pagenum = page;
      this.getCategoriesList();
    },
    // 添加分类
    // 1.渲染级联选择器
    async addCategories() {
      this.isAddCateShow = true;
      let res = await this.$http({
        url: `categories`,
        params: {
          type: 2
        }
      });
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.cateOptions = res.data.data;
      }
    },
    // 2.确认添加分类
    async addCate() {
      let cat_pid = this.cateList.parentArr.pop() || 0
      let cat_name = this.cateList.cat_name
      let cat_level = this.cateList.parentArr.length + 1
      let res = await this.$http({
        url: `categories`,
        method: "post",
        data: {
          cat_pid,
          cat_name,
          cat_level
        }
      });
      if (res.data.meta.status === 201) {
        this.$message({
          message: res.data.meta.msg,
          type: "success"
        });
        this.isAddCateShow = false;
        this.$refs.addCateForm.resetFields();
        this.getCategoriesList();
      }
    },
    // 删除分类
    async delCate(row) {
      console.log(row);
      let res = await this.$http({
        url: `categories/${row.cat_id}`,
        method: "delete"
      })
      this.$message({
        message: res.data.meta.msg,
        type: "success"
      })
      this.getCategoriesList();
    }
  },
  created() {
    this.getCategoriesList();
  },
  filters: {
    levelFilter(value) {
      switch (value) {
        case 0:
          return "一级";
        case 1:
          return "二级";
        case 2:
          return "三级";
      }
    }
  }
};
</script>

