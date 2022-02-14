<template>
  <el-dropdown type="primary" @command="toggleTheme">
    <section class="top_icon">
      <icon icon="layers"/>
    </section>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="theme in themes" :key="theme.scopeName" :command="theme.scopeName">
        {{ themeNameMapper(theme.scopeName) }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
/**
 * 主题切换控件
 */
import {toggleTheme} from "@zougt/theme-css-extract-webpack-plugin/dist/toggleTheme";

const themeKey = 'theme'
const themeConfig = process.env.themeConfig;
export default {
  name: "themeSelect",
  data() {
    return {
      theme: 'default'
    }
  },
  computed: {
    themes() {
      return themeConfig.multipleScopeVars.filter(t => t.scopeName !== this.theme)
    }
  },
  methods: {
    toggleTheme(scopeName) {
      localStorage.setItem(themeKey, scopeName)
      this.theme = scopeName
      toggleTheme({
        scopeName,
        multipleScopeVars: themeConfig.multipleScopeVars,
        extract: themeConfig.extract,
        publicPath: themeConfig.publicPath,
        outputDir: themeConfig.extractCssOutputDir,
      });
    },
    themeNameMapper(name) {
      switch (name) {
        case 'default':
          return '默认蓝';
        case 'red':
          return '主题红';
        case 'green':
          return '活力绿'
        default:
          return name
      }
    }
  },
  mounted() {
    const theme = localStorage.getItem(themeKey)
    if (theme) {
      this.toggleTheme(theme)
    }
  }
}
</script>