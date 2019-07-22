<template>
  <div class="state-tag-wrapper">
    <span v-for="item in orderStateList" :key="item.value">
      <span v-if="item.value == payType">{{item.label}}</span>
    </span>
  </div>
</template>

<script>
// 回收订单
const orderStateList = [
  { label: "定向积分", value: "3" },
  { label: "兜礼积分", value: "0" },
  { label: "微信", value: "1" },
  { label: "支付宝", value: "6" },
  { label: "云支付", value: "14" },
  { label: "建行龙支付", value: "15" },
  { label: "微信积分混合", value: "2" },
  { label: "支付宝积分混合", value: "11" },
  { label: "云支付积分混合", value: "17" },
  { label: "建行龙积分混合", value: "16" },
  { label: "支付失败", value: "-1" }
];

export default {
  name: "order-state",
  data() {
    return {
      orderStateList
    };
  },
  props: {
    payType: {
      required: true
    }
  }
};
</script>

