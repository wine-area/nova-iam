import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import {
  Card,
  Form,
  Input,
  ColorPicker,
  Button,
  Select,
  Upload,
  message,
  Row,
  Col,
  Space,
  Modal,
  Divider,
  Typography,
} from 'antd';
import {
  CloudUploadOutlined,
  EyeOutlined,
  SaveOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { listRealms } from '@/services/realmService';
import {
  createTheme,
  deployTheme,
  previewTheme,
  type ThemeConfig,
  type ThemePreview,
} from '@/services/themeService';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Paragraph } = Typography;

const ThemeDesigner: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [realms, setRealms] = useState<any[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState<ThemePreview | null>(null);
  const [logoFile, setLogoFile] = useState<string | null>(null);

  useEffect(() => {
    loadRealms();
  }, []);

  const loadRealms = async () => {
    try {
      const realmList = await listRealms();
      setRealms(realmList);
    } catch (error) {
      message.error('Failed to load realms');
    }
  };

  const handleImageUpload = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoFile(result);
        form.setFieldValue('logoFile', result);
        resolve(false); // Prevent default upload behavior
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePreview = async () => {
    try {
      const values = await form.validateFields();
      setPreviewLoading(true);

      const themeConfig: ThemeConfig = {
        realmName: values.realmName,
        themeName: values.themeName || `nova-theme-${Date.now()}`,
        primaryColor: values.primaryColor?.toHexString?.() || values.primaryColor,
        backgroundColor: values.backgroundColor?.toHexString?.() || values.backgroundColor,
        logoUrl: values.logoUrl,
        logoFile: logoFile || undefined,
        customCss: values.customCss,
      };

      const preview = await previewTheme(themeConfig);
      setPreviewData(preview);
      setPreviewVisible(true);
    } catch (error) {
      message.error('Failed to generate preview');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const themeConfig: ThemeConfig = {
        realmName: values.realmName,
        themeName: values.themeName || `nova-theme-${Date.now()}`,
        primaryColor: values.primaryColor?.toHexString?.() || values.primaryColor,
        backgroundColor: values.backgroundColor?.toHexString?.() || values.backgroundColor,
        logoUrl: values.logoUrl,
        logoFile: logoFile || undefined,
        customCss: values.customCss,
      };

      const response = await createTheme(themeConfig);
      message.success(`Theme "${response.themeName}" created and deployed successfully!`);
      form.resetFields();
      setLogoFile(null);
    } catch (error: any) {
      message.error(error.message || 'Failed to create theme');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      header={{
        title: 'Theme Designer',
        subTitle: 'Design custom login themes for your Keycloak realms',
      }}
    >
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card title="Theme Configuration" bordered={false}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                primaryColor: '#1890ff',
                backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="realmName"
                    label="Target Realm"
                    rules={[{ required: true, message: 'Please select a realm' }]}
                  >
                    <Select placeholder="Select realm to apply theme">
                      {realms.map((realm) => (
                        <Option key={realm.realm} value={realm.realm}>
                          {realm.displayName || realm.realm}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="themeName"
                    label="Theme Name"
                    tooltip="Leave empty to auto-generate"
                  >
                    <Input placeholder="e.g., my-custom-theme" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Colors</Divider>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="primaryColor" label="Primary Color">
                    <ColorPicker showText />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="backgroundColor" label="Background">
                    <Input placeholder="CSS background value (color, gradient, etc.)" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Logo</Divider>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="logoUrl" label="Logo URL">
                    <Input placeholder="https://example.com/logo.png" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Upload Logo">
                    <Upload
                      accept="image/*"
                      beforeUpload={handleImageUpload}
                      showUploadList={false}
                      maxCount={1}
                    >
                      <Button icon={<PictureOutlined />}>
                        {logoFile ? 'Change Logo' : 'Upload Logo'}
                      </Button>
                    </Upload>
                    {logoFile && (
                      <div style={{ marginTop: 8 }}>
                        <img
                          src={logoFile}
                          alt="Logo preview"
                          style={{ maxWidth: 100, maxHeight: 50 }}
                        />
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Custom Styling</Divider>
              <Form.Item name="customCss" label="Custom CSS">
                <TextArea
                  rows={6}
                  placeholder="Add your custom CSS here..."
                  style={{ fontFamily: 'monospace' }}
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSave}
                    loading={loading}
                  >
                    Create & Deploy Theme
                  </Button>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={handlePreview}
                    loading={previewLoading}
                  >
                    Preview
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Instructions" bordered={false}>
            <Title level={5}>Getting Started</Title>
            <Paragraph>
              1. Select a realm where you want to apply the custom theme
            </Paragraph>
            <Paragraph>
              2. Customize colors, logo, and styling to match your brand
            </Paragraph>
            <Paragraph>
              3. Use the Preview button to see how your theme will look
            </Paragraph>
            <Paragraph>
              4. Click "Create & Deploy" to apply the theme to your realm
            </Paragraph>

            <Divider />

            <Title level={5}>Tips</Title>
            <Paragraph>
              • Use gradients for modern-looking backgrounds
            </Paragraph>
            <Paragraph>
              • Upload PNG/SVG logos for best quality
            </Paragraph>
            <Paragraph>
              • Test your theme with different screen sizes
            </Paragraph>
            <Paragraph>
              • Custom CSS allows advanced styling options
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Theme Preview"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
        bodyStyle={{ padding: 0 }}
      >
        {previewData && (
          <div style={{ height: 600, overflow: 'auto' }}>
            <style>{previewData.cssContent}</style>
            <div dangerouslySetInnerHTML={{ __html: previewData.templateHtml }} />
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default ThemeDesigner;