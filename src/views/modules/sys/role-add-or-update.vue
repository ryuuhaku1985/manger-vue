<template>
  <el-dialog
    :title="!dataForm.id ? 'Add' : 'Update'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="Role Name" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="Role Name"></el-input>
      </el-form-item>
      <el-form-item label="Department" prop="deptName">
        <el-popover
          ref="deptListPopover"
          placement="bottom-start"
          trigger="click"
          popper-class="mod-menu__icon-popover">
          <el-tree
            :data="deptList"
            :props="deptListTreeProps"
            node-key="deptId"
            ref="deptListTree"
            @current-change="deptListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" placeholder="Click to Department" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item label="Notes" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="Notes"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span='12'>
          <el-form-item size="mini" label="Permissions">
            <el-tree
              :data="menuList"
              :props="menuListTreeProps"
              node-key="menuId"
              ref="menuListTree"
              :default-expand-all="false"
              show-checkbox>
            </el-tree>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item size="mini" label="Data Authorization">
            <el-tree
              :data="deptList"
              :props="deptListTreeProps"
              node-key="deptId"
              ref="authDeptListTree"
              :default-expand-all="false"
              show-checkbox>
            </el-tree>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">Cancel</el-button>
      <el-button type="primary" @click="dataFormSubmit()">Submit</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          id: 0,
          roleName: '',
          deptId: 0,
          deptName: '',
          remark: ''
        },
        dataRule: {
          roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ]
        },
        tempKey: -666666, // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
        deptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/dept/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.deptList = treeDataTranslate(data.resp.deptList, 'deptId')
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/menu/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.menuList = treeDataTranslate(data, 'menuId')
          }).then(() => {
            this.visible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].resetFields()
              this.$refs.menuListTree.setCheckedKeys([])
            })
          }).then(() => {
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === '0') {
                  this.dataForm.roleName = data.resp.role.roleName
                  this.dataForm.remark = data.resp.role.remark
                  this.dataForm.deptId = data.resp.role.deptId
                  this.dataForm.deptName = data.resp.role.deptName
                  var idx = data.resp.role.menuIdList.indexOf(this.tempKey)
                  if (idx !== -1) {
                    data.resp.role.menuIdList.splice(idx, data.resp.role.menuIdList.length - idx)
                  }
                  this.$refs.menuListTree.setCheckedKeys(data.resp.role.menuIdList)

                  var idxDept = data.resp.role.deptIdList.indexOf(this.tempKey)
                  if (idxDept !== -1) {
                    data.resp.role.deptIdList.splice(idxDept, data.resp.role.deptIdList.length - idxDept)
                  }
                  this.$refs.authDeptListTree.setCheckedKeys(data.resp.role.deptIdList)
                }
              })
            }
          })
        })
      },
      // 机构树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.deptId = data.deptId
        this.dataForm.deptName = data.name
      },
      // 机构树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId)
        this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/role/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'roleId': this.dataForm.id || undefined,
                'roleName': this.dataForm.roleName,
                'deptId': this.dataForm.deptId,
                'deptName': this.dataForm.deptName,
                'remark': this.dataForm.remark,
                'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys()),
                'deptIdList': [].concat(this.$refs.authDeptListTree.getCheckedKeys(), [this.tempKey], this.$refs.authDeptListTree.getHalfCheckedKeys())
              })
            }).then(({data}) => {
              if (data && data.code === '0') {
                this.$message({
                  message: 'Success',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
