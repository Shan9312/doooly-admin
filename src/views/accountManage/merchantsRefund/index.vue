<template>
  <div class="merchants-order app-container">
    <div class="order-form">
      <el-form
        label-position="left"
        :inline="true"
        :model="search"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="商户名称">
              <el-input
                style="width: 100%"
                v-model="search.businessName"
                maxlength="20"
                placeholder="请输入商户名称"
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="退款时间">
              <el-date-picker
                :editable="false"
                v-model="refundDate"
                type="datetimerange"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
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
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="收款类型">
              <el-select
                style="width: 120px;"
                v-model="search.receiptType"
                placeholder="请选择"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="平台收款" :value="0"></el-option>
                <el-option label="非平台收款" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="同步日期">
              <el-date-picker
                :editable="false"
                v-model="syncDate"
                type="daterange"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
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
                style="width: 120px;"
                v-model="search.status"
                placeholder="请选择"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="系统成功" value="1"></el-option>
                <el-option label="财务确认" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
          <el-col :span="5">
            <span class="search-btn">
              <el-form-item>
                <pe-button
                  label="查询"
                  perms="account:merchantsRefund:search"
                  type="primary"
                  @click="searchOrder"
                />
              </el-form-item>
              <el-form-item>
                <pe-button
                  label="重置"
                  perms="account:merchantsRefund:reset"
                  type="primary"
                  @click="reset"
                />
              </el-form-item>
            </span>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <pe-button
                :loading="downloadLoading"
                label="导出订单明细"
                icon="el-icon-download"
                perms="account:merchantsRefund:export"
                type="primary"
                @click="handleDownload"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="order-table">
      <el-table
        :data="list"
        border
        ref="multipleTable"
        v-loading="listLoading"
        style="width: 100%"
        tooltip-effect="dark"
        :row-key="getRowKey"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :reserve-selection="true" width="55">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in title"
          :key="index"
          :min-width="item.width"
          align="center"
          :prop="item.value"
          :label="item.label"
        >
          <template slot-scope="scope">
            <span v-if="item.value !== 'serialNumber'">{{
              scope.row[item.value]
            }}</span>
            <router-link
              style="color:#409EFF"
              :to="
                `orderDetail/${encodeURIComponent(scope.row.orderNumber)}/${
                  scope.row.userId
                }/${scope.row.businessId}/${scope.row.serialNumber}?storeId=${
                  scope.row.storeId
                }&receiptType=${scope.row.receiptType}&orderIntegral=${
                  scope.row.orderIntegral
                }&orderNotIntegral=${scope.row.orderNotIntegral}`
              "
              v-if="item.value == 'serialNumber'"
              >{{ scope.row[item.value] }}</router-link
            >
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
  </div>
