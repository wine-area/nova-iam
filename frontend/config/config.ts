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
  // Enable Qiankun plugin for micro-frontend support
  qiankun: {
    master: {
      // Apps configuration will be dynamically loaded
      apps: [],
      // Enable sandbox to isolate sub-applications
      sandbox: {
        strictStyleIsolation: true,
        experimentalStyleIsolation: true,
      },
      // Defer mounting to allow proper initialization
      defer: true,
    },
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
      name: 'Client Management',
      path: '/realms/:realmName/clients',
      component: './ClientList',
    },
    {
      name: 'Theme Designer',
      path: '/theme-designer',
      component: './ThemeDesigner',
    },
    {
      name: 'Applications',
      path: '/apps',
      component: './Applications',
    },
    // Micro-frontend routes will be handled dynamically
    {
      path: '/sub-app/*',
      microApp: 'subApp',
      microAppProps: {
        autoSetLoading: true,
      },
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