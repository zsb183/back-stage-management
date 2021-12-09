// 商品列表
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 栅格布局 -->
      <el-row :gutter="20">
        <!-- 搜素框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="axiosObj.query"
            @change="getGoodsList"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加按钮 -->
          <el-button type="primary" @click="addGoods"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户表格 -->
      <el-table :data="goodsList" style="width: 100%" stripe border>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>

        <el-table-column prop="goods_name" label="商品名称"  ></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
            <template slot-scope="scope">
                {{scope.row.add_time | formattingTime}}
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="130px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoods(scope.row.goods_id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
            
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="axiosObj.pagenum"
        :page-sizes="[1, 2, 4, 8]"
        :page-size="axiosObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  
  </div>
</template>

<script>
export default {
  props: {},
  data() {
   
    return {
      axiosObj: {
        query: "",
        pagenum: 1, //当前的页数
        pagesize: 4, //当前页显示几条数据
      },
      goodsList: [],
      total: 0,    
    };
  },
  methods: {
    //   获取用户列表值
    getGoodsList() {
      this.axios.get("/goods", { params: this.axiosObj }).then((res) => {
        if (res.data.meta.status !== 200) {
          this.$message({
            message: "用户列表获取失败",
            type: "error",
            duration: 2000,
          });
        }
        //   console.log(res);
        this.goodsList = res.data.data.goods;
        this.total = res.data.data.total;
        //   console.log(this.GoodsList[0].mg_state);
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.axiosObj.pagesize = val;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.axiosObj.pagenum = val;
      this.getGoodsList();
    },
   

    // 添加用户
    addGoods() {
      this.$router.push('/goods/add')
    },
    // 修改用户信息
    editGoods(id) {
      this.axios.get("goods/" + id).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取信息失败！");
        } else {
          this.editRuleForm = res.data.data;
          this.editDialogVisible = true;
        }
      });
    },
  
    // 删除用户
    deleteGoods(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios.delete("goods/" + id).then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message.error("删除信息失败！");
            } else {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              // 重新获取用户数据 刷新列表
              this.getGoodsList();
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
   
  },
  components: {},
  mounted() {
    this.getGoodsList();
  },
};
</script>

<style scoped lang="less">
.el-table{
    font-size: 13px;
}
</style>
