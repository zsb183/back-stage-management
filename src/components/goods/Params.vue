<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 警示 -->
      <el-alert
        title="只能选择第三级分类"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类分类 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="cateKeys"
            :options="CateList"
            :props="CateProps"
            @change="CateChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab栏切换 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isdisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isdisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
        </el-tab-pane>
      </el-tabs>
      <!-- 参数列表表格 -->
      <el-table :data="paramsList" style="width: 100%" stripe border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(scope.row,item)" >
              {{ item }}
            </el-tag>
            <el-input
            class="input-new-tag"
            v-if="scope.row.inputVisible"
            v-model="scope.row.inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm(scope.row)"
            @blur="handleInputConfirm(scope.row)"></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
          </template>
          <pre>
            {{ this.paramsList }}
          </pre>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>

        <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <!-- 作用域插槽获取本行数据 -->
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openEdit(scope.row.attr_id, scope.row.cat_id)"
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delect(scope.row.attr_id, scope.row.cat_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加参数/属性 -->
      <el-dialog
        :title="this.activeName === 'many' ? '添加动态参数' : '添加静态属性'"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose"
      >
        <!-- 主要内容 -->
        <el-form
          :model="addParamsForm"
          :rules="addParamsRules"
          ref="addParamsForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            :label="this.activeName === 'many' ? '动态参数' : '静态属性'"
            prop="attr_name"
          >
            <el-input v-model="addParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改参数/属性 -->
      <el-dialog
        :title="this.activeName === 'many' ? '修改动态参数' : '修改静态属性'"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <!-- 主要内容 -->
        <el-form
          :model="editParamsForm"
          :rules="editParamsRules"
          ref="editParamsForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            :label="this.activeName === 'many' ? '动态参数' : '静态属性'"
            prop="attr_name"
          >
            <el-input v-model="editParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 控制添加对话框开关
      addDialogVisible: false,
      // 控制修改对话框开关
      editDialogVisible: false,
      // 控制Tag与文本框的显示
      inputVisible:false,
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
      //  级联选择器绑定值
      cateKeys: [],
      // tab栏绑定值（获取分类静态参数还是动态参数）
      activeName: "many",
      // 控制添加按钮是否禁用
      isdisabled: true,
      // 参数列表
      paramsList: [],
      // 需要添加的数据
      addParamsForm: {
        attr_name: "",
      },
      // 需要添加的数据的验证
      addParamsRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数/属性名称",
            trigger: "blur",
          },
        ],
      },

      // 需要修改的数据
      editParamsForm: {
        attr_name: "",
        cat_id: "",
        attr_id: "",
      },
      // 需要修改的数据的验证
      editParamsRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数/属性名称",
            trigger: "blur",
          },
        ],
      },
      // tag文本框输入的内容
      inputValue:'',
    };
  },
  methods: {
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
    // 获取参数列表
    getParamsList() {
      this.axios
        .get(
          `categories/${this.cateKeys[this.cateKeys.length - 1]}/attributes`,
          {
            params: { sel: this.activeName },
          }
        )
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message({
              type: "error",
              message: "信息获取失败",
            });
          } else {
            res.data.data.forEach((item) => {
              item.attr_vals =
                item.attr_vals !== "" ? item.attr_vals.split(" ") : [];
                item.inputVisible=false;
                item.inputValue='';
            });
            this.paramsList = res.data.data;
            // console.log(this.paramsList);
          }
        });
    },
    // 监听级联选择框变化
    CateChange() {
      // console.log(this.cateKeys);
      // 判断是不是第三级，不是就清空
      if (this.cateKeys.length !== 3) {
        this.cateKeys = [];
        this.paramsList=[];
        this.isdisabled = true;
      } else {
        this.isdisabled = false;
        this.getParamsList();
      }
    },
    // tab栏点击切换
    handleClick() {
      this.getParamsList();
    },
    //  监听添加对话框关闭
    addDialogClose() {
      this.$refs["addParamsForm"].resetFields();
    },
    //  监听修改对话框关闭
    editDialogClose() {
      this.$refs["editParamsForm"].resetFields();
    },
    // 添加
    addParams() {
      this.$refs["addParamsForm"].validate((validate) => {
        if (!validate) return;
        this.axios({
          method: "post",
          url: `categories/${
            this.cateKeys[this.cateKeys.length - 1]
          }/attributes`,
          data: {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName,
            // attr_vals:
          },
        }).then((res) => {
          if (res.data.meta.status !== 201) {
            this.$message({
              message: "添加分类失败",
              type: "error",
              duration: 2000,
            });
          } else {
            this.$message({
              message: "添加分类成功！",
              type: "success",
              duration: 1000,
            });
            this.addDialogVisible = false;
            // 重新获取用户数据 刷新列表
            this.getParamsList();
          }
        });
      });
    },
    // 打开修改对话框
    openEdit(attr_id, cat_id) {
      // console.log(attr_id,cat_id);
      this.axios
        .get(`categories/${cat_id}/attributes/${attr_id}`, {
          params: { sel: this.activeName },
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message({
              type: "error",
              message: "信息获取失败",
            });
          } else {
            this.editParamsForm.attr_name = res.data.data.attr_name;
            this.editParamsForm.cat_id = res.data.data.cat_id;
            this.editParamsForm.attr_id = res.data.data.attr_id;
            this.editDialogVisible = true;
          }
        });
    },
    // 修改
    editParams() {
      this.$refs["editParamsForm"].validate((validate) => {
        if (!validate) return;
        this.axios({
          method: "put",
          url: `categories/${this.editParamsForm.cat_id}/attributes/${this.editParamsForm.attr_id}`,
          data: {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName,
            // attr_vals:
          },
        }).then((res) => {
          if (res.data.meta.status !== 200) {
            this.$message({
              message: "修改参数失败",
              type: "error",
              duration: 2000,
            });
          } else {
            this.$message({
              message: "修改参数成功！",
              type: "success",
              duration: 1000,
            });
            this.editDialogVisible = false;
            // 重新获取用户数据 刷新列表
            this.getParamsList();
          }
        });
      });
    },
    // 删除
    delect(attr_id, cat_id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios
            .delete(`categories/${cat_id}/attributes/${attr_id}`)
            .then((res) => {
              if (res.data.meta.status !== 200) {
                return this.$message.error("删除信息失败！");
              } else {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                // 重新获取用户数据 刷新列表
                this.getParamsList();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // tag文本框失去焦点或点击回车
    handleInputConfirm(val){
      if(val.inputValue!==''){
        val.attr_vals.push(val.inputValue.trim());
        val.inputVisible=false;
        val.inputValue='';
        console.log(val.cat_id);
        let vals=val.attr_vals.join(' ');
        this.axios({
          method: "put",
          url: `categories/${val.cat_id}/attributes/${val.attr_id}`,
          data: {
            attr_name: val.attr_name,
            attr_sel: val.attr_sel,
            attr_vals:vals,
          },
        }).then((res) => {
          console.log(res);
          if (res.data.meta.status !== 200) {
            this.$message({
              message: "修改参数失败",
              type: "error",
              duration: 2000,
            });
          } else {
            this.$message({
              message: "修改参数成功！",
              type: "success",
              duration: 1000,
            });
            // 重新获取用户数据 刷新列表
            // this.getParamsList();
          }
        });
      }else{
        val.inputVisible=false;
      }
        
    },
    // 点击显示文本框
    showInput(val){
      val.inputVisible=true;
       this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 删除Tag
    handleClose(val,tagName){
      for(let i=0;i<val.attr_vals.length;i++){
        if(val.attr_vals[i]===tagName){
          val.attr_vals[i]='';
        }
      }
      let vals=val.attr_vals.join(' ').trim();
      this.axios({
          method: "put",
          url: `categories/${val.cat_id}/attributes/${val.attr_id}`,
          data: {
            attr_name: val.attr_name,
            attr_sel: val.attr_sel,
            attr_vals:vals,
          },
        }).then((res) => {
          console.log(res);
          if (res.data.meta.status !== 200) {
            this.$message({
              message: "修改参数失败",
              type: "error",
              duration: 2000,
            });
          } else {
            this.$message({
              message: "修改参数成功！",
              type: "success",
              duration: 1000,
            });
            // 重新获取用户数据 刷新列表
            this.getParamsList();
          }
        });
    }
  },
  components: {},
  mounted() {
    this.getCateList();
  },
};
</script>

<style scoped lang="less">
.el-row {
  margin-top: 15px;
  margin-bottom: 15px;
}
.input-new-tag{
  width: 150px;
  margin-left: 15px;
}
.button-new-tag{
  margin-left: 15px;
}
</style>
