import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  model: {},
  initialState: {},
  request: {},
  
  // Configure as micro-frontend sub-application
  qiankun: {
    slave: {},
  },
  
  base: '/sub-app/demo/',
  publicPath: '/sub-app/demo/',
  
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      component: './Dashboard',
    },
    {
      path: '/profile',
      component: './Profile',
    },
  ],
  
  // Allow cross-origin for micro-frontend
  devServer: {
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  
  npmClient: 'npm',
});