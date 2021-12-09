<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div id="main" style="width: 800px; height: 500px"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  methods: {
    getOption() {
      this.axios.get("reports/type/1").then((res) => {
        if (res.data.meta.status !== 200) {
          this.$message({
            message: "用户报表获取失败",
            type: "error",
            duration: 2000,
          });
        } else {
          return res.data.data;
        }
      });
    },
  },
  components: {},
  mounted() {
    let echarts = require("echarts");
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById("main"));

    this.axios.get("reports/type/1").then((res) => {
      if (res.data.meta.status !== 200) {
        this.$message({
          message: "用户报表获取失败",
          type: "error",
          duration: 2000,
        });
      } else {
        const returnedTarget = Object.assign(this.options, res.data.data);
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(returnedTarget);
      }
    });
  },
};
</script>

<style scoped lang="less">
</style>
