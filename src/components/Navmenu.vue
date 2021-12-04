<template>
  <div>
    <div class="shrink" @click='shrink'>| | |</div>
    <el-menu
      class="el-menu-vertical-demo"
      :unique-opened="true"
      :router="true"
      background-color="#313743"
      text-color="#fff"
      :collapse="iscollapse"
      :collapse-transition="false"
      :default-active="defaultActive"
      active-text-color="#409eff"
    >
      <el-submenu
        :index="items.id.toString()"
        v-for="items in list"
        :key="items.id"
      >
        <template slot="title">
          <i :class="iconList[items.id]"></i>
          <span>{{ items.authName }}</span>
        </template>
        <el-menu-item
          :index="'/'+item.path"
          v-for="item in items.children"
          :key="item.id"
          @click="actve('/'+item.path)"
        >
          <i class="el-icon-menu"></i>
          <span>{{ item.authName }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      iscollapse: false,// 是否折叠
      defaultActive:'',//当前选中的菜单index
      list: [],
      iconList: {
        125: "el-icon-s-custom",
        103: "el-icon-s-platform",
        101: "el-icon-s-shop",
        102: "el-icon-s-order",
        145: "el-icon-s-data",
      },
    };
  },
  methods: {
    //   点击按钮，菜单展开与收缩
      shrink(){
          this.iscollapse=!this.iscollapse;
          this.$emit('iscollapse',this.iscollapse);
      },
    //   点击获取当前菜单的index
      actve(defaultActive){
          window.sessionStorage.setItem('defaultActive',defaultActive);
          this.defaultActive=defaultActive;
      }
  },
  components: {},
  
  mounted() {
    //   获取菜单列表值
    this.axios.get("/menus").then((res) => {
      // console.log(res);
      this.list = res.data.data;
      //   console.log(this.list);
    });
    // 为当初选中属性赋值
    this.defaultActive=window.sessionStorage.getItem("defaultActive");
  },
};
</script>

<style scoped lang="less">
.shrink{
    width: 100%;
    height: 24px;
    font-size: 10px;
    color: white;
    text-align: center;
    line-height: 24px;
    background-color: #475163;
    cursor: pointer;
    user-select:none; 
}
.el-menu {
  border: 0;
  .el-menu-item {
    text-align: center;
  }
}
</style>
