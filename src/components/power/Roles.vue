<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表表格 -->
      <el-table :data="rolesData" style="width: 100%" stripe border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', 'vcenter', i1 === 0 ? 'bdtop' : '']"
            >
              <el-col :span="5">
                <el-tag @close="deletePower(scope.row, item1.id)" closable>{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      @close="deletePower(scope.row, item2.id)"
                      type="success"
                      closable
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      @close="deletePower(scope.row, item3.id)"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>

        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <!-- 作用域插槽获取本行数据 -->
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getEditRoles(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoles(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配权限 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 对话框主体内容 -->
      <el-form
        :model="addRolesForm"
        :rules="addRules"
        ref="addRolesForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
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
        :model="editRolesForm"
        :rules="editRules"
        ref="editRolesForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="setRightsDialogVisible"
      width="50%"
    >
      <!-- 对话框主体内容 -->
      <el-tree
      ref="treeRef"
        :data="rightsList"
        :props="rightsListProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defaultRightsListId"
      >
      </el-tree>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 角色列表数据
      rolesData: [],
      //   添加角色对话框显示与隐藏
      addDialogVisible: false,
      //   修改角色对话框显示与隐藏
      editDialogVisible: false,
      //   分配权限对话框显示与隐藏
      setRightsDialogVisible: false,
      //   添加角色数据
      addRolesForm: {
        roleName: "",
        roleDesc: "",
      },

      //   添加角色数据验证
      addRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      //   需要修改的角色的数据
      editRolesForm: {},
      //   修改角色数据验证
      editRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      // 权限列表数据
      rightsList: [],
      // 权限树获取规则
      rightsListProps: {
        children: "children",
        label: "authName",
      },
      // 权限树默认选中的节点数组
      defaultRightsListId: [],
      // 当初要分配权限的角色的id
      nowRoleId:'',
    };
  },
  methods: {
    //   获取角色列表数据
    getRolesList() {
      this.axios.get("roles").then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取信息失败！");
        } else {
          this.rolesData = res.data.data;
        }
      });
    },
    //   监听添加角色对话框关闭
    addDialogClose() {
      this.$refs["addRolesForm"].resetFields();
    },
    // 监听修改信息对话框关闭
    editDialogClose() {
      this.$refs["editRolesForm"].resetFields();
    },
    // 添加角色
    addRoles() {
      this.$refs["addRolesForm"].validate((validate) => {
        if (!validate) return;
        this.axios({
          method: "post",
          url: "roles",
          data: {
            roleName: this.addRolesForm.roleName,
            roleDesc: this.addRolesForm.roleDesc,
          },
        }).then((res) => {
          if (res.data.meta.status !== 201) {
            this.$message({
              message: "添加角色失败",
              type: "error",
              duration: 2000,
            });
          } else {
            this.$message({
              message: "添加角色成功！",
              type: "success",
              duration: 1000,
            });
            this.addDialogVisible = false;
            // 重新获取用户数据 刷新列表
            this.getRolesList();
          }
        });
      });
    },
    // 获取要修改的角色的信息
    getEditRoles(id) {
      this.axios.get("roles/" + id).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取信息失败！");
        } else {
          this.editRolesForm = res.data.data;
          this.editDialogVisible = true;
        }
      });
    },
    // 修改角色信息
    editRoles() {
      this.$refs["editRolesForm"].validate((validate) => {
        if (!validate) return;
        this.axios({
          method: "put",
          url: "roles/" + this.editRolesForm.roleId,
          data: {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc,
          },
        }).then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message.error("修改信息失败！");
          } else {
            this.$message({
              message: "修改角色信息成功！",
              type: "success",
              duration: 1000,
            });
            this.editDialogVisible = false;
            // 重新获取用户数据 刷新列表
            this.getRolesList();
          }
        });
      });
    },

    // 删除用户
    deleteRoles(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios.delete("roles/" + id).then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message.error("删除信息失败！");
            } else {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              // 重新获取用户数据 刷新列表
              this.getRolesList();
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
    // 删除权限
    deletePower(role, powerId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios
            .delete(`roles/${role.id}/rights/${powerId}`)
            .then((res) => {
              if (res.data.meta.status !== 200) {
                return this.$message({
                  type: "error",
                  message: "删除权限失败",
                });
              } else {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                role.children = res.data.data;
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
    // 通过递归获取当前角色默认选中的权限id
    getdefaultRightsListId(node, arr) {
      // 通过当前节点有无children属性，判断是否第三极权限
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getdefaultRightsListId(item, arr);
      });
    },
    // 点击分配权限按钮
    showSetRightDialog(role) {
      this.axios.get("rights/tree").then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: "信息获取失败",
          });
        } else {
          this.rightsList = res.data.data;
          this.defaultRightsListId=[];
          this.nowRoleId=role.id;
          this.getdefaultRightsListId(role, this.defaultRightsListId);
          // console.log(typeof(this.defaultRightsListId));
          this.setRightsDialogVisible = true;
        }
      });
    },
    // 确认分配权限
    setRights(){
      let checkKeys=[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      checkKeys=checkKeys.join(',');
      this.axios({
          method: "post",
          url: `roles/${this.nowRoleId}/rights`,
          data: {
            rids:checkKeys
          },
        }).then(res=>{
          if(res.data.meta.status!==200){
            return this.$message({
            type: "error",
            message: "分配权限失败",
          });
          }else{
            this.setRightsDialogVisible=false;
            this.getRolesList();
          }
        })
    },
  },
  components: {},
  mounted() {
    this.getRolesList();
  },
};
</script>

<style scoped lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
  .el-table {
    margin-top: 15px;
  }
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
