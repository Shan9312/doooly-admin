<template>
  <div class="order-detail-wapper">
    <!-- 订单详情 -->
    <div>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">订单编号:</el-col>
            <el-col :span="18">{{ orderObj.orderNumber }}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">产品名称:</el-col>
            <el-col :span="18">{{ orderObj.productName }}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">订单日期:</el-col>
            <el-col :span="18">{{ orderObj.orderTime }}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">规格:</el-col>
            <el-col :span="18">{{ orderObj.productSpecification }}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">会员卡号:</el-col>
            <el-col :span="18">{{ orderObj.cardNumber }}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">数量:</el-col>
            <el-col :span="18">{{ orderObj.productNum }}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">订单状态:</el-col>
            <el-col :span="18">
              <order-state :orderState="orderObj.orderState"></order-state>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">支付宝姓名:</el-col>
            <el-col :span="18">
              <div
                @click="handleClickWatch(orderObj.alipayName, '1')"
                class="hidden-btn"
              >
                <span v-if="!isHiddenObj.isShowAlipayName">{{
                  orderObj.alipayName ? "******" : orderObj.alipayName
                }}</span>
                <span v-else>{{ orderObj.alipayName }}</span>
              </div>
              <kt-button
                label="修改付款信息"
                class="btn"
                perms="recycle:orderDetail:edit"
                v-if="
                  orderObj.orderState != '5' && orderObj.recoveryState == '3'
                "
                @click="handleChildEdit"
              />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">所属企业:</el-col>
            <el-col :span="18">{{ orderObj.groupName }}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">支付宝账号:</el-col>
            <el-col :span="18">
              <div
                @click="handleClickWatch(orderObj.alipayAccount, '2')"
                class="hidden-btn"
              >
                <span v-if="!isHiddenObj.isShowAlipayAccount">{{
                  orderObj.alipayAccount ? "******" : orderObj.alipayAccount
                }}</span>
                <span v-else>{{ orderObj.alipayAccount }}</span>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">商家名称:</el-col>
            <el-col :span="18">{{ orderObj.businessName }}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">购买人手机号:</el-col>
            <el-col :span="18">
              <div
                @click="handleClickWatch(orderObj.userPhone, '3')"
                class="hidden-btn"
              >
                <span v-if="!isHiddenObj.isShowUserPhone">{{
                  orderObj.userPhone ? "******" : orderObj.userPhone
                }}</span>
                <span v-else>{{ orderObj.userPhone }}</span>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">销售金额:</el-col>
            <el-col :span="18">{{ orderObj.sellPrice | fixedNum }}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">购买人姓名:</el-col>
            <el-col :span="18">
              <div
                @click="handleClickWatch(orderObj.userName, '4')"
                class="hidden-btn"
              >
                <span v-if="!isHiddenObj.isShowUserName">{{
                  orderObj.userName ? "******" : orderObj.userName
                }}</span>
                <span v-else>{{ orderObj.userName }}</span>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">供货金额:</el-col>
            <el-col :span="18">{{ orderObj.supplyPrice | fixedNum }}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">回收状态:</el-col>
            <el-col :span="18">
              <recycle-state
                :recoveryState="orderObj.recoveryState"
                @click="handleChildConfirm"
              ></recycle-state>
              <el-button
                class="btn"
                v-if="
                  orderObj.orderState != '5' && orderObj.recoveryState == '3'
                "
                @click="handleChildConfirm"
                >确认回款</el-button
              >
              <kt-button
                label="确认回款"
                class="btn"
                perms="recycle:orderDetail:confirm"
                v-if="
                  orderObj.orderState != '5' && orderObj.recoveryState == '3'
                "
                @click="handleChildConfirm"
              />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">实付总金额:</el-col>
            <el-col :span="18">{{ orderObj.actualPrice | fixedNum }}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <!-- 返回按钮 -->
          <router-link :to="{ path: '/recycleGoods/orderManage/orderList' }">
            <el-button type="primary" plain class="btn">返回</el-button>
          </router-link>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">回收发起时间:</el-col>
            <el-col :span="18">{{ orderObj.recoveryTime }}</el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <!-- 弹窗 start-->
    <!-- 修改回复信息 -->
    <edit-dialog
      :userInfo="userInfo"
      ref="dialogEditChild"
      :isDetailPage="true"
      @handleGetDeiatil="handleGetList"
    ></edit-dialog>
    <!-- 确认回款 -->
    <confirm-dialog
      @handleGetList="handleGetList"
      :userInfo="userInfo"
      ref="dialogConfirmChild"
    ></confirm-dialog>
  </div>
</template>

<script>
  import { RecycleGoodsService } from "@/service";
  import RecycleState from "../components/RecycleState.vue";
  import OrderState from "../components/OrderState.vue";
  import ConfirmDialog from "../components/ConfirmDialog";
  import EditDialog from "../components/EditDialog";
  import { Message } from "element-ui";

  export default {
    name: "OrderDetail",
    components: {
      RecycleState,
      OrderState,
      ConfirmDialog,
      EditDialog
    },
    filters: {
      fixedNum(num) {
        if (!num) return 0;
        return Number(num).toFixed(2);
      }
    },
    data() {
      return {
        orderObj: {
          recoveryTime: "",
          orderNumber: ""
        },
        userInfo: {
          userId: this.$store.state.user.userInfo.name,
          orderNumber: this.$route.params.id
        },
        isHiddenObj: {
          isShowAlipayName: false,
          isShowAlipayAccount: false,
          isShowUserPhone: false,
          isShowUserName: false
        }
      };
    },
    created() {
      this.getOrderDetails();
    },
    methods: {
      // 点击查看隐藏的数字
      handleClickWatch(value, type) {
        if (value) {
          switch (type) {
            case "1":
              this.isHiddenObj.isShowAlipayName = !this.isHiddenObj
                .isShowAlipayName;
              break;
            case "2":
              this.isHiddenObj.isShowAlipayAccount = !this.isHiddenObj
                .isShowAlipayAccount;
              break;
            case "3":
              this.isHiddenObj.isShowUserPhone = !this.isHiddenObj
                .isShowUserPhone;
              break;
            case "4":
              this.isHiddenObj.isShowUserName = !this.isHiddenObj.isShowUserName;
              break;
          }
        }
      },

      // 查询订单详情
      async getOrderDetails() {
        const { data } = await RecycleGoodsService.recycleGoodsDetail({
          orderNumber: this.userInfo.orderNumber
        });
        this.orderObj = data;
        this.isHiddenObj = {
          isShowAlipayName: false,
          isShowAlipayAccount: false,
          isShowUserPhone: false,
          isShowUserName: false
        };
      },

      // 弹出确认按钮
      handleChildConfirm() {
        this.$refs.dialogConfirmChild.dialogVisible = true;
      },
      handleChildEdit() {
        this.$refs.dialogEditChild.dialogVisibleEdit = true;
      },
      handleGetList(v) {
        if (v) this.getOrderDetails();
      }
    }
  };
</script>

<style lang="less" scoped>
  .order-detail-wapper {
    .detail-row {
      margin-bottom: 2.5rem;
    }
    .btn {
      vertical-align: top;
      margin-left: 0.5rem;
      margin-top: -0.7rem;
    }
    .hidden-btn {
      cursor: pointer;
      display: inline-block;
    }
  }
</style>