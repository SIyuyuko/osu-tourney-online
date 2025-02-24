import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: '首页',
      keepAlive: true,
      noScroll: false,
    },
  },
  {
    path: '/tournament',
    name: 'Tournament',
    component: () => import('@/views/TournamentView.vue'),
    meta: {
      title: '比赛',
      keepAlive: true,
      noScroll: false,
    },
  },
  {
    path: '/mappool',
    name: 'Mappool',
    redirect: '/mappool/list',
    component: () => import('@/views/mappool/MapPoolHub.vue'),
    meta: {
      title: '图池',
      keepAlive: true,
      noScroll: false,
    },
    children: [
      {
        path: 'list',
        name: 'MapPoolList',
        component: () => import('@/views/mappool/PoolListView.vue'),
        meta: {
          title: '图池列表',
        },
      },
      {
        path: ':title',
        name: 'MappoolDetail',
        component: () => import('@/views/mappool/PoolView.vue'),
        meta: {
          title: '图池详情',
          keepAlive: true,
          noScroll: false,
        },
        props: true,
      },
    ],
  },
  {
    path: '/songlist',
    name: 'Songlist',
    component: () => import('@/views/SongListView.vue'),
    meta: {
      title: '歌曲列表',
      keepAlive: true,
      noScroll: false,
    },
  },
  {
    path: '/command',
    name: 'Command',
    component: () => import('@/views/CommandView.vue'),
    meta: {
      title: '指令',
      keepAlive: true,
      noScroll: false,
    },
  },
  {
    path: '/bind',
    name: 'Bind',
    component: () => import('@/views/BindView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/components/global/NotFound.vue'),
  },
];

export const router = createRouter({
  // import.meta.env.BASE_URL
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach(async (to, _, next) => {
  // 处理登录逻辑
  if (to.query.code) {
    try {
      const token = Array.isArray(to.query.code) ? to.query.code[0] : to.query.code;

      const loginService = (await import('@/api')).authApi.login;
      if (token) {
        const response = await loginService(token as string);

        if (response.data) {
          localStorage.setItem('userKey', JSON.stringify(response.data));
          next(to.query.redirect?.toString() || '/home');
          return;
        }
        return;
      }
    } catch (error) {
      console.error('登录失败:', error);
    }
  }

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - OSU Tournament`;
  }

  next();
});
