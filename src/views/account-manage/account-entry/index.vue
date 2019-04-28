<template>
  <div class="account-entry app-container">
    <div class="form">
      <el-form
        label-position="left"
        :inline="true"
        :model="search"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item label="同步日期">
              <el-date-picker
                :editable="false"
                v-model="syncDate"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单编号">
              <el-input
                style="width: 100%"
                v-model="search.orderNumber"
                placeholder="请输入订单编号"
                maxlength="40"
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商户名称" prop="businessName">
              <el-input
                style="width: 100%"
                v-model="search.businessName"
                placeholder="请输入商户名称"
                maxlength="15"
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button type="primary" @click="searchOrder">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="下单时间">
              <el-date-picker
                :editable="false"
                v-model="createDate"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="对账状态">
              <el-select
                style="min-width: 190px;"
                v-model="search.statusList"
                placeholder="请选择"
                multiple
              >
                <el-option
                  v-for="(item, index) in checkState"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否补单">
              <el-select
                style="width: 120px;"
                v-model="search.dateMark"
                placeholder="请选择"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button type="primary" @click="reset">重置</el-button>
            </el-form-item>
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
          align="center"
          :prop="item.value"
          :label="item.label"
          :min-width="item.width"
        >
          <template slot-scope="scope">
            <span v-if="item.value !== 'orderNumber'">{{
              scope.row[item.value]
            }}</span>
            <router-link
              style="color:#409EFF"
              :to="
                `/order-detail/${scope.row.orderNumber}/${scope.row.userId}/${
                  scope.row.businessId
                }?storeId=${scope.row.storeId}&receiptType=${
                  scope.row.receiptTypeValue
                }&orderIntegral=${scope.row.orderIntegral}&orderNotIntegral=${
                  scope.row.orderNotIntegral
                }`
              "
              v-if="item.value == 'orderNumber'"
              >{{ scope.row[item.value] }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status >= 3"
              type="danger"
              size="small"
              @click="handleUpdate(scope.row)"
              >异常处理</el-button
            >
            <el-button
              v-if="scope.row.status == 2"
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
        v-show="dialogStatus !== 'abnormal'"
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="top"
        label-width="70px"
      >
        <el-row class="dialog-order">
          <el-col :span="2" class="order-title">订单：</el-col>
          <el-col :span="10">
            积分支付总额：{{ rowData.orderIntegral }}元
          </el-col>
          <el-col :span="10">
            非积分支付总额：{{ rowData.orderNotIntegral }}元
          </el-col>
        </el-row>
        <el-row class="dialog-flow">
          <el-col :span="2" class="flow-title">流水：</el-col>
          <el-col :span="10">
            积分支付总额：{{ rowData.flowIntegral }}元
          </el-col>
          <el-col :span="10">
            非积分支付总额：{{ rowData.flowNotIntegral }}元
          </el-col>
        </el-row>
        <el-form-item prop="value" v-show="dialogStatus !== 'abnormal'">
          <el-select
            v-model="temp.value"
            placeholder="请选择需要修改的金额类型"
            @change="onChangeStatus"
            style="width:300px;margin-top: 14px;"
          >
            <el-option
              v-for="item in priceList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="金额修改为"
          prop="price"
          v-show="dialogStatus !== 'abnormal'"
        >
          <el-input
            style="width: 350px;"
            type="number"
            v-model="temp.price"
          />元（精确小数后两位）
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="temp.remark"
            type="textarea"
            placeholder="可输入该异常出现的原因（100字以内）"
            maxlength="100"
          />
        </el-form-item>
      </el-form>
      <div v-show="dialogStatus === 'abnormal'">
        <h3>异常类型：{{ rowData.statusOld | formatStatus }}</h3>
        <div class="apply-total">支付总金额：{{ rowData.orderAmountPlan }}</div>
        <el-row class="apply-table">
          <el-col :span="2">&nbsp</el-col>
          <el-col :span="6">订单积分支付</el-col>
          <el-col :span="6">流水积分支付</el-col>
          <el-col :span="5">订单非积分支付</el-col>
          <el-col :span="5">流水非积分支付</el-col>
        </el-row>
        <el-row class="apply-table">
          <el-col :span="2">原值</el-col>
          <el-col :span="6">{{ rowData.orderIntegralOld }}</el-col>
          <el-col :span="6">{{ rowData.flowIntegralOld }}</el-col>
          <el-col :span="5">{{ rowData.orderNotIntegralOld }}</el-col>
          <el-col :span="5">{{ rowData.flowNotIntegralOld }}</el-col>
        </el-row>
        <el-row class="apply-table">
          <el-col :span="2">现值</el-col>
          <el-col :span="6">{{ rowData.orderIntegral }}</el-col>
          <el-col :span="6">{{ rowData.flowIntegral }}</el-col>
          <el-col :span="5">{{ rowData.orderNotIntegral }}</el-col>
          <el-col :span="5">{{ rowData.flowNotIntegral }}</el-col>
        </el-row>
        <div class="apply-remark">
          <h3>备注：</h3>
          <p>
            {{ rowData.remark }}
          </p>
        </div>
      </div>
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
  import { AccountEntryService } from "@/service";
  import { Utils } from "@/common";
  const title = [
    // 表格title
    { label: "业务类型", value: "businessType", width: "80px" },
    { label: "同步日期", value: "orderCreateDate", width: "160px" },
    { label: "是否补单", value: "dateMark", width: "80px" },
    { label: "下单时间", value: "orderDate", width: "160px" },
    { label: "订单编号", value: "orderNumber", width: "180px" },
    { label: "商户名称", value: "businessName", width: "100px" },
    { label: "收款类型", value: "receiptTypeValue", width: "100px" },
    { label: "订单应付金额", value: "orderAmountPlan", width: "80px" },
    { label: "订单实付金额", value: "orderAmount", width: "80px" },
    { label: "积分支付总额", value: "orderIntegral", width: "80px" },
    { label: "非积分支付总额", value: "orderNotIntegral", width: "80px" },
    { label: "流水总金额", value: "flowAmount", width: "80px" },
    { label: "积分流水总额", value: "flowIntegral", width: "80px" },
    { label: "非积分流水总额", value: "flowNotIntegral", width: "80px" },
    { label: "对账状态", value: "statusText", width: "120px" },
    { label: "差异金额", value: "differences", width: "80px" }
  ];

  // 筛选按钮
  const tabs = [
    { label: "前一天", value: 1 },
    { label: "近一周(7天)", value: 2 },
    { label: "近一月(30天)", value: 3 }
  ];

  // 对账状态
  const checkState = [
    { label: "系统成功", value: "1" },
    { label: "财务确认", value: "2" },
    { label: "金额不一致", value: "3" },
    { label: "订单缺失", value: "4" },
    { label: "流水缺失", value: "5" }
  ];

  // 修改的金额类型
  const priceList = [
    { label: "订单积分支付金额", value: "orderIntegral" },
    { label: "订单非积分支付金额", value: "orderNotIntegral" },
    { label: "积分流水支付金额", value: "flowIntegral" },
    { label: "非积分流水支付金额", value: "flowNotIntegral" }
  ];

  const format = data => {
    let list = [];
    data.map(item => {
      switch (item.status) {
        case 1:
          item.statusText = "系统成功";
          break;
        case 2:
          item.statusText = "财务确认";
          break;
        case 3:
          item.statusText = "金额不一致";
          break;
        case 4:
          item.statusText = "订单缺失";
          break;
        case 5:
          item.statusText = "流水缺失";
          break;
        default:
          break;
      }
      item["differences"] = Math.abs(
        (item.orderAmount - item.flowAmount).toFixed(2)
      ); // 计算差异金额
      switch (item.receiptType) {
        case 0:
          item.receiptTypeValue = "平台收款";
          break;
        case 1:
          item.receiptTypeValue = "非平台收款";
          break;
        default:
          break;
      }
      if (item.dateMark) {
        item.dateMark = '是'
      } else {
        item.dateMark = '否'
      }
      item["businessType"] = "入款";
      list.push(item);
    });
    return list;
  };

  function NewDate(str) {
    if (!str) {
      return 0;
    }
    arr = str.split(" ");
    d = arr[0].split("-");
    t = arr[1].split(":");
    var date = new Date();
    date.setUTCFullYear(d[0], d[1] - 1, d[2]);
    date.setUTCHours(t[0], t[1], t[2], 0);
    return date;
  }

  export default {
    name: "AccountEntry",
    data() {
      return {
        createDate: "", // 筛选条件v-model绑定的下单时间
        syncDate: "", // 筛选条件v-model绑定的同步日期
        search: {
          // 列表筛选
          startCreateDate: "", // 同步开始日期
          endCreateDate: "", // 同步结束日期
          startOrderDate: "", // 下单开始日期
          endOrderDate: "", // 下单结束日期
          businessName: "", // 商户名称
          orderNumber: "", // 订单编号
          statusList: ["3", "4", "5"], // 对账状态
          dateMark: "", // 是否补单，true为是，false为否
          pageNum: 1, // 分页
          pageSize: 20 // 每页显示的条数
        },
        pickerOptions: {
          // 设置日期范围
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        tabs, // 按钮切换筛选数据
        title, // 表格title
        list: [], // 表格数据列表
        total: 0, // 返回的列表总数
        checkState, // 对账状态
        priceList, // 修改的金额类型
        listLoading: false, // 表格数据加载的loading
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
          value: "", // 对账状态
          remark: "", // 备注
          price: "" // 修改的金额
        },
        rowData: {}, // // 存储需要修改的某一条列表数据
        rules: {
          // 表单验证
          price: [
            // 金额验证
            { required: true, message: "请输入金额", trigger: "blur" },
            {
              pattern: /^[1-9]\d*(\.\d{1,2})?$|^[0]\.\d{1,2}$/g,
              message: "请输入正确的金额",
              trigger: "blur"
            }
          ],
          value: [
            // 选择状态验证
            { required: true, message: "请选择内容", trigger: "change" }
          ]
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 初始化列表,获取数据展示表格
      async getList() {
        this.listLoading = true;
        const { data } = await AccountEntryService.orderList(this.search);
        this.listLoading = false;
        this.list = format(data.list);
        this.total = data.total;
      },

      // 表格异常数据标红处理
      tableRowClassName({ row }) {
        if (row.status === 3 || row.status === 4 || row.status === 5) {
          return "warning-row";
        }
        return "";
      },

      // 筛选输入框禁止输入特殊字符
      onKeyup(e) {
        e.target.value = e.target.value.replace(/[!~@#$%*&()_+\s^]/g, "");
      },

      /*
       * 筛选订单
       * @param {value} 快捷搜索时传入的参数类型
       */
      searchOrder(value) {
        // 切换按钮筛选数据，除了支付时间其他条件置空
        if (value === "createDate") {
          this.search = {
            startCreateDate: "", // 同步开始日期
            endCreateDate: "", // 同步结束日期
            businessName: "",
            orderNumber: "",
            dateMark: "",
            statusList: ["3", "4", "5"],
            pageNum: 1,
            pageSize: 20
          };
        }
        const { createDate, syncDate } = this;
        if (createDate) {
          // 判断有没有选择下单时间，有的话格式化时间并添加到search对象下
          Object.assign(this.search, {
            startOrderDate: Utils.formatTime(createDate[0]),
            endOrderDate: Utils.formatTime(createDate[1])
          });
        } else {
          // 如果上一次选择了下单时间，本次没有选择下单时间，则需要将上一次的下单时间清空
          this.search["startOrderDate"] = "";
          this.search["endOrderDate"] = "";
        }
        if (syncDate) {
          // 判断有没有选择同步日期，有的话格式化时间并添加到search对象下
          Object.assign(this.search, {
            startCreateDate: Utils.formatTime(syncDate[0]),
            endCreateDate: Utils.formatTime(syncDate[1])
          });
        } else {
          // 如果上一次选择了同步日期，本次没有选择同步日期，则需要将上一次的同步日期清空
          this.search["startCreateDate"] = "";
          this.search["endCreateDate"] = "";
        }
        this.getList();
      },

      // 重置搜索
      reset() {
        this.createDate = "";
        this.syncDate = "";
        this.search = {
          startCreateDate: "", // 同步开始日期
          endCreateDate: "", // 同步结束日期
          businessName: "",
          statusList: ["3", "4", "5"],
          startOrderDate: "",
          endOrderDate: "",
          orderNumber: "",
          pageNum: 1,
          pageSize: 20
        };
        this.getList();
      },

      /*
       * 切换按钮,筛选前一天，前7天，前一个月的数据
       * @param {index} 快捷筛选时传入的按钮key值
       */
      handleClick(index) {
        const yesterDay = Utils.formatTime(
          new Date(new Date().setDate(new Date().getDate() - 1)),
          "{y}/{m}/{d}"
        ); // 获取前一天日期
        const end = new Date(
          new Date(yesterDay).getTime() + 24 * 60 * 60 * 1000 - 1
        ); // 获取昨天的23时59分59秒
        const start = Date.parse(Utils.formatTime(new Date(), "{y}/{m}/{d}")); // 获取今天的0时0分0秒
        switch (index) {
          case 1:
            // 昨天的00:00:00到昨天的23:59:59
            this.createDate = [start - 3600 * 1000 * 24, end];
            this.searchOrder("createDate"); // 切换按钮之后清空支付时间以外的搜索条件并请求数据
            break;
          case 2:
            // 前7天的00:00:00到昨天的23:59:59
            this.createDate = [start - 3600 * 1000 * 24 * 7, end];
            this.searchOrder("createDate"); // 切换按钮之后清空支付时间以外的搜索条件并请求数据
            break;
          case 3:
            // 前30天的00:00:00到昨天的23:59:59
            this.createDate = [start - 3600 * 1000 * 24 * 30, end];
            this.searchOrder("createDate"); // 切换按钮之后清空支付时间以外的搜索条件并请求数据
            break;
          default:
            break;
        }
      },

      // 修改订单
      handleUpdate(row) {
        this.temp = {
          value: "", // 对账状态
          remark: "", // 备注
          price: "" // 修改的金额
        };
        this.temp["remark"] = row.remark; // 回显备注信息
        this.rowData = Object.assign({}, row); // 存储需要修改的某一行数据
        if (row.status == 3) {
          // 金额不一致
          this.dialogStatus = "discrepancy";
        }
        if (row.status == 4) {
          this.dialogStatus = "order"; // 流水缺失
        }
        if (row.status == 5) {
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
        if (e == "orderIntegral") {
          this.temp["price"] = this.rowData["orderIntegral"];
        }
        if (e == "orderNotIntegral") {
          this.temp["price"] = this.rowData["orderNotIntegral"];
        }
        if (e == "flowIntegral") {
          this.temp["price"] = this.rowData["flowIntegral"];
        }
        if (e == "flowNotIntegral") {
          this.temp["price"] = this.rowData["flowNotIntegral"];
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
        this.$refs["dataForm"].validate(async valid => {
          if (valid) {
            const { price, value, remark } = this.temp;
            this.rowData[value] = price;
            this.rowData["remark"] = remark;
            const { data } = await AccountEntryService.orderUpdate(this.rowData);
            this.getList();
            this.dialogFormVisible = false;
            if (data) {
              this.$message({
                message: "修改成功",
                type: "success",
                duration: 1500
              });
            }
          } else {
            return false;
          }
        });
      }
    },
    filters: {
      formatStatus(status) {
        if (status) {
          switch (status) {
            case 1:
              return "系统成功";
            case 2:
              return "财务确认";
            case 3:
              return "金额不一致";

            case 4:
              return "订单缺失";
            case 5:
              return "流水缺失";
            default:
              return;
          }
        }
      }
    }
  };
</script>

<style lang="less">
  .account-entry {
    .line {
      text-align: center;
    }
    .el-table .warning-row {
      color: red;
    }
    .dialog-order,
    .dialog-flow {
      padding: 10px 0;
      .order-title,
      .flow-title {
        color: #333;
        font-weight: bold;
      }
    }
    .apply-total {
      font-size: 18px;
      color: #666;
      font-weight: bold;
      line-height: 28px;
    }
    .apply-table {
      text-align: center;
      padding: 5px 8px;
    }
  }
</style>
