<template>
  <el-upload
    ref="upload"
    :auto-upload="false"
    :before-remove="beforeRemove"
    :before-upload="beforeUpload"
    class="upload-files"
    :data="uploadData"
    :file-list="fileList"
    :headers="headers"
    :limit="1"
    multiple
    :on-exceed="handleExceed"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
  >
    <el-button size="small" type="primary">上传文件</el-button>
  </el-upload>
</template>
<script>
  export default {
    name: 'UploadFiles',
    props: {
      // eslint-disable-next-line vue/require-default-prop
      //action: String,
      // eslint-disable-next-line vue/require-default-prop
      headers: String,
      accept: {
        type: String,
        default: '*/*',
      },
      disabled: Boolean,
      // eslint-disable-next-line vue/require-default-prop
      value: Array,
      // eslint-disable-next-line vue/require-default-prop
      uploadData: Object,
    },
    data() {
      return {
        fileList: [], // 初始化过程中的文件
        files: [], // 动态过程中的文件
      }
    },
    watch: {
      value() {
        if (this.value instanceof Array) {
          this.fileList = this.value.map((item) => {
            return { url: item.Path, name: item.Name, id: item.Path }
          })
        }
      },
    },
    created() {
      if (this.value instanceof Array) {
        this.fileList = this.value.map((item) => {
          return { url: item.Path, name: item.Name, id: item.Path }
        })
      }
    },
    methods: {
      beforeRemove(file) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      beforeUpload() {
        const promise = new Promise((resolve) => {
          this.$nextTick(function () {
            resolve(true)
          })
        })
        return promise // 通过返回一个promis对象解决
      },
      handleSuccess(response) {
        this.fileList = [] // 清空上传文件列表
        if (response.success && response.response != null) {
          this.$message({
            message: response.msg,
            type: 'success',
          })
          this.$parent.fetchData()
        } else {
          this.$message({
            message: response.msg,
            type: 'error',
          })
        }
      },
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择1个文件，本次选择了 ${files.length} 个文件，共选择了 ${
            files.length + fileList.length
          } 个文件`
        )
      },
      handleRemove(file) {
        const files = this.value ? this.value : []
        for (let i = 0; i < files.length; i++) {
          if (file.id) {
            if (file.id === files[i].Path) {
              files.splice(i, 1)
              break
            }
          }
        }
        this.$emit('input', files)
      },
      // 上传
      submitUpload() {
        this.$refs.upload.submit()
      },
    },
  }
</script>
<style>
  .upload-files .el-upload {
    width: auto;
    height: auto;
  }
</style>
