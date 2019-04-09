<template>
  <div class="order-detail app-container" v-loading="loading">
    <el-row>
      <el-col :span="24"
        >订单详情页（订单编号：{{ params.orderNumber }}）</el-col
      >
    </el-row>
    <!-- 基础信息 -->
    <div class="basis-info">
      <div><h4>基础信息</h4></div>
      <el-row>
        <el-col :span="10" :offset="2"
          >所属企业：{{
            orderDetail.group ? orderDetail.group.groupName : ""
          }}</el-col
        >
        <el-col :span="10" :offset="2"
          >手机号码：{{
            orderDetail.user ? orderDetail.user.telephone : ""
          }}</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2"
          >会员id：{{
            orderDetail.user ? orderDetail.user.cardNumber : ""
          }}</el-col
        >
        <el-col :span="10" :offset="2"
          >供应商名称：{{
            orderDetail.business ? orderDetail.business.company : ""
          }}</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2"
          >会员姓名：{{ orderDetail.user ? orderDetail.user.name : "" }}</el-col
        >
        <el-col :span="10" :offset="2"
          >门店名称：{{
            orderDetail.businessStore ? orderDetail.businessStore.storeName : ""
          }}</el-col
        >
      </el-row>
    </div>
    <!-- 订单信息 -->
    <div class="order-info">
      <div><h4>订单信息</h4></div>
      <el-row>
        <el-col :span="10" :offset="2"
          >订单编号：{{ orderDetail.orderReport ? orderDetail.orderReport.orderNumber : '' }}</el-col
        >
        <el-col :span="10" :offset="2"
          >订单下单时间：{{
            Utils.formatTime(orderDetail.orderReport ? orderDetail.orderReport.orderDate : '')
          }}</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2"
          >付款总金额：{{ orderDetail.orderReport ? orderDetail.orderReport.totalMount : '' }}元</el-col
        >
        <el-col :span="10" :offset="2"
          >订单状态：{{ orderDetail.orderReport.state | formatState }}</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2"
          >收款类型：{{ query.receiptType }}</el-col
        >
        <el-col :span="10" :offset="2"
          >支付方式：{{ orderDetail.order | formatApplyType }}</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2"
          >积分支付总额：{{ query.orderIntegral }}元</el-col
        >
        <el-col :span="10" :offset="2"
          >非积分支付总额：{{ query.orderNotIntegral }}元</el-col
        >
      </el-row>
    </div>
    <!-- 支付流水信息 -->
    <div class="flow-info">
      <div><h4>支付流水信息</h4></div>
      <el-row>
        <el-col :span="10" :offset="2">
          <div>积分流水号：</div>
          <div v-if="item.payType == 0" v-for="item in orderDetail.orderFlow">
            {{ item.id }}
          </div>
        </el-col>
        <el-col :span="10" :offset="2"
          >积分流水支付总额：{{ orderDetail.orderFlow | integralTotal }}</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">
          <div>非积分流水号：</div>
          <div v-if="item.payType != 0" v-for="item in orderDetail.orderFlow">
            {{ item.id }}
          </div>
        </el-col>
        <el-col :span="10" :offset="2"
          >非积分流水支付总额：{{
            orderDetail.orderFlow | integralNotTotal
          }}</el-col
        >
      </el-row>
    </div>
    <!-- 订单商品明细 -->
    <div class="goods-detail">
      <div><h4>订单商品明细</h4></div>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-table :data="orderDetail.orderDetail" border style="width: 100%">
            <el-table-column prop="categoryId" label="品类编号" width="180">
            </el-table-column>
            <el-table-column prop="code" label="商品编号" width="180">
            </el-table-column>
            <el-table-column prop="goods" label="商品名称"> </el-table-column>
            <el-table-column prop="address" label="税率（%）">
            </el-table-column>
            <el-table-column prop="number" label="数量"> </el-table-column>
            <el-table-column prop="price" label="应付金额"> </el-table-column>
            <el-table-column prop="amount" label="实付金额"> </el-table-column>
          </el-table>
          <div class="coll-total">
            <div class="">应收款合计：<span>{{shouldReceipt}}</span></div>
            <div>实收款合计：<span>{{realityReceipt}}</span></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import { OrderDetailService } from "@/service";
  import { Utils } from "@/common";
  export default {
    name: "OrderDetail",
    data() {
      return {
        params: null, // 路由参数
        query: null, // url参数
        Utils, // 格式化时间
        loading: true,
        orderDetail: {
          // 订单详情
          business: {},
          businessStore: {},
          group: {},
          order: {},
          orderDetail: [],
          orderFlow: {},
          orderReport: {},
          user: {}
        }
      };
    },
    created() {
      let { storeId } = this.$route.query;
      this.params = Object.assign({ storesId: storeId }, this.$route.params);
      this.query = Object.assign({}, this.$route.query);
      this.getOrderDetail();
    },
    methods: {
      // 获取订单详情
      async getOrderDetail() {
        const { data } = await OrderDetailService.getOrderDetail(this.params);
        this.loading = false;
        this.orderDetail = data;
      }
    },
    computed: {
      // 计算订单商品明细应收款总额
      shouldReceipt() {
        let price = 0;
        if (this.orderDetail.orderDetail && this.orderDetail.orderDetail.length > 0) {
          this.orderDetail.orderDetail.map(item => {
            price += item.price;
          })
        }
        return price
      },
      // 计算订单商品明细实收款总额
      realityReceipt() {
        let price = 0;
        if (this.orderDetail.orderDetail && this.orderDetail.orderDetail.length > 0) {
          this.orderDetail.orderDetail.map(item => {
            price += item.amount;
          })
        }
        return price
      }
    },
    filters: {
      // 格式化订单状态
      formatState(value) {
        if (!value) return "";
        switch (value) {
          case "1":
            return "系统成功";
          case "2":
            return "财务确认";
          case "3":
            return "金额不一致";
          case "4":
            return "订单缺失";
          case "5":
            return "流水缺失";
          default:
            return "";
        }
      },
      // 格式化支付方式
      formatApplyType(value) {
        let list = [];
        if (value && value.length > 0) {
          value.map(item => {
            switch (item.paytype) {
              case 0:
                list = [...list, "积分"];
                break;
              case 1:
                list = [...list, "非积分"];
                break;
              case 2:
                list = [...list, "现金"];
                break;
              case 3:
                list = [...list, "微信"];
                break;
              case 4:
                list = [...list, "银行卡"];
                break;
              case 5:
                list = [...list, "商家积分"];
                break;
              case 6:
                list = [...list, "支付宝"];
                break;
              case 7:
                list = [...list, "京东"];
                break;
              case 8:
                list = [...list, "唯品"];
                break;
              case 9:
                list = [...list, "其他"];
                break;
              default:
                break;
            }
          });
          return Array.from(new Set(list)).join("+");
        }
      },

      // 计算积分流水支付总额
      integralTotal(data) {
        let number = 0;
        if (data && data.length > 0) {
          data.map(item => {
            if (item.payType == 0) {
              number += item.amount
            }
          });
        }
        return number;
      },

      // 计算非积分流水支付总额
      integralNotTotal(data) {
        let number = 0;
        if (data && data.length > 0) {
          data.map(item => {
            if (item.payType != 0) {
              number += item.amount
            }
          });
        }
        return number ? number : '';
      }
    }
  };
</script>

<style lang="less">
  .order-detail {
    font-size: 14px;
    color: #909399;
    .basis-info,
    .order-info,
    .flow-info {
      line-height: 28px;
    }
    .flow-info .el-col {
      display: flex;
    }
    .el-row {
      color: #666;
    }
    .coll-total {
      float: right;
      color: #666;
      margin: 20px;
      line-height: 40px;
    }
  }
</style>
