<template>
  <div class="state-tag-wrapper">
    <span v-if="recoveryState == '1'" class="gray">未回收</span>
    <span v-if="recoveryState == '2'" class="success">已回收</span>
    <span v-if="recoveryState == '3'" class="default">未返款</span>
    <span v-if="recoveryState == '4'" class="green">已返款</span>
  </div>
</template>

<script>
export default {
  name: "state-tag-ui",
  data() {
    return {};
  },
  props: {
    recoveryState: {
      required: true
    }
  }
};
</script>

<style lang="less" scoped>
.state-tag-wrapper {
  .default {
    color: #909399;
  }
  .success {
    color: #409eff;
  }
  .green {
    color: #1ac062;
  }
  .gray {
    color: #ff9900;
  }
}
</style>


