export {}
declare module 'vue/types/vue' {
    interface Vue {
        /**
         * 判断当前登录用户是否有指定的角色
         * @param roleIdOrCode
         * @return boolean 返回true或者false
         */
        hasRole(roleIdOrCode: String | Array<String>): boolean

        /**
         * 判断当前系统是不是指定的系统编码或者id
         * @param sysId
         */
        isSys(sysId: String): boolean

        /**
         *可以在页面声明角色属性，如果当前登录用户没有指定的角色，则跳转没有权限页面
         */
        role: String | Array<String>
    }
}
