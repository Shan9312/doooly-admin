<template>
  <div class="user app-container">
    <div class="user-form">
      <el-form
        label-position="left"
        :inline="true"
        :model="search"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="11" :offset="1">
            <el-form-item label="自定义日期查询">
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
            <el-form-item>
              <el-button type="primary" @click="searchUser">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="user-table">
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
        ref="multipleTable"
        v-loading="listLoading"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item, index) in title"
          :min-width="item.width"
          align="center"
          :prop="item.value"
          :label="item.label"
        >
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

  // 快捷查询按钮
  const tabs = [
    { label: "1月", value: 1 },
    { label: "2月", value: 2 },
    { label: "3月", value: 3 }
  ];
  export default {
    name: "User",
    data() {
      return {
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
        tabs,
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
          window.location.href = `/api/reconciliInfo/exportExcel?${params}`
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
