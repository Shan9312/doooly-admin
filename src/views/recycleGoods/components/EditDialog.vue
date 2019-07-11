<template>
  <div>
    <el-dialog title="修改回收信息" :visible.sync="dialogVisibleEdit" width="30%" center>
      <el-form :model="forms" key="form2" :rules="rules" ref="ruleForm">
        <el-form-item label="支付宝姓名" label-width="100px" prop="alipayName">
          <el-input v-model="forms.alipayName" maxlength="10" clearable></el-input>
        </el-form-item>
        <el-form-item label="支付宝账号" label-width="100px" prop="alipayAccount">
          <el-input v-model="forms.alipayAccount" maxlength="20" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleEditUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Validate } from "@/common";
import { RecycleGoodsService } from "@/service";
import { Message } from "element-ui";

export default {
  name: "edit-dialog",
  props: {
    userInfo: {
      type: Object
    },
    isDetailPage: {
      type: Boolean
    }
  },
  data() {
    return {
      rules: {
        alipayName: [
          {
            validator: Validate.alipayNameVaild,
            required: true,
            trigger: "change"
          }
        ],
        alipayAccount: [
          {
            validator: Validate.alipayVaild,
            required: true,
            trigger: "change"
          }
        ]
      },
      forms: {
        alipayName: "",
        alipayAccount: ""
      },
      dialogVisibleEdit: false
    };
  },
  created() {},
  methods: {
    // 确认 修改回复信息
    handleEditUserInfo() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.sendUserInfo();
        } else {
          Message({
            message: "请填写付款信息",
            type: "warning",
            duration: 2 * 1000
          });
          return;
        }
      });
    },
    async sendUserInfo() {
      const obj = Object.assign(this.userInfo, this.forms);
      const res = await RecycleGoodsService.recycleEditOrder(obj);
      this.dialogVisibleEdit = false;
      if (res.data == "SUCCESS") {
        this.forms = {
          alipayName: "",
          alipayAccount: ""
        };
        Message({
          message: res.info,
          type: "success",
          duration: 2 * 1000
        });
        if (this.isDetailPage) {
          this.$emit("handleGetDeiatil", true);
          return;
        }
        this.$router.push({
          path: `/recycleGoods/orderDetail/${this.userInfo.orderNumber}`
        });
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
</style>

