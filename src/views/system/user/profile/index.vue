<script setup lang="ts">
import resetPwd from "./resetPwd.vue";
import userInfo from "./userInfo.vue";
import userAvatar from "./userAvatar.vue";
import { reactive, ref } from "vue";
import dayjs from "dayjs";
import { useUserStoreHook } from "@/store/modules/user";
import { getUserProfileApi, UserDTO } from "@/api/system/user";
import { message } from "@/utils/message";

const activeTab = ref("userinfo");
const userStore = useUserStoreHook();
const state = reactive<{
  user: UserDTO;
  roleName: string;
  postName: string;
}>({
  user: {},
  roleName: "",
  postName: ""
});

function syncUser(user?: UserDTO, roleName?: string, postName?: string) {
  state.user = {
    ...userStore.currentUserInfo,
    ...state.user,
    ...user
  };
  state.roleName = roleName ?? state.user.roleName ?? "";
  state.postName = postName ?? state.user.postName ?? "";
  userStore.currentUserInfo = {
    ...userStore.currentUserInfo,
    ...state.user,
    roleName: state.roleName,
    postName: state.postName
  };
}

async function getUser() {
  try {
    const { data } = await getUserProfileApi();
    syncUser(data.user, data.roleName, data.postName);
  } catch (e) {
    syncUser(userStore.currentUserInfo as UserDTO);
    message((e as Error)?.message || "加载个人信息失败", { type: "error" });
  }
}

function handleProfileUpdated(user: UserDTO) {
  syncUser(user);
}

function handleAvatarUpdated(avatar: string) {
  syncUser({ avatar });
}

getUser();
</script>
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <template v-slot:header>
            <div class="clearfix">
              <span>个人信息</span>
            </div>
          </template>
          <div>
            <div class="text-center">
              <userAvatar :user="state.user" @success="handleAvatarUpdated" />
            </div>

            <el-row>
              <el-descriptions :column="1">
                <el-descriptions-item label="用户名称">{{
                  state.user.username
                }}</el-descriptions-item>
                <el-descriptions-item label="手机号码">{{
                  state.user.phoneNumber
                }}</el-descriptions-item>
                <el-descriptions-item label="用户邮箱">{{
                  state.user.email
                }}</el-descriptions-item>
                <el-descriptions-item label="部门 / 职位">
                  {{ state.user.deptName }} /
                  {{ state.postName }}
                </el-descriptions-item>
                <el-descriptions-item label="角色">
                  {{ state.roleName }}
                </el-descriptions-item>
                <el-descriptions-item label="创建日期">
                  {{
                    state.user.createTime
                      ? dayjs(state.user.createTime).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )
                      : "-"
                  }}
                </el-descriptions-item>
              </el-descriptions>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <template v-slot:header>
            <div class="clearfix">
              <span>基本资料</span>
            </div>
          </template>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="state.user" @success="handleProfileUpdated" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="state.user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
