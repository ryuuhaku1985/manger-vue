<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">MANAGEMENT PLATFORM</h2>
          <p class="brand-info__intro"></p>
        </div>
        <div class="login-main">
          <h3 class="login-title">Operator sign in</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitLoginVerification()" status-icon>
            <el-form-item prop="userName" v-show=this.dataForm.panelShow>
              <el-input v-model="dataForm.userName" placeholder="User Name"></el-input>
            </el-form-item>
            <el-form-item prop="password" v-show=this.dataForm.panelShow>
              <el-input v-model="dataForm.password" type="password" placeholder="Password"></el-input>
            </el-form-item>
            <!--<el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="Verify Code">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item>-->
            <el-form-item v-show=this.dataForm.panelShow>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmitLoginVerification()">Sign in</el-button>
            </el-form-item>
          </el-form>

          <el-form :model="Register" ref="RegisterForm" label-width="0" class="RegisterForm" v-show=this.dataForm.verifyShow>
            <el-form-item prop="phone">
              <el-input v-model="Register.phone" placeholder="phone number"></el-input>
            </el-form-item>
            <el-form-item prop="verify" class="code">
              <el-input v-model="Register.code" placeholder="verify code"></el-input>
              <el-button type="button" @click="sendcode" :disabled="disabled" v-if="disabled==false">Send Verify Code
              </el-button>
              <el-button type="button" @click="sendcode" :disabled="disabled" v-if="disabled==true">{{btntxt}}
              </el-button>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm">Sign in</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getUUID } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          userName: '',
          password: '',
          verify: '',
          uuid: '',
          captcha: '',
          panelShow: true,
          verifyShow: false
        },
        Register: {
          phone: '',
          code: '',
        },
        disabled: false,
        time: 0,
        btntxt: "Resend",
        dataRule: {
          userName: [
            { required: true, message: 'Please enter user name', trigger: 'blur' }
          ],
          password: [
            { required: true, message: 'Please enter password', trigger: 'blur' }
          ],
          captcha: [
            { required: true, message: 'Please enter verufy code', trigger: 'blur' }
          ]
        },
        captchaPath: ''
      }
    },
    created () {
      this.getCaptcha()
    },
    methods: {
      //发送验证码方法
      sendcode() {
        const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
        if (this.Register.phone == '') {
          this.$message({
            message:'Cell phone number cannot be empty',
            center: true
          })
          return
        }
        if (!reg.test(this.Register.phone)) {
          this.$message({
            message:'Please enter the correct phone number',
            center:true
          })
          return
        } else {
          console.log(this.Register.phone);
          this.$message({
            message: 'Send success',
            type: 'success',
            center:true
          });
          this.time = 60;
          this.disabled = true;
          this.timer();
        }
        this.$refs['RegisterForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/loginsendverify'),
              method: 'post',
              data: this.$http.adornData({
                'mobile': this.Register.phone,
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha
              })
            }).then(({data}) => {
              if (data && data.code === '0') {

              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      timer() {
        if (this.time > 0) {
          this.time--;
          this.btntxt = "Try again in "+ this.time + " seconds";
          setTimeout(this.timer, 1000);
        } else {
          this.time = 0;
          this.btntxt = "Get verify code";
          this.disabled = false;
        }
      },

      submitForm(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/loginverify'),
              method: 'post',
              data: this.$http.adornData({
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha,
                'mobile': this.Register.phone,
                'verifycode': this.Register.code
              })
            }).then(({data}) => {
              if (data && data.code === '0') {
                this.$cookie.set('token', data.resp.token)
                this.$router.replace({ name: 'home' })
              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })

      },
      send(){
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);  // 清除定时器
              this.timer = null;
            }
          }, 1000)
        }
      },
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/loginverify'),
              method: 'post',
              data: this.$http.adornData({
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha
              })
            }).then(({data}) => {
              if (data && data.code === '0') {
                this.$cookie.set('token', data.resp.token)
                this.$router.replace({ name: 'home' })
              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 先查询用户是否需要验证码登录，如果不需要直接登录到后台中
      dataFormSubmitLoginVerification () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/login'),
              method: 'post',
              data: this.$http.adornData({
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha
              })
            }).then(({data}) => {
              if (data && data.code === '0') {
                this.$cookie.set('token', data.resp.token)
                // this.$router.replace({ name: 'home' })
                if (data.resp.verify === 2) {
                  this.dataForm.panelShow = false
                  this.dataForm.verifyShow = true
                } else {
                  this.dataFormSubmit()
                }
              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      }
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: center;
    margin: 0 auto;
    background-color: rgba(38, 50, 56, .6);
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      //background-image: url(~@/assets/img/login_bg.jpg);
      background-size: cover;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0 auto;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
    }
    .brand-info {
      color: #fff;
    }
    .brand-info__text {
      right: 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      position: absolute;
      right: 35%;
      padding:  30px 60px;
      width: 400px;
      height: 300px;
      background-color: #fff;
    }
    .login-title {
      font-size: 16px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 38px;
    }
  }
  .root {
    background: url("http://img.hena360.cn/login_bj.jpg") no-repeat center;
    background-size: 100% 100%;
    height: 100vh;
    width: 100vw;
    display: table-cell;
    vertical-align: middle;
    form {
      width: 80%;
      margin: auto;
      margin-top: 90%;
      .code {
        .el-input {
          width: 55%;
          border-radius: 0px;
          float: left;
          display: inline-block;
        }
        .el-button {
          width: 45%;
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
          border-left: 0px;
          float: left;
          display: inline-block;
        }
      }
      .el-button--primary {
        width: 100%;
        background-color: #ffe86a;
        border: none;
        color: #000;
      }
    }
  }
</style>
