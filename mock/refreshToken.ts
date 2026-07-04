import { MockMethod } from "vite-plugin-mock";

// 模拟刷新token接口
export default [
  {
    url: "/refresh-token",
    method: "post",
    response: ({ body }) => {
      if (body.refreshToken) {
        return {
          code: 0,
          msg: "success",
          data: {
            token: "eyJhbGciOiJIUzUxMiJ9.newAdmin",
            refreshToken: "eyJhbGciOiJIUzUxMiJ9.newAdminRefresh",
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
          code: 107,
          msg: "refresh token 无效",
          data: null
        };
      }
    }
  }
] as MockMethod[];
