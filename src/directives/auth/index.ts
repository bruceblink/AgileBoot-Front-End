import { hasAuth } from "@/router/utils";
import type { Directive, DirectiveBinding } from "vue";

function updateAuthDisplay(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  if (!value) {
    throw new Error(
      "[Directive: auth]: need permission! Like v-auth=\"['system:user:add','system:user:edit']\""
    );
  }

  el.style.display = hasAuth(value) ? "" : "none";
}

export const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    updateAuthDisplay(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    updateAuthDisplay(el, binding);
  }
};
