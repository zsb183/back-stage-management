<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 返回、退出 -->
      <i class="el-icon-arrow-left return" @click="exit"></i>
      <!-- 警示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        show-icon
        center
      >
      </el-alert>

      <!-- 步骤条 -->
      <el-steps
        :active="activeStep - 0"
        simple
        process-status="process"
        finish-status="success"
      >
        <el-step title="基本信息" icon="el-icon-document"></el-step>
        <el-step title="商品参数" icon="el-icon-s-operation"></el-step>
        <el-step title="商品属性" icon="el-icon-setting"></el-step>
        <el-step
          title="商品图片"
          icon="el-icon-picture-outline-round"
        ></el-step>
        <el-step title="商品内容" icon="el-icon-edit"></el-step>
        <el-step title="完成" icon="el-icon-circle-check"></el-step>
      </el-steps>
      <!-- Form表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tab标签页 -->
        <el-tabs
          v-model="activeStep"
          @tab-click="handleClick"
          tabPosition="left"
          :before-leave="beforeLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 基本信息页 -->
            <!-- 选择商品分类分类 -->
            <el-form-item label="选择商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="CateList"
                :props="CateProps"
                @change="CateChange"
                clearable
              ></el-cascader>
            </el-form-item>
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in this.paramsList"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="val"
                  v-for="val in item.attr_vals"
                  :key="val"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in this.attributeList"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="action"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :headers="headers"
              :on-success="handleSuccess"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" /> </el-dialog
          ></el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" round @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    // 自定义选择分类验证
    var validateCate = (rule, value, callback) => {
      if (value.length === 3) {
        callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    return {
      // 当前所在的步骤、tab绑定值
      activeStep: "0",
      //   添加商品表单数据
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [], //商品所属分类数组
        pics: [], //图片数组
        goods_introduce: "", //商品详情介绍
        attrs: [], //商品参数数组
      },
      // 添加商品表单数据验证
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: "blur",
          },
          { validator: validateCate, trigger: "blur" },
        ],
      },
      // 分类列表
      CateList: [],
      // 分类列表请求参数
      CatePage: {
        type: 3,
      },
      // 为级联选择器配置选项
      CateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 动态参数列表
      paramsList: {},
      // 静态属性列表
      attributeList: {},
      // 上传路径
      action: "http://127.0.0.1:8888/api/private/v1/upload",
      // 上传请求头
      headers: {
        Authorization: window.sessionStorage.getItem("token_"),
      },
      // 上传的图片路径
      dialogImageUrl: "",
      //  预览对话框隐藏与否
      dialogVisible: false,
    };
  },
  methods: {
    //   返回上一级路由
    exit() {
      this.$router.push("/goods");
    },

    // 监听Tab栏切换
    handleClick() {
      // console.log(this.activeStep);
      // 获取动态参数
      if (this.activeStep === "1") {
        this.axios
          .get(
            `categories/${
              this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
            }/attributes`,
            {
              params: { sel: "many" },
            }
          )
          .then((res) => {
            // console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message({
                type: "error",
                message: "信息获取失败",
              });
            } else {
              res.data.data.forEach((item) => {
                item.attr_vals =
                  item.attr_vals !== "" ? item.attr_vals.split(" ") : [];
              });
              this.paramsList = res.data.data;
            }
          });
      }
      // 获取静态属性
      if (this.activeStep === "2") {
        this.axios
          .get(
            `categories/${
              this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
            }/attributes`,
            {
              params: { sel: "only" },
            }
          )
          .then((res) => {
            // console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message({
                type: "error",
                message: "信息获取失败",
              });
            } else {
              // res.data.data.forEach((item) => {
              //   item.attr_vals =
              //     item.attr_vals !== "" ? item.attr_vals.split(" ") : [];
              // });
              this.attributeList = res.data.data;
            }
          });
      }
    },
    // tab栏切换前的判断
    beforeLeave(activeName, oldActiveName) {
      if (this.addForm.goods_cat.length == 3) {
        return true;
      } else {
        return false;
      }
    },
    // 获取商品分类列表
    getCateList() {
      this.cateKeys = [];
      this.axios
        .get("categories", {
          params: this.CatePage,
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message({
              type: "error",
              message: "信息获取失败",
            });
          } else {
            this.CateList = res.data.data;
          }
        });
    },
    // 监听级联选择框变化
    CateChange() {
      // console.log(this.cateKeys);
      // 判断是不是第三级，不是就清空
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    //  移除上传的图片
    handleRemove(file) {
      // console.log(file);
      let i = this.addForm.pics.indexOf((x) => {
        if (x == file.data.tmp_path) {
          return;
        }
      });
      this.addForm.pics.splice(i, 1);
      // console.log(this.addForm.pics);
      console.log(this.addForm);
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 文件上传成功时
    handleSuccess(file) {
      this.addForm.pics.push({
        pic: file.data.tmp_path,
      });
      // console.log(file.data.tmp_path);
      console.log(this.addForm);
    },
    // 添加商品
    addGoods() {
      this.paramsList.forEach((item) => {
        // console.log(item.attr_vals);
        let obj = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(""),
        };
        this.addForm.attrs.push(obj);
      });
      this.attributeList.forEach((item) => {
        let obj = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals,
        };
        this.addForm.attrs.push(obj);
      });
      const form = JSON.parse(JSON.stringify(this.addForm));
      form.goods_cat = form.goods_cat.join(",");
      // console.log(form);
      this.$refs["addFormRef"].validate((validate) => {
        if (!validate)
          return this.$message({
            message: "商品名称、价格、数量、重量不能为空",
            type: "error",
            duration: 2000,
          });
        // console.log(form.goods_name);
        this.axios.post("goods", form).then((res) => {
          if (res.data.meta.status !== 201) {
            his.$message({
              message: "添加商品失败",
              type: "error",
              duration: 2000,
            });
          } else {
            this.$message({
              message: "添加商品成功！",
              type: "success",
              duration: 1000,
            });
            this.$router.push("/goods");
          }
        });
      });
    },
  },
  components: {},
  mounted() {
    this.getCateList();
  },
};
</script>

<style scoped lang="less">
.el-steps {
  margin-top: 15px;
}
.return {
  font-size: 30px;
  margin-bottom: 15px;
  cursor: pointer;
}
.el-tabs {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
.el-button {
  margin-top: 15px;
}
</style>
