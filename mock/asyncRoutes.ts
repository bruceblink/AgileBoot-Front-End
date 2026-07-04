// 模拟后端动态生成路由
import { MockMethod } from "vite-plugin-mock";

/**
 * roles：页面级别角色权限字符，对应登录态 currentUser.roleKey
 * admin：管理员角色
 * common-user：普通角色
 */

const permissionRouter = {
  path: "/permission",
  meta: {
    title: "权限管理",
    icon: "lollipop",
    rank: 10
  },
  children: [
    {
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "页面权限",
        roles: ["admin", "common-user"]
      }
    },
    {
      path: "/permission/button/index",
      name: "PermissionButton",
      meta: {
        title: "按钮权限",
        roles: ["admin", "common-user"]
      }
    }
  ]
};

export default [
  {
    url: "/getRouters",
    method: "get",
    response: () => {
      return {
        code: 0,
        msg: "success",
        data: [permissionRouter]
      };
    }
  }
] as MockMethod[];
