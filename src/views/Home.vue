<template>
  <div class="home">
    <el-container>
      <el-header>
          <div class="logo">
              <div class="avatar">
                  <img src="../assets/avatar.jpg">
              </div>
              <span>电商后台管理系统</span>
          </div>
        <el-button class="button" @click="logOut" type="success" round>退出登录</el-button>
      </el-header>
      <el-container>
        <el-aside :width="asideWidth">
            <navmenu @iscollapse="changeWidth"></navmenu>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Navmenu from '@/components/Navmenu.vue'
export default {
  props: {},
  data() {
    return {
        iscollapse:false,
        asideWidth:'200px'
    };
  },
  methods: {
    logOut() {
      window.sessionStorage.removeItem("token_");
      this.$router.push("/login");
    },
    changeWidth(v){
        this.iscollapse=v;
        if(this.iscollapse){
            this.asideWidth='64px';
        }else{
            this.asideWidth='200px';
        }
    }
  },
  components: {
      Navmenu
  },
};
</script>

<style scoped lang="less">
.home {
  width: 100%;
  height: 100%;
  .el-container {
    width: 100%;
    height: 100%;

    .el-header {
      background-color: #363D40;

      display: flex;
      justify-content: space-between;
      align-items: center;

      .logo{
          width: 300px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          .avatar{
              width: 45px;
              height: 45px;
              border-radius: 50%;
              border: 1px solid #eee;
              background-color: #fff;
              padding: 3px;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-right: 20px;
              img{
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                  border: 1px solid #eee;
                  background-color: #fff;
                  
              }
          }
          span{
              font-size: 26px;
              color: #fff;
              font-family: 楷体;
          }
      }

      .button {
        margin-right: 20px;
      }
    }
    .el-aside {
      background-color: #313743;
      transition: width 0.3s;
    }
    .el-main{
        background-color: #E9EDF1;
    }
  }
}
</style>
