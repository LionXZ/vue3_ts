// 分模块路由 vite
const modulesFiles = import.meta.globEager("./modules/*.ts")
const layoutRouter = Object.keys(modulesFiles).reduce((modules: any, modulePath: any) => {
  const value = modulesFiles[modulePath]
  if (Array.isArray(value.default)) {
    value.default.forEach(e => {
      modules.push(e)
    })
  } else {
    modules.push(value.default)
  }
  return modules
}, [])

//排序
layoutRouter.sort((a: any, b: any) => {
  if (a.sort && b.sort) {
    return a.sort - b.sort
  }
})

export default layoutRouter