import React, { useState, useEffect } from 'react';
import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, message, Switch, Space, Tag } from 'antd';
import { PlusOutlined, PlayCircleOutlined, PauseCircleOutlined, LinkOutlined } from '@ant-design/icons';
import { microFrontendService, MicroAppConfig } from '@/services/microFrontendService';

interface MicroApp {
  id: string;
  name: string;
  displayName: string;
  entry: string;
  activeRule: string;
  container: string;
  enabled: boolean;
  status: 'loaded' | 'unloaded' | 'loading';
  props?: Record<string, any>;
}

const Applications: React.FC = () => {
  const [apps, setApps] = useState<MicroApp[]>([
    {
      id: 'demo-app',
      name: 'demo-app',
      displayName: 'Demo Application',
      entry: 'http://localhost:3001',
      activeRule: '/sub-app/demo',
      container: '#demo-app-container',
      enabled: true,
      status: 'unloaded',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Simulate getting current auth info for demonstration
    const mockToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.demo.token';
    const mockUser = { username: 'admin', email: 'admin@nova-iam.com', firstName: 'Admin', lastName: 'User' };
    localStorage.setItem('nova_iam_token', mockToken);
    localStorage.setItem('nova_iam_user', JSON.stringify(mockUser));
  }, []);

  const handleCreate = async (values: any) => {
    const newApp: MicroApp = {
      id: values.name,
      name: values.name,
      displayName: values.displayName,
      entry: values.entry,
      activeRule: values.activeRule,
      container: `#${values.name}-container`,
      enabled: true,
      status: 'unloaded',
    };

    setApps([...apps, newApp]);
    setModalVisible(false);
    form.resetFields();
    message.success('Application registered successfully');
  };

  const handleToggleApp = async (app: MicroApp) => {
    setLoading(true);
    try {
      const updatedApps = [...apps];
      const appIndex = updatedApps.findIndex(a => a.id === app.id);
      
      if (app.status === 'loaded') {
        // Unload the app
        await microFrontendService.unloadApp(app.name);
        updatedApps[appIndex] = { ...app, status: 'unloaded' };
        message.success(`${app.displayName} unloaded successfully`);
      } else {
        // Load the app
        updatedApps[appIndex] = { ...app, status: 'loading' };
        setApps(updatedApps);
        
        try {
          const config: MicroAppConfig = {
            name: app.name,
            entry: app.entry,
            container: app.container,
            activeRule: app.activeRule,
          };
          
          await microFrontendService.loadApp(config);
          updatedApps[appIndex] = { ...app, status: 'loaded' };
          message.success(`${app.displayName} loaded successfully`);
        } catch (error) {
          updatedApps[appIndex] = { ...app, status: 'unloaded' };
          message.error(`Failed to load ${app.displayName}: ${error}`);
        }
      }
      
      setApps(updatedApps);
    } catch (error) {
      message.error(`Operation failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'loaded':
        return 'green';
      case 'loading':
        return 'blue';
      case 'unloaded':
        return 'default';
      default:
        return 'default';
    }
  };

  const columns: ProColumns<MicroApp>[] = [
    {
      title: 'Application Name',
      dataIndex: 'displayName',
      key: 'displayName',
    },
    {
      title: 'Entry URL',
      dataIndex: 'entry',
      key: 'entry',
      ellipsis: true,
      render: (text: string) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          <LinkOutlined /> {text}
        </a>
      ),
    },
    {
      title: 'Active Rule',
      dataIndex: 'activeRule',
      key: 'activeRule',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Switch checked={enabled} disabled />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type={record.status === 'loaded' ? 'default' : 'primary'}
            icon={record.status === 'loaded' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => handleToggleApp(record)}
            loading={record.status === 'loading'}
            size="small"
          >
            {record.status === 'loaded' ? 'Unload' : 'Load'}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              if (record.status === 'loaded') {
                // Scroll to the app container
                const container = document.querySelector(record.container);
                if (container) {
                  container.scrollIntoView({ behavior: 'smooth' });
                }
              } else {
                message.info('Please load the application first');
              }
            }}
          >
            {record.status === 'loaded' ? 'View' : 'Load First'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'Application Management',
        subTitle: 'Manage micro-frontend applications',
        extra: [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Register Application
          </Button>,
        ],
      }}
    >
      <ProTable<MicroApp>
        columns={columns}
        dataSource={apps}
        loading={loading}
        search={false}
        pagination={{
          pageSize: 10,
        }}
        rowKey="id"
      />

      {/* Container for micro-apps */}
      <div style={{ marginTop: 24 }}>
        {apps.map((app) => (
          <div key={app.id} style={{ marginBottom: '16px' }}>
            {app.status === 'loaded' && (
              <div
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  padding: '16px',
                  backgroundColor: '#fafafa',
                }}
              >
                <h3 style={{ margin: '0 0 16px 0' }}>
                  {app.displayName} <Tag color="green">LOADED</Tag>
                </h3>
                <div
                  id={app.id + '-container'}
                  style={{
                    minHeight: '400px',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    border: '1px solid #e8e8e8',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        title="Register New Application"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="name"
            label="Application Name"
            rules={[{ required: true, message: 'Please enter application name' }]}
          >
            <Input placeholder="e.g., user-management-app" />
          </Form.Item>
          <Form.Item
            name="displayName"
            label="Display Name"
            rules={[{ required: true, message: 'Please enter display name' }]}
          >
            <Input placeholder="e.g., User Management System" />
          </Form.Item>
          <Form.Item
            name="entry"
            label="Entry URL"
            rules={[{ required: true, message: 'Please enter entry URL' }]}
          >
            <Input placeholder="http://localhost:3001" />
          </Form.Item>
          <Form.Item
            name="activeRule"
            label="Active Rule (Route Path)"
            rules={[{ required: true, message: 'Please enter active rule' }]}
          >
            <Input placeholder="/sub-app/user-management" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Applications;