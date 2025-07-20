import { loadMicroApp, unloadMicroApp } from '@umijs/plugin-qiankun/es/master';

export interface MicroAppConfig {
  name: string;
  entry: string;
  container: string;
  activeRule?: string;
  props?: Record<string, any>;
}

export interface TokenInfo {
  accessToken?: string;
  refreshToken?: string;
  user?: any;
  expires?: number;
}

class MicroFrontendService {
  private loadedApps: Map<string, any> = new Map();
  
  /**
   * Get current authentication token and user info
   */
  getAuthInfo(): TokenInfo {
    try {
      const token = localStorage.getItem('nova_iam_token');
      const user = localStorage.getItem('nova_iam_user');
      const expires = localStorage.getItem('nova_iam_expires');
      
      return {
        accessToken: token || undefined,
        user: user ? JSON.parse(user) : undefined,
        expires: expires ? parseInt(expires) : undefined,
      };
    } catch (error) {
      console.error('Failed to get auth info:', error);
      return {};
    }
  }
  
  /**
   * Load a micro-frontend application
   */
  async loadApp(config: MicroAppConfig): Promise<any> {
    try {
      const authInfo = this.getAuthInfo();
      
      const appConfig = {
        name: config.name,
        entry: config.entry,
        container: config.container,
        props: {
          // Pass authentication info to sub-app
          token: authInfo.accessToken,
          user: authInfo.user,
          // Pass other props
          ...config.props,
          // Add service methods that sub-apps can use
          services: {
            getAuthInfo: () => this.getAuthInfo(),
            refreshToken: () => this.refreshToken(),
          },
        },
      };
      
      const app = await loadMicroApp(appConfig);
      this.loadedApps.set(config.name, app);
      
      console.log(`Micro-app ${config.name} loaded successfully`);
      return app;
    } catch (error) {
      console.error(`Failed to load micro-app ${config.name}:`, error);
      throw error;
    }
  }
  
  /**
   * Unload a micro-frontend application
   */
  async unloadApp(name: string): Promise<void> {
    try {
      const app = this.loadedApps.get(name);
      if (app) {
        await unloadMicroApp(name);
        this.loadedApps.delete(name);
        console.log(`Micro-app ${name} unloaded successfully`);
      }
    } catch (error) {
      console.error(`Failed to unload micro-app ${name}:`, error);
      throw error;
    }
  }
  
  /**
   * Update props for a loaded micro-app (e.g., when token is refreshed)
   */
  updateAppProps(name: string, newProps: Record<string, any>): void {
    const app = this.loadedApps.get(name);
    if (app && app.update) {
      app.update(newProps);
    }
  }
  
  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<void> {
    try {
      // This would typically call your auth service to refresh the token
      // For now, we'll just simulate it
      console.log('Refreshing token...');
      
      // Update all loaded apps with new token
      const authInfo = this.getAuthInfo();
      this.loadedApps.forEach((app, name) => {
        this.updateAppProps(name, {
          token: authInfo.accessToken,
          user: authInfo.user,
        });
      });
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error;
    }
  }
  
  /**
   * Get list of currently loaded apps
   */
  getLoadedApps(): string[] {
    return Array.from(this.loadedApps.keys());
  }
  
  /**
   * Check if an app is loaded
   */
  isAppLoaded(name: string): boolean {
    return this.loadedApps.has(name);
  }
}

// Export singleton instance
export const microFrontendService = new MicroFrontendService();

export default microFrontendService;