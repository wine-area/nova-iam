import { request } from '@umijs/max';

export interface ThemeConfig {
  realmName: string;
  themeName: string;
  primaryColor?: string;
  backgroundColor?: string;
  logoUrl?: string;
  logoFile?: string;
  customCss?: string;
}

export interface ThemePreview {
  templateHtml: string;
  cssContent: string;
}

export interface ThemeListItem {
  name: string;
  displayName: string;
  preview?: string;
}

export interface ThemeResponse {
  themeName: string;
  message: string;
  realmName: string;
}

export async function listThemes(): Promise<ThemeListItem[]> {
  return request('/api/themes', {
    method: 'GET',
  });
}

export async function previewTheme(themeConfig: ThemeConfig): Promise<ThemePreview> {
  return request('/api/themes/preview', {
    method: 'POST',
    data: themeConfig,
  });
}

export async function createTheme(themeConfig: ThemeConfig): Promise<ThemeResponse> {
  return request('/api/themes', {
    method: 'POST',
    data: themeConfig,
  });
}

export async function deployTheme(realmName: string, themeConfig: ThemeConfig): Promise<ThemeResponse> {
  return request(`/api/themes/${realmName}/deploy`, {
    method: 'POST',
    data: { ...themeConfig, realmName },
  });
}