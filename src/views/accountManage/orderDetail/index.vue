<template>
  <div class="order-detail app-container" v-loading="loading">
    <el-row>
      <el-col :span="24">
        <span>订单详情页（订单编号：{{ params.orderNumber }}）</span>
        <span v-if="params.returnOrderNumber"
          >——退款单号：{{ params.returnOrderNumber }}</span
        >
      </el-col>
    </el-row>
    <!-- 基础信息 -->
    <div class="basis-info">
      <div><h4>基础信息</h4></div>
      <el-row>
        <el-col :span="10" :offset="2"
          >所属企业：{{
            orderDetail.group ? orderDetail.group.groupName : "无"
          }}</el-col
        >
        <el-col :span="10" :offset="2"
          >手机号码：{{
            orderDetail.user ? orderDetail.user.telephone : "无"
          }}</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2"
          >会员id：{{
            orderDetail.user ? orderDetail.user.cardNumber : "无"
          }}</el-col
        >
        <el-col :span="10" :offset="2"
          >供应商名称：{{
            orderDetail.business ? orderDetail.business.company : "无"
          }}</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2"
          >会员姓名：{{
            orderDetail.user ? orderDetail.user.name : "无"
          }}</el-col
        >
        <el-col :span="10" :offset="2"
          >门店名称：{{
            orderDetail.businessStore
              ? orderDetail.businessStore.storeName
              : "无"
          }}</el-col
        >
      </el-row>
    </div>
    <!-- 订单信息 -->
    <div class="order-info">
      <div><h4>订单信息</h4></div>
      <el-row>
        <el-col :span="10" :offset="2"
          >订单编号：{{
            orderDetail.orderReport ? orderDetail.orderReport.orderNumber : "无"
          }}</el-col
        >
        <el-col :span="10" :offset="2"
          >订单下单时间：{{
            Utils.formatTime(
              orderDetail.orderReport ? orderDetail.orderReport.orderDate : "无"
            )
          }}</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2"
          >付款总金额：{{
            orderDetail.orderReport ? orderDetail.orderReport.totalMount : "0"
          }}元
          <span v-if="params.returnOrderNumber"
            >（另手续费：{{ orderDetail.orderServiceCharge }}积分）</span
          >
        </el-col>
        <el-col :span="10" :offset="2"
          >订单状态：{{ orderDetail.orderReport.state | formatState }}</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2"
          >收款类型：{{ query.receiptType || "无" }}</el-col
        >
        <el-col :span="10" :offset="2"
          >支付方式：{{ orderDetail.order | formatApplyType }}</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">
          积分支付总额：{{ orderDetail.orderIntegral}}元
          <span v-if="params.returnOrderNumber">（另手续费：{{ orderDetail.orderServiceCharge }}积分）</span>
        </el-col>
        <el-col :span="10" :offset="2"
          >非积分支付总额：{{ orderDetail.orderNotIntegral}}元</el-col
        >
      </el-row>
    </div>
    <!-- 支付流水信息 -->
    <div class="flow-info">
      <div><h4>支付流水信息</h4></div>
      <el-row>
        <el-col :span="10" :offset="2" class="integral-flow">
          <div>积分流水号：</div>
          <div v-if="orderDetail.orderFlow.length > 0">
            <div
              v-if="item.payType == 0"
              v-for="(item, index) in orderDetail.orderFlow"
              :key="index"
            >
              {{ item.serialNumber }}
            </div>
          </div>
          <div v-else>无</div>
        </el-col>
        <el-col :span="10" :offset="2"
          >积分流水支付总额：{{
            orderDetail.orderFlow | integralTotal
          }}元
            <span v-if="params.returnOrderNumber">（另手续费：{{orderDetail.orderServiceCharge}}积分）</span>
          </el-col
        >
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2" class="notIntegral-flow">
          <div class="notIntegral-flow-title">非积分流水号：</div>
          <div v-if="orderDetail.orderFlow.length > 0">
            <div
              class="notIntegral-flow-list"
              v-if="item.payType != 0"
              v-for="(item, index) in orderDetail.orderFlow"
              :key="index"
            >
              {{ item.serialNumber }}
            </div>
          </div>
          <div v-else>无</div>
        </el-col>
        <el-col :span="10" :offset="2"
          >非积分流水支付总额：{{
            orderDetail.orderFlow | integralNotTotal
          }}元</el-col
        >
      </el-row>
    </div>
    <!-- 退款信息 -->
    <div v-if="params.returnOrderNumber">
      <h4>
        退款信息（退货单号：{{ orderDetail.returnInfo.returnFlowNumber }}）
      </h4>
      <el-row>
        <el-col :span="10" :offset="2"
          >订单退款总金额：{{
            orderDetail.returnInfo
              ? orderDetail.returnInfo.returnTotalAmount + '元'
              : "无"
          }}</el-col
        >
        <el-col :span="10" :offset="2"
          >手续费退款总金额：{{
            orderDetail.returnInfo ? orderDetail.returnInfo.serviceCharge + '积分' : "无"
          }}</el-col
        >
      </el-row>
      <el-row class="flow-info">
        <el-col :span="10" :offset="2" class="integral-flow">
          <div>积分退款流水号：</div>
          <div
            v-if="
              orderDetail.returnInfo.integralReturnFlows &&
                orderDetail.returnInfo.integralReturnFlows.length > 0
            "
          >
            <div
              v-for="(item, index) in orderDetail.returnInfo
                .integralReturnFlows"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
          <div v-else>无</div>
        </el-col>
        <el-col :span="10" :offset="2"
          >积分退款总额：{{
            orderDetail.returnInfo
              ? `${orderDetail.returnInfo.integralReturnAmount}元（另手续费退款：${orderDetail.returnInfo.serviceCharge}积分）`
              : "无"
          }}</el-col
        >
      </el-row>
      <el-row class="flow-info">
        <el-col :span="10" :offset="2" class="notIntegral-flow">
          <div>非积分退款流水号：</div>
          <div
            v-if="
              orderDetail.returnInfo.notIntegralReturnFlows &&
                orderDetail.returnInfo.notIntegralReturnFlows.length > 0
            "
          >
            <div
              v-for="(item, index) in orderDetail.returnInfo
                .notIntegralReturnFlows"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
          <div v-else>无</div>
        </el-col>
        <el-col :span="10" :offset="2"
          >非积分退款总额：{{
            orderDetail.returnInfo
              ? orderDetail.returnInfo.notIntegralReturnAmount + '元'
              : "无"
          }}</el-col
        >
      </el-row>
    </div>
    <!-- 订单商品明细 -->
    <div class="goods-detail">
      <div><h4>订单商品明细</h4></div>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-table :data="params.returnOrderNumber ? orderDetail.returnInfo.returnDetails : orderDetail.orderDetail" border style="width: 100%">
            <el-table-column prop="categoryId" label="品类编号" width="180">
            </el-table-column>
            <el-table-column prop="code" label="商品编号" width="180">
            </el-table-column>
            <el-table-column prop="goods" label="商品名称"> </el-table-column>
            <el-table-column prop="tax" label="税率（%）"> </el-table-column>
            <el-table-column prop="number" label="数量"> </el-table-column>
            <el-table-column prop="price" label="应付金额"> </el-table-column>
            <el-table-column prop="amount" label="实付金额"> </el-table-column>
          </el-table>
          <div class="coll-total">
            <div>
              应收款合计：<span>{{ shouldReceipt }}元</span> <span v-if="params.returnOrderNumber">（另手续费退款：{{orderDetail.returnInfo.serviceCharge}}积分）</span>
            </div>
            <div>
              实收款合计：<span>{{ realityReceipt }}元</span> <span v-if="params.returnOrderNumber">（另手续费退款：{{orderDetail.returnInfo.serviceCharge}}积分）</span>
            </div>
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
          orderIntegral: '',
          orderNotIntegral: '',
          businessStore: {},
          group: {},
          order: {},
          orderDetail: [],
          orderFlow: {},
          orderReport: {},
          orderServiceCharge: '',
          returnInfo: {},
          user: {}
        }
      };
    },
    created() {
      let { storeId } = this.$route.query;
      let { returnOrderNumber } = this.$route.params; // 退款订单
      if (returnOrderNumber == "null") {
        delete this.$route.params.returnOrderNumber;
      }
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
        if (
          this.orderDetail.orderDetail &&
          this.orderDetail.orderDetail.length > 0
        ) {
          this.orderDetail.orderDetail.map(item => {
            price += item.price;
          });
        }
        return price.toFixed(2);
      },
      // 计算订单商品明细实收款总额
      realityReceipt() {
        let price = 0;
        if (
          this.orderDetail.orderDetail &&
          this.orderDetail.orderDetail.length > 0
        ) {
          this.orderDetail.orderDetail.map(item => {
            price += item.amount;
          });
        }
        return price.toFixed(2);
      }
    },
    filters: {
      // 格式化订单状态
      formatState(value) {
        if (!value) return "";
        switch (value) {
          case "0":
            return "未完成";
          case "1":
            return "已完成";
          default:
            return "无";
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
              number += item.amount;
            }
          });
        }
        return number ? number : "0";
      },

      // 计算非积分流水支付总额
      integralNotTotal(data) {
        let number = 0;
        if (data && data.length > 0) {
          data.map(item => {
            if (item.payType != 0) {
              number += item.amount;
            }
          });
        }
        return number ? number : "0";
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
