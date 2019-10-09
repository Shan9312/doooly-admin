<template>
  <div class="app-container card-warrp">
    <div class="title-top">礼包批次号:{{this.$route.params.id}}</div>
    <!-- 模糊查询暂无 -->
    <section class="form-box">
      <el-form ref="formObj" :model="formObj" :inline="true" key="form1">
        <el-row :span="24">
          <el-col :span="6">
            <el-form-item label="礼包">
              <el-select v-model="formObj.giftName">
                <el-option
                  v-for="(item, index) in giftList"
                  :label="item.name"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卡类型">
              <el-select v-model="formObj.cardType">
                <el-option
                  v-for="(item, index) in cardTypeList"
                  :label="item.name"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卡状态">
              <el-select v-model="formObj.cardStatus">
                <el-option
                  v-for="(item, index) in cardStatusList"
                  :label="item.name"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卡号">
              <el-input
                style="width: 100%"
                v-model="formObj.orderNumber"
                placeholder="请输入卡号"
                maxlength="40"
                clearable
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <el-col :span="6">
            <pe-button label="查询" perms="recycle:order:search" type="primary" />
          </el-col>
          <el-col :span="6">
            <pe-button label="重置" perms="recycle:order:search" type="primary" />
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
                <span
                  v-if="item.value == 'transactionType'"
                >{{scope.row['transactionType'] == 'PAYMENT' ? '已支付':'退款'}}</span>
                <span v-if="item.value == 'operat'">
                  <el-button @click="handleCheckOrder(scope.row,1)" type="text">设置测试卡</el-button>
                  <el-button
                    v-if=" scope.row['status'] != 'NORMAL'"
                    type="text"
                    @click="handleCheckOrder(scope.row,2)"
                  >设置冻结</el-button>
                  <el-button type="text" @click="handleCheckOrder(scope.row,2)">设置正常</el-button>
                </span>
                <span
                  v-if="item.value == 'status'"
                  :class="{'red_text': scope.row['status'] != 'NORMAL'}"
                >{{scope.row['status']=='NORMAL' ?'正常' : '订单缺失'}}</span>
                <span
                  v-if="item.value !='transactionType' && 
                item.value != 'operat' && item.value != 'status'"
                >{{scope.row[item.value]}}</span>
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
          @pagination="getList"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { IntergralMoniterService } from "@/service";

const giftList = [
  { name: "所有礼包", value: "" },
  { name: "大华礼包", value: "1" },
  { name: "夏日礼包", value: "2" }
];
const cardTypeList = [
  { name: "所有类型", value: "" },
  { name: "礼包类型", value: "1" }
];
const cardStatusList = [
  { name: "所有状态", value: "" },
  { name: "已激活", value: "1" },
  { name: "未激活", value: "2" }
];
const title = [
  // 表格title
  { label: "礼包卡号", value: "merchantName" },
  { label: "礼包卡密码", value: "orderId" },
  { label: "类型", value: "transactionType" },
  { label: "礼包名称", value: "transactionId", width: "120" },
  { label: "分配时间", value: "transactionOccurTime" },
  { label: "分配人", value: "memberId" },
  { label: "状态", value: "groupName" },
  { label: "操作", value: "operat" }
];
export default {
  name: "cardBatchList",
  data() {
    return {
      orderTimes: [],
      list: [], // 表格数据列表
      listLoading: false, // 表格数据加载的loading
      loading: false,
      title, // 表头
      total: 0,
      formObj: {
        giftName: "",
        cardType: "",
        cardStatus: "", // 订单号
        orderNumber: "864523961",
        page: 1, // 分页
        limit: 5 // 每页显示条数
      },
      pickerOptions: {
        // 设置日期范围
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      giftList,
      cardTypeList,
      cardStatusList,
      rules: {}
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    // 初始化列表,获取数据展示表格
    async getList() {
      this.listLoading = true;
      const { data } = await IntergralMoniterService.getIntegralExchangeList(
        this.formObj
      );
      this.listLoading = false;
      if (data) {
        this.list = data.list;
        this.total = data.total;
      }
    },
    // 操作 分配，详情
    handleCheckOrder(item, type) {
      if (type == 1) {
        // 分配
        this.$router.push({
          path: `/activityGiftManage/cardBatchDetail/${item.id}`
        });
      } else {
        // 详情
        this.$router.push({
          path: `/activityGiftManage/cardBatchDetail/${item.id}`
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card-warrp {
  .newBtn {
    margin-bottom: 20px;
  }
  .title-top {
    padding: 5px 0 10px 0;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
  }
  .table-box {
    margin-top: 20px;
  }
}
</style>