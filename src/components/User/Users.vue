// 用户列表
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
            @change="getUserList"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加按钮 -->
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户表格 -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>

        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态" width="100px" align="center">
          <!-- 作用域插槽获取本行数据 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getEditUser(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRolesDialog(scope.row)"
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
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 对话框主体内容 -->
      <el-form
        :model="addRuleForm"
        :rules="addRules"
        ref="addRuleForm"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addRuleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addRuleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 对话框主体内容 -->
      <el-form
        :model="editRuleForm"
        :rules="editRules"
        ref="editRuleForm"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editRuleForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="提示" :visible.sync="setRolesDialogVisible" width="30%">
      <div>
        <p class="setRolesP">姓名：{{ setRolesUser.username }}</p>
        <p class="setRolesP">当前角色：{{ setRolesUser.role_name }}</p>
        <p class="setRolesP">
          请选择要分配的角色：<el-select
            v-model="rolesId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoles"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    // 自定义邮箱验证
    var validateEmail = (rule, value, callback) => {
      let regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (regEmail.test(value)) {
        callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    // 自定义手机号验证
    var validateMobile = (rule, value, callback) => {
      let regMobile =
        /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
      if (regMobile.test(value)) {
        callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      axiosObj: {
        query: "",
        pagenum: 1, //当前的页数
        pagesize: 4, //当前页显示几条数据
      },
      userList: [],
      total: 0,
      // 添加用户对话框隐藏与否
      addDialogVisible: false,
      // 修改用户信息对话框隐藏与否
      editDialogVisible: false,
      // 分配角色对话框隐藏与否
      setRolesDialogVisible: false,
      // 添加用户对象
      addRuleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 修改用户信息对象
      editRuleForm: {},
      // 添加用户验证对象
      addRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 6,
            message: "长度在 3 到 6 个字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          { validator: validateEmail, trigger: "blur" },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          { validator: validateMobile, trigger: "blur" },
        ],
      },
      // 修改用户信息验证对象
      editRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 6,
            message: "长度在 3 到 6 个字符",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          { validator: validateEmail, trigger: "blur" },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          { validator: validateMobile, trigger: "blur" },
        ],
      },
      // 需要分配角色的用户信息
      setRolesUser: {},
      // 角色列表
      rolesList: [],
      // 选中角色的ID
      rolesId:'',
    };
  },
  methods: {
    //   获取用户列表值
    getUserList() {
      this.axios.get("/users", { params: this.axiosObj }).then((res) => {
        if (res.data.meta.status !== 200) {
          this.$message({
            message: "用户列表获取失败",
            type: "error",
            duration: 2000,
          });
        }
        //   console.log(res);
        this.userList = res.data.data.users;
        this.total = res.data.data.total;
        //   console.log(this.userList[0].mg_state);
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.axiosObj.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.axiosObj.pagenum = val;
      this.getUserList();
    },
    // 监听用户状态改变
    userStatusChange(val) {
      this.axios.put(`users/${val.id}/state/${val.mg_state}`).then((res) => {
        if (res.data.meta.status !== 200) {
          val.mg_state = !val.mg_state;
        }
        this.$message({
          message: "用户状态修改成功！",
          type: "success",
          duration: 1000,
        });
      });
    },

    // 监听添加用户对话框的关闭
    addDialogClose() {
      this.$refs["addRuleForm"].resetFields();
    },
    // 监听修改用户信息对话框的关闭
    editDialogClose() {
      this.$refs["editRuleForm"].resetFields();
    },
    // 添加用户
    addUser() {
      this.$refs["addRuleForm"].validate((validate) => {
        if (!validate) return;
        this.axios({
          method: "post",
          url: "users",
          data: {
            username: this.addRuleForm.username,
            password: this.addRuleForm.password,
            email: this.addRuleForm.email,
            mobile: this.addRuleForm.mobile,
          },
        }).then((res) => {
          if (res.data.meta.status !== 201) {
            this.$message({
              message: "添加用户失败",
              type: "error",
              duration: 2000,
            });
          } else {
            this.$message({
              message: "添加用户成功！",
              type: "success",
              duration: 1000,
            });
            this.addDialogVisible = false;
            // 重新获取用户数据 刷新列表
            this.getUserList();
          }
        });
      });
    },
    // 获取需要修改的用户的信息
    getEditUser(id) {
      this.axios.get("users/" + id).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取信息失败！");
        } else {
          this.editRuleForm = res.data.data;
          this.editDialogVisible = true;
        }
      });
    },
    // 修改用户信息
    editUser() {
      this.$refs["editRuleForm"].validate((validate) => {
        if (!validate) return;
        this.axios({
          method: "put",
          url: "users/" + this.editRuleForm.id,
          data: {
            email: this.editRuleForm.email,
            mobile: this.editRuleForm.mobile,
          },
        }).then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message.error("修改信息失败！");
          } else {
            this.$message({
              message: "修改用户信息成功！",
              type: "success",
              duration: 1000,
            });
            this.editDialogVisible = false;
            // 重新获取用户数据 刷新列表
            this.getUserList();
          }
        });
      });
    },
    // 删除用户
    deleteUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios.delete("users/" + id).then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message.error("删除信息失败！");
            } else {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              // 重新获取用户数据 刷新列表
              this.getUserList();
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
    // 打开分配角色对话框
    setRolesDialog(role) {
      this.rolesId='',
      this.axios.get(`roles`).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取信息失败！");
        } else {
          this.rolesList = res.data.data; //获取角色列表
          this.setRolesUser = role; //获取当前用户
          this.setRolesDialogVisible = true;
          // console.log(this.rolesList);
        }
      });
    },
    // 分配角色
    setRoles(){
      // console.log(this.rolesId);
       this.axios({
          method: "put",
          url: `users/${this.setRolesUser.id}/role`,
          data: {
            rid:this.rolesId,
          },
        }).then(res=>{
         if (res.data.meta.status !== 200) {
          return this.$message.error("分配角色失败！");
        } else {
          this.setRolesDialogVisible = false;
           // 重新获取用户数据 刷新列表
            this.getUserList();
        }
      })
    },
  },
  components: {},
  mounted() {
    this.getUserList();
  },
};
</script>

<style scoped lang="less">

</style>
