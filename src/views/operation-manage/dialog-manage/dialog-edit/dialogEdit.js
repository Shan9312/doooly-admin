import { DialogService } from '@/service'
import { Validate } from '@/common'
export default {
  name: 'DialogEdit',
  data() {
    let validateLinkUrl = (rule, value, callback) => {
      if (value && !Validate.isUrl(value)) {
        callback(new Error('请输入正确的链接地址'))
      } else {
        callback()
      }
    }
    let validateDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择时间'))
      } else {
        callback()
      }
    }
    let validateTitle = (rule, value, callback) => {
      let val = value.trim()
      if (!val) {
        callback(new Error('请输入弹窗名称'))
      } else {
        callback()
      }
    }
    const generateData = _ => {
      const data = []
      const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都']
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index
        })
      })
      return data
    }
    return {
      actionUrl: process.env.VUE_APP_URL + '/fileUpload',
      loading: false,
      companyData: generateData(),
      modalData: {
        id: this.$route.params.id,
        name: '',
        startDate: '', // 生效时间
        endDate: '', // 失效时间
        type: '1', // 弹窗类型 1全部用户 2企业 3指定用户
        companyVal: [],
        imageUrl: '',
        formUrl: '' // 点击图片的跳转地址
      },
      editRules: {
        name: [{ required: true, validator: validateTitle, trigger: 'blur' }],
        startDate: [{ required: true, validator: validateDate, trigger: 'blur' }],
        endDate: [{ required: true, validator: validateDate, trigger: 'blur' }],
        imageUrl: [{ required: true, message: '请选择图片', trigger: 'change' }],
        formUrl: [{ validator: validateLinkUrl, trigger: 'blur' }]
      }
    }
  },
  created() {
    if (this.modalData.id == 'null') return
    this.getPageDetail()
  },
  methods: {
    async getPageDetail() {
      const res = await DialogService.getPageDetail(this.modalData.id)
      if (res && res.data) {
        let data = res.data
        this.modalData = {
          id: this.$route.params.id,
          name: data.name,
          startDate: data.startDate, // 生效时间
          endDate: data.endDate, // 失效时间
          type: data.type.toString(), // 弹窗类型 1全部用户 2企业 3指定用户
          imageUrl: data.imageUrl,
          formUrl: data.formUrl // 点击图片的跳转地址
        }
      }
    },
    beforeImgUpload(file) {
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png'
      const isLt3M = file.size / 1024 <= 500
      this.loading = true
      if (!isJPG) {
        this.loading = false
        this.$message.error('上传图片只能是PNG、JPG格式!')
      }
      if (!isLt3M) {
        this.loading = false
        this.$message.error('上传图片大小不能超过500kb!')
      }
      return isJPG && isLt3M
    },
    handleImgSuccess(res, file) {
      if (res.data) {
        this.$set(this.modalData, 'imageUrl', res.data[0])
        this.loading = false
      }
    },
    handleImgError(err, file) {
      this.loading = false
      this.$message.error('上传图片失败，请重新上传！')
    },
    async handleSaveSubject() {
      const dialogRef = this.$refs['dialogRef']
      Promise.all([dialogRef].map(this.getFormPromise)).then(async res => {
        const validateResult = res.every(item => !!item)
        if (!validateResult) return
        console.log(this.modalData)
        const { id, name, startDate, endDate, imageUrl, formUrl, type } = this.modalData
        let response = null
        if (id == 'null') {
          // 新增
          response = await DialogService.createHomePage({ name, startDate, endDate, imageUrl, formUrl, type })
        } else {
          response = await DialogService.updateHomePage({ id, name, startDate, endDate, imageUrl, formUrl, type })
        }
        if (response) {
          this.$router.push('/operationManage/dialogList')
        }
      })
    },
    getFormPromise(form) {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res)
        })
      })
    },
    resetFields(formName) {
      if (!this.$refs[formName]) return
      this.$refs[formName].resetFields()
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('delCachedView', view)
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.refreshSelectedTag(vm.$route)
    })
  }
}
