<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['permission_addRoutes'])
  },
  created() {
    const { params, query } = this.$route
    const { path } = params
    let url = path
    if (!path) {
      url = this.fGetUrl()
    }
    this.$router.replace({ path: '/' + url, query })
  },
  methods: {
    fGetUrl() {
      for (let i = 0; i < this.permission_addRoutes.length; i++) {
        const { children, path } = this.permission_addRoutes[i]
        if (path) {
          for (let j = 0; j < children.length; j++) {
            const twoPath = children[j].path
            if (twoPath) {
              return path.replace('/', '') + '/' + twoPath
            }
          }
        }
      }
      return ''
    }
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
