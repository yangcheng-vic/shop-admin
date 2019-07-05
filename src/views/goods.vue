<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加商品按钮 -->
    <el-button type="success" plain style="margin-top: 10px" @click="$router.push('/goods-add')">添加商品</el-button>
    <!-- 表格 -->
    <el-table :data="goodsList" stripe style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot="{row}">
          {{row.add_time | dateFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
        <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination background layout="prev, pager, next" :total="total" :current-page="pagenum" :page-size="pagesize" @current-change="changePage"></el-pagination>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 6,
      total: 0
    };
  },
  async created() {
    this.getGoodslList();
  },
  methods: {
    async getGoodslList() {
      let res = await this.$http({
        url: `goods`,
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      // console.log(res)
      this.goodsList = res.data.data.goods
      this.total = res.data.data.total
    },
    changePage(page) {
      this.pagenum = page
      this.getGoodslList()
    }
  },
   filters: {
     dateFilter(value) {
       return moment.unix(value).format('YYYY-MM-DD HH:mm:ss')
     }
   }
};
</script>

