const vueResize = {}
vueResize.install = Vue => {
  Vue.directive('resize', {
    bind(el, binding) {
      let width = ''
      let height = ''
      function isResize() {
        const style = document.defaultView.getComputedStyle(el)
        if (width !== style.width || height !== style.height) {
          binding.value()// 关键
        }
        width = style.width
        height = style.height
      }
      el.__vueSetInterval__ = setInterval(isResize, 500)
    },
    unbind(el) {
      clearInterval(el.__vueSetInterval__)
    }
  })
}

export default vueResize

