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
import { RecycleGoodsService } from "@/service";
import { Message } from "element-ui";

export default {
  name: "confirm-dialog",
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  created() {},
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },

    // 回款弹窗
    async handleConfirm() {
      const res = await RecycleGoodsService.recycleConfirmOrder(this.userInfo);
      this.dialogVisible = false;
      if (res.data == "SUCCESS") {
        Message({
          message: res.info,
          type: "success",
          duration: 2 * 1000
        });
        this.$emit("handleGetList", true);
      } else {
        Message({
          message: res.info,
          type: "error",
          duration: 2 * 1000
        });
      }
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

