<template>
  <div class="channel-warrpe app-container">
    <el-button type="success" plain>新增白名单手机号</el-button>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="请输入白名单手机号" prop="testerTel">
            <el-input v-model="ruleForm.testerTel"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleGetPhoneCode">生成白名单</el-button>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="手机号" prop="testerTel">
            <el-input v-model="ruleForm.testerTel"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleGetPhoneCode">生成验证码</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="验证码值:">
            <div>{{code}}</div>
          </el-form-item>
        </el-col>
      </el-row>-->
    </el-form>
  </div>
</template>

<script>
import { MobileCodeService } from "@/service";

export default {
  name: "generat",
  data() {
    return {
      rules: {
        testerTel: [
          { required: true, message: "请输入手机号", trigger: "blur" }
        ]
      },
      ruleForm: {
        bizId: "6",
        codeType: "GENERAL",
        testerTel: "18362390862"
      },
      code: "702831"
    };
  },
  created() {},
  methods: {
    // 点击手动生成二维码
    async handleGetPhoneCode() {
      const data = await MobileCodeService.handleGetCode(
        this.ruleForm.bizId,
        this.ruleForm.codeType,
        this.ruleForm.testerTel
      );
      console.dir(data);
    }
  }
};
</script>

<style lang="less" scoped>
</style>