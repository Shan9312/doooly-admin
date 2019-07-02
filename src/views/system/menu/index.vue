<template>
  <div class="menu app-container">
    <!--工具栏-->
    <div class="menu-form">
      <el-form :inline="true" :model="search" @submit.native.prevent>
        <el-row>
          <el-col :span="11" :offset="1">
            <el-form-item label="菜单名称">
              <el-input
                v-model="search.name"
                clearable
                placeholder="请输入菜单名称"
                @keyup.native="onKeyup"
                maxlength="15"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <kt-button
                label="查询"
                perms="sys:menu:search"
                type="primary"
                @click="handlSearch"
              />
            </el-form-item>
            <el-form-item>
              <kt-button
                label="新增"
                perms="sys:menu:add"
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
      element-loading-text="加载中..."
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
        label="名称"
      >
      </table-tree-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success"
            >菜单</el-tag
          >
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info"
            >按钮</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        width="120"
        label="上级菜单"
      >
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="菜单URL"
      >
      </el-table-column>
      <el-table-column
        prop="perms"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="授权标识"
      >
      </el-table-column>
      <el-table-column
        prop="buttonUrl"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="授权接口地址"
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
        fixed="right"
        header-align="center"
        align="center"
        width="185"
        label="操作"
      >
        <template slot-scope="scope">
          <kt-button
            icon="fa fa-edit"
            label="编辑"
            size="small"
            perms="sys:menu:edit"
            @click="handleEdit(scope.row)"
          />
          <kt-button
            icon="fa fa-trash"
            label="删除"
            size="small"
            perms="sys:menu:delete"
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
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio
              v-for="(type, index) in menuTypeList"
              :label="index"
              :key="index"
              :disabled="index == 0"
              >{{ type }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="menuTypeList[dataForm.type] + '名称'" prop="name">
          <el-input
            v-model.trim="dataForm.name"
            :placeholder="menuTypeList[dataForm.type] + '名称'"
          ></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentName">
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
        <el-form-item v-if="dataForm.type === 2" label="授权标识" prop="perms">
          <el-input
            v-model.trim="dataForm.perms"
            placeholder="如: sys:user:add, sys:user:edit, sys:user:delete"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="dataForm.type === 2" label="接口地址" prop="perms">
          <el-input
            v-model.trim="dataForm.buttonUrl"
            placeholder="请填写接口地址"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="dataForm.type === 1" label="菜单路由" prop="url">
          <el-row>
            <el-col :span="22">
              <el-input
                v-model.trim="dataForm.url"
                placeholder="菜单路由"
              ></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <el-tooltip placement="top" effect="light" style="padding: 10px;">
                <div slot="content">
                  <p>URL格式：</p>
                  <p>
                    1.常规业务开发的功能URL，如添加一级菜单系统管理，Views目录下页面路径为
                    /system, 此处填写 /system
                  </p>
                  <p>
                    2.继续添加二级菜单用户管理，Views目录下页面路径为
                    /system/user, 此处填写/user
                  </p>
                  <p>
                    3.动态路由匹配需使用路径后带：的形式添加，与Vue
                    Router官方文档一致，如添加查看用户详情菜单{/user/:id}
                  </p>
                  <p>
                    4.嵌套外部网页，如通过菜单打开百度网页，此处填写
                    http://www.baidu.com，http:// 不可省略。
                  </p>
                  <p>
                    示例：用户管理：/system/user 嵌套百度：http://www.baidu.com
                    嵌套网页：http://127.0.0.1:8000
                  </p>
                </div>
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="dataForm.type === 1" label="菜单显示" prop="type">
          <el-radio-group v-model="dataForm.isShow">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
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
        <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
          <el-row>
            <el-col :span="22">
              <el-input
                v-model.trim="dataForm.icon"
                v-popover:iconListPopover
                :readonly="false"
                placeholder="菜单图标名称（如：fa fa-home fa-lg）"
                class="icon-list__input"
              ></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <!-- <fa-icon-tooltip /> -->
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">取消</el-button>
        <el-button :size="size" type="primary" @click="submitForm()"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { Validate } from "@/common";
  import { MenuService } from "@/service";
  import { Utils } from "@/common";

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
        tableTreeDdata: [],
        dialogVisible: false,
        menuTypeList: ["目录", "菜单", "按钮"],
        dataForm: {
          id: 0,
          type: 1,
          name: "",
          parentId: 0,
          parentName: "",
          url: "",
          isShow: 1,
          perms: "",
          orderNum: 0,
          buttonUrl: "",
          icon: "",
          iconList: []
        },
        dataRule: {
          name: [
            {
              required: true,
              trigger: "blur",
              validator: Validate.specialCharacters
            }
          ],
          url: [{ required: true, message: "菜单路由不能为空", trigger: "blur" }],
          perms: [
            { required: true, message: "按钮授权标识不能为空", trigger: "blur" }
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
        const { data } = await MenuService.getMenuList();
        this.tableTreeDdata = data;
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

      // 获取上级菜单树
      getParentMenuTree: function(tableTreeDdata) {
        let parent = {
          parentId: 0,
          name: "顶级菜单",
          children: tableTreeDdata
        };
        return [parent];
      },
      // 显示新增界面
      handleAdd: function() {
        this.dialogVisible = true;
        this.dataForm = {
          id: 0,
          type: 1,
          typeList: ["目录", "菜单", "按钮"],
          name: "",
          parentId: 0,
          parentName: "",
          url: "",
          buttonUrl: "",
          isShow: 1,
          perms: "",
          orderNum: 0,
          icon: "",
          iconList: []
        };
      },
      // 显示编辑界面
      handleEdit: function(row) {
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
            const data = await MenuService.deleteMenu(params);
            if (data) {
              this.findTreeData();
              this.$message({
                message: "删除成功，请刷新页面！",
                type: "success"
              });
            }
            setTimeout(() => {
              window.location.reload(); // 操作菜单或者按钮后需要重新刷新页面获取菜单和按钮
            }, 1500);
          })
          .catch(() => {});
      },
      // 获取删除的包含子菜单的id列表
      getDeleteIds(ids, row) {
        ids.push({ id: row.id });
        if (row.children != null) {
          for (let i = 0, len = row.children.length; i < len; i++) {
            this.getDeleteIds(ids, row.children[i]);
          }
        }
        return ids;
      },
      // 菜单树选中
      handleTreeSelectChange(data, node) {
        this.dataForm.parentId = data.id;
        this.dataForm.parentName = data.name;
      },
      // 图标选中
      iconActiveHandle(iconName) {
        this.dataForm.icon = iconName;
      },
      // 表单提交
      submitForm() {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.$confirm("确认提交吗？", "提示", {})
              .then(async () => {
                this.editLoading = true;
                let params = Object.assign({}, this.dataForm);
                const data = await MenuService.editMenu(params);
                if (data) {
                  this.$message({
                    message: "操作成功，请刷新页面！",
                    type: "success"
                  });
                  this.$refs["dataForm"].clearValidate();
                  this.dialogVisible = false;
                }
                setTimeout(() => {
                  window.location.reload(); // 操作菜单或者按钮后需要重新刷新页面获取菜单和按钮
                }, 1500);
              })
              .catch(() => {
                // this.$message({
                //   type: "info",
                //   message: "已取消操作"
                // });
              });
          }
        });
      }
    },
    mounted() {
      this.findTreeData();
    }
  };
</script>

<style scoped>
</style>


