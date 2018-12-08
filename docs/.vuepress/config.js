module.exports = {
    theme: 'yubisaki',
    title: "zane's blog",
    description: "zane's blog",
    head: [
        ['link', { rel: 'icon', href: `/favicon.ico` }]
    ],
    port:3000,
    //base: '/zane/',
    //repo: 'https://github.com/itzane94/zane',
    dest: './docs/.vuepress/dist',
    ga: '',
    serviceWorker: true,
    evergreen: true,
    themeConfig: {
        background: '#e6ecf0',
        github: 'itzane94',
        logo: '/img/logo.png',
        accentColor: '#ac3e40',
        per_page: 6,
        date_format: 'yyyy-MM-dd HH:mm:ss',
        tags: true,
        comment: {
            clientID: '88781ce5a398415c3e22',
            clientSecret: '758fe6833d7cd7ffce7104475994c65743bec92f',
            repo: 'zane',  // blog of repo name
            owner: 'itzane94',  // github of name
            admin: 'itzane94', // github of name
            distractionFreeMode: false
        },
        nav: [
            {text: 'Blog', link: '/blog/', root: true},
            {text: 'TAGS', link: '/tags/', tags: true},
            {text: 'Github', link: 'https://github.com/itzane94'},
            {text: '简书', link: 'https://www.jianshu.com/u/050ae06765e7'},
            {text: '关于我', link: '/about/'},
        ]
    },
    markdown: {
        anchor: {
            permalink: true
        },
        toc: {
            includeLevel: [1, 2]
        },
        config: md => {
            // 使用更多 markdown-it 插件！
            md.use(require('markdown-it-task-lists'))
            .use(require('markdown-it-imsize'), { autofill: true })
        }
    },
    postcss: {
        plugins: [require('autoprefixer')]
    },
}

