<template>
  <div class="role app-container">
    <!--工具栏-->
    <div class="role-form">
      <el-form :inline="true" :model="search" @submit.native.prevent>
        <el-row>
          <el-col :span="11" :offset="1">
            <el-form-item label="角色名称">
              <el-input
                clearable
                v-model="search.name"
                placeholder="请输入角色名称"
                @keyup.native="onKeyup"
                maxlength="15"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <pe-button
                label="查询"
                perms="sys:role:search"
                type="primary"
                @click="findPage"
              />
            </el-form-item>
            <el-form-item>
              <pe-button
                label="新增"
                perms="sys:role:add"
                type="primary"
                @click="handleAdd"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--表格内容栏-->
    <el-table
      :data="pageResult"
      stripe
      style="width: 100%;"
      v-loading="loading"
      element-loading-text="loading"
      row-key="id"
      border
      default-expand-all
      :tree-props="{
        children: 'children',
        hasChildren: 'hasChildren',
        date: 'date'
      }"
    >
      <el-table-column label="选择" width="50" align="center">
        <template slot-scope="scope">
          <el-radio
            class="radio"
            @change="handleRoleSelectChange(scope.row)"
            v-model="radio"
            :label="scope.$index"
            >&nbsp;</el-radio
          >
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        type="index"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="角色名"
      >
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"
      >
      </el-table-column>
      <el-table-column
        prop="createBy"
        header-align="center"
        align="center"
        label="创建人"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间"
        :formatter="dateFormat"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="185"
        label="操作"
      >
        <template slot-scope="scope">
          <pe-button
            size="small"
            icon="fa fa-edit"
            label="编辑"
            perms="sys:role:edit"
            @click="handleEdit(scope.row)"
          />
          <pe-button
            size="small"
            icon="fa fa-trash"
            label="删除"
            perms="sys:role:delete"
            type="danger"
            @click="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="search.pageNum"
      :limit.sync="search.pageSize"
      @pagination="findPage"
    />
    <!-- </el-col> -->
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
        @submit.native.prevent
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input
            v-model="dataForm.id"
            :disabled="true"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input v-model.trim="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注 " prop="remark">
          <el-input
            v-model.trim="dataForm.remark"
            auto-complete="off"
            type="textarea"
          ></el-input>
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
    <!--角色菜单，表格树内容栏-->
    <div class="menu-container" :v-if="true">
      <div class="menu-header">
        <span><B>角色菜单授权</B></span>
      </div>
      <el-tree
        :data="menuData"
        size="mini"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        style="width: 100%;pading-top:20px;"
        ref="menuTree"
        :render-content="renderContent"
        v-loading="menuLoading"
        element-loading-text="拼命加载中"
        :check-strictly="false"
      >
      </el-tree>
      <div
        style="float:left;padding-left:24px;padding-top:12px;padding-bottom:4px;"
      >
        <el-checkbox
          v-model="checkAll"
          @change="handleCheckAll"
          :disabled="this.radio == null"
          ><b>全选</b></el-checkbox
        >
      </div>
      <div
        style="float:right;padding-right:15px;padding-top:4px;padding-bottom:4px;"
      >
        <pe-button
          label="重置"
          type="primary"
          perms="sys:role:submit"
          @click="resetSelection"
          :disabled="this.radio == null"
        />
        <pe-button
          label="提交"
          perms="sys:role:submit"
          type="primary"
          @click="submitAuthForm"
          :disabled="this.radio == null"
          :loading="authLoading"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { Validate } from "@/common";
  import { RoleService } from "@/service";
  import { Utils, Auth } from "@/common";
  export default {
    name: "Role",
    data() {
      return {
        onKeyup(e) {
          e.target.value = e.target.value.replace(/[!~@#$%*&()_+\s^]/g, "");
        },
        size: "small",
        loading: false,
        search: {
          name: "",
          pageNum: 1,
          pageSize: 20
        },
        radio: null,
        total: 0,
        columns: [
          { prop: "id", label: "ID", minWidth: 50 },
          { prop: "name", label: "角色名", minWidth: 120 },
          { prop: "remark", label: "备注", minWidth: 120 },
          { prop: "createBy", label: "创建人", minWidth: 120 },
          {
            prop: "createTime",
            label: "创建时间",
            minWidth: 120,
            formatter: this.dateFormat
          }
        ],
        pageRequest: { pageNum: 1, pageSize: 10 },
        pageResult: [],

        operation: false, // true:新增, false:编辑
        dialogVisible: false, // 新增编辑界面是否显示
        editLoading: false,
        dataFormRules: {
          name: [
            {
              required: true,
              trigger: "blur",
              validator: Validate.specialCharacters
            }
          ]
        },
        // 新增编辑界面数据
        dataForm: {
          id: 0,
          name: "",
          remark: ""
        },
        selectRole: {},
        menuData: [],
        menuSelections: [],
        menuLoading: false,
        authLoading: false,
        checkAll: false,
        currentRoleMenus: [],
        defaultProps: {
          children: "children",
          label: "name"
        }
      };
    },
    methods: {
      // 获取分页数据
      async findPage() {
        this.search.columnFilters = {
          name: { name: "name", value: this.search.name }
        };
        const { data } = await RoleService.getRoleList(this.search);
        this.pageResult = data.content;
        this.total = data.totalSize;
        this.findTreeData();
        this.radio = null; // 更新数据后将选择的radio置空
      },
      // 删除数据
      handleDelete(row) {
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning"
        })
          .then(async () => {
            let params = [{ id: row.id }];
            const data = await RoleService.deleteRole(params);
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
      // 显示新增界面
      handleAdd() {
        const userInfo = JSON.parse(Auth.getUserInfo());
        this.dialogVisible = true;
        this.operation = true;
        this.dataForm = {
          id: 0,
          name: "",
          remark: "",
          createBy: userInfo.name
        };
      },
      // 显示编辑界面
      handleEdit(row) {
        this.dialogVisible = true;
        this.operation = false;
        this.dataForm = Object.assign({}, row);
      },
      // 编辑
      submitForm() {
        this.$refs.dataForm.validate(async valid => {
          if (valid) {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            const data = await RoleService.editRole(params);
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
      // 获取数据
      async findTreeData() {
        this.menuLoading = true;
        const { data } = await RoleService.getMenuList();
        this.menuLoading = false;
        this.menuData = data;
      },

      // 角色选择改变监听
      async handleRoleSelectChange(val) {
        if (val == null) {
          return;
        }
        this.selectRole = val;
        this.checkAll = false;
        const { data } = await RoleService.getRoleMenus(val.id);
        this.currentRoleMenus = data.filter(item => item.perms)
        this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus);
      },

      // 重置选择
      resetSelection() {
        this.checkAll = false;
        this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus);
      },

      // 全选操作
      handleCheckAll() {
        if (this.checkAll) {
          let allMenus = [];
          this.checkAllMenu(this.menuData, allMenus);
          this.$refs.menuTree.setCheckedNodes(allMenus);
        } else {
          this.$refs.menuTree.setCheckedNodes([]);
        }
      },

      // 递归全选
      checkAllMenu(menuData, allMenus) {
        menuData.forEach(menu => {
          allMenus.push(menu);
          if (menu.children) {
            this.checkAllMenu(menu.children, allMenus);
          }
        });
      },

      // 角色菜单授权提交
      async submitAuthForm() {
        let roleId = this.selectRole.id;
        this.authLoading = true;
        let checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true);
        let roleMenus = [];
        for (let i = 0, len = checkedNodes.length; i < len; i++) {
          let roleMenu = { roleId: roleId, menuId: checkedNodes[i].id };
          roleMenus.push(roleMenu);
        }
        const data = await RoleService.saveRoleMenus(roleMenus);
        this.authLoading = false;
        if (data) {
          this.$message({ message: "操作成功", type: "success" });
        }
      },

      renderContent(h, { node, data, store }) {
        return (
          <div class="column-container">
            <span style="text-algin:center;margin-right:80px;">{data.name}</span>
            <span style="text-algin:center;margin-right:80px;">
              <el-tag
                type={data.type === 0 ? "" : data.type === 1 ? "success" : "info"}
                size="small"
              >
                {data.type === 0 ? "目录" : data.type === 1 ? "菜单" : "按钮"}
              </el-tag>
            </span>
            <span style="text-algin:center;margin-right:80px;">
              {" "}
              <i class={data.icon} />
            </span>
            <span style="text-algin:center;margin-right:80px;">
              {data.parentName ? data.parentName : "顶级菜单"}
            </span>
            <span style="text-algin:center;margin-right:80px;">
              {data.url ? data.url : "\t"}
            </span>
          </div>
        );
      },
      // 时间格式化
      dateFormat(row, column, cellValue, index) {
        if (row[column.property]) {
          return Utils.formatTime(row[column.property]);
        }
      }
    },
    created() {
      this.findPage();
    }
  };
</script>
<style scoped>
  .menu-container {
    margin-top: 10px;
  }
  .menu-header {
    padding-left: 8px;
    padding-bottom: 5px;
    text-align: left;
    font-size: 16px;
    color: rgb(20, 89, 121);
  }
</style>