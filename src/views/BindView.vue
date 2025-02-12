<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-21 11:15:24
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-09-25 10:55:14
 * @FilePath: /osu-tourney-online/src/views/bind.vue
 * @Description: 用户绑定页
-->
<template>bind page</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { authApi } from '@/api';

const route = useRoute();
const router = useRouter();

const log = () => {
  let token = route.query.code as string;
  if (Array.isArray(token)) {
    token = token[0];
  }
  interface AuthResponse {
    data: any;
  }

  authApi.login(token).then((res: AuthResponse) => {
    if (res.data) {
      let data = JSON.stringify(res.data);
      sessionStorage.setItem('userData', data);
      window.alert('登录成功！');
      router.push('/');
    }
  });
};

onMounted(() => {
  log();
});
</script>
