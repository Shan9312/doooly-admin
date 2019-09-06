<template>
  <div class="channel-warrpe app-container">
    <!-- 筛选条件 -->
    <section class="form-box">
      <el-form ref="formObj" :model="formObj" :inline="true" :rules="rules" key="formObj">
        <el-row :span="24">
          <el-col :span="10">
            <el-form-item label="流水时间">
              <el-date-picker
                :editable="false"
                v-model="orderDate"
                type="datetimerange"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单编号">
              <el-input
                style="width: 100%"
                v-model="formObj.orderNo"
                placeholder="请输入订单编号"
                maxlength="40"
                clearable
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业名称">
              <el-input
                style="width: 100%"
                v-model="formObj.groupName"
                placeholder="请输入商户名称"
                maxlength="40"
                clearable
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="对账状态">
              <el-select v-model="formObj.accoutStatus">
                <el-option
                  v-for="(item, index) in orderStateList"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="流水类型">
              <el-select v-model="formObj.flowType">
                <el-option
                  v-for="(item, index) in FlowList"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="会员手机" prop="tel">
              <el-input
                style="width: 100%"
                v-model="formObj.tel"
                placeholder="请输入商户名称"
                maxlength="40"
                clearable
                type="number"
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
          <el-col :span="2">
            <pe-button
              label="查询"
              perms="recycle:order:search"
              type="primary"
              @click="handleGetListByMsg"
            />
          </el-col>
          <el-col :span="2">
            <pe-button label="重置" perms="recycle:order:search" type="primary" @click="handleReset" />
          </el-col>
          <el-col :span="4">
            <pe-button
              label="批量重新核对"
              perms="recycle:order:search"
              type="primary"
              @click="handleGetListByMsg"
            />
          </el-col>
          <el-col :span="2">
            <pe-button
              :loading="downloadLoading"
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

    <!-- 表格 -->
    <section class="table-box">
      <div>
        <el-table
          border
          :data="list"
          v-loading="listLoading"
          style="width: 100%"
          :row-key="getRowKey"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
          <el-table-column type="index" width="55" label="序号"></el-table-column>
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
                <span v-if="item.value == 'operat'" class="operat-title">重新核对</span>
                <span v-else>{{scope.row[item.value]}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="formObj.page"
          :limit.sync="formObj.limit"
          @pagination="getList"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { IntegralExchangeService } from "@/service";
import { Validate, Auth, Utils } from "@/common";

// 对账状态
const orderStateList = [
  { label: "订单缺失", value: "0" },
  { label: "补单成功", value: "1" },
  { label: "正常", value: "2" }
];
// 流水类型
const FlowList = [
  { label: "全部", value: "0" },
  { label: "支付", value: "1" },
  { label: "退款", value: "2" }
];
const title = [
  // 表格title
  { label: "流水发生时间", value: "orderDate", width: "120" },
  { label: "积分流水编号", value: "orderId" },
  { label: "流水类型", value: "memberId" },
  { label: "订单编号", value: "memberName" },
  { label: "商户名称", value: "groupName" },
  { label: "会员id", value: "bizName" },
  { label: "归属企业", value: "itemDetail" },
  { label: "积分数", value: "totalAmount" },
  { label: "对账状态", value: "paiedAmount" },
  { label: "操作", value: "operat" }
];

export default {
  name: "",
  filters: {
    fixedNum(num) {
      if (!num) return 0;
      return Number(num).toFixed(2);
    }
  },
  data() {
    return {
      list: [], // 表格数据列表
      listLoading: false, // 表格数据加载的loading
      multipleSelection: [], // 需要导出的数据
      title, // 表头
      orderStateList,
      FlowList,
      orderDate: [], // 流水时间
      formObj: {
        startDate: "", // 订单开始时间
        endDate: "", // 订单结束时间
        orderNo: "", // 订单号
        groupName: "", // 企业名称
        accoutStatus: "", // 对账状态
        flowType: "", // 流水类型
        tel: "", // 手机号码
        merchantName: "", // 商户名称
        page: 1, // 分页
        limit: 5 // 每页显示条数
      },
      downloadLoading: false, // 导出loading
      total: 0, // 总数量
      pickerOptions: {
        // 设置日期范围
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },

      rules: {
        tel: [{ validator: Validate.phoneValid, trigger: "change" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 筛选输入框禁止输入特殊字符
    onKeyup(e) {
      e.target.value = e.target.value.replace(/[!~@#$%*&()_+\s^]/g, "");
    },
    // 初始化列表,获取数据展示表格
    async getList() {
      this.listLoading = true;
      const { data } = await IntegralExchangeService.getIntegralExchangeList(
        this.formObj
      );
      this.listLoading = false;
      if (data) {
        this.list = data.list;
        this.total = data.total;
      }
    },
    // 查询条件
    handleGetListByMsg() {
      this.formObj.page = 1;
      this.$refs["formObj"].validate(valid => {
        if (valid) {
          this.getList();
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
    // 重置查询
    handleReset() {
      this.orderDate = [];
      this.formObj = {
        startDate: "", // 订单开始时间
        endDate: "", // 订单结束时间
        orderNo: "", // 订单号
        groupName: "", // 企业名称
        accoutStatus: "", // 对账状态
        flowType: "", // 流水类型
        tel: "", // 手机号码
        merchantName: "", // 商户名称
        page: 1, // 分页
        limit: 10, // 每页显示条数
        total: 0 // 总数量
      };
      this.getList();
    },
    // 选择需要导出的数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 格式化需要导出的数据
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    },
    // 导出订单
    handleDownload() {
      this.downloadLoading = true;
      if (this.multipleSelection.length > 0) {
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = [
            "流水发生时间",
            "积分流水编号",
            "订单编号",
            "商户名称",
            "会员ID",
            "归属企业",
            "积分数",
            "对账状态"
          ];
          const filterVal = [
            "orderDate",
            "orderId",
            "memberId",
            "memberName",
            "groupName",
            "bizName",
            "itemDetail",
            "totalAmount"
          ];
          const list = this.multipleSelection;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "积分兑换订单列表" + new Date().toLocaleDateString()
          });
          this.downloadLoading = false;
        });
      } else {
        let query = {};
        let token = Auth.getToken();
        query.Authorization = token;
        const { startDate, endDate } = this.formObj;
        this.downloadLoading = false;
        Object.assign(query, this.formObj);
        let params = Utils.obj2Param(query);
        IntegralExchangeService.export(params);
      }
    },

    // 表格
    getRowKey(row) {
      return row.id;
    }
  },
  watch: {
    orderDate(time) {
      if (time) {
        this.formObj.startDate = time[0];
        this.formObj.endDate = time[1];
      } else {
        this.formObj.startDate = "";
        this.formObj.endDate = "";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.operat-title {
  color: #409eff;
  cursor: pointer;
}
</style>