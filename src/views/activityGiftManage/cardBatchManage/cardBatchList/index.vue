<template>
  <div class="app-container card-warrp">
    <div class="title-top">礼包卡批次列表</div>
    <!-- 模糊查询暂无 -->
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
                  <el-button @click="handleCheckOrder(scope.row)" type="text">礼包卡分配</el-button>
                  <el-button type="text">查看详情信息</el-button>
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

const title = [
  // 表格title
  { label: "批次号", value: "transactionId", width: "120" },
  { label: "创建时间", value: "transactionOccurTime" },
  { label: "创建人", value: "transactionType" },
  { label: "礼包卡开始卡号", value: "orderId" },
  { label: "礼包卡结束卡号", value: "merchantName" },
  { label: "礼包卡数量", value: "memberId" },
  { label: "已分配卡数量", value: "groupName" },
  { label: "未分配卡数量", value: "transactionAmount" },
  { label: "操作", value: "operat" }
];
export default {
  name: "cardBatchList",
  data() {
    return {
      list: [], // 表格数据列表
      listLoading: false, // 表格数据加载的loading
      loading: false,
      title, // 表头
      total: 0,
      formObj: {
        startDate: "", // 订单开始时间
        endDate: "", // 订单结束时间
        orderId: "", // 订单号
        groupName: "", // 企业名称
        conciliateStatus: "", // 对账状态
        transactionType: "", // 流水类型
        tel: "", // 手机号码
        merchantName: "", // 商户名称
        page: 1, // 分页
        limit: 10 // 每页显示条数
      }
    };
  },
  created() {
    this.getList();
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
    }
  }
};
</script>

<style lang="less" scoped>
.card-warrp {
  .title-top {
    padding: 5px 0 10px 0;
    border-bottom: 1px solid #eee;
  }
}
</style>