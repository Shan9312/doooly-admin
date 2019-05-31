<template>
  <div>
    <!-- 确认回款 -->
    <div>
      <el-dialog title="确认回款" :visible.sync="dialogVisible" width="30%" center class="confirm-box">
        <span class="dialog-text">请再次确认是否汇款</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "confirm-dialog",
  props: {
    dialogVisible: {
      require: true,
      type: Boolean
    }
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    handleClose() {
      this.$emit("handleClose", false);
    },
    handleConfirm() {
      this.$emit("handleConfirm", false);
    }
  }
};
</script>

<style lang="less" scoped>
.confirm-box {
  text-align: center;
  .dialog-text {
    font-size: 1.1rem;
  }
}
</style>

