<template>
  <div class="table app-container">
    <div class="form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input
            style="width: 100px;"
            v-model="formInline.name"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="formInline.mobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="formInline.sex" placeholder="请选择性别">
            <el-option label="男" value="men"></el-option>
            <el-option label="女" value="women"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="formInline.date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchOrder">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="downloadLoading"
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            @click="handleDownload"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list">
      <el-table :data="list" v-loading="listLoading" style="width: 100%">
        <el-table-column
          :prop="item.value"
          :label="item.label"
          width="180"
          v-for="(item, index) in title"
        ></el-table-column>
        <el-table-column
          label="编辑"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleUpdate(scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleModifyStatus(scope.row, 'published')"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="formInline.page"
        :limit.sync="formInline.size"
        @pagination="getList"
      />
    </div>
    <!-- 新增和修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="日期" prop="timestamp">
          <el-date-picker
            v-model="temp.date"
            type="datetime"
            placeholder="Please pick a date"
          />
        </el-form-item>
        <el-form-item label="年龄" prop="title">
          <el-input v-model="temp.age" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select
            v-model="temp.sex"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              label="男"
              value="0"
            />
            <el-option
              label="女"
              value="1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="temp.mobile"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="temp.address"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
  const title = [
    { label: "id", value: "id" },
    { label: "日期", value: "date" },
    { label: "姓名", value: "name" },
    { label: "性别", value: "sex" },
    { label: "年龄", value: "age" },
    { label: "手机号码", value: "mobile" },
    { label: "地址", value: "address" }
  ];
  import { OrderService } from "@/service";
  export default {
    name: "TsetTable",
    data() {
      return {
        formInline: {
          name: "",
          mobile: "",
          age: "",
          page: 1,
          size: 10,
          date:'',
        },
        loading: true,
        title,
        list: [],
        total: 0,
        downloadLoading: false,
        dialogFormVisible: false,
        dialogStatus: "",
        textMap: {
          update: "修改",
          create: "新增"
        },
        temp: {
          id: undefined,
          date: new Date(),
          name: "",
          sex: "",
          age: "",
          mobile: "",
          address: ""
        },
        rules: {
          name: [
            { required: true, message: "type is required", trigger: "change" }
          ],
          mobile: [
            {
              type: "date",
              required: true,
              message: "timestamp is required",
              trigger: "change"
            }
          ],
          address: [
            { required: true, message: "title is required", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 初始化列表
      async getList() {
        this.listLoading = true;
        const { data } = await OrderService.orderList(this.formInline);
        this.listLoading = false;
        let list = data.items.map(item => {
          if (item.sex == 0) {
            item.sex = "男";
          } else {
            item.sex = "女";
          }
        });
        this.list = data.items;
        this.total = data.total;
      },

      // 搜索订单
      searchOrder() {
        this.getList();
      },

      // 修改订单
      handleUpdate(row) {
        this.temp = Object.assign({}, row);
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        console.log(this.temp);
        // this.$nextTick(() => {
        //   this.$refs["dataForm"].clearValidate();
        // });
      },

      // 导出excel
      handleDownload() {
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = [
            "id",
            "日期",
            "姓名",
            "性别",
            "年龄",
            "手机号码",
            "地址"
          ];
          const filterVal = [
            "id",
            "date",
            "name",
            "sex",
            "age",
            "mobile",
            "address"
          ];
          const list = this.list;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "table-list"
          });
          this.downloadLoading = false;
        });
      },

      // 格式化需要导出的数据
      formatJson(filterVal, jsonData) {
        return jsonData.map(v =>
          filterVal.map(j => {
            return v[j];
          })
        );
      }
    }
  };
</script>

<style lang="less" scoped>
  .line {
    text-align: center;
  }
</style>
