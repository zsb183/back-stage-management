<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
            @change="getOrdersList"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单表格 -->
      <el-table :data="ordersList" style="width: 100%" stripe border>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>

        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格(元)"
          width="110px"
        ></el-table-column>
        <el-table-column
          prop="order_pay"
          label="是否付款"
          width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay == 0" type="danger"
              >未付款</el-tag
            >
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="80px"
        ></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="160px">
          <template slot-scope="scope">
            {{ scope.row.create_time | formattingTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="130px">
          <template>
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialogVisible = true"
            ></el-button>
            <!-- 查看物流信息 -->
            <el-tooltip
              effect="dark"
              content="查看物流信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-location-outline"
                size="mini"
                @click="locationDialogVisible = true"
              ></el-button>
            </el-tooltip>
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

      <!-- 修改订单位置信息对话框 -->
      <el-dialog
        title="修改位置信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <!-- 对话框主体内容 -->
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item label="省市/区" prop="address1">
            <el-cascader
              v-model="addressForm.address1"
              :options="cityData"
              :props="addressProps"
              @change="addressChange"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <!-- 对话框底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 查看物流信息对话框 -->
      <el-dialog
        title="详细物流信息"
        :visible.sync="locationDialogVisible"
        width="50%"
      >
        <!-- 对话框主体内容 -->

        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in locationMessage"
            :key="index"
            :timestamp="activity.time"
            color="#0bbd87"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
        <!-- 对话框底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="locationDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from "./citydata";
export default {
  props: {},
  data() {
    // 自定义级联选择框验证
    var validateAddress = (rule, value, callback) => {
      if (value.length == 2) {
        callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    return {
      axiosObj: {
        query: "",
        pagenum: 1, //当前的页数
        pagesize: 4, //当前页显示几条数据
      },
      ordersList: [],
      total: 0,
      cityData,
      // 修改用户信息对话框隐藏与否
      editDialogVisible: false,
      // 查看物流信息对话框隐藏与否
      locationDialogVisible: false,
      //   地址表单
      addressForm: {
        address1: [],
        address2: "",
      },
      //   地址表单验证
      addressFormRules: {
        address1: [
          {
            required: true,
            message: "请选择省市/区",
            trigger: "blur",
          },
          { validator: validateAddress, trigger: "blur" },
        ],
        address2: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
        ],
      },
      // 为级联选择器配置选项
      addressProps: {
        expandTrigger: "hover",
        value: "value",
        label: "label",
        children: "children",
      },
      // 物流信息
      locationMessage: [
        {
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: "",
        },
        {
          time: "2018-05-10 08:23:00",
          ftime: "2018-05-10 08:23:00",
          context:
            "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          location: "",
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-10 02:03:00",
          ftime: "2018-05-10 02:03:00",
          context:
            "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-09 23:05:00",
          ftime: "2018-05-09 23:05:00",
          context: "快件到达 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 21:21:00",
          ftime: "2018-05-09 21:21:00",
          context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 13:07:00",
          ftime: "2018-05-09 13:07:00",
          context: "顺丰速运 已收取快件",
          location: "",
        },
        {
          time: "2018-05-09 12:25:03",
          ftime: "2018-05-09 12:25:03",
          context: "卖家发货",
          location: "",
        },
        {
          time: "2018-05-09 12:22:24",
          ftime: "2018-05-09 12:22:24",
          context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          location: "",
        },
        {
          time: "2018-05-08 21:36:04",
          ftime: "2018-05-08 21:36:04",
          context: "商品已经下单",
          location: "",
        },
      ],
    };
  },
  methods: {
    //   获取订单列表值
    getOrdersList() {
      this.axios.get("/orders", { params: this.axiosObj }).then((res) => {
        if (res.data.meta.status !== 200) {
          this.$message({
            message: "用户列表获取失败",
            type: "error",
            duration: 2000,
          });
        }
        //   console.log(res);
        this.ordersList = res.data.data.goods;
        this.total = res.data.data.total;
        //   console.log(this.GoodsList[0].mg_state);
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.axiosObj.pagesize = val;
      this.getOrdersList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.axiosObj.pagenum = val;
      this.getOrdersList();
    },
    // 监听修改位置信息对话框的关闭
    editDialogClose() {
      this.$refs["addressFormRef"].resetFields();
    },
    // 监听级联选择框变化
    addressChange() {},
  },
  components: {},
  mounted() {
    this.getOrdersList();
  },
};
</script>

<style scoped lang="less">
.el-cascader {
  width: 100%;
}
</style>
