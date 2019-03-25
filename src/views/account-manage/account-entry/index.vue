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
                :editable="false"
                v-model="search.createDate"
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
                :editable="false"
                v-model="search.flowDate"
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
                v-model="search.businessName"
                placeholder="请输入商户名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对账状态">
              <el-select
                style="width: 120px;"
                v-model="search.state"
                placeholder="请选择"
              >
                <el-option label="全部" value=""></el-option>
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
                  v-if="scope.row.state >= 3"
                  type="danger"
                  size="small"
                  @click="handleUpdate(scope.row)"
                  >异常处理</el-button
                >
                <el-button
                  v-if="scope.row.state == 2"
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
          <el-radio-group v-model="temp.state" @change="onChangeStatus">
            <el-radio v-if="temp.status == 3" :label="3"
              >修改订单应付总金额</el-radio
            >
            <el-radio v-else :label="4">修改订单应付总金额</el-radio>
            <el-radio :label="5">修改流水总金额</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="金额修改为"
          prop="price"
          v-show="dialogStatus !== 'abnormal' && (temp.state == 3 || temp.state == 4)"
        >
          <el-input
            style="width: 200px;"
            v-model="temp.orderAmount"
          />元（精确小数后两位）
        </el-form-item>
        <el-form-item
          label="金额修改为"
          prop="price"
          v-show="dialogStatus !== 'abnormal' && temp.state == 5"
        >
          <el-input
            style="width: 200px;"
            v-model="temp.flowAmount"
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
            v-model="temp.remark"
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
          @click="updateData()"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { OrderService } from "@/service";
  import { Utils } from "@/common";
  const title = [
    // 表格title
    { label: "业务类型", value: "id" },
    { label: "支付时间", value: "flowDate" },
    { label: "下单时间", value: "createDate" },
    { label: "订单编号", value: "orderNumber" },
    { label: "商户名称", value: "businessName" },
    { label: "订单应付总金额", value: "orderAmount" },
    { label: "流水总金额", value: "flowAmount" },
    { label: "对账状态", value: "status" },
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
    { label: "全部", value: "" },
    { label: "系统成功", value: "1" },
    { label: "财务确认", value: "2" },
    { label: "金额不一致", value: "3" },
    { label: "流水缺失", value: "4" },
    { label: "订单缺失", value: "5" }
  ];
  const format = data => {
    let list = [];
    data.map(item => {
      switch (item.state) {
        case 1:
          item.status = "系统成功";
          break;
        case 2:
          item.status = "财务确认";
          break;
        case 3:
          item.status = "金额不一致";
          break;
        case 4:
          item.status = "订单缺失";
          break;
        case 5:
          item.status = "流水缺失";
          break;
        default:
          break;
      }
      item.createDate = Utils.formatTime(item.createDate);
      item.flowDate = Utils.formatTime(item.flowDate);
      list.push(item);
    });
    return list;
  };

  export default {
    name: "AccountEntry",
    data() {
      return {
        search: {
          // 列表筛选
          createDate: "",
          flowDate: "",
          businessName: "",
          state: ""
          // page: 1,
          // size: 10
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
          status: "", // 对账状态
          remark: "", // 备注
          orderAmount: '', // 修改的订单总金额
          flowAmount: '', // 修改的流水总金额
        },
        rules: {
          // 表单验证
          prices: [
            // 价格验证
            { required: true, message: "type is required", trigger: "blur" }
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
      async getList(value) {
        this.listLoading = true;
        const { data } = await OrderService.orderList(
          value ? value : this.search
        );
        this.listLoading = false;
        if (data.code == 200 && data.data) {
          this.list = format(data.data);
          this.total = 10;
        } else {
          this.$message({
            message: data.info || "内部错误",
            type: "error",
            duration: 5 * 1000
          });
        }
      },

      // 搜索订单
      searchOrder() {
        const { createDate, flowDate, businessName, state } = this.search;
        let data = {
          businessName: businessName,
          state: state
        };
        if (createDate) {
          // 判断有没有选择下单时间，有的话格式化时间并添加到data对象下
          data["startOrderDate"] = Utils.formatTime(createDate[0]);
          data["endOrderDate"] = Utils.formatTime(createDate[1]);
        }
        if (flowDate) {
          // 判断有没有选择支付时间，有的话格式化时间并添加到data对象下
          data["startFlowDate"] = Utils.formatTime(flowDate[0]);
          data["endFlowDate"] = Utils.formatTime(flowDate[1]);
        }
        this.getList(data);
      },

      // 重置搜索
      reset() {
        this.search = {
          createDate: "",
          flowDate: "",
          businessName: "",
          state: ""
          // page: 1,
          // size: 10
        };
        this.getList();
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
            this.search["flowDate"] = "";
            break;
          case "1":
            // 昨天的00:00:00到昨天的23:59:59
            start.setTime(start - 3600 * 1000 * 24);
            this.search["flowDate"] = [start, end];
            break;
          case "2":
            // 前7天的00:00:00到昨天的23:59:59
            start.setTime(start - 3600 * 1000 * 24 * 7);
            this.search["flowDate"] = [start, end];
            break;
          case "3":
            // 前30天的00:00:00到昨天的23:59:59
            start.setTime(start - 3600 * 1000 * 24 * 30);
            this.search["flowDate"] = [start, end];
            break;
          default:
            break;
        }
      },

      // 修改订单
      handleUpdate(row) {
        this.temp = Object.assign({}, row);
        this.temp['status'] = row.state;
        if (row.state == 3) {
          // 金额不一致
          this.dialogStatus = "discrepancy";
        }
        if (row.state == 4) {
          this.dialogStatus = "order"; // 流水缺失
        }
        if (row.state == 5) {
          this.dialogStatus = "runningWater"; // 订单缺失
        }
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          // 打开弹框清空数据
          this.$refs["dataForm"].clearValidate();
        });
      },

      // 切换修改的金额
      onChangeStatus(e) {
        const { orderAmount, flowAmount } = this.temp;
        if (e == 4 || e == 3) {
          this.temp['price'] = orderAmount
        }
        if (e == 5) {
          this.temp['price'] = flowAmount
        }
      },

      // 查看异常处理内容
      handlePreview(row) {
        this.temp = Object.assign({}, row);
        this.dialogStatus = "abnormal";
        this.dialogFormVisible = true;
      },

      // 更新订单流水
      async updateData() {
        console.log(this.temp);
        const {data} = await OrderService.orderUpdate(this.temp)
        if (data && data.code == 200) {
          this.$message({
            message: data.info || "修改成功",
            type: "success",
            duration: 1500
          });
        }
        console.log(data)
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
