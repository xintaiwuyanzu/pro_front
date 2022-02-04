<template>
  <el-dropdown type="primary" @command="toggleTheme">
    <el-button circle>
      <icon icon="el-icon-magic-stick"/>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="theme in themes" :key="theme.scopeName" :command="theme.scopeName">
        {{ theme.scopeName === 'default' ? '默认' : theme.scopeName }}
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
      themes: themeConfig.multipleScopeVars
    }
  },
  methods: {
    toggleTheme(scopeName) {
      localStorage.setItem(themeKey, scopeName)
      toggleTheme({
        scopeName,
        multipleScopeVars: themeConfig.multipleScopeVars,
        extract: themeConfig.extract,
        publicPath: themeConfig.publicPath,
        outputDir: themeConfig.extractCssOutputDir,
      });
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