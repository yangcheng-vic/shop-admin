<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :active="activeStep" finish-status="success" style="margin-top: 10px">
      <el-step title="第一步" description="基本信息"></el-step>
      <el-step title="第二步" description="基本图片"></el-step>
      <el-step title="第三步" description="基本内容"></el-step>
    </el-steps>
    <!-- tab栏 -->
    <el-tabs
      v-model="activeName"
      tab-position="left"
      style="margin-top: 20px"
      @tab-click="changeTab"
    >
      <el-tab-pane label="基本信息" name="info">
        <el-form ref="form" :model="addGoodsFormData" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addGoodsFormData.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addGoodsFormData.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addGoodsFormData.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addGoodsFormData.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="addGoodsFormData.goods_cat"
              :options="cateOptions"
              :props="defaultProps"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="addGoodsFormData.is_promote" label="1">是</el-radio>
            <el-radio v-model="addGoodsFormData.is_promote" label="0">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next(1, 'pic')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="基本图片" name="pic">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :headers="headers"
          :on-success="uploads"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2, 'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="基本内容" name="content">
        <quill-editor
          v-model="addGoodsFormData.goods_introduce"
        ></quill-editor>
        <el-button type="primary" @click="addGoods">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      activeStep: 0,
      activeName: "info",
      addGoodsFormData: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: [],
        is_promote: "",
        pics: [],
        goods_introduce: ""
      },
      cateOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name"
      },
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  methods: {
    next(activeStep, activeName) {
      this.activeStep = activeStep;
      this.activeName = activeName;
    },
    changeTab(tab) {
      // console.log(tab)
      this.activeStep = +tab.index;
    },
    // 图片上传
    uploads(res) {
      // console.log(res);
      this.addGoodsFormData.pics.push({
        pic: res.data.tmp_path
      });
    },
    // 添加商品
    async addGoods() {
      let newObj = {
        goods_name: this.addGoodsFormData.goods_name,
        goods_price: this.addGoodsFormData.goods_price,
        goods_weight: this.addGoodsFormData.goods_weight,
        goods_number: this.addGoodsFormData.goods_number,
        goods_cat: this.addGoodsFormData.goods_cat.join(),
        is_promote: this.addGoodsFormData.is_promote,
        pics: this.addGoodsFormData.pics,
        goods_introduce: this.addGoodsFormData.goods_introduce,
      }
      let res = await this.$http({
        url: `goods`,
        method: "post",
        data: newObj
      })
      // console.log(res)
      if(res.data.meta.status === 201) {
        this.$router.push('/goods')
      }
    }
  },
  async created() {
    let res = await this.$http({
      url: `categories`,
      params: {
        type: 3
      }
    });
    // console.log(res);
    if (res.data.meta.status === 200) {
      this.cateOptions = res.data.data;
    }
  }
};
</script>
<style>
  .ql-container {
    height: 200px;
  }
</style>


