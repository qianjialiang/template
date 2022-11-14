<template>
  <section class="app-main">
    <div class="app-main-div" :class="{'app-main-iframe': route.meta.iframe}">
      <transition-group name="fade-transform" mode="out-in">
        <component
          :is="item.name"
          v-for="item in iframeViews"
          v-show="route.path === item.path"
          :key="item.name"
        />
      </transition-group>
      <transition name="fade-transform" mode="out-in">
        <keep-alive v-if="!route.meta.iframe" :include="cachedViews">
          <router-view :key="route.path" />
        </keep-alive>
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    iframeViews() {
      return this.$store.state.tagsView.iframeViews
    },
    route() {
      return this.$route
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  height: calc(100vh - 50px);
  width: 100%;
  padding: 10px;
  position: relative;
  overflow: hidden;

  >.app-main-div{
    height: 100%;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    //background-color: #fff;

    &.app-main-iframe{
      overflow: hidden;
    }
  }
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
