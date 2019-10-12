<template>
  <div class="app-container card-warrp">
    <!-- 新建按钮 -->
    <div class="newBtn">
      <el-button type="success" plain @click="dialogVisibleAdd = true">新建卡批次</el-button>
    </div>
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
                  item.value != 'operat' &&
                   item.value != 'status' &&
                  item.value !='memberId' &&
                  item.value !='orderId' &&
                  item.value !='transactionAmount'"
                >{{scope.row[item.value]}}</span>
                <!-- 礼包卡数量  -->
                <span v-if="item.value == 'memberId'" class="card-accout">{{scope.row[item.value]}}</span>
                <!-- 已分配卡数量 -->
                <span
                  v-if="item.value == 'orderId'"
                  class="card-allocated"
                >{{scope.row[item.value]}}</span>
                <!-- 未分配卡数量 -->
                <span
                  v-if="item.value == 'transactionAmount'"
                  class="card-remain"
                >{{scope.row[item.value]}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page-sizes="[5,10,20,30,40,50]"
          :page.sync="formObj.pageNum"
          :limit.sync="formObj.pageSize"
          @pagination="getList"
        />
      </div>
    </section>
    <!-- 卡批次说明 -->
    <!-- 新建卡批次弹窗 -->
    <div>
      <el-dialog title="新建卡批次" :visible.sync="dialogVisibleAdd" width="40%" center>
        <el-form :model="formsAdd" key="form2" :rules="rules" ref="formsAdd">
          <el-form-item label="礼包卡数量" label-width="100px" prop="cardNumber">
            <el-input v-model="formsAdd.cardNumber" maxlength="4" clearable></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="handleAddCard">提交</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 编辑弹窗 -->
    <div>
      <el-dialog title="礼包卡分配" :visible.sync="dialogVisibleEdit" width="40%" center>
        <el-form :model="formsEdit" key="form3" :rules="rules" ref="formsEdit">
          <el-form-item label="礼包卡批次号:" label-width="100px">
            <el-input v-model="formsEdit.cardId" maxlength="10" disabled></el-input>
            <span>礼包卡可分配的范围：10311000～100319999</span>
          </el-form-item>
          <el-form-item label="选择礼包:" label-width="100px">
            <el-select v-model="formsEdit.giftName">
              <el-option
                v-for="(item, index) in giftList"
                :label="item.name"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分配卡数量:" label-width="100px" prop="accout">
            <el-input v-model="formsEdit.accout" maxlength="10" clearable></el-input>
            <span>礼包卡最多分配数量：9000</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleEdit = false">取 消</el-button>
          <el-button type="primary">提交</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { CardBatchManageService } from "@/service";
import { Auth, Validate } from "@/common";

const title = [
  // 表格title
  { label: "批次号", value: "batchNo" },
  { label: "创建时间", value: "createdTime", width: "120" },
  { label: "创建人", value: "createdBy" },
  { label: "礼包卡开始卡号", value: "startCardNo" },
  { label: "礼包卡结束卡号", value: "endCardNo" },
  { label: "礼包卡数量", value: "totalNo" },
  { label: "已分配卡数量", value: "hasAllocated" },
  { label: "未分配卡数量", value: "hasNotAllocated" },
  { label: "操作", value: "operat" }
];
const giftList = [
  { name: "所有礼包", value: "" }
  // { name: "大华礼包", value: "1" },
  // { name: "夏日礼包", value: "2" }
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
      pickerOptions: {
        // 设置日期范围
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      giftList,
      formObj: {
        pageSize: 10, // 分页
        pageNum: 1 // 每页显示条数
      },
      dialogVisibleAdd: false, // 新建弹窗
      dialogVisibleEdit: false,
      formsAdd: {
        user: JSON.parse(Auth.getUserInfo()).email,
        cardNumber: ""
      }, // 新建弹窗对象
      formsEdit: {
        cardId: "10010522",
        giftName: "",
        accout: 100
      },
      rules: {
        cardNumber: [
          {
            required: true,
            trigger: "blur",
            validator: Validate.numerbValid
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 新建卡批次
    async handleAddCard() {
      if (!this.formsAdd.cardNumber) {
        this.$message({
          message: "请输入值",
          type: "error"
        });
        return;
      }
      this.formsAdd.cardNumber = parseInt(this.formsAdd.cardNumber);
      const data = await CardBatchManageService.handleAddTelCode(this.formsAdd);
      if (data.code == 200) {
        this.$message({
          message: "新建成功",
          type: "success"
        });
        this.dialogVisibleAdd = false;
        this.formObj.pageNum = 1;
        this.getList();
      }
    },
    // 初始化列表,获取数据展示表格
    async getList() {
      this.listLoading = true;
      const { data } = await CardBatchManageService.cardBatchNoList(
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
        this.dialogVisibleEdit = true;
      } else {
        // 详情
        this.$router.push({
          path: `/activityGiftManage/cardBatchDetail/${item.batchId}`
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
  .card-accout {
    color: #409eff;
  }
  .card-allocated {
    color: #85ce61;
  }
  .card-remain {
    color: #e6a23c;
  }
}
</style>