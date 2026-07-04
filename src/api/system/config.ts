import { http } from "@/utils/http";

export interface ConfigQuery extends BasePageQuery {
  /**
   * 配置key
   */
  configKey?: string;
  /**
   * 配置名称
   */
  configName?: string;
  /**
   * 是否允许更改配置
   */
  isAllowChange?: boolean;
}

/**
 * ConfigDTO, 配置信息
 */
export interface ConfigDTO {
  configId?: string;
  configKey?: string;
  configName?: string;
  configOptions?: string[];
  configValue?: string;
  createTime?: Date;
  isAllowChange?: number;
  isAllowChangeStr?: string;
  remark?: string;
}

export type ConfigFormModel = ConfigDTO & {
  configOptionsText?: string;
};

export interface AddConfigRequest {
  configKey: string;
  configName: string;
  configOptions?: string[];
  configValue: string;
  isAllowChange: number;
  remark?: string;
}

/**
 * ConfigUpdateCommand
 */
export interface UpdateConfigRequest {
  configValue: string;
}

/** 获取配置列表 */
export const getConfigListApi = (params?: ConfigQuery) => {
  return http.request<ResponseData<PageDTO<ConfigDTO>>>(
    "get",
    "/system/configs",
    {
      params
    }
  );
};

/** 新增配置 */
export const addConfigApi = (data: AddConfigRequest) => {
  return http.request<ResponseData<void>>("post", "/system/config", { data });
};

/** 获取配置信息 */
export const getConfigInfoApi = (configId: string) => {
  return http.request<ResponseData<ConfigDTO>>(
    "get",
    `/system/config/${configId}`
  );
};

/** 修改配置 */
export const updateConfigApi = (
  configId: number,
  data: UpdateConfigRequest
) => {
  return http.request<ResponseData<void>>("put", `/system/config/${configId}`, {
    data
  });
};

/** 刷新配置缓存 */
export const refreshConfigCacheApi = () => {
  return http.request<ResponseData<void>>("delete", "/system/configs/cache");
};
