<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 权限列表表格 -->
      <el-table :data="rightsData" style="width: 100%" stripe border>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>

        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column label="权限等级">
          <!-- 作用域插槽获取本行数据 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="danger" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      rightsData: [],
    };
  },
  methods: {},
  computed: {},
  components: {},
  mounted() {
    //   获取权限列表值
    this.axios.get("/rights/list ").then((res) => {
      if (res.data.meta.status !== 200) {
        return this.$message.error("获取信息失败！");
      } else {
        this.rightsData = res.data.data;
      }
    });
  },
};
</script>

<style scoped lang="less">

</style>
