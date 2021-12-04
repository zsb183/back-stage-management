<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/avatar.jpg" alt="" />
      </div>
      <!-- 表单 -->
      <el-form
        :model="formLabelAlign"
        class="form"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item prop="name">
          <el-input
            v-model="formLabelAlign.name"
            placeholder="请输入用户名"
            clearable
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formLabelAlign.password"
            placeholder="请输入密码（长度在 6 到 12 个字符）"
            clearable
            show-password
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <div class="button_box">
          <el-button
            type="primary"
            class="button"
            @click="login('ruleForm')"
            :plain="true"
            >登录</el-button
          >
          <el-button type="info" class="button" @click="resetForm('ruleForm')"
            >重置</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      formLabelAlign: {
        name: "admin",
        password: "123456",
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return;
        }
        this.axios({
          method: "post",
          url: "login",
          data: {
            username: this.formLabelAlign.name,
            password: this.formLabelAlign.password,
          },
        }).then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message({
              message: "用户名、密码错误",
              type: "error",
              showClose: true,
            });
          }
          // console.log(res.data);
          window.sessionStorage.setItem('token_',res.data.data.token);
          this.$message({
            message: "登录成功！",
            type: "success",
            duration: 1000,
            onClose:()=>{
              this.$router.push('/home')
            }
          });
        });
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
// *{
//   padding: 0;
//   margin: 0;
// }
.login {
  width: 100%;
  height: 100%;
  background-color: #e2e2e2;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // flex-direction: column;
}
.avatar_box {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 1px solid #eee;
  background-color: #fff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
  box-shadow: 0 0 10px #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar_box > img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid #eee;
  background-color: #eee;
}
.form {
  width: 350px;
  position: absolute;
  left: 50%;
  top: 54%;
  transform: translate(-50%, -50%);
}
.button_box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.button {
  width: 150px;
}
</style>
