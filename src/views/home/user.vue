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
                v-model="search.date"
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
        <el-col :span="23" :offset="1">
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
        @pagination="getUsers"
      />
    </div>
  </div>
</template>
<script>
  import { HomeService } from "@/service";
  // import { Utils } from "@/common";
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
    { label: "3月", value: 3 },
    { label: "4月", value: 4 },
    { label: "5月", value: 5 },
    { label: "6月", value: 6 },
    { label: "7月", value: 7 },
    { label: "8月", value: 8 },
    { label: "9月", value: 9 },
    { label: "10月", value: 10 },
    { label: "11月", value: 11 },
    { label: "12月", value: 12 }
  ];
  export default {
    name: "User",
    data() {
      return {
        search: {
          // 列表筛选
          date: "", // 搜索日期
          pageNum: 1,
          pageSize: 20,
        },
        listLoading: false,
        title,
        list:[],
        total: 0,
        tabs,
      };
    },
    created() {
      // this.getUsers();
    },
    methods: {
      // 获取列表数据
      async getUsers() {
        this.listLoading = true;
        const { data } = await getUsers.getUsers(this.search);
        this.listLoading = false;
        console.log(data)
        // this.list = format(data.list);
        // this.total = data.total;
      },
      // 搜索订单
      searchUser() {
        if (this.createDate) {
          // 判断有没有选择下单时间，有的话格式化时间并添加到search对象下
          Object.assign(this.search, {
            startOrderDate: Utils.formatTime(this.createDate[0]),
            endOrderDate: Utils.formatTime(this.createDate[1])
          });
        }
        // this.getList();
      },
    }
  };
</script>

<style lang="less">
</style>
