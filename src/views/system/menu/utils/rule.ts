import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  isButton: [
    { required: true, message: "菜单类型为必选项", trigger: "change" }
  ],
  menuType: [
    { required: true, message: "菜单子类型为必选项", trigger: "change" }
  ],
  menuName: [{ required: true, message: "菜单名称为必填项", trigger: "blur" }],
  status: [{ required: true, message: "菜单状态为必选项", trigger: "change" }],
  permission: [
    { max: 100, message: "权限标识长度不能超过100个字符", trigger: "blur" }
  ]
});
