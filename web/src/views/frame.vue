<template>
    <section>
        <nac-info></nac-info>
        <iframe :src="$route.query.$url" class="index_main" v-if="$route.query&&$route.query.$url"
                frameborder="0"/>
        <div v-else class="index_main">未找到页面</div>
    </section>
</template>
