<template>
  <div>
    home
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
