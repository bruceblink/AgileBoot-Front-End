<script setup lang="ts">
import { initRouter } from "@/router/utils";
import { storageSession } from "@pureadmin/utils";
import { type CSSProperties, ref, computed } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { getToken, setTokenFromBackend } from "@/utils/auth";

defineOptions({
  name: "PermissionPage"
});

const elStyle = computed((): CSSProperties => {
  return {
    width: "85vw",
    justifyContent: "start"
  };
});

const options = [
  {
    roleKey: "admin",
    label: "管理员角色",
    username: "admin",
    permissions: ["*:*:*"]
  },
  {
    roleKey: "common-user",
    label: "普通角色",
    username: "common",
    permissions: ["system:user:list", "system:user:query", "system:role:list"]
  }
];

const roleKey = ref(getToken()?.currentUser?.roleKey ?? options[0].roleKey);

function onChange() {
  const currentToken = getToken();
  const selectedRole =
    options.find(item => item.roleKey === roleKey.value) ?? options[0];

  if (currentToken?.token) {
    setTokenFromBackend({
      ...currentToken,
      currentUser: {
        ...currentToken.currentUser,
        roleKey: selectedRole.roleKey,
        permissions: selectedRole.permissions,
        userInfo: {
          ...currentToken.currentUser?.userInfo,
          username: selectedRole.username
        }
      }
    });
  }

  useUserStoreHook().SET_USERNAME(selectedRole.username);
  useUserStoreHook().SET_ROLE_KEYS([selectedRole.roleKey]);
  storageSession().removeItem("async-routes");
  usePermissionStoreHook().clearAllCachePage();
  initRouter();
}
</script>

<template>
  <el-space direction="vertical" size="large">
    <el-tag :style="elStyle" size="large" effect="dark">
      模拟后台根据不同角色返回对应路由（具体参考完整版pure-admin代码）
    </el-tag>
    <el-card shadow="never" :style="elStyle">
      <template #header>
        <div class="card-header">
          <span>当前角色权限字符：{{ roleKey }}</span>
        </div>
      </template>
      <el-select v-model="roleKey" @change="onChange">
        <el-option
          v-for="item in options"
          :key="item.roleKey"
          :label="item.label"
          :value="item.roleKey"
        />
      </el-select>
    </el-card>
  </el-space>
</template>
