import { RuntimeConfig } from '@umijs/max';

export const qiankun = () => ({
  // Configure the base app with deferred mounting
  defer: true,
  
  // Lifecycle hooks for the main application
  async bootstrap() {
    console.log('Nova IAM main app bootstrapped');
  },
  
  async mount() {
    console.log('Nova IAM main app mounted');
  },
  
  async unmount() {
    console.log('Nova IAM main app unmounted');
  },
});

// Configure initial state
export async function getInitialState() {
  // Simulate authentication check
  const token = localStorage.getItem('nova_iam_token');
  const user = localStorage.getItem('nova_iam_user');
  
  return {
    name: 'Nova IAM',
    authenticated: !!token,
    currentUser: user ? JSON.parse(user) : null,
    settings: {},
  };
}

// Configure layout
export const layout: RuntimeConfig['layout'] = () => {
  return {
    title: 'Nova IAM',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    menu: {
      locale: false,
    },
    footerRender: () => (
      <div style={{ textAlign: 'center' }}>
        Nova IAM ©2024 Created by Wine Area
      </div>
    ),
  };
};