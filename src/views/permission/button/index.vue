<script setup lang="ts">
import { type CSSProperties, computed } from "vue";
import { hasAuth, getAuths } from "@/router/utils";

defineOptions({
  name: "PermissionButton"
});

const elStyle = computed((): CSSProperties => {
  return {
    width: "85vw",
    justifyContent: "start"
  };
});

const queryPermission = "system:user:query";
const editPermission = "system:user:edit";
const removePermission = "system:user:remove";
</script>

<template>
  <el-space direction="vertical" size="large">
    <el-tag :style="elStyle" size="large" effect="dark">
      当前拥有的code列表：{{ getAuths() }}
    </el-tag>

    <el-card shadow="never" :style="elStyle">
      <template #header>
        <div class="card-header">组件方式判断权限</div>
      </template>
      <Auth :value="queryPermission">
        <el-button type="success">
          拥有code：'{{ queryPermission }}' 权限可见
        </el-button>
      </Auth>
      <Auth :value="[editPermission]">
        <el-button type="primary">
          拥有code：['{{ editPermission }}'] 权限可见
        </el-button>
      </Auth>
      <Auth :value="[queryPermission, editPermission, removePermission]">
        <el-button type="danger">
          拥有code：['{{ queryPermission }}', '{{ editPermission }}', '{{
            removePermission
          }}'] 权限可见
        </el-button>
      </Auth>
    </el-card>

    <el-card shadow="never" :style="elStyle">
      <template #header>
        <div class="card-header">函数方式判断权限</div>
      </template>
      <el-button type="success" v-if="hasAuth(queryPermission)">
        拥有code：'{{ queryPermission }}' 权限可见
      </el-button>
      <el-button type="primary" v-if="hasAuth([editPermission])">
        拥有code：['{{ editPermission }}'] 权限可见
      </el-button>
      <el-button
        type="danger"
        v-if="hasAuth([queryPermission, editPermission, removePermission])"
      >
        拥有code：['{{ queryPermission }}', '{{ editPermission }}', '{{
          removePermission
        }}'] 权限可见
      </el-button>
    </el-card>

    <el-card shadow="never" :style="elStyle">
      <template #header>
        <div class="card-header">
          指令方式判断权限（该方式不能动态修改权限）
        </div>
      </template>
      <el-button type="success" v-auth="queryPermission">
        拥有code：'{{ queryPermission }}' 权限可见
      </el-button>
      <el-button type="primary" v-auth="[editPermission]">
        拥有code：['{{ editPermission }}'] 权限可见
      </el-button>
      <el-button
        type="danger"
        v-auth="[queryPermission, editPermission, removePermission]"
      >
        拥有code：['{{ queryPermission }}', '{{ editPermission }}', '{{
          removePermission
        }}'] 权限可见
      </el-button>
    </el-card>
  </el-space>
</template>
