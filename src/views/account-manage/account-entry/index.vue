<template>
  <div class="order app-container">
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
                v-model="createDate"
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
                v-model="flowDate"
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
            <!-- <el-form-item>
              <el-button
                :loading="downloadLoading"
                class="filter-item"
                type="primary"
                icon="el-icon-download"
                @click="handleDownload"
                >导出</el-button
              >
            </el-form-item> -->
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-list">
      <el-row>
        <el-col :span="11" :offset="1">
          <el-button
            v-for="(item, index) in tabs"
            class="filter-item"
            type="primary"
            @click="handleClick(item.value)"
            >{{ item.label }}</el-button
          >
        </el-col>
      </el-row>
      <el-table
        :data="list"
        v-loading="listLoading"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          v-for="(item, index) in title"
          :min-width="item.width"
          align="center"
          :prop="item.value"
          :label="item.label"
        ></el-table-column>
        <el-table-column
          label="操作"
          align="center"
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
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="search.pageNum"
        :limit.sync="search.pageSize"
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
            <el-radio v-if="rowData.state == 3" :label="3"
              >修改订单应付总金额</el-radio
            >
            <el-radio v-else :label="4">修改订单应付总金额</el-radio>
            <el-radio :label="5">修改流水总金额</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="金额修改为"
          prop="orderAmount"
          v-show="
            dialogStatus !== 'abnormal' &&
              (rowData.state == 3 || rowData.state == 4)
          "
        >
          <el-input
            style="width: 200px;"
            type="number"
            v-model="temp.orderAmount"
          />元（精确小数后两位）
        </el-form-item>
        <el-form-item
          label="金额修改为"
          prop="flowAmount"
          v-show="dialogStatus !== 'abnormal' && rowData.state == 5"
        >
          <el-input
            type="number"
            style="width: 200px;"
            v-model="temp.flowAmount"
          />元（精确小数后两位）
        </el-form-item>
        <el-form-item v-show="dialogStatus === 'abnormal'">
          <h3>异常类型：金额不一致</h3>
          <div>
            【订单应付总金额】原值：{{ rowData.orderAmountOld }}元，现值：{{
              rowData.orderAmount
            }}元
          </div>
          <div>
            【流水总金额】原值：{{ rowData.flowAmountOld }}元，现值：{{
              rowData.flowAmount
            }}元
          </div>
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
    { label: "业务类型", value: "type", width: "80px" },
    { label: "订单编号", value: "orderNumber", width: "180px" },
    { label: "支付时间", value: "orderDate", width: "160px" },
    { label: "下单时间", value: "createDate", width: "160px" },
    { label: "商户名称", value: "businessName", width: "100px" },
    { label: "订单应付总金额", value: "orderAmount", width: "100px" },
    { label: "流水总金额", value: "flowAmount", width: "100px" },
    { label: "对账状态", value: "status", width: "100px" },
    { label: "差异金额", value: "differences", width: "100px" }
  ];
  const tabs = [
    { label: "前一天", value: 1 },
    { label: "前一周", value: 2 },
    { label: "前一月", value: 3 }
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
      if (item.orderAmount && item.flowAmount) {
        item["differences"] = (item.orderAmount - item.flowAmount).toFixed(2); // 计算差异金额
      }
      item["type"] = "入款";
      list.push(item);
    });
    return list;
  };

  export default {
    name: "AccountEntry",
    data() {
      // 验证订单总额
      const orderAmount = (rule, value, callback) => {
        const myreg = /^[1-9]\d*(\.\d{1,2})?$|^[0]\.\d{1,2}$/g;
        const { flowAmount } = this.rowData;
        if (value === "") {
          callback(new Error("请输入金额"));
        } else if (!myreg.test(value)) {
          callback(new Error("请输入正确的金额"));
        } else if (value < flowAmount) {
          callback(new Error("输入的订单总金额不能小于流水总金额"));
        } else {
          callback();
        }
      };
      // 验证流水总额
      const flowAmount = (rule, value, callback) => {
        const myreg = /^[1-9]\d*(\.\d{1,2})?$|^[0]\.\d{1,2}$/g;
        const { orderAmount } = this.rowData;
        if (value === "") {
          callback(new Error("请输入金额"));
        } else if (!myreg.test(value)) {
          callback(new Error("请输入正确的金额"));
        } else if (value > orderAmount) {
          callback(new Error("输入的流水总金额不能大于订单总金额"));
        } else {
          callback();
        }
      };
      return {
        createDate: "", // 筛选条件v-model绑定的下单时间
        flowDate: "", //筛选条件v-model绑定的支付时间
        search: {
          // 列表筛选
          startOrderDate: "", // 下单开始日期
          endOrderDate: "", // 下单结束日期
          startFlowDate: "", // 支付开始日期
          endFlowDate: "", // 支付结束日期
          businessName: "", // 商户名称
          state: "", // 对账状态
          pageNum: 1, // 分页
          pageSize: 20 // 每页显示的条数
        },
        tabs, // 按钮切换筛选数据
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
          id: undefined,
          status: "", // 对账状态
          remark: "", // 备注
          orderAmount: "", // 修改的订单总金额
          flowAmount: "" // 修改的流水总金额
        },
        rowData: {}, // // 存储需要修改的某一条列表数据
        rules: {
          // 表单验证
          orderAmount: [
            // 金额验证
            { validator: orderAmount, trigger: "blur" }
          ],
          flowAmount: [
            // 金额验证
            { validator: flowAmount, trigger: "blur" }
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
        const { data } = await OrderService.orderList(this.search);
        this.listLoading = false;
        if (data.code == 200 && data.data && data.data.list) {
          this.list = format(data.data.list);
          this.total = data.data.total;
        } else {
          this.$message({
            message: data.info || "内部错误",
            type: "error",
            duration: 5 * 1000
          });
        }
      },

      // 表格异常数据标红
      tableRowClassName({ row }) {
        if (row.state === 3 || row.state === 4 || row.state === 5) {
          return "warning-row";
        }
        return "";
      },

      // 搜索订单
      searchOrder(value) {
        // 切换按钮筛选数据，除了支付时间其他条件置空
        if (value === "flowDate") {
          this.createDate = "";
          this.search = {
            businessName: "",
            state: "",
            startOrderDate: "",
            endOrderDate: "",
            startFlowDate: "",
            endFlowDate: "",
            pageNum: 1,
            pageSize: 20
          };
        }
        const { createDate, flowDate } = this;
        if (createDate) {
          // 判断有没有选择下单时间，有的话格式化时间并添加到search对象下
          Object.assign(this.search, {
            startOrderDate: Utils.formatTime(createDate[0]),
            endOrderDate: Utils.formatTime(createDate[1])
          });
        }
        if (flowDate) {
          // 判断有没有选择支付时间，有的话格式化时间并添加到search对象下
          Object.assign(this.search, {
            startFlowDate: Utils.formatTime(flowDate[0]),
            endFlowDate: Utils.formatTime(flowDate[1])
          });
        }
        this.getList();
      },

      // 重置搜索
      reset(value) {
        this.flowDate = "";
        this.createDate = "";
        this.search = {
          businessName: "",
          state: "",
          startOrderDate: "",
          endOrderDate: "",
          startFlowDate: "",
          endFlowDate: "",
          pageNum: 1,
          pageSize: 20
        };
        this.getList();
      },

      // 切换按钮,筛选前一天，前7天，前一个月的数据
      handleClick(index) {
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
        switch (index) {
          case 1:
            // 昨天的00:00:00到昨天的23:59:59
            start.setTime(start - 3600 * 1000 * 24);
            this.flowDate = [start, end];
            this.searchOrder("flowDate"); // 切换按钮之后清空支付时间以外的搜索条件并请求数据
            break;
          case 2:
            // 前7天的00:00:00到昨天的23:59:59
            start.setTime(start - 3600 * 1000 * 24 * 7);
            this.flowDate = [start, end];
            this.searchOrder("flowDate"); // 切换按钮之后清空支付时间以外的搜索条件并请求数据
            break;
          case 3:
            // 前30天的00:00:00到昨天的23:59:59
            start.setTime(start - 3600 * 1000 * 24 * 30);
            this.flowDate = [start, end];
            this.searchOrder("flowDate"); // 切换按钮之后清空支付时间以外的搜索条件并请求数据
            break;
          default:
            break;
        }
      },

      // 修改订单
      handleUpdate(row) {
        this.temp = Object.assign({}, row); // 表单数据回显
        this.rowData = Object.assign({}, row); // 存储数据用于逻辑控制
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
        if (e == 4 || e == 3) {
          // 切换radio后订单总额数据恢复至初始值
          this.temp["orderAmount"] = this.rowData["orderAmount"];
        }
        if (e == 5) {
          // 切换radio后流水总额数据恢复至初始值
          this.temp["flowAmount"] = this.rowData["flowAmount"];
        }
      },

      // 查看异常处理内容
      handlePreview(row) {
        this.rowData = Object.assign({}, row);
        this.dialogStatus = "abnormal";
        this.dialogFormVisible = true;
      },

      // 更新订单流水
      updateData() {
        this.temp["state"] = 2; // 更改数据时需要把状态改为2，财务确认
        this.$refs["dataForm"].validate(async valid => {
          if (valid) {
            const { data } = await OrderService.orderUpdate(this.temp);
            this.dialogFormVisible = false;
            if (data && data.code == 200) {
              this.getList();
              this.$message({
                message: data.info || "修改成功",
                type: "success",
                duration: 1500
              });
            } else {
              this.$message({
                message: data.info || "修改失败",
                type: "error",
                duration: 1500
              });
            }
          } else {
            return false;
          }
        });
      }

      // // 导出excel 目前后端来做
      // handleDownload() {
      //   this.downloadLoading = true;
      //   import("@/vendor/Export2Excel").then(excel => {
      //     const tHeader = [
      //       "id",
      //       "日期",
      //       "姓名",
      //       "性别",
      //       "年龄",
      //       "手机号码",
      //       "地址"
      //     ];
      //     const filterVal = [
      //       "id",
      //       "date",
      //       "name",
      //       "sex",
      //       "age",
      //       "mobile",
      //       "address"
      //     ];
      //     const list = this.list;
      //     const data = this.formatJson(filterVal, list);
      //     excel.export_json_to_excel({
      //       header: tHeader,
      //       data,
      //       filename: "table-list"
      //     });
      //     this.downloadLoading = false;
      //   });
      // },

      // // 格式化需要导出的数据
      // formatJson(filterVal, jsonData) {
      //   return jsonData.map(v =>
      //     filterVal.map(j => {
      //       return v[j];
      //     })
      //   );
      // }
    }
  };
</script>

<style lang="less">
  .order {
    .line {
      text-align: center;
    }
    .el-table .warning-row {
      color: red;
    }
  }
</style>
