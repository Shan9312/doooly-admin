<template>
  <div class="home app-container" v-loading="loading">
    <div class="statistical">
      <el-row class="sta-row" v-for="item in list">
        <el-col class="sta-left" :span="7" :offset="1">
          <router-link :to="'/user'">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <i class="iconicon- grid-con-icon iconfont"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">
                    {{ userTotal[4] ? userTotal[4].infoData : "" }}
                  </div>
                  <div>总用户数</div>
                  <div class="grid-access">
                    <div>
                      激活用户数：{{
                        userTotal[1] ? userTotal[1].infoData : ""
                      }}
                    </div>
                    <div class="grid-prop">
                      激活比例：{{ userTotal | proportion }}
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </router-link>
        </el-col>
        <el-col class="sta-center" :span="7" :offset="1">
          <el-card shadow="hover" :body-style="{ padding: '0px' }">
            <div class="grid-content grid-con-2">
              <i class="icondingdan grid-con-icon iconfont"></i>
              <div class="grid-cont-right">
                <div class="grid-num">
                  {{ orderTotal[0] ? orderTotal[0].infoData : "" }}
                </div>
                <div>总订单数</div>
                <div class="grid-access">
                  <div></div>
                  <div class="grid-prop">
                    平均客单价：{{
                      orderTotal[3] ? orderTotal[3].infoData : ""
                    }}元
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col class="sta-right" :span="7" :offset="1">
          <el-card shadow="hover" :body-style="{ padding: '0px' }">
            <div class="grid-content grid-con-3">
              <i class="iconrenminbi iconfont grid-con-icon"></i>
              <div class="grid-cont-right">
                <div class="grid-num">
                  {{ orderTotal[2] ? orderTotal[2].infoData : "" }}元
                </div>
                <div>GMV</div>
                <div class="grid-access">
                  <div></div>
                  <div class="grid-prop">
                    人均消费:{{ orderTotal[4] ? orderTotal[4].infoData : "" }}元
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { HomeService } from "@/service";
  export default {
    name: "Home",
    data() {
      return {
        userTotal: [], // 用户数据列表
        orderTotal: [], // 订单数据列表
        loading: true,
        list: [1]
      };
    },
    created() {
      this.getList();
    },
    filters: {
      proportion(value) {
        if (value.length > 0) {
          if (value[1] && value[4]) {
            return (
              Math.round(
                (Number(value[1].infoData) / Number(value[4].infoData)) * 10000
              ) /
                100.0 +
              "%"
            );
          }
        }
      },
      integral(value) {
        if (value.length > 0) {
          if (value[7] && value[2]) {
            return (
              Math.round(
                (Number(value[7].infoData) / Number(value[2].infoData)) * 10000
              ) /
                100.0 +
              "%"
            );
          }
        }
      }
    },
    methods: {
      async getList() {
        const userData = await HomeService.getUserTotal();
        const orderData = await HomeService.getOrderTotal();
        this.loading = false;
        this.userTotal = userData.data;
        this.orderTotal = orderData.data;
      }
    }
  };
</script>

<style lang="less">
  .home {
    .sta-row {
      width: 100%;
      margin: 60px auto;
      text-align: center;
      .sta-left,
      .sta-center,
      .sta-right {
        position: relative;
        cursor: pointer;
        .grid-content {
          display: flex;
          align-items: center;
          height: 120px;
          justify-content: space-around;
          .grid-cont-right {
            flex: 1;
            text-align: center;
            font-size: 14px;
            color: #999;
            .grid-num {
              font-size: 30px;
              font-weight: bold;
            }
            .grid-access {
              padding: 20px 3px 0;
              display: flex;
              .grid-prop {
                flex: 1;
                text-align: right;
              }
            }
          }
          .grid-con-icon {
            font-size: 80px;
            width: 120px;
            height: 120px;
            text-align: center;
            line-height: 120px;
            color: #fff;
          }
        }

        .grid-con-1 .grid-con-icon {
          background: rgb(45, 140, 240);
        }
        .grid-con-1 .grid-num {
          color: rgb(45, 140, 240);
        }
        .grid-con-2 .grid-con-icon {
          background: rgb(100, 213, 114);
        }
        .grid-con-2 .grid-num {
          color: rgb(45, 140, 240);
        }
        .grid-con-3 .grid-con-icon {
          background: rgb(242, 94, 67);
        }
        .grid-con-3 .grid-num {
          color: rgb(242, 94, 67);
        }
      }
    }
  }
</style>
