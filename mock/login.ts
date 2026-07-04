// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/login",
    method: "post",
    response: ({ body }) => {
      if (body.username === "admin") {
        return {
          code: 0,
          msg: "success",
          data: {
            token: "eyJhbGciOiJIUzUxMiJ9.admin",
            refreshToken: "eyJhbGciOiJIUzUxMiJ9.adminRefresh",
            expiresIn: 7200,
            refreshExpiresIn: 604800,
            currentUser: {
              roleKey: "admin",
              permissions: ["*:*:*"],
              userInfo: {
                username: "admin",
                nickname: "管理员"
              }
            }
          }
        };
      } else {
        return {
          code: 0,
          msg: "success",
          data: {
            token: "eyJhbGciOiJIUzUxMiJ9.common",
            refreshToken: "eyJhbGciOiJIUzUxMiJ9.commonRefresh",
            expiresIn: 7200,
            refreshExpiresIn: 604800,
            currentUser: {
              roleKey: "common",
              permissions: [
                "system:user:list",
                "system:user:query",
                "system:role:list"
              ],
              userInfo: {
                username: "common",
                nickname: "普通用户"
              }
            }
          }
        };
      }
    }
  }
] as MockMethod[];
