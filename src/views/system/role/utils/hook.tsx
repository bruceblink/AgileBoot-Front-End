import dayjs from "dayjs";
import { message } from "@/utils/message";
import {
  deleteRoleApi,
  exportRoleExcelApi,
  getRoleListApi,
  RoleDTO,
  RoleQuery,
  updateRoleStatusApi
} from "@/api/system/role";
import { getMenuListApi, MenuDTO } from "@/api/system/menu";
import { ElMessage, ElMessageBox, type FormInstance } from "element-plus";
import { usePublicHooks } from "../../hooks";
import { type PaginationProps } from "@pureadmin/table";
import { onMounted, reactive, ref, toRaw } from "vue";
import { toTree } from "@/utils/tree";
import { CommonUtils } from "@/utils/common";
import { useSystemDict } from "@/views/system/utils/dict";
import { hasAuth } from "@/router/utils";

type SwitchState = {
  loading?: boolean;
};

type SwitchLoadMap = Record<number, SwitchState>;

const statusMap = useSystemDict("common.status").map;

function getStatusLabel(status: unknown, fallback = "") {
  return statusMap.value[String(status)]?.label || fallback;
}

function renderStatusTag(status: unknown, size: string) {
  const statusInfo = statusMap.value[String(status)] ?? {
    cssTag: "info",
    label: String(status ?? "-")
  };

  return (
    <el-tag size={size} type={statusInfo.cssTag} effect="plain">
      {statusInfo.label}
    </el-tag>
  );
}

export function useRole() {
  const form = reactive<RoleQuery>({
    roleKey: "",
    roleName: "",
    status: undefined
  });
  const dataList = ref<RoleDTO[]>([]);
  const loading = ref(true);
  const switchLoadMap = ref<SwitchLoadMap>({});
  const { switchStyle } = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "角色编号",
      prop: "roleId",
      minWidth: 100
    },
    {
      label: "角色名称",
      prop: "roleName",
      minWidth: 120
    },
    {
      label: "权限字符",
      prop: "roleKey",
      minWidth: 150
    },
    {
      label: "状态",
      minWidth: 130,
      cellRenderer: scope =>
        hasAuth("system:role:edit") ? (
          <el-switch
            size={scope.props.size === "small" ? "small" : "default"}
            loading={switchLoadMap.value[scope.index]?.loading}
            v-model={scope.row.status}
            active-value={1}
            inactive-value={0}
            active-text={getStatusLabel(1, "1")}
            inactive-text={getStatusLabel(0, "0")}
            inline-prompt
            style={switchStyle.value}
            onChange={() => onChange(scope.row as RoleDTO, scope.index)}
          />
        ) : (
          renderStatusTag(scope.row.status, scope.props.size)
        )
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 150
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];

  async function onChange(row: RoleDTO, index: number) {
    const nextStatus = Number(row.status);
    const previousStatus = nextStatus === 0 ? 1 : 0;
    const nextStatusLabel = getStatusLabel(nextStatus, String(nextStatus));

    try {
      await ElMessageBox.confirm(
        `确认要将<strong style='color:var(--el-color-primary)'>${row.roleName}</strong>角色状态修改为<strong>${nextStatusLabel}</strong>吗?`,
        "系统提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
          draggable: true
        }
      );

      switchLoading(index, true);
      await updateRoleStatusApi(row.roleId, nextStatus);
      message(`已将${row.roleName}状态修改为${nextStatusLabel}`, {
        type: "success"
      });
      await getList();
    } catch (e) {
      row.status = previousStatus;
      if (e === "cancel" || e === "close") {
        message("取消操作", {
          type: "info"
        });
      }
    } finally {
      switchLoading(index, false);
    }
  }

  function switchLoading(index: number, loading: boolean) {
    switchLoadMap.value[index] = Object.assign({}, switchLoadMap.value[index], {
      loading
    });
  }

  async function handleDelete(row: RoleDTO) {
    try {
      loading.value = true;
      await deleteRoleApi(row.roleId);
      message(`您删除了角色名称为${row.roleName}的这条数据`, {
        type: "success"
      });
      await getList();
    } catch (e) {
      console.error(e);
      message((e as Error)?.message || "删除失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  async function onSearch() {
    pagination.currentPage = 1;
    await getList();
  }

  async function getList() {
    try {
      CommonUtils.fillPaginationParams(form, pagination);
      loading.value = true;
      const { data } = await getRoleListApi(toRaw(form));
      dataList.value = data.rows;
      pagination.total = data.total;
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || "加载失败");
    } finally {
      loading.value = false;
    }
  }

  async function exportAllExcel() {
    CommonUtils.fillPaginationParams(form, pagination);
    exportRoleExcelApi(toRaw(form), "角色列表.xlsx");
  }

  const resetForm = (formEl?: FormInstance) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  const menuTree = ref<MenuDTO[]>([]);

  /** 菜单权限 */
  async function getMenuTree(force = false) {
    if (!force && menuTree.value?.length) {
      return menuTree.value;
    }
    const { data } = await getMenuListApi();
    menuTree.value = toTree(data, "id", "parentId");
    return menuTree.value;
  }

  /** 数据权限 可自行开发 */
  // function handleDatabase() {}

  onMounted(onSearch);

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    getList,
    exportAllExcel,
    resetForm,
    menuTree,
    getMenuTree,
    handleDelete
  };
}
