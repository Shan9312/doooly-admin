<template>
  <div class="channel-warrpe app-container">
    <!-- 筛选条件 -->
    <section class="form-box">
      <el-form ref="formObj" :model="formObj" :inline="true" key="form1">
        <el-row :span="24">
          <el-col :span="12">
            <el-form-item label="交易时间">
              <el-date-picker
                v-model="payDate"
                type="daterange"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下单时间">
              <el-date-picker
                v-model="createDate"
                type="daterange"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="订单编号">
              <el-input
                style="width: 100%"
                v-model="formObj.merchantOrderNo"
                placeholder="请输入订单编号"
                maxlength="40"
                clearable
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商户名称">
              <el-input
                style="width: 100%"
                v-model="formObj.merchantName"
                placeholder="请输入商户名称"
                maxlength="40"
                clearable
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="支付方式">
              <el-select v-model="formObj.payType">
                <el-option
                  v-for="(item, index) in orderStateList"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <pe-button
              label="查询"
              perms="recycle:order:search"
              type="primary"
              @click="handleGetListByMsg"
            />
          </el-col>
          <el-col :span="4">
            <pe-button
              label="导出明细"
              icon="el-icon-download"
              perms="recycle:order:search"
              type="primary"
              @click="handleDownload"
            />
          </el-col>
        </el-row>
      </el-form>
    </section>

    <!-- table表单 -->
    <section class="table-box">
      <el-table :data="tableData" style="width: 100%" v-loading="listLoading">
        <el-table-column
          v-for="(item, index) in titleList"
          :key="index"
          align="center"
          :prop="item.value"
          :label="item.label"
          :min-width="item.width"
        >
          <template slot-scope="scope">
            <div>
              <span
                v-if="item.value != 'payType' && item.value !='orderAmount'"
              >{{ scope.row[item.value] }}</span>
              <span v-if="item.value == 'payType' && item.value != 'orderAmount'">
                <order-type :payType="scope.row[item.value]"></order-type>
              </span>
              <span
                v-if="item.value != 'payType' && item.value == 'orderAmount'"
              >{{ scope.row[item.value]| fixedNum}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="formObj.total > 0"
        :total="formObj.total"
        :page.sync="formObj.pageNum"
        :limit.sync="formObj.pageSize"
        @pagination="getChannelList"
      />
    </section>
  </div>
</template>

<script>
import { TransctChannelManage } from "@/service";
import { Message } from "element-ui";
import OrderType from "../components/OrderType.vue";
import { Utils, Auth } from "@/common";
import { constants } from "crypto";
import { Ajax } from "@/common";

// 表格
const titleList = [
  { label: "交易时间", value: "payEndTime", width: "80px" },
  { label: "下单时间", value: "createTime", width: "100px" },
  { label: "订单编号", value: "merchantOrderNo", width: "100px" },
  { label: "商户名称", value: "merchantName", width: "80px" },
  { label: "支付方式", value: "payType", width: "80px" },
  { label: "第三方交易单号", value: "outTradeNo", width: "60px" },
  { label: "实付总金额", value: "orderAmount", width: "60px" }
];

// 回收订单
const orderStateList = [
  { label: "全部", value: "" },
  { label: "定向积分", value: "3" },
  { label: "兜里积分", value: "0" },
  { label: "微信", value: "1" },
  { label: "支付宝", value: "6" },
  { label: "云支付", value: "14" },
  { label: "建行龙支付", value: "15" },
  { label: "微信积分混合", value: "2" },
  { label: "支付宝积分混合", value: "11" },
  { label: "云支付积分混合", value: "17" },
  { label: "建行龙积分混合", value: "16" }
];

export default {
  components: { OrderType },
  filters: {
    fixedNum(num) {
      if (!num) return 0;
      return Number(num).toFixed(2);
    }
  },
  data() {
    return {
      payDate: "", // 交易时间
      createDate: "", // 下单时间
      listLoading: false, // 表格数据加载的loading
      formObj: {
        merchantOrderNo: "", // 订单号 merchantOrderNo
        payType: "", // 支付类型
        merchantName: "", // 商户名称
        startCreateTime: "",
        endCreateTime: "",
        startPayEndTime: "",
        endPayEndTime: "",
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      orderStateList, //支付方式
      titleList,
      pickerOptions: {
        // 设置日期范围
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  created() {
    this.getChannelList();
  },
  mounted() {},
  methods: {
    // 筛选输入框禁止输入特殊字符
    onKeyup(e) {
      e.target.value = e.target.value.replace(/[!~@#$%*&()_+\s^]/g, "");
    },
    // 查询条件
    handleGetListByMsg() {
      this.formObj.pageNum = 1;
      this.$refs["formObj"].validate(valid => {
        if (valid) {
          this.getChannelList();
        } else {
          Message({
            message: "请输入正确的查询信息",
            type: "error",
            duration: 2 * 1000
          });
          return false;
        }
      });
    },
    // 初始化列表,获取数据展示表格
    async getChannelList() {
      this.listLoading = true;
      const { data } = await TransctChannelManage.channelList(this.formObj);
      this.listLoading = false;
      this.tableData = data.list;
      this.formObj.total = data.total;
    },
    // 导出
    async excelDownload() {
      let token = Auth.getToken();
      this.formObj.Authorization = token;
      let params = Utils.obj2Param(this.formObj);
      this.downloadLoading = false;
      TransctChannelManage.exportExcel(params);
    },
    handleDownload() {
      this.excelDownload();
    }
  },
  watch: {
    // 交易日期
    payDate(time) {
      if (time) {
        this.formObj.startPayEndTime = time[0];
        this.formObj.endPayEndTime = time[1];
      } else {
        this.formObj.startPayEndTime = "";
        this.formObj.endPayEndTime = "";
      }
    },
    // 下单日期
    createDate(time) {
      if (time) {
        this.formObj.startCreateTime = time[0];
        this.formObj.endCreateTime = time[1];
      } else {
        this.formObj.startCreateTime = "";
        this.formObj.endCreateTime = "";
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>


