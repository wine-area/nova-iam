import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Nova IAM',
  },
  routes: [
    {
      path: '/',
      redirect: '/realms',
    },
    {
      name: 'Realm Management',
      path: '/realms',
      component: './RealmList',
    },
    {
      name: 'User Management',
      path: '/realms/:realmName/users',
      component: './UserList',
    },
    {
      name: 'Theme Designer',
      path: '/theme-designer',
      component: './ThemeDesigner',
    },
  ],
  npmClient: 'npm',
  proxy: {
    '/api': {
      target: 'http://localhost:8090',
      changeOrigin: true,
    },
  },
});