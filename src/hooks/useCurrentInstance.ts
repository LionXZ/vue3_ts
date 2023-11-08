import { ComponentInternalInstance, getCurrentInstance } from 'vue'
export default function useCurrentInstance() {
  const { appContext, refs } = getCurrentInstance() as ComponentInternalInstance
  const proxy = appContext.config.globalProperties

  return {
    proxy, refs
  }
}