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
    return {
      actionUrl: process.env.VUE_APP_URL + 'fileUpload',
      loading: false,
      companyAllData: [],
      modalData: {
        id: this.$route.params.id,
        name: '',
        startDate: '', // 生效时间
        endDate: '', // 失效时间
        type: '1', // 弹窗类型 1全部用户 2企业 3指定用户
        groups: [],
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
    this.getPageDetail()
  },
  methods: {
    async getPageDetail() {
      /* 目前后端返回弹窗列表没做过滤，暂时隐藏掉企业勾选功能 to do list、 */
      // 获取所有的企业列表
      // await this.getGroupAll()
      if (this.modalData.id == 'null') return
      // 获取弹窗详情页
      const res = await DialogService.getPageDetail(this.modalData.id)
      if (res && res.data) {
        let data = res.data
        let selectedList = data.groups || []
        this.modalData = {
          id: this.$route.params.id,
          name: data.name,
          startDate: data.startDate, // 生效时间
          endDate: data.endDate, // 失效时间
          type: data.type.toString(), // 弹窗类型 1全部用户 2企业 3指定用户
          groups: [],
          imageUrl: data.imageUrl,
          formUrl: data.formUrl // 点击图片的跳转地址
        }
        // 过滤已选中的企业
        selectedList.map(item => {
          this.companyAllData.map((group, index) => {
            if (item.id == group.id) {
              this.modalData.groups.push(index)
            }
          })
        })
      }
    },
    async getGroupAll() {
      const groupAllData = await DialogService.getGroupAll()
      if (groupAllData && groupAllData.data) {
        let companies = groupAllData.data
        companies.forEach((item, index) => {
          this.companyAllData.push({
            label: item.groupName,
            key: index,
            id: item.id
          })
        })
      }
    },
    beforeImgUpload(file) {
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png'
      const isLt500k = file.size / 1024 <= 500
      this.loading = true
      if (!isJPG) {
        this.loading = false
        this.$message.error('上传图片只能是PNG、JPG格式!')
      }
      if (!isLt500k) {
        this.loading = false
        this.$message.error('上传图片大小不能超过500kb!')
      }
      return isJPG && isLt500k
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
    handleGroupsData() {
      // 根据后端获取的企业列表数据，过滤选中的企业
      let companyVal = JSON.parse(JSON.stringify(this.modalData.groups))
      let selectedList = []
      companyVal.forEach(item => {
        selectedList.push(this.companyAllData[item])
      })
      return selectedList
    },
    async handleSaveSubject() {
      const dialogRef = this.$refs['dialogRef']
      Promise.all([dialogRef].map(this.getFormPromise)).then(async res => {
        const validateResult = res.every(item => !!item)
        if (!validateResult) return
        if (this.modalData.type == 2 && this.modalData.groups.length === 0) {
          this.$message.error('您还未勾选企业哦！')
          return
        }
        const { id, name, startDate, endDate, imageUrl, formUrl, type } = this.modalData
        const groups = this.handleGroupsData()
        let response = null
        if (id == 'null') {
          // 新增
          response = await DialogService.createHomePage({ name, startDate, endDate, imageUrl, formUrl, groups, type })
        } else {
          // 修改
          response = await DialogService.updateHomePage({ id, name, startDate, endDate, imageUrl, formUrl, groups, type })
        }
        if (response) {
          this.$router.push('/operationManage/dialogList')
        }
      })
    },
    getFormPromise(form) {
      // 多个form表单校验
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
