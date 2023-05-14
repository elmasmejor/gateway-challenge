export default defineNuxtConfig({
    modules: [
        '@element-plus/nuxt'
    ],
    elementPlus: {},
    buildModules: [
        '@nuxtjs/vee-validate',
    ],
    veeValidate: {
        validateOnInput: true,
        validateOnChange: true,
    },
    generate: {
        routes: [
            '/gateway/:id',
        ]
    },
    runtimeConfig: {
        public: {
            baseURL: process.env.BASE_URL || 'http://localhost:3000/api',
        },
    },
    plugins: [
        '~/plugins/ofetch.ts'
    ],
})
