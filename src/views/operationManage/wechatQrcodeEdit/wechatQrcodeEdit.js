import { WechatQrcode } from '@/service'
import { Validate, Auth } from '@/common'
export default {
  name: 'WechatQrcodeEdit',
  data() {
    let validateLinkUrl = (rule, value, callback) => {
      if (value && !Validate.isUrl(value)) {
        callback(new Error('请输入正确的链接地址'))
      } else {
        callback()
      }
    }
    // let validateDate = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('请选择时间'))
    //   } else {
    //     callback()
    //   }
    // }
    let validateDictKey = (rule, value, callback) => {
      let val = value.trim()
      if (!val) {
        callback(new Error('请输入活动编码'))
      } else {
        callback()
      }
    }
    let validateTitle = (rule, value, callback) => {
      let val = value.trim()
      if (!val) {
        callback(new Error('请输入主标题'))
      } else {
        callback()
      }
    }
    const token = Auth.getToken()
    return {
      params: {
        dictKey: '',
        title: '',
        subTitle: '',
        codeType: 0,
        image: '',
        url: '',
      },
      editRules: {
        dictKey: [{ required: true, validator: validateDictKey, trigger: 'blur' }],
        title: [{ required: true, validator: validateTitle, trigger: 'blur' }],
        codeType: [{ required: true }],
        url: [{ required: true, validator: validateLinkUrl, trigger: 'blur' }],
        // startDate: [{ required: true, validator: validateDate, trigger: 'blur' }],
        // endDate: [{ required: true, validator: validateDate, trigger: 'blur' }],
        // imageUrl: [{ required: true, message: '请选择图片', trigger: 'change' }],
        // formUrl: [{ validator: validateLinkUrl, trigger: 'blur' }]
      },

      actionUrl: process.env.VUE_APP_URL + 'fileUpload',
      headers: { Authorization: token },
      loading: false,
      companyAllData: [],
      modalData: {
        id: this.$route.params.id,
        name: '',
        startDate: '', // 生效时间
        endDate: '', // 失效时间
        type: '1', // 弹窗类型 1全部用户 2企业 3指定用户
        groups: [],
        users: [],
        imageUrl: '',
        formUrl: '' // 点击图片的跳转地址
      },
      // editRules: {
      //   name: [{ required: true, validator: validateTitle, trigger: 'blur' }],
      //   startDate: [{ required: true, validator: validateDate, trigger: 'blur' }],
      //   endDate: [{ required: true, validator: validateDate, trigger: 'blur' }],
      //   imageUrl: [{ required: true, message: '请选择图片', trigger: 'change' }],
      //   formUrl: [{ validator: validateLinkUrl, trigger: 'blur' }]
      // }
    }
  },
  created() {
    this.queryDetail()
  },
  methods: {
    async save(){
      let data = await WechatQrcode.addQrcode(this.params);
      let msg = '';
      if (data && data.data) {
        if (data.data === 'SUCCESS') {
          msg = '操作成功';
        } else {
          msg = '操作失败'
        }
        this.$message({
          message: msg,
          type: "success"
        });
        this.$router.push('/operationManage/wechatQrcode');
      }
    },
    async queryDetail() {
      let id = this.$route.params.id;
      if (!id || id === 'null') return;
      let data = await WechatQrcode.queryDetail({id});
      if (data && data.data) {
        this.params = data.data || {};
      }
      /* 目前后端返回弹窗列表没做过滤，暂时隐藏掉企业勾选功能 to do list、 */
      // 获取所有的企业列表
      // await this.getGroupAll()
      // if (this.modalData.id == 'null') return
      // // 获取弹窗详情页
      // const res = await DialogService.getPageDetail(this.modalData.id)
      // if (res && res.data) {
      //   let data = res.data
      //   let selectedList = data.groups || []
      //   this.modalData = {
      //     id: this.$route.params.id,
      //     name: data.name,
      //     startDate: data.startDate, // 生效时间
      //     endDate: data.endDate, // 失效时间
      //     type: data.type.toString(), // 弹窗类型 1全部用户 2企业 3指定用户
      //     groups: [],
      //     users: [],
      //     imageUrl: data.imageUrl,
      //     formUrl: data.formUrl // 点击图片的跳转地址
      //   }
      //   // 过滤已选中的企业
      //   selectedList.map(item => {
      //     this.companyAllData.map((group, index) => {
      //       if (item.id == group.id) {
      //         this.modalData.groups.push(index)
      //       }
      //     })
      //   })
      // }
    },
    // async handleSaveSubject() {
    //   const dialogRef = this.$refs['dialogRef']
    //   Promise.all([dialogRef].map(this.getFormPromise)).then(async res => {
    //     const validateResult = res.every(item => !!item)
    //     if (!validateResult) return
    //     if (this.modalData.type == 2 && this.modalData.groups.length === 0) {
    //       this.$message.error('您还未勾选企业哦！')
    //       return
    //     }
    //     const { id, name, startDate, endDate, imageUrl, formUrl, type, users } = this.modalData
    //     const groups = this.handleGroupsData()
    //     let response = null
    //     if (id == 'null') {
    //       // 新增
    //       if (type == 3 && users.length === 0) {
    //         this.$message.error('您还未导入员工数据哦！')
    //         return
    //       }
    //       response = await DialogService.createHomePage({ name, startDate, endDate, imageUrl, formUrl, groups, type, users })
    //     } else {
    //       // 修改
    //       let updateParams = { id, name, startDate, endDate, imageUrl, formUrl, groups, type, users }
    //       if (type == 3 && users.length === 0) {
    //         delete updateParams.type
    //         delete updateParams.users
    //       }
    //       response = await DialogService.updateHomePage(updateParams)
    //     }
    //     if (response) {
    //       this.$router.push('/operationManage/dialogList')
    //     }
    //   })
    // },
    // async getPageDetail() {
    //   /* 目前后端返回弹窗列表没做过滤，暂时隐藏掉企业勾选功能 to do list、 */
    //   // 获取所有的企业列表
    //   await this.getGroupAll()
    //   if (this.modalData.id == 'null') return
    //   // 获取弹窗详情页
    //   const res = await DialogService.getPageDetail(this.modalData.id)
    //   if (res && res.data) {
    //     let data = res.data
    //     let selectedList = data.groups || []
    //     this.modalData = {
    //       id: this.$route.params.id,
    //       name: data.name,
    //       startDate: data.startDate, // 生效时间
    //       endDate: data.endDate, // 失效时间
    //       type: data.type.toString(), // 弹窗类型 1全部用户 2企业 3指定用户
    //       groups: [],
    //       users: [],
    //       imageUrl: data.imageUrl,
    //       formUrl: data.formUrl // 点击图片的跳转地址
    //     }
    //     // 过滤已选中的企业
    //     selectedList.map(item => {
    //       this.companyAllData.map((group, index) => {
    //         if (item.id == group.id) {
    //           this.modalData.groups.push(index)
    //         }
    //       })
    //     })
    //   }
    // },
    // async getGroupAll() {
    //   const groupAllData = await DialogService.getGroupAll()
    //   if (groupAllData && groupAllData.data) {
    //     let companies = groupAllData.data
    //     companies.forEach((item, index) => {
    //       this.companyAllData.push({
    //         label: item.groupName,
    //         key: index,
    //         id: item.id
    //       })
    //     })
    //   }
    // },
    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['企业ID', '员工工号', '兜礼卡号']
        const filterVal = []
        const list = []
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '弹窗-指定用户模板' + new Date().toLocaleDateString()
        })
      })
    },
    // async changeUploadExcel(event) {
    //   let files = event.target.files
    //   let formData = new FormData()
    //   formData.append('file', files[0])
    //   // 此处必须将控制导入的input值进行置空，否则不会触发change事件，会导致同一个文件不能二次导入
    //   event.target.value = null
    //   const res = await DialogService.readExcel(formData)
    //   if (res && res.data) {
    //     this.$message.success('导入数据成功!')
    //     this.modalData.users = res.data
    //   }
    // },
    // async changeUploadExcel(file) {
    //   let fileSize = file.size;
    //   let fileType = file.raw && file.raw.type;
    //   let mimeType = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    //   if (!mimeType.includes(fileType)) return this.$message.error('上传文件只能是xls、xlsx格式');
    //   if (fileSize > 50 * 1024) return this.$message.error('文件不能超过50kb');
    //   let formData = new FormData()
    //   formData.append('file', file.raw)
    //   const res = await DialogService.readExcel(formData)
    //   if (res && res.data) {
    //     let failCount = res.data.failUsers && res.data.failUsers.length;
    //     if (failCount) {
    //       return this.$message.error(`${failCount}条数据导入失败`);
    //     }
    //     this.$message.success('导入数据成功');
    //     this.modalData.users = res.data.users;
    //   } else {
    //     this.$message.error('导入数据失败')
    //   }
    // },
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
    beforeExcelUpload(file) {},
    handleImgSuccess(res, file) {
      if (res.data) {
        this.$set(this.params, 'image', res.data[0])
      } else {
        this.$message.error(res.info)
      }
      this.loading = false
    },
    handleImgError(err, file) {
      this.loading = false
      this.$message.error('上传图片失败，请重新上传！')
    },
    // handleGroupsData() {
    //   // 根据后端获取的企业列表数据，过滤选中的企业
    //   let companyVal = JSON.parse(JSON.stringify(this.modalData.groups))
    //   let selectedList = []
    //   companyVal.forEach(item => {
    //     selectedList.push(this.companyAllData[item])
    //   })
    //   return selectedList
    // },
    // async handleSaveSubject() {
    //   const dialogRef = this.$refs['dialogRef']
    //   Promise.all([dialogRef].map(this.getFormPromise)).then(async res => {
    //     const validateResult = res.every(item => !!item)
    //     if (!validateResult) return
    //     if (this.modalData.type == 2 && this.modalData.groups.length === 0) {
    //       this.$message.error('您还未勾选企业哦！')
    //       return
    //     }
    //     const { id, name, startDate, endDate, imageUrl, formUrl, type, users } = this.modalData
    //     const groups = this.handleGroupsData()
    //     let response = null
    //     if (id == 'null') {
    //       // 新增
    //       if (type == 3 && users.length === 0) {
    //         this.$message.error('您还未导入员工数据哦！')
    //         return
    //       }
    //       response = await DialogService.createHomePage({ name, startDate, endDate, imageUrl, formUrl, groups, type, users })
    //     } else {
    //       // 修改
    //       let updateParams = { id, name, startDate, endDate, imageUrl, formUrl, groups, type, users }
    //       if (type == 3 && users.length === 0) {
    //         delete updateParams.type
    //         delete updateParams.users
    //       }
    //       response = await DialogService.updateHomePage(updateParams)
    //     }
    //     if (response) {
    //       this.$router.push('/operationManage/dialogList')
    //     }
    //   })
    // },
    // getFormPromise(form) {
    //   // 多个form表单校验
    //   return new Promise(resolve => {
    //     form.validate(res => {
    //       resolve(res)
    //     })
    //   })
    // },
    resetFields(formName) {
      if (!this.$refs[formName]) return
      this.$refs[formName].resetFields()
    },
    // refreshSelectedTag(view) {
    //   this.$store.dispatch('delCachedView', view)
    // },
    // 格式化需要导出的数据
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v =>
    //     filterVal.map(j => {
    //       return v[j]
    //     })
    //   )
    // }
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     vm.refreshSelectedTag(vm.$route)
  //   })
  // }
}
