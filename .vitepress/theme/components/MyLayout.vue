<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
</script>

<template>
    <Layout>
        <!-- 公告插槽 -->
        <template #layout-top>
            <notice/>
        </template>
        <!-- 一言插槽 -->
        <template #home-hero-actions-after>
            <Quote/>
        </template>
    </Layout>
</template>

<style>

</style>