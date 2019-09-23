<template>
  <div class="app-container card-warrp">
    <!-- <div class="title-top">礼包卡批次列表</div> -->
    <!-- 新建按钮 -->
    <div class="newBtn">
      <el-button type="success" plain @click="dialogVisibleAdd = true">新建卡批次</el-button>
    </div>
    <!-- 模糊查询暂无 -->
    <section class="form-box">
      <el-form ref="formObj" :model="formObj" :inline="true" key="form1">
        <el-row :span="24">
          <el-col :span="6">
            <el-form-item label="批次号">
              <el-input
                style="width: 100%"
                v-model="formObj.orderNumber"
                placeholder="请输入批次号"
                maxlength="40"
                clearable
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="orderTimes"
                type="daterange"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <pe-button label="查询" perms="recycle:order:search" type="primary" />
          </el-col>
          <el-col :span="2">
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
                  <el-button @click="handleCheckOrder(scope.row,1)" type="text">礼包卡分配</el-button>
                  <el-button type="text" @click="handleCheckOrder(scope.row,2)">查看详情</el-button>
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
    <!-- 卡批次说明 -->
    <!-- 新建卡批次弹窗 -->
    <div>
      <el-dialog title="新建卡批次" :visible.sync="dialogVisibleAdd" width="40%" center>
        <el-form :model="formsAdd" key="form2" :rules="rules" ref="ruleForm">
          <el-form-item label="礼包卡批次号:" label-width="100px">
            <el-input v-model="formsAdd.cardId" maxlength="10" disabled></el-input>
          </el-form-item>
          <el-form-item label="礼包卡数量" label-width="100px">
            <el-input v-model="formsAdd.accout" maxlength="10" clearable></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="handleEditUserInfo">提交</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 编辑弹窗 -->
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
      orderTimes: [],
      list: [], // 表格数据列表
      listLoading: false, // 表格数据加载的loading
      loading: false,
      title, // 表头
      total: 0,
      formObj: {
        startDate: "", // 订单开始时间
        endDate: "", // 订单结束时间
        orderId: "", // 订单号
        page: 1, // 分页
        limit: 5 // 每页显示条数
      },
      dialogVisibleAdd: false, // 新建弹窗
      pickerOptions: {
        // 设置日期范围
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      formsAdd: {
        cardId: "10010522",
        accout: 100
      }, // 新建弹窗对象
      rules: []
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
  }
}
</style>