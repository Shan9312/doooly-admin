<template>
  <div class="dept app-container">
    <!--工具栏-->
    <div class="dept-form">
      <el-form :inline="true" :model="search">
        <el-row>
          <el-col :span="11" :offset="1">
            <el-form-item label="机构名称">
              <el-input
                clearable
                v-model="search.name"
                placeholder="请输入机构名称"
                @keyup.native="onKeyup"
                maxlength="15"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <kt-button
                label="查询"
                perms="sys:dept:search"
                type="primary"
                @click="handlSearch"
              />
            </el-form-item>
            <el-form-item>
              <kt-button
                label="新增"
                perms="sys:dept:add"
                type="primary"
                @click="handleAdd"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--表格树内容栏-->
    <el-table
      :data="tableTreeDdata"
      stripe
      style="width: 100%;"
      v-loading="loading"
      element-loading-text="loading"
      border
    >
      <el-table-column
        header-align="center"
        align="center"
        type="index"
        width="50"
      >
      </el-table-column>
      <table-tree-column
        prop="name"
        header-align="center"
        treeKey="id"
        width="150"
        label="名称"
      >
      </table-tree-column>
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        width="120"
        label="上级机构"
      >
      </el-table-column>
      <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        label="排序"
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
          <kt-button
            size="small"
            icon="fa fa-edit"
            label="编辑"
            perms="sys:dept:edit"
            @click="handleEdit(scope.row)"
          />
          <kt-button
            size="small"
            icon="fa fa-trash"
            label="删除"
            perms="sys:dept:delete"
            type="danger"
            @click="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改界面 -->
    <el-dialog
      :title="!dataForm.id ? '新增' : '修改'"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="submitForm()"
        label-width="80px"
        :size="size"
        style="text-align:left;"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="dataForm.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="上级机构" prop="parentName">
          <popup-tree-input
            :data="popupTreeData"
            :props="popupTreeProps"
            :prop="
              dataForm.parentName == null || dataForm.parentName == ''
                ? '顶级菜单'
                : dataForm.parentName
            "
            :nodeKey="'' + dataForm.parentId"
            :currentChangeHandle="handleTreeSelectChange"
          >
          </popup-tree-input>
        </el-form-item>
        <el-form-item
          v-if="dataForm.type !== 2"
          label="排序编号"
          prop="orderNum"
        >
          <el-input-number
            v-model="dataForm.orderNum"
            controls-position="right"
            :min="0"
            label="排序编号"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">取消</el-button>
        <el-button
          :size="size"
          :loading="editLoading"
          type="primary"
          @click="submitForm()"
          >确认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { Validate } from "@/common";
  import { DeptService } from "@/service";
  import { Utils, Auth } from "@/common";
  // 模糊查询树结构中的数据，并返回当前整个树结构
  const filterList = (name, data) => {
    let list = [];
    data.map((item, i) => {
      if (item.name.indexOf(name) >= 0) {
        list.push(item);
      } else {
        if (item.children && item.children.length > 0) {
          const _data = filterList(name, item.children);
          const obj = {
            ...item,
            children: _data
          };
          if (_data && _data.length > 0) {
            list.push(obj);
          }
        }
      }
    });
    return list;
  };

  // 列表排序
  const sortList = data => {
    let list = [];
    list = data.sort((a, b) => {
      return a.orderNum - b.orderNum;
    });
    list.map(item => {
      if (item.children && item.children.length > 0) {
        sortList(item.children);
      }
    });
    return list;
  };

  export default {
    data() {
      return {
        onKeyup(e) {
          e.target.value = e.target.value.replace(/[!~@#$%*&()_+\s^]/g, "");
        },
        size: "small",
        loading: false,
        search: {
          name: ""
        },
        value: [],
        tableTreeDdata: [],
        dialogVisible: false,
        editLoading: false,
        dataForm: {
          id: 0,
          name: "",
          parentId: 0,
          parentName: "顶级菜单",
          orderNum: 0
        },
        dataRule: {
          name: [
            {
              required: true,
              trigger: "blur",
              validator: Validate.specialCharacters
            }
          ]
        },
        popupTreeData: [],
        popupTreeProps: {
          label: "name",
          children: "children"
        }
      };
    },
    methods: {
      // 获取数据
      async findTreeData() {
        this.loading = true;
        const { data } = await DeptService.getDeptList();
        this.tableTreeDdata = sortList(data);
        this.popupTreeData = this.getParentMenuTree(data);
        this.loading = false;
      },

      // 查询筛选数据
      handlSearch() {
        const { name } = this.search;
        const { tableTreeDdata } = this;
        if (name) {
          this.tableTreeDdata = filterList(name, tableTreeDdata);
        } else {
          this.findTreeData();
        }
      },

      // 获取机构树
      getParentMenuTree(tableTreeDdata) {
        let parent = {
          id: "0",
          name: "顶级菜单",
          children: tableTreeDdata
        };
        return [parent];
      },

      // 显示新增界面
      handleAdd() {
        const userInfo = JSON.parse(Auth.getUserInfo());
        this.dialogVisible = true;
        this.dataForm = {
          id: 0,
          name: "",
          parentId: 0,
          parentName: "顶级菜单",
          orderNum: 0,
          createBy: userInfo.name
        };
      },

      // 显示编辑界面
      handleEdit(row) {
        this.dialogVisible = true;
        Object.assign(this.dataForm, row);
      },

      // 删除
      handleDelete(row) {
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning"
        })
          .then(async () => {
            let params = this.getDeleteIds([], row);
            const res = await DeptService.deleteDept(params);
            if (res) {
              this.findTreeData();
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

      // 获取删除的包含子机构的id列表
      getDeleteIds(ids, row) {
        ids.push({ id: row.id });
        if (row.children != null) {
          for (let i = 0, len = row.children.length; i < len; i++) {
            this.getDeleteIds(ids, row.children[i]);
          }
        }
        return ids;
      },
      // 机构树选中
      handleTreeSelectChange(data) {
        this.dataForm.parentId = data.id;
        this.dataForm.parentName = data.name;
      },
      // 表单提交
      submitForm() {
        this.$refs["dataForm"].validate(async valid => {
          if (valid) {
            let params = Object.assign({}, this.dataForm);
            this.editLoading = true;
            const data = await DeptService.editDept(params);
            this.editLoading = false;
            if (data) {
              this.$message({ message: "操作成功", type: "success" });
              this.dialogVisible = false;
              this.$refs["dataForm"].clearValidate();
            }
            this.findTreeData();
          }
        });
      },
      // 时间格式化
      dateFormat(row, column, cellValue, index) {
        if (row[column.property]) {
          return Utils.formatTime(row[column.property]);
        }
      }
    },
    mounted() {
      this.findTreeData();
    }
  };
</script>

<style scoped>
</style>

