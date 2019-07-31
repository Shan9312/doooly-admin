import { WechatQrcode } from '@/service'
import {
  Message
} from 'element-ui'
export default {
  name: 'WechatQrcodeList',
  data() {
    return {
      tableData: [],
      pickerOptions: {
        // 设置日期范围
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      total: 0,
      searchParams: {
        pageNum: 1,
        pageSize: 10,
        title: '',
        codeType: ''
      },
      // dialogModalVisible: false,
      shelfOptions: [
        {
          value: '',
          label: '全部',
        },
        {
          value: '1',
          label: '下架',
        },
        {
          value: '2',
          label: '上架',
        },
      ],
    }
  },
  watch: {
    // 更新时间
    // updateDate(time) {
    //   if (time) {
    //     this.searchParams.updateStartDate = time[0];
    //     this.searchParams.updateEndDate = time[1];
    //   } else {
    //     this.searchParams.updateStartDate = "";
    //     this.searchParams.updateEndDate = "";
    //   }
    // },
  },
  created() {
    // this.getSubjectList()
    this.queryList();
  },
  methods: {
    async queryList(){
      let data = await WechatQrcode.queryList(this.searchParams);
      if (data && data.data && data.data.list) {
        this.tableData = data.data.list
        this.total = data.data.total || this.tableData.length
      }
    },
    async createQrcode(id){
      let data = await WechatQrcode.createQrcode({id});
      if (data) {
        let msg = data.info || '';
        msg && Message({
          message: msg,
          type: 'success',
          duration: 2 * 1000
        })
      }
    },
    downloadQrcode(codeUrl){
      
    },
    // 筛选输入框禁止输入特殊字符
    onKeyup(e) {
      e.target.value = e.target.value.replace(/[!~@#$%*&()_+\s^]/g, "");
    },
    edit(id) {
      this.$router.push(`/operationManage/wechatQrcodeEdit/${id}`)
    },
    handleSearch() {
      this.searchParams.pageNum = 1 // 如果是点击查询，则页码需要重置，否则可能没数据
      this.queryList()
    },
    resetFields(formName) {
      if (!this.$refs[formName]) return
      this.$refs[formName].resetFields()
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('delCachedView', view)
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.refreshSelectedTag(vm.$route)
    })
  },
}
