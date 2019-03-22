<template>
  <div class="table app-container">
    <div class="form">
      <el-form
        label-position="left"
        :inline="true"
        :model="search"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="11" :offset="1">
            <el-form-item label="下单时间">
              <el-date-picker
                v-model="search.orderDate"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付时间">
              <el-date-picker
                v-model="search.payDate"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="1">
            <el-form-item label="商户名称">
              <el-input
                style="width: 100%"
                v-model="search.merchantsName"
                placeholder="请输入商户名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对账状态">
              <el-select style="width: 120px;" v-model="search.status" placeholder="请选择">
                <el-option label="全部" value="0"></el-option>
                <el-option label="系统成功" value="1"></el-option>
                <el-option label="财务确认" value="2"></el-option>
                <el-option label="金额不一致" value="3"></el-option>
                <el-option label="流水缺失" value="4"></el-option>
                <el-option label="订单缺失" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchOrder">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="reset">重置</el-button>
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
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-list">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in tabs"
          :label="item.label"
          :name="item.value"
        >
          <el-table :data="list" v-loading="listLoading" style="width: 100%">
            <el-table-column
              v-for="(item, index) in title"
              :prop="item.value"
              :label="item.label"
            ></el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="230"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  size="small"
                  @click="handleUpdate(scope.row)"
                  >异常处理</el-button
                >
                <el-button
                  size="small"
                  @click="handlePreview(scope.row)"
                  >查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="search.page"
        :limit.sync="search.size"
        @pagination="getList"
      />
    </div>
    <!-- 新增和修改 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="600px"
      center
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="top"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item v-show="dialogStatus !== 'abnormal'">
          <el-radio-group v-model="temp.resource">
            <el-radio label="修改订单应付总金额"></el-radio>
            <el-radio label="修改流水总金额"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="金额修改为"
          prop="price"
          v-show="dialogStatus !== 'abnormal'"
        >
          <el-input
            style="width: 200px;"
            v-model="temp.age"
          />元（精确小数后两位）
        </el-form-item>
        <el-form-item v-show="dialogStatus === 'abnormal'">
          <h3>异常类型：金额不一致</h3>
          <div>【订单应付总金额】原值：345.56元，现值：1234.56元</div>
          <div>【流水总金额】原值：1234.56元，现值：1234.56元</div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="temp.mobile"
            type="textarea"
            placeholder="可输入该异常出现的原因（100字以内）"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{
          dialogStatus !== "abnormal" ? "取消" : "关闭"
        }}</el-button>
        <el-button
          v-show="dialogStatus !== 'abnormal'"
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
    // 表格title
    { label: "业务类型", value: "id" },
    { label: "支付时间", value: "date" },
    { label: "下单时间", value: "name" },
    { label: "订单编号", value: "sex" },
    { label: "商户名称", value: "age" },
    { label: "订单应付总金额", value: "mobile" },
    { label: "流水总金额", value: "address" },
    { label: "对账状态", value: "address" },
    { label: "差异金额", value: "address" }
  ];
  const tabs = [
    // tabs切换
    { label: "全部", value: "0" },
    { label: "前一天", value: "1" },
    { label: "近一周（7天）", value: "2" },
    { label: "近一月（30天）", value: "3" }
  ];
  const status = [
    { label: "全部", value: "0" },
    { label: "系统成功", value: "1" },
    { label: "财务确认", value: "2" },
    { label: "金额不一致", value: "3" },
    { label: "流水缺失", value: "4" },
    { label: "订单缺失", value: "5" }
  ];
  import { OrderService } from "@/service";
  export default {
    name: "AccountEntry",
    data() {
      return {
        search: {
          // 列表筛选
          orderDate: "",
          payDate: "",
          merchantsName: "",
          status: "0",
          page: 1,
          size: 10
        },
        tabs, // tabs切换
        activeName: "0", // 当前选中的tabs
        title, // 表格title
        list: [], // 表格数据列表
        total: 0, // 返回的列表总数
        downloadLoading: false, // 表格数据加载的loading
        dialogFormVisible: false, // 编辑修改弹框显示与隐藏
        dialogStatus: "", // 点击按钮显示不同的弹框内容
        textMap: {
          // 弹框种类
          discrepancy: "异常处理-金额不一致",
          runningWater: "异常处理-流水缺失",
          order: "异常处理-订单缺失",
          abnormal: " 查看异常处理内容"
        },
        temp: {
          // 存储需要修改的某一条列表数据
          id: undefined,
          date: new Date(),
          name: "",
          sex: "",
          age: "",
          mobile: "",
          address: "",
          resource: ""
        },
        rules: {
          // 表单验证
          price: [
            // 价格验证
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

      // 重置搜索
      reset() {
        this.search = {
          orderDate: "",
          payDate: "",
          merchantsName: "",
          status: "0",
          page: 1,
          size: 10
        };
      },

      // 切换tabs
      handleClick(tab, event) {
        const end = new Date(
          new Date(
            new Date(
              new Date().setDate(new Date().getDate() - 1)
            ).toLocaleDateString()
          ).getTime() +
            24 * 60 * 60 * 1000 -
            1
        ); // 获取昨天的23时59分59秒
        const start = new Date(new Date().toLocaleDateString()); // 获取今天的0时0分0秒
        switch (tab.index) {
          case "0":
            this.search["payDate"] = "";
            break;
          case "1":
            // 昨天的00:00:00到昨天的23:59:59
            start.setTime(start - 3600 * 1000 * 24);
            this.search["payDate"] = [start, end];
            break;
          case "2":
            // 前7天的00:00:00到昨天的23:59:59
            start.setTime(start - 3600 * 1000 * 24 * 7);
            this.search["payDate"] = [start, end];
            break;
          case "3":
            // 前30天的00:00:00到昨天的23:59:59
            start.setTime(start - 3600 * 1000 * 24 * 30);
            this.search["payDate"] = [start, end];
            break;
          default:
            break;
        }
      },

      // 修改订单
      handleUpdate(row) {
        this.temp = Object.assign({}, row);
        this.dialogStatus = "discrepancy";
        this.dialogFormVisible = true;
        console.log(this.temp);
        // this.$nextTick(() => {
        //   this.$refs["dataForm"].clearValidate();
        // });
      },

      // 查看异常处理内容
      handlePreview(row) {
        this.temp = Object.assign({}, row);
        this.dialogStatus = "abnormal";
        this.dialogFormVisible = true;
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
