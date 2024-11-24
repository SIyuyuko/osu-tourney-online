import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/homeView.vue'),
    meta: {
      title: '首页',
      keepAlive: true,
      noScroll: false,
    },
  },
  {
    path: '/tournament',
    name: 'Tournament',
    component: () => import('@/views/tournament/index.vue'),
    meta: {
      title: '比赛',
      keepAlive: true,
      noScroll: false,
    },
  },
  {
    path: '/mappool',
    name: 'Mappool',
    component: () => import('@/views/mappool/index.vue'),
    meta: {
      title: '图池',
      keepAlive: true,
      noScroll: false,
    },
  },
  {
    path: '/songlist',
    name: 'Songlist',
    component: () => import('@/views/songListView.vue'),
    meta: {
      title: '歌曲列表',
      keepAlive: true,
      noScroll: false,
    },
  },
  {
    path: '/command',
    name: 'Command',
    component: () => import('@/views/command/index.vue'),
    meta: {
      title: '指令',
      keepAlive: true,
      noScroll: false,
    },
  },
  {
    path: '/bind',
    name: 'Bind',
    component: () => import('@/views/bind.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFound.vue'),
  },
];

export const router = createRouter({
  // import.meta.env.BASE_URL
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 处理登录逻辑
  if (to.query.code) {
    try {
      const token = Array.isArray(to.query.code) ? to.query.code[0] : to.query.code;

      const loginService = (await import('@/api/data_api')).login;
      const response = await loginService(token);

      if (response.data?.data) {
        localStorage.setItem('userKey', JSON.stringify(response.data.data));
        next('/');
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
