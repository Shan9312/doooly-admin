import { WechatQrcode } from '@/service'
import VueQr from 'vue-qr'
import logoSrc from '@/assets/image/operation/bg.png'
import {
  Message
} from 'element-ui'
export default {
  name: 'WechatQrcodeList',
  data() {
    return {
      logoSrc,
      qrCodeImgObj: {},
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
  components: {
    VueQr
  },
  methods: {
    handleQrcodeData(dataURI, id){
      if(!id || !dataURI) return;
      this.qrCodeImgObj[id] = dataURI;
    },
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
    downloadQrcode(id){
      let aEl = document.createElement('a');
      let imgBase64 = this.qrCodeImgObj[id];
      let imgBlod = this.dataURItoBlob(imgBase64);
      let imgURL = this.getObjectURL(imgBlod);

      let evt = document.createEvent("HTMLEvents");
      let fileName = `${id}-qrcode.png`;
      evt.initEvent("click", true, true); // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aEl.download = fileName;
      aEl.href = imgURL;

      aEl.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));//兼容火狐
    },
    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      let byteString = atob(dataURI.split(',')[1]);
      // separate out the mime component
      let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      // write the bytes of the string to an ArrayBuffer
      let ab = new ArrayBuffer(byteString.length);
      let ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      // write the ArrayBuffer to a blob, and you're done
      let blob = new Blob([ab], { type: mimeString });
      return blob;
      // Old code
      // let bb = new BlobBuilder();
      // bb.append(ab);
      // return bb.getBlob(mimeString);
    },
    getObjectURL(file) {
      let url = null;
      if (URL !== undefined) {
          url = URL.createObjectURL(file);
      }
      else if (webkitURL !== undefined) {
          url = webkitURL.createObjectURL(file);
      }
      return url;
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
