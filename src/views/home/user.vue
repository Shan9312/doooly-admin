<template>
  <div class="user app-container">
    <div class="user-form">
      <el-form
        label-position="left"
        :inline="true"
        :model="search"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="11" :offset="1">
            <el-form-item label="自定义日期查询">
              <el-date-picker
                :editable="false"
                v-model="search.date"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" @click="searchUser">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="reset">重置</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handelExport">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="user-table">
      <el-row>
        <el-col :span="2" :offset="1" class="quick-label">
          快捷查询:
        </el-col>
        <el-col :span="21">
          <el-button
            v-for="(item, index) in tabs"
            class="filter-item"
            type="primary"
            :autofocus="item.focus"
            :disabled="item.disabled"
            @click="handleClick(item, index)"
            >{{ item.label }}</el-button
          >
        </el-col>
      </el-row>
      <el-table
        :data="list"
        ref="multipleTable"
        v-loading="listLoading"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item, index) in title"
          :min-width="item.width"
          align="center"
          :prop="item.value"
          :label="item.label"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="handleDel(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import { HomeService } from "@/service";
  import { Utils } from "@/common";
  const title = [
    // 表格title
    { label: "日期", value: "dateRange", width: "160px" },
    { label: "当前用户总数", value: "currentUser", width: "80px" },
    { label: "当前激活用户数", value: "currentActivate", width: "180px" },
    { label: "当期新增用户数", value: "currentPerAdd", width: "160px" },
    { label: "当期激活用户数", value: "currentPerAct", width: "100px" },
    { label: "当期新增并激活用户数", value: "currentPerActAdd", width: "100px" }
  ];

  // 获取当前月份以及近一年的月份时间
  const getMonths = () => {
    let d, // 设置的日
      dataArr = [],
      data = new Date(),
      year = data.getFullYear();
    data.setMonth(data.getMonth() + 1, 1); //获取到当前月份,设置本月月份
    for (let i = 12; i > 0; i--) {
      data.setMonth(data.getMonth() - 1); //每循环一次 月份值减1,并设置月份
      let m = data.getMonth() + 1; // 然后取出设置的月份
      if (m == 2) {
        d = year % 4 == 0 ? "29" : "28"; // 平年的二月只有28号， 闰年的2月有29号
      } else if (m == 4 || m == 6 || m == 9 || m == 11) {
        d = 30; // 4，6，9，11月每月只有30号
      } else {
        d = 31; // 其他月份每月有31号
      }
      dataArr = [
        ...dataArr,
        {
          label: `${data.getFullYear()}年${m}月`,
          value: i,
          startDate: `${data.getFullYear()}/${m}/1`, // 每月的开始日期
          endDate: `${data.getFullYear()}/${m}/${d}`, // 每月的结束日期
          disabled: false
        }
      ];
    }
    return dataArr.reverse();
  };

  export default {
    name: "User",
    data() {
      return {
        search: {
          // 列表筛选
          date: "" // 搜索日期
        },
        pickerOptions: {
          // 设置日期范围
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          }
        },
        id: 0,
        listLoading: false,
        title,
        list: [],
        tabs: getMonths()
      };
    },
    created() {
      // 默认加载本月最新数据
      this.tabs[11].disabled = true;
      Object.assign(this.search, {
        startDate: this.tabs[11].startDate,
        endDate: this.tabs[11].endDate
      });
      this.getUsers();
    },
    methods: {
      // 获取列表数据
      async getUsers() {
        this.listLoading = true;
        const data = await HomeService.getUsers(this.search);
        this.listLoading = false;
        if (
          data.data01 &&
          data.data02 &&
          data.data04 &&
          data.data05 &&
          data.data06
        ) {
          this.id++;
          this.list = [
            {
              dateRange: `${this.search.startDate}~${this.search.endDate}`, // 将筛选日期添加到数组中显示日期范围
              currentUser: data.data01["infoData"],
              currentActivate: data.data02["infoData"],
              currentPerAdd: data.data04["infoData"],
              currentPerAct: data.data05["infoData"],
              currentPerActAdd: data.data06["infoData"],
              startDate: this.search.startDate,
              endDate: this.search.endDate,
              id: this.id
            },
            ...this.list
          ];
          Array.from(new Set(this.list));
          console.log(Array.from(new Set(this.list)));
        }
      },

      // 重置搜索
      reset() {
        this.search = {
          date: ""
        };
        this.tabs[11].disabled = true;
        Object.assign(this.search, {
          startDate: this.tabs[11].startDate,
          endDate: this.tabs[11].endDate
        });
        this.getUsers();
      },

      // 搜索订单
      searchUser() {
        const { date } = this.search;
        if (date) {
          // 判断有没有选择下单时间，有的话格式化时间并添加到search对象下
          Object.assign(this.search, {
            startDate: date[0].toLocaleDateString(),
            endDate: date[1].toLocaleDateString()
          });
          this.getUsers();
        }
      },

      // 快捷搜索
      handleClick(data, index) {
        this.tabs[index].disabled = true; // 筛选后此按钮不可再次点击
        Object.assign(this.search, {
          startDate: data.startDate,
          endDate: data.endDate
        });
        this.getUsers();
      },

      // 导出订单
      handelExport() {
        console.log("导出");
      },

      // 删除
      handleDel(value) {
        this.list = this.list.filter(item => item.dateRange !== value.dateRange);
        this.tabs.map((item, i) => {
          if (
            item.startDate == value.startDate &&
            item.endDate == value.endDate
          ) {
            this.tabs[i].disabled = false; // 按钮可以再次点击
          }
        });
      }
    }
  };
</script>

<style lang="less">
  .user {
    .quick-label {
      height: 40px;
      line-height: 40px;
    }
    .el-button {
      margin: 0 10px 10px 0;
    }
  }
</style>
