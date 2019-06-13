import { SubjectService } from '@/service'
import { Validate } from '@/common'
export default {
  name: 'DialogEdit',
  data() {
    let validateLinkUrl = (rule, value, callback) => {
      if (!Validate.isUrl(value)) {
        callback(new Error('请输入正确的链接地址'))
      } else {
        callback()
      }
    }
    let validateEndDate = (rule, value, callback) => {
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
      specialTopicInfo: {
        id: this.$route.params.id,
        title: '',
        endDate: '' // 下架时间
      },
      modalData: {
        status: '1', // 下架状态 1.限时 2.永久
        companyVal: [],
        imgUrl: '',
        linkUrl: '' // 点击图片的跳转地址
      },
      editImgRules: {
        imgUrl: [{ required: true, message: '请选择图片', trigger: 'change' }],
        linkUrl: [{ validator: validateLinkUrl, trigger: 'blur' }]
      },
      specialTopicInfoRules: {
        title: [{ required: true, validator: validateTitle, trigger: 'blur' }],
        endDate: [{ required: true, validator: validateEndDate, trigger: 'blur' }]
      }
    }
  },
  created() {
    if (this.specialTopicInfo.id == 'null') return
    this.getSubjectDetail()
  },
  methods: {
    async getSubjectDetail() {
      const res = await SubjectService.subjectDetail(this.specialTopicInfo.id)
      if (res && res.data) {
        let data = res.data
        this.specialTopicInfo = {
          title: data.specialTopicInfo.title,
          endDate: data.specialTopicInfo.endDate,
          id: data.specialTopicInfo.id
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
        this.$set(this.modalData, 'imgUrl', res.data[0])
        this.loading = false
      }
    },
    handleImgError(err, file) {
      this.loading = false
      this.$message.error('上传图片失败，请重新上传！')
    },
    async handleSaveSubject() {
      const topicRef = this.$refs['topicRef']
      const editImgRef = this.$refs['editImgRef']

      Promise.all([topicRef, editImgRef].map(this.getFormPromise)).then(res => {
        const validateResult = res.every(item => !!item)
        if (validateResult) {
          console.log('两个表单都校验通过')
        } else {
          console.log('两个表单未校验通过')
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
