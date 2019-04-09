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
          <el-col :span="6" :offset="1">
            <el-form-item label="商户名称">
              <el-input
                style="width: 100%"
                v-model="search.businessName"
                placeholder="请输入商户名称"
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
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
            <el-form-item label="订单编号">
              <el-input
                style="width: 100%"
                v-model="search.orderNumber"
                placeholder="请输入订单编号"
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="1">
            <el-form-item label="收款类型">
              <el-select
                style="width: 120px;"
                v-model="search.receiptType"
                placeholder="请选择"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="平台收款" value="0"></el-option>
                <el-option label="非平台收款" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="对账状态">
              <el-select
                style="width: 120px;"
                v-model="search.state"
                placeholder="请选择"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="系统成功" value="1"></el-option>
                <el-option label="财务确认" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
                >导出订单明细</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="order-table">
      <el-table
        :data="list"
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
          :min-width="item.width"
          align="center"
          :prop="item.value"
          :label="item.label"
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
                  scope.row.receiptType
                }&orderIntegral=${scope.row.orderIntegral}&orderNotIntegral=${
                  scope.row.orderNotIntegral
                }`
              "
              v-if="item.value == 'orderNumber'"
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
  import { MerchantsOrder } from "@/service";
  import { Utils } from "@/common";
  const title = [
    // 表格title
    { label: "商户名称", value: "businessName", width: "80px" },
    { label: "订单编号", value: "orderNumber", width: "180px" },
    { label: "下单时间", value: "createDate", width: "160px" },
    { label: "收款类型", value: "receiptType", width: "100px" },
    { label: "订单应付总金额", value: "orderAmountPlan", width: "100px" },
    { label: "订单实付总金额", value: "orderAmount", width: "100px" },
    { label: "积分支付总额", value: "orderIntegral", width: "100px" },
    { label: "其他支付总额", value: "orderNotIntegral", width: "100px" },
    { label: "对账状态", value: "status", width: "100px" }
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
      list.push(item);
    });
    return list;
  };
  export default {
    name: "MerchantsOrder",
    data() {
      return {
        pickerOptions: {
          // 设置日期范围
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          }
        },
        createDate: "", // 筛选条件v-model绑定的下单时间
        search: {
          // 列表筛选
          startOrderDate: "", // 下单开始日期
          endOrderDate: "", // 下单结束日期
          businessName: "", // 商户名称
          orderNumber: "", // 订单编号
          state: "", // 对账状态
          receiptType: "", // 收款类型
          pageNum: 1, // 分页
          pageSize: 20 // 每页显示的条数
        },
        downloadLoading: false, // 导出excel按钮loading
        createDate: "", // 下单时间
        list: [], // 表格数据
        total: 0, // 返回的列表总数
        listLoading: false, // table列表加载的loading
        title, // 表格的title
        multipleSelection: [], // 选中的数据
        getRowKey(row) {
          return row.id;
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 获取列表数据
      async getList() {
        this.listLoading = true;
        const { data } = await MerchantsOrder.orderList(this.search);
        this.listLoading = false;
        this.list = format(data.list);
        this.total = data.total;
      },
      // 搜索订单
      searchOrder() {
        if (this.createDate) {
          // 判断有没有选择下单时间，有的话格式化时间并添加到search对象下
          Object.assign(this.search, {
            startOrderDate: Utils.formatTime(this.createDate[0]),
            endOrderDate: Utils.formatTime(this.createDate[1])
          });
        }
        this.getList();
      },

      // 重置
      reset() {
        this.createDate = "";
        this.search = {
          // 列表筛选
          startOrderDate: "", // 下单开始日期
          endOrderDate: "", // 下单结束日期
          businessName: "", // 商户名称
          orderNumber: "", // 订单编号
          state: "", // 对账状态
          receiptType: "", // 收款类型
          pageNum: 1, // 分页
          pageSize: 20 // 每页显示的条数
        };
        this.getList();
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      // 禁止输入特殊字符
      onKeyup(e) {
        e.target.value = e.target.value.replace(/[!~@#$%*&()_+\s^]/g, '')
      },

      // 导出
      handleDownload() {
        this.downloadLoading = true;
        if (this.multipleSelection.length > 0) {
          import("@/vendor/Export2Excel").then(excel => {
            const tHeader = [
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
          let params = Utils.obj2Param(this.search)
          this.downloadLoading = false;
          window.location.href = `http://39.98.195.15/api/pro_reconcili/reconciliInfo/exportExcel?${params}`
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
</style>