</template>
<script>
  import { MerchantsOrderService } from "@/service";
  import { Utils, Auth } from "@/common";
  const title = [
    // 表格title
    { label: "同步日期", value: "orderCreateDate", width: "160px" },
    { label: "是否补单", value: "dateMark", width: "80px" },
    { label: "商户名称", value: "businessName", width: "80px" },
    { label: "订单编号", value: "orderNumber", width: "180px" },
    { label: "退款单号", value: "serialNumber", width: "180px" },
    { label: "退款时间", value: "orderDate", width: "160px" },
    { label: "收款类型", value: "receiptType", width: "100px" },
    { label: "订单退款总金额", value: "orderAmountPlan", width: "100px" },
    { label: "积分退款总额", value: "orderIntegral", width: "100px" },
    { label: "非积分退款总额", value: "orderNotIntegral", width: "100px" },
    { label: "手续费退款", value: "serviceCharge", width: "80px" },
    { label: "对账状态", value: "statusText", width: "100px" }
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
      switch (item.receiptType) {
        case 0:
          item.receiptType = "平台收款";
          break;
        case 1:
          item.receiptType = "非平台收款";
          break;
        default:
          break;
      }
      if (item.dateMark) {
        item.dateMark = "是";
      } else {
        item.dateMark = "否";
      }
      list.push(item);
    });
    return list;
  };
  export default {
    name: "MerchantsRefund",
    data() {
      return {
        pickerOptions: {
          // 设置日期范围
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        syncDate: "", // 同步日期
        refundDate: "", // 退款时间
        search: {
          // 列表筛选
          startOrderCreateDate: "", // 同步开始日期
          endOrderCreateDate: "", // 同步结束日期
          startReturnDate: "", // 退款开始日期
          endReturnDate: "", // 退款结束日期
          businessName: "", // 商户名称
          orderNumber: "", // 订单编号
          status: "", // 对账状态
          dateMark: "", // 是否补单
          receiptType: "", // 收款类型
          pageNum: 1, // 分页
          pageSize: 20, // 每页显示的条数
          type: 2
        },
        downloadLoading: false, // 导出excel按钮loading
        list: [], // 表格数据
        total: 0, // 返回的列表总数
        listLoading: false, // table列表加载的loading
        title, // 表格的title
        multipleSelection: [], // 选中的导出数据
        getRowKey(row) {
          return row.id;
        }
      };
    },
    watch: {
      // 同步日期
      syncDate(time) {
        if (time) {
          this.search.startOrderCreateDate = time[0];
          this.search.endOrderCreateDate = time[1];
        } else {
          this.search.startOrderCreateDate = "";
          this.search.endOrderCreateDate = "";
        }
      },
      // 退款日期
      refundDate(time) {
        if (time) {
          this.search.startReturnDate = time[0];
          this.search.endReturnDate = time[1];
        } else {
          this.search.startReturnDate = "";
          this.search.endReturnDate = "";
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      // 获取列表数据
      async getList() {
        this.listLoading = true;
        const { data } = await MerchantsOrderService.orderList(this.search);
        this.listLoading = false;
        this.list = format(data.list);
        this.total = data.total;
      },

      // 搜索订单
      searchOrder() {
        this.search.pageNum = 1;
        this.$refs.multipleTable.clearSelection(); // 除了翻页，其他任何刷新页面的操作都将清空之前选择的内容
        this.getList();
      },

      // 重置
      reset() {
        this.refundDate = "";
        this.syncDate = "";
        this.search = {
          // 列表筛选
          startOrderCreateDate: "", // 同步开始日期
          endOrderCreateDate: "", // 同步结束日期
          startReturnDate: "", // 退款开始日期
          endReturnDate: "", // 退款结束日期
          businessName: "", // 商户名称
          orderNumber: "", // 订单编号
          status: "", // 对账状态
          receiptType: "", // 收款类型
          pageNum: 1, // 分页
          pageSize: 20 // 每页显示的条数
        };
        this.getList();
      },

      // 选择需要导出的数据
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      // 禁止输入特殊字符
      onKeyup(e) {
        e.target.value = e.target.value.replace(/[!~@#$%*&()_+\s^]/g, "");
      },

      // 导出
      handleDownload() {
        this.downloadLoading = true;
        if (this.multipleSelection.length > 0) {
          import("@/vendor/Export2Excel").then(excel => {
            const tHeader = [
              "同步日期",
              "是否补单",
              "商户名称",
              "订单编号",
              "下单时间",
              "收款类型",
              "订单应付总金额",
              "订单实付总金额",
              "积分支付总额",
              "其他支付总额",
              "对账状态"
            ];
            const filterVal = [
              "orderCreateDate",
              "dateMark",
              "businessName",
              "orderNumber",
              "createDate",
              "receiptType",
              "orderAmountPlan",
              "orderAmount",
              "orderIntegral",
              "orderNotIntegral",
              "status"
            ];
            const list = this.multipleSelection;
            const data = this.formatJson(filterVal, list);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: "商户订单入款明细" + new Date().toLocaleDateString()
            });
            this.downloadLoading = false;
          });
        } else {
          let token = Auth.getToken();
          this.search.Authorization = token;
          let params = Utils.obj2Param(this.search);
          this.downloadLoading = false;
          MerchantsOrderService.exportExcel(params);
        }
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

<style lang="less">
  .search-btn {
    margin-left: 50px;
  }
</style>
