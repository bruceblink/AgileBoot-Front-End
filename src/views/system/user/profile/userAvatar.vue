<script setup lang="ts">
import ReCropper from "@/components/ReCropper";
import { formatBytes } from "@pureadmin/utils";
import { ref, watch } from "vue";
import { uploadUserAvatarApi, UserDTO } from "@/api/system/user";
import { message } from "@/utils/message";
import type { PropType } from "vue";

const props = defineProps({
  user: {
    type: Object as PropType<UserDTO>,
    default: () => ({})
  }
});
const emit = defineEmits<{
  (e: "success", avatar: string): void;
}>();

const infos = ref();
const imgBlob = ref();
const refCropper = ref();
const showPopover = ref(false);
const cropperImg = ref<string>("");

function getAvatarUrl(avatar?: string) {
  if (!avatar) return "";
  return avatar.startsWith("http")
    ? avatar
    : import.meta.env.VITE_APP_BASE_API + avatar;
}

cropperImg.value = getAvatarUrl(props.user.avatar);

watch(
  () => props.user.avatar,
  avatar => {
    if (avatar) {
      cropperImg.value = getAvatarUrl(avatar);
    }
  }
);

function onCropper({ base64, blob, info }) {
  infos.value = info;
  imgBlob.value = blob;
  cropperImg.value = base64;
}

const open = ref(false);
const visible = ref(false);

// 图片裁剪数据
// const options = reactive({
//   img: avatarUrl, // 裁剪图片的地址
//   autoCrop: true, // 是否默认生成截图框
//   autoCropWidth: 200, // 默认生成截图框宽度
//   autoCropHeight: 200, // 默认生成截图框高度
//   fixedBox: true, // 固定截图框大小 不允许改变
//   previews: {} // 预览数据
// });

/** 上传图片 */
function uploadImg() {
  if (!imgBlob.value) {
    message("请先选择头像图片", { type: "warning" });
    return;
  }
  const formData = new FormData();
  formData.append("avatarfile", imgBlob.value);
  uploadUserAvatarApi(formData).then(({ data }) => {
    open.value = false;
    if (data?.imgUrl) {
      cropperImg.value = getAvatarUrl(data.imgUrl);
      emit("success", data.imgUrl);
    }
    message("上传图片成功", {
      type: "success"
    });
    visible.value = false;
  });
}
</script>
<template>
  <div class="user-info-head" @click="open = true">
    <el-avatar :size="120" :src="cropperImg" />
  </div>
  <el-dialog
    title="修改头像"
    v-model="open"
    width="900px"
    append-to-body
    @opened="visible = true"
    @close="visible = false"
  >
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="font-medium"> 右键下面左侧裁剪区开启功能菜单 </span>
        </div>
      </template>
      <el-popover
        :visible="showPopover"
        placement="right"
        width="300px"
        :teleported="false"
      >
        <template #reference>
          <ReCropper
            ref="refCropper"
            class="w-[500px]"
            :src="cropperImg"
            circled
            @cropper="onCropper"
            @readied="showPopover = true"
          />
        </template>
        <div class="flex flex-wrap justify-center items-center text-center">
          <el-image
            v-if="cropperImg"
            :src="cropperImg"
            :preview-src-list="Array.of(cropperImg)"
            fit="cover"
          />
          <div v-if="infos" class="mt-1">
            <p>
              图像大小：{{ parseInt(infos.width) }} ×
              {{ parseInt(infos.height) }}像素
            </p>
            <p>
              文件大小：{{ formatBytes(infos.size) }}（{{ infos.size }} 字节）
            </p>
          </div>
        </div>
      </el-popover>
    </el-card>
    <template #footer>
      <div>
        <el-button @click="open = false">取消</el-button>
        <el-button type="primary" @click="uploadImg">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.user-info-head {
  position: relative;
  display: inline-block;
  height: 120px;
}

.user-info-head:hover::after {
  position: absolute;
  inset: 0;
  font-size: 24px;
  font-style: normal;
  line-height: 110px;
  color: #eee;
  cursor: pointer;
  content: "+";
  background: rgb(0 0 0 / 50%);
  border-radius: 50%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
