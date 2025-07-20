import { RuntimeConfig } from '@umijs/max';

// Configure initial state for micro-frontend
export async function getInitialState() {
  return {
    name: 'Demo Sub-App',
    version: '1.0.0',
  };
}

// Configure request interceptors if needed
export const request: RuntimeConfig['request'] = {
  timeout: 60000,
  errorConfig: {
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } = res;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error;
      }
    },
    errorHandler: (error, opts) => {
      if (opts?.skipErrorHandler) throw error;
      console.error('Request error:', error);
    },
  },
};