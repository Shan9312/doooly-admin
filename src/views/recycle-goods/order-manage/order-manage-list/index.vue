<template>
  <div class="order-manage-warpper app-container">
    <!-- 筛选条件 -->
    <section class="form-box">
      <el-form ref="formObj" :model="formObj" :inline="true" :rules="rules" key="form1">
        <el-row :span="24">
          <el-col :span="6">
            <el-form-item label="订单编号">
              <el-input
                style="width: 100%"
                v-model="formObj.orderNumber"
                placeholder="请输入订单编号"
                maxlength="40"
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="订单日期">
              <el-date-picker
                v-model="orderTimes"
                type="daterange"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属企业">
              <el-input
                style="width: 100%"
                v-model="formObj.groupName"
                placeholder="请输入企业名称"
                maxlength="15"
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="会员编号">
              <el-input
                style="width: 100%"
                v-model="formObj.userId"
                placeholder="请输入订单编号"
                maxlength="40"
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="发起回收日期">
              <el-date-picker
                v-model="recoveryTime"
                type="daterange"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单状态">
              <el-select v-model="formObj.orderState">
                <el-option
                  v-for="(item, index) in orderStateList"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="回收状态">
              <el-select v-model="formObj.recoveryState">
                <el-option
                  v-for="(item, index) in recycleStateList"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号" prop="userPhone">
              <el-input style="width: 100%" v-model="formObj.userPhone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="handleGetListByMsg">查询</el-button>
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
                v-if="item.value != 'orderState' && item.value != 'recoveryState'"
              >{{scope.row[item.value]}}</span>
              <span v-if="item.value == 'orderState'">
                <OrderState :orderState="scope.row[item.value]"></OrderState>
              </span>
              <span v-if="item.value == 'recoveryState'">
                <RecycleState :recoveryState="scope.row[item.value]"></RecycleState>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="180"
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="handleRouter(scope.row.orderNumber)">查看</el-button>
            <el-button size="small" type="info" @click="handleEdit(scope.row.orderNumber)">修改付款信息</el-button>
            <el-button
              size="small"
              type="success"
              @click="confirmRecycle(scope.row.orderNumber)"
            >确认回款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="formObj.total > 0"
        :total="formObj.total"
        :page.sync="formObj.pageNum"
        :limit.sync="formObj.pageSize"
        @pagination="getRecycleGoodsList"
      />
    </section>
    <!-- 弹窗 start-->
    <!-- 修改回复信息 -->
    <el-dialog title="修改回付信息" :visible.sync="dialogVisibleEdit" width="30%" center>
      <el-form :model="forms" key="form2" :rules="rules" ref="ruleForm">
        <el-form-item label="支付宝姓名" label-width="100px" prop="applyName">
          <el-input v-model="forms.applyName"></el-input>
        </el-form-item>
        <el-form-item label="支付宝账号" label-width="100px" prop="applyAccount">
          <el-input v-model="forms.applyAccount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleEditUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 确认回款 -->
    <el-dialog title="确认回款" :visible.sync="dialogVisibl" width="30%" center class="confirm-box">
      <span class="dialog-text">请再次确认是否汇款</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibl = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗 end-->
  </div>
</template>

<script>
import { RecycleGoodsService } from "@/service";
import { phoneValid, applyVaild } from "@/common/validateTools";
import { Message } from "element-ui";

// 订单状态
const recycleStateList = [
  { label: "未回收", value: "1" },
  { label: "已回收", value: "2" },
  { label: "未返款", value: "3" },
  { label: "已返款", value: "4" },
  { label: "全部", value: "" }
];

// 回收订单
const orderStateList = [
  { label: "未支付", value: "0" },
  { label: "已支付", value: "1" },
  { label: "取消", value: "2" },
  { label: "全部", value: "" }
];

// 表格
const titleList = [
  { label: "订单号", value: "orderNumber", width: "100px" },
  { label: "会员编号", value: "cardNumber", width: "80px" },
  { label: "预定日期", value: "orderTime", width: "80px" },
  { label: "订单状态", value: "orderState", width: "60px" },
  { label: "回收状态", value: "recoveryState", width: "60px" }
];

