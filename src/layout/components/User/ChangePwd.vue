<template>
  <el-dialog title="修改密码" :visible.sync="bTopVisibility" width="600px">
    <el-form
      ref="oUserForm"
      :model="oTopUser"
      :rules="aUserRules"
      label-width="80px"
    >
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
          :key="passwordType"
          ref="oldPassword"
          v-model="oTopUser.oldPassword"
          :type="passwordType === 'oldPassword' ? '' : 'password'"
        >
          <svg-icon
            slot="append"
            :icon-class="passwordType === 'oldPassword' ? 'eye-open' : 'eye'"
            @click="showPwd('oldPassword')"
          />
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          :key="passwordType"
          ref="newPassword"
          v-model="oTopUser.newPassword"
          :type="passwordType === 'newPassword' ? '' : 'password'"
        >
          <svg-icon
            slot="append"
            :icon-class="passwordType === 'newPassword' ? 'eye-open' : 'eye'"
            @click="showPwd('newPassword')"
          />
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="pass">
        <el-input
          :key="passwordType"
          ref="pass"
          v-model="oTopUser.pass"
          :type="passwordType === 'pass' ? '' : 'password'"
        >
          <svg-icon
            slot="append"
            :icon-class="passwordType === 'pass' ? 'eye-open' : 'eye'"
            @click="showPwd('pass')"
          />
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="bTopVisibility = false">取 消</el-button>
        <el-button type="primary" :loading="bTopLoading" @click="fTopSubmit">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { fModifyPassword } from '@/api/user'
import { validPassword } from '@/utils/validate'
export default {
  name: 'ChangePwd',
  data() {
    const checkPass = (rule, value, callback) => {
      if (value !== this.oTopUser.newPassword) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    const checkNewPwd = (rule, value, callback) => {
      if (value === this.oTopUser.oldPassword) {
        callback(new Error('新密码和旧密码一致'))
      } else if (!validPassword(value)) {
        callback(new Error('密码至少包含数字、大小写字母、特殊字符，两种以上，长度不小于8位'))
      } else {
        callback()
      }
    }
    return {
      passwordType: '',
      bTopVisibility: false,
      bTopLoading: false,
      oTopUser: {},
      aUserRules: {
        oldPassword: [
          { message: '请输入密码', trigger: 'blur' },
          { min: 8, message: '长度在 8 个以上', trigger: 'blur' }
        ],
        newPassword: [
          { message: '请输入密码', trigger: 'blur' },
          { validator: checkNewPwd, trigger: 'blur' }
        ],
        pass: [
          { validator: checkPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    fOpenPwd() {
      this.bTopVisibility = true
      this.passwordType = ''
      this.oTopUser = {}
    },
    showPwd(type) {
      if (this.passwordType === type) {
        this.passwordType = ''
      } else {
        this.passwordType = type
      }
    },
    fTopSubmit() {
      this.$refs.oUserForm.validate((valid) => {
        if (valid) {
          const { newPassword, oldPassword } = this.oTopUser
          const obj = {
            oldPassword: this.$Base64.encode(oldPassword),
            newPassword: this.$Base64.encode(newPassword)
          }
          this.bTopLoading = true
          fModifyPassword(obj).then(() => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.bTopLoading = false
            this.bTopVisibility = false
          }).catch(() => {
            this.bTopLoading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style  lang="scss" scoped>
</style>
