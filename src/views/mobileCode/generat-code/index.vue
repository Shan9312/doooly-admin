<template>
  <div class="channel-warrpe app-container">
    <el-button type="success" plain class="top-btn" @click="dialogVisibleAdd = true">新增白名单</el-button>

    <!-- 模糊查询暂无 -->
    <section class="form-box">
      <el-form ref="formObj" :model="formObj" :inline="true" key="form1">
        <el-row :span="24">
          <el-col :span="6">
            <el-form-item label="手机号">
              <el-input
                style="width: 100%"
                v-model="formObj.tel"
                placeholder="请输入手机号"
                maxlength="40"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <pe-button
              label="查询"
              perms="recycle:order:search"
              type="primary"
              @click="haneldeGetWhiteTel(formObj.tel)"
            />
          </el-col>
        </el-row>
      </el-form>
    </section>
    <!-- 列表 -->
    <section class="table-box">
      <div>
        <el-table border :data="list" v-loading="listLoading" style="width: 100%">
          <el-table-column
            v-for="(item, index) in title"
            :key="index"
            :min-width="item.width"
            align="center"
            :prop="item.value"
            :label="item.label"
          >
            <template slot-scope="scope">
              <div>
                <span v-if="item.value == 'tel'">{{scope.row['tel']}}</span>
                <span v-if="item.value == 'operat'">
                  <el-button @click="handleClickTel(scope.row.tel)" type="text">手动生成验证码</el-button>
                  <el-button @click="handleDel(scope.row)" type="text">删除</el-button>
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page-sizes="[5,10,15,20]"
          :page.sync="formObj.page"
          :limit.sync="formObj.limit"
        />
      </div>
    </section>
    <!-- 生成验证码 -->
    <section>
      <div v-if="userObj && userObj.code >0" style="margin-top:20px;">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">手机号:{{userObj.tel}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">商户号:{{userObj.bizId}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:20px;">
          <el-col :span="8">
            <div class="grid-content bg-purple">验证码:{{userObj.code}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">类型:{{userObj.type =='GENERAL'? '通用验证码':'支付验证码'}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:20px;">
          <el-col :span="4">
            <div class="grid-content bg-purple">有效时间:{{timer}}秒</div>
          </el-col>
          <el-col :span="8" v-if="timer ==5">
            <el-button @click="handleClickTel(ruleForm.tel)" type="text">手动生成验证码</el-button>
          </el-col>
        </el-row>
      </div>
    </section>
    <!-- 弹框 -->
    <div>
      <el-dialog title="生成白名单" :visible.sync="dialogVisibleAdd" width="40%" center>
        <el-form :model="form1" key="form2" :rules="rules" ref="form1" label-width="120px">
          <el-form-item label="请输入手机号" prop="tel">
            <el-input v-model="form1.tel" clearable></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="handleAddPhoneCode">提交</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 生成验证码 -->
    <!-- 弹框 -->
    <div>
      <el-dialog title="生成白名单" :visible.sync="dialogVisible" width="40%" center>
        <el-form :model="ruleForm" key="form1" :rules="rules" ref="ruleForm" label-width="120px">
          <el-form-item label="请输入手机号" prop="tel">
            <el-input v-model="ruleForm.tel" clearable></el-input>
          </el-form-item>
          <el-form-item label="选择使用类型" prop="tel">
            <el-select v-model="ruleForm.codeType">
              <el-option
                v-for="(item, index) in codeTypeList"
                :label="item.name"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleGetPhoneCode">提交</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { MobileCodeService, IntegralExchangeService } from "@/service";

const title = [
  // 表格title
  { label: "手机号", value: "tel" },
  { label: "操作", value: "operat" }
];
const codeTypeList = [
  { name: "通用验证码", value: "GENERAL" },
  { name: "支付验证码", value: "PAYMENT" }
];
export default {
  name: "generat",
  data() {
    return {
      rules: {
        testerTel: [
          { required: true, message: "请输入手机号", trigger: "blur" }
        ],
        tel: [{ required: true, message: "请输入手机号", trigger: "blur" }]
      },
      ruleForm: {
        bizId: "TEST_0d4e9c9ae4f81ee0838797d849c69c361", // 正式： af393ffbc78b2a7e9744071a4b10f8d1
        codeType: "GENERAL",
        testerTel: "18362390862"
      },
      form1: {
        tel: "18362390864"
      },
      code: "702831",
      list: [], // 表格数据列表
      listLoading: false, // 表格数据加载的loading
      loading: false,
      title, // 表头,
      total: 0,
      formObj: {
        giftName: "",
        cardType: "",
        cardStatus: "", // 订单号
        orderNumber: "864523961",
        page: 1, // 分页
        limit: 5 // 每页显示条数
      },
      dialogVisibleAdd: false,
      dialogVisible: false,
      userObj: {
        code: 0
      },
      codeTypeList,
      timer: 7200 // 300
    };
  },
  created() {},
  methods: {
    // 倒计时2分钟
    handleTime() {
      let interval = null;
      clearInterval(interval);
      interval = setInterval(() => {
        if (this.timer <= 7200 && this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(interval);
          this.timer = 7200;
        }
      }, 1000);
    },
    // 点击生成
    handleClickTel(tel) {
      this.dialogVisible = true;
      this.ruleForm.tel = tel;
    },
    // 点击手动生成二维码
    async handleGetPhoneCode() {
      const data = await MobileCodeService.handleGetCode(
        this.ruleForm.bizId,
        this.ruleForm.codeType,
        this.ruleForm.tel
      );
      if (data.code == 200) {
        this.$message({
          type: "success",
          message: "成功获取验证码"
        });
      }
      this.userObj = data.data;
      this.dialogVisible = false;
      this.handleTime();
    },
    // 添加手机白名单
    async handleAddPhoneCode() {
      const data = await MobileCodeService.handleAddTelCode(this.form1.tel);
      if (data.data == "SUCCESS") {
        this.dialogVisibleAdd = false;
        this.getWhiteTel(this.form1.tel);
        this.$message({
          type: "success",
          message: "成功"
        });
      }
    },

    // 手动查询白名单
    haneldeGetWhiteTel(tel) {
      this.getWhiteTel(tel, 2);
    },
    // 查看已添加白名单的手机
    async getWhiteTel(tel, type) {
      const data = await MobileCodeService.getWhiteTel(
        this.formObj.limit,
        this.formObj.page,
        tel
      );
      if (data.data && data.data.length > 0) {
        this.list = [{ tel: data.data[0] }];
      } else {
        this.list = [];
        if (type == 2) {
          this.$message({
            type: "warning",
            message: "暂无白名单手机号!"
          });
        }
      }
    },

    // 手动删除白名单手机号
    handleDel(obj) {
      this.$confirm("确认删除该手机号吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.delTel(obj.tel);
        this.userObj = {
          code: 0
        };
      });
    },
    // 删除手机号
    async delTel(tel) {
      const data = await MobileCodeService.handleDelTel(tel);
      if (data.code == 200) {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getWhiteTel(tel);
      } else {
        this.$message({
          type: "error",
          message: "删除失败!"
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.top-btn {
  margin-bottom: 20px;
}
</style>