export default {
  name: "OrderList",
  data() {
    return {
      orderTimes: [],
      recoveryTime: [],
      formObj: {
        orderNumber: "", // 订单号 orderNumber
        groupName: "",
        userId: "",
        orderState: "", // 0 未支付，1 已支付，2，取消
        recoveryState: "", // 1,未回收 2,已回收  3, 未返款 4 已还款
        userPhone: "",
        orderStartTime: "",
        orderEndTime: "",
        recoveryStartTime: "",
        recoveryEndTime: "",
        pageNum: 1,
        rowCount: 10,
        total: 0
      },
      orderStateList,
      recycleStateList,
      titleList,
      pickerOptions: {
        // 设置日期范围
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      rules: {
        userPhone: [{ validator: phoneValid, trigger: "change" }],
        applyName: [
          { required: true, message: "请输入支付宝名称", trigger: "blur" },
          { min: 1, message: "请输入正确名称", trigger: "blur" }
        ],
        applyAccount: [
          {
            validator: applyVaild,
            required: true,
            trigger: "blur"
          }
        ]
      },
      tableData: [],
      listLoading: false,
      dialogVisibleEdit: false,
      dialogVisibl: false,
      forms: {
        applyName: "",
        applyAccount: ""
      },
      userInfo: {
        userId: this.$store.state.user.userInfo.name,
        orderNumber: ""
      }
    };
  },
  created() {
    this.getRecycleGoodsList();
  },
  mounted() {},
  methods: {
    // 初始化列表,获取数据展示表格
    async getRecycleGoodsList() {
      this.listLoading = true;
      const { data } = await RecycleGoodsService.recycleGoodsList(this.formObj);
      this.listLoading = false;
      this.tableData = data.list;
      this.formObj.total = data.totalNumber;
    },

    // 根据条件查询列表
    handleGetListByMsg() {
      if (this.orderTimes.length) {
        this.formObj.orderStartTime = this.orderTimes[0];
        this.formObj.orderEndTime = this.orderTimes[1];
      }
      if (this.recoveryTime.length) {
        this.formObj.recoveryStartTime = this.recoveryTime[0];
        this.formObj.recoveryEndTime = this.recoveryTime[1];
      }
      this.$refs["formObj"].validate(valid => {
        if (valid) {
          this.getRecycleGoodsList();
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

    // 筛选输入框禁止输入特殊字符
    onKeyup(e) {
      e.target.value = e.target.value.replace(/[!~@#$%*&()_+\s^]/g, "");
    },

    /**
     * 查看订单详情
     *
     * */
    handleRouter(orderNumber) {
      this.$router.push({
        path: `/recycleGoods/orderManage/orderDetail/${orderNumber}`
      });
    },

    /**
     * 点击按钮确认回款
     *
     * */
    confirmRecycle(orderNumber) {
      this.userInfo.orderNumber = orderNumber;
      this.dialogVisibl = true;
    },

    // 回款弹窗
    async handleConfirm() {
      const res = await RecycleGoodsService.recycleConfirmOrder(this.userInfo);
      this.dialogVisibl = false;
      if (res.data == "SUCCESS") {
        Message({
          message: res.info,
          type: "success",
          duration: 2 * 1000
        });
      } else {
        Message({
          message: res.info,
          type: "error",
          duration: 2 * 1000
        });
      }
      this.getRecycleGoodsList();
    },

    /**
     * 修改回款信息
     *
     * */
    handleEdit(orderNumber) {
      this.userInfo.orderNumber = orderNumber;
      this.dialogVisibleEdit = true;
    },

    // 确认 修改回复信息
    async handleEditUserInfo() {
      const obj = Object.assign(this.userInfo, this.forms);
      const res = await RecycleGoodsService.recycleEditOrder(obj);
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.dialogVisibleEdit = false;
          if (res.data == "SUCCESS") {
            Message({
              message: res.info,
              type: "success",
              duration: 2 * 1000
            });
          } else {
            Message({
              message: res.info,
              type: "error",
              duration: 2 * 1000
            });
          }
          this.getRecycleGoodsList();
        } else {
          Message({
            message: "请填写付款信息",
            type: "warning",
            duration: 2 * 1000
          });
          return false;
        }
      });
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