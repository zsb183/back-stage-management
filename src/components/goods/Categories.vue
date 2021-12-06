<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="openAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 商品分类列表表格 -->
      <tree-table
        class="treeTable"
        :data="goodsCateList"
        :columns="columns"
        show-index
        index-text=""
        border
        children-prop="children"
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <div>
            <i
              class="el-icon-success"
              v-if="!scope.row.cat_deleted"
              style="color: lightgreen; font-size: 16px"
            ></i>
            <i
              class="el-icon-error"
              v-else
              style="color: red; font-size: 16px"
            ></i>
          </div>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
            <el-tag
              type="success"
              v-else-if="scope.row.cat_level === 1"
              size="mini"
              >二级</el-tag
            >
            <el-tag type="danger" v-else size="mini">三级</el-tag>
          </div>
        </template>
        <!-- 操作 -->
        <template slot="operate" slot-scope="scope">
          <div>
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getEditCate(scope.row)"
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row.cat_id)"
              >删除</el-button
            >
          </div>
        </template>
      </tree-table>
      <!-- <pre>
          {{ goodsCateList }}
      </pre> -->

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsCatePage.pagenum"
        :page-sizes="[1, 2, 4, 8]"
        :page-size="goodsCatePage.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类 -->
    <el-dialog
      title="提示"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 主要内容 -->
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类">
          <el-cascader
            v-model="cateKeys"
            :options="parentCateList"
            :props="parentCateProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色信息对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 对话框主体内容 -->
      <el-form
        :model="editCateForm"
        :rules="editRules"
        ref="editCateForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 添加分类对话框显示与隐藏
      addDialogVisible: false,
      // 修改分类对话框显示与隐藏
      editDialogVisible: false,
      // 商品分类列表
      goodsCateList: [],
      // 父级分类列表
      parentCateList: [],
      // 商品分类列表请求参数
      goodsCatePage: {
        type: 3,
        pagenum: 1,
        pagesize: 4,
      },
      // 父级分类列表请求参数
      parentCatePage: {
        type: 2,
      },
      //   商品分类数据个数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "sort",
        },
        {
          label: "操作",
          type: "template",
          template: "operate",
        },
      ],
      //   添加分类数据
      addCateForm: {
        // 分类名称
        cat_name: "",
        // 父级分类ID
        cat_pid: 0,
        // 当前分类层级
        cat_level: 0,
      },
      // 添加分类数据的规则
      addCateRules: {
        cat_name: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
        ],
      },
      // 为级联选择器配置选项
      parentCateProps: {
        expandTrigger: "hover",
        checkStrictly: true,
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //   级联选择器绑定值
      cateKeys: [],
      //   需要修改的分类的信息
      editCateVal: {},
      // 需要修改的数据ID
      editCateId: "",
      // 需要修改的数据
      editCateForm: {
        cat_name: "",
      },
      // 需要修改的数据验证
      editRules: {
        cat_name: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.goodsCatePage.pagesize = val;
      this.getGoodsCateList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.goodsCatePage.pagenum = val;
      this.getGoodsCateList();
    },
    // 获取商品分类列表
    getGoodsCateList() {
      this.axios
        .get("categories", {
          params: this.goodsCatePage,
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message({
              type: "error",
              message: "信息获取失败",
            });
          } else {
            //   console.log(res.data.data);
            this.goodsCateList = res.data.data.result;
            this.total = res.data.data.total;
          }
        });
    },
    //   监听添加分类对话框关闭
    addDialogClose() {
      this.$refs["addCateForm"].resetFields();
    },
    //   修改添加分类对话框关闭
    editDialogClose() {
      this.$refs["editCateForm"].resetFields();
    },
    // 打开添加分类对话框
    openAddDialog() {
      this.cateKeys = [];
      this.axios
        .get("categories", {
          params: this.parentCatePage,
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message({
              type: "error",
              message: "信息获取失败",
            });
          } else {
            //   console.log(res.data.data);
            this.addDialogVisible = true;
            this.parentCateList = res.data.data;
            // console.log(this.parentCateList);
          }
        });
    },
    // 监听级联选择器选项变化
    parentCateChange() {
      // console.log(this.cateKeys);
      if (this.cateKeys.length > 0) {
        this.addCateForm.cat_pid = this.cateKeys[this.cateKeys.length - 1];
        this.addCateForm.cat_level = this.cateKeys.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
      //   console.log(this.addCateForm);
    },
    // 添加分类
    addCate() {
      this.$refs["addCateForm"].validate((validate) => {
        if (!validate) return;
        this.axios({
          method: "post",
          url: "categories",
          data: this.addCateForm,
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
            this.getGoodsCateList();
          }
        });
      });
    },
    // 获取要修改的分类信息
    getEditCate(cate) {
      // console.log(cate.cat_id);
      this.axios.get("categories/" + cate.cat_id).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取信息失败！");
        } else {
          this.editCateVal = res.data.data;
          this.editCateId = res.data.data.cat_id;
          this.editDialogVisible = true;
        }
      });
    },
    // 修改分类
    editCate() {
      // console.log(this.editCateForm);
      this.$refs["editCateForm"].validate((validate) => {
        if (!validate) return;
        this.axios({
          method: "put",
          url: `categories/${this.editCateId}`,
          data: {
            cat_name: this.editCateForm.cat_name,
          },
        }).then((res) => {
          console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error("修改信息失败！");
          } else {
            this.$message({
              message: "修改分类成功！",
              type: "success",
              duration: 1000,
            });
            this.editDialogVisible = false;
            // 重新获取用户数据 刷新列表
            this.getGoodsCateList();
          }
        });
      });
    },
    // 删除分类
    deleteCate(id){
 this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios.delete("categories/" + id).then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message.error("删除信息失败！");
            } else {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              // 重新获取用户数据 刷新列表
              this.getGoodsCateList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    }
  },
  components: {},
  mounted() {
    this.getGoodsCateList();
  },
};
</script>

<style scoped lang="less">
</style>
