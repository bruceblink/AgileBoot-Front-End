import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { storageLocal } from "@pureadmin/utils";
import {
  DictionaryData,
  logout as logoutApi,
  logoutRefreshToken
} from "@/api/common/login";
import { clearLoginSession } from "@/utils/session";
import {
  getCurrentRoleKeys,
  getCurrentUser,
  getRefreshToken
} from "@/utils/auth";

const dictionaryListKey = "ag-dictionary-list";
const dictionaryMapKey = "ag-dictionary-map";

export const useUserStore = defineStore({
  id: "ag-user",
  state: (): userType => {
    const currentUser = getCurrentUser();

    return {
      // 用户名
      username: currentUser?.userInfo?.username ?? "",
      // 页面级别角色权限字符
      roleKeys: getCurrentRoleKeys(),
      dictionaryList:
        storageLocal().getItem<Record<string, DictionaryData[]>>(
          dictionaryListKey
        ) ?? {},
      dictionaryMap:
        storageLocal().getItem<Record<string, Record<string, DictionaryData>>>(
          dictionaryMapKey
        ) ?? {},
      verifyCode: "",
      currentUserInfo: currentUser?.userInfo ?? {}
    };
  },
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      /** TODO 这里不是应该再进一步存到sessionStorage中吗 */
      this.username = username;
    },
    /** 存储角色权限字符 */
    SET_ROLE_KEYS(roleKeys: Array<string>) {
      this.roleKeys = roleKeys;
    },
    /** 存储系统内的字典值 并拆分为Map形式和List形式 */
    SET_DICTIONARY(
      dictionary:
        | Map<string, DictionaryData[]>
        | Record<string, DictionaryData[]>
        | undefined
    ) {
      const dictionaryEntries =
        dictionary instanceof Map
          ? dictionary.entries()
          : Object.entries(dictionary ?? {});
      /** 由于localStorage不能存储Map对象,所以用Obj来装载数据 */
      const dictionaryMapTmp: Record<
        string,
        Record<string, DictionaryData>
      > = {};
      const dictionaryListTmp: Record<string, DictionaryData[]> = {};

      for (const [key, list] of dictionaryEntries) {
        dictionaryListTmp[String(key)] = list || [];
        dictionaryMapTmp[String(key)] = (list || []).reduce((map, dict) => {
          map[String(dict.value)] = dict;
          return map;
        }, {} as Record<string, DictionaryData>);
      }

      /** 将字典分成List形式和Map形式 List便于下拉框展示 Map便于匹配值 */
      this.dictionaryList = dictionaryListTmp;
      this.dictionaryMap = dictionaryMapTmp;

      storageLocal().setItem<Record<string, DictionaryData[]>>(
        dictionaryListKey,
        dictionaryListTmp
      );

      storageLocal().setItem<Record<string, Record<string, DictionaryData>>>(
        dictionaryMapKey,
        dictionaryMapTmp
      );
    },

    /** 登出 */
    async logOut(options: { clearStorage?: boolean } = {}) {
      const refreshToken = getRefreshToken();
      try {
        await logoutApi();
      } catch {
        if (refreshToken) {
          await logoutRefreshToken({ refreshToken }).catch(() => undefined);
        }
      } finally {
        this.clearLoginState(options);
      }
    },

    /** 清理登录态并返回登录页 */
    clearLoginState(options: { clearStorage?: boolean } = {}) {
      this.username = "";
      this.roleKeys = [];
      clearLoginSession(options);
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
