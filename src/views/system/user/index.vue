<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="user-form">
      <el-form :inline="true" :model="search">
        <el-row>
          <el-col :span="11" :offset="1">
            <el-form-item label="用户名">
              <el-input
                clearable
                v-model="search.name"
                placeholder="请输入用户名"
                maxlength="10"
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <kt-button
                label="查询"
                perms="sys:user:search"
                type="primary"
                @click="findPage()"
              />
            </el-form-item>
            <el-form-item>
              <kt-button
                label="新增"
                perms="sys:user:add"
                type="primary"
                @click="handleAdd"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      :data="pageResult"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        type="index"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="用户名"
      >
      </el-table-column>
      <el-table-column
        prop="deptName"
        header-align="center"
        align="center"
        label="机构"
      ></el-table-column>
      <el-table-column
        prop="roles"
        header-align="center"
        align="center"
        label="角色"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        label="邮箱"
      >
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="手机"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="325"
        label="操作"
      >
        <template slot-scope="scope">
          <kt-button
            size="small"
            icon="fa fa-trash"
            label="重置密码"
            perms="sys:user:reset"
            type="danger"
            @click="handleReset(scope.row)"
          />
          <kt-button
            size="small"
            icon="fa fa-edit"
            label="编辑"
            perms="sys:user:edit"
            @click="handleEdit(scope.row)"
          />
          <kt-button
            size="small"
            icon="fa fa-trash"
            label="删除"
            perms="sys:user:delete"
            type="danger"
            @click="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer" v-if="pageResult.length > 0">
      <div class="user-delete">
        <kt-button
          size="small"
          label="批量删除"
          perms="sys:user:delete"
          type="danger"
          @click="handleDeleteAll"
        />
      </div>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="search.pageNum"
        :limit.sync="search.pageSize"
        @pagination="findPage"
      />
    </div>

    <!--新增编辑界面-->
    <el-dialog
      :title="operation ? '新增' : '编辑'"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input
            v-model="dataForm.id"
            :disabled="true"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="dataForm.username" auto-complete="off" maxlength="10"></el-input>
        </el-form-item>
        </el-form-item>
        <el-form-item label="机构" prop="deptName">
          <popup-tree-input
            :data="deptData"
            :props="deptTreeProps"
            :prop="dataForm.deptName"
            :nodeKey="'' + dataForm.deptId"
            :currentChangeHandle="deptTreeCurrentChangeHandle"
          >
          </popup-tree-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" auto-complete="off" maxlength="40"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="dataForm.phone" auto-complete="off" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="userRoles" v-if="!operation">
          <el-select
            v-model="dataForm.userRoles"
            multiple
            placeholder="请选择"
            style="width: 100%;"
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false"
          >取消</el-button
        >
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { Validate } from "@/common";
  import { UserService } from "@/service";
  import { Utils } from "@/common";

  export default {
    name: "User",
    data() {
      return {
        onKeyup(e) {
          e.target.value = e.target.value.replace(/[!~@#$%*&()_+\s^]/g, "");
        },
        size: "small",
        search: {
          name: "",
          pageNum: 1,
          pageSize: 20
        },
        total: 0,
        multipleSelection: [],
        columns: [],
        tableData: [],
        pageRequest: { pageNum: 1, pageSize: 10 },
        pageResult: [],
        operation: false, // true:新增, false:编辑
        dialogVisible: false, // 新增编辑界面是否显示
        editLoading: false,
        dataFormRules: {
          username: [
            {
              required: true,
              trigger: "blur",
              validator: Validate.alipayNameVaild
            }
          ],
          email: [
            { required: true, trigger: "blur", validator: Validate.validateEmail }
          ],
          phone: [
            { required: true, trigger: "blur", validator: Validate.phoneValid }
          ]
        },
        // 新增编辑界面数据
        dataForm: {
          id: 0,
          username: "",
          deptId: 0,
          deptName: "",
          email: "",
          phone: "",
          status: 1,
          userRoles: []
        },
        deptData: [],
        deptTreeProps: {
          label: "name",
          children: "children"
        },
        roles: []
      };
    },
    methods: {
      // 获取分页数据
      async findPage() {
        this.search.columnFilters = {
          name: { name: "name", value: this.search.name }
        };
        const { data } = await UserService.getUserList(this.search);
        this.pageResult = data.content;
        this.total = data.totalSize;
        this.findUserRoles();
      },
      // 加载用户角色信息
      async findUserRoles() {
        const { data } = await UserService.getUserRole();
        this.roles = data;
      },

      // 删除单条数据
      handleDelete(row) {
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning"
        })
          .then(async () => {
            let params = [{ id: row.id }];
            const data = await UserService.deleteUser(params);
            if (data) {
              this.findPage();
              this.$message({ message: "删除成功", type: "success" });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },

      // 删除多条数据
      handleDeleteAll() {
        const { multipleSelection } = this;
        if (multipleSelection.length == 0) {
          this.$message({ message: "请勾选需要删除的列表", type: "warning" });
          return;
        }
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning"
        })
          .then(async () => {
            let params = [];
            multipleSelection.map(item => {
              params.push({ id: item.id });
            });
            const data = await UserService.deleteUser(params);
            if (data) {
              this.findPage();
              this.$message({ message: "删除成功", type: "success" });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },

      // 重置密码
      handleReset(row) {
        this.$confirm("确认要重置密码吗？", "提示", {
          type: "warning"
        })
          .then(async () => {
            let params = { id: row.id, email: row.email };
            const data = await UserService.resetPassword(params);
            if (data) {
              this.findPage();
              this.$message({ message: "重置成功", type: "success" });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消重置"
            });
          });
      },

      // 显示新增界面
      handleAdd: function() {
        this.dialogVisible = true;
        this.operation = true;
        this.dataForm = {
          id: 0,
          username: "",
          password: "",
          deptId: 0,
          deptName: "",
          email: "",
          phone: "",
          status: 1,
          userRoles: []
        };
      },
      // 显示编辑界面
      handleEdit(row) {
        this.dialogVisible = true;
        this.operation = false;
        this.dataForm = Object.assign({}, row);
        let userRoles = [];
        for (let i = 0, len = row.userRoles.length; i < len; i++) {
          userRoles.push(row.userRoles[i].roleId);
        }
        this.dataForm.userRoles = userRoles;
      },
      // 编辑
      submitForm: function() {
        this.$refs.dataForm.validate(async valid => {
          if (valid) {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm),
              roles = this.roles;
            let userRoles = []; // 角色关系列表
            let rolesName = []; // 角色名称列表
            for (let i = 0, len = params.userRoles.length; i < len; i++) {
              for (let j = 0; j < roles.length; j++) {
                if (roles[j].id == params.userRoles[i]) { // 循环查找对应的角色列表
                  let userRole = {
                    userId: params.id,
                    roleId: params.userRoles[i],
                  };
                  rolesName.push(roles[j].name)
                  userRoles.push(userRole);
                }
              }
            }
            params.userRoles = userRoles;
            params.roles = rolesName.join(',') // 角色名称用，拆分提交
            const data = await UserService.editUser(params);
            this.editLoading = false;
            if (data) {
              this.$message({ message: "操作成功", type: "success" });
              this.dialogVisible = false;
              this.$refs["dataForm"].clearValidate();
            }
            this.findPage();
          }
        });
      },
      // 获取部门列表
      async findDeptTree() {
        const { data } = await UserService.getDeptList();
        this.deptData = data;
      },

      // 菜单树选中
      deptTreeCurrentChangeHandle(data, node) {
        this.dataForm.deptId = data.id;
        this.dataForm.deptName = data.name;
      },

      // 表格数据全选
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    },
    mounted() {
      this.findPage();
      this.findDeptTree();
    }
  };
</script>

<style lang="less" scoped>
  .table-footer {
    .user-delete {
      float: left;
    }
    .user-delete {
      padding: 32px 0;
    }
    .pagination-container {
      float: right;
    }
  }
</style>