import React from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Tag } from 'antd';
import { UserOutlined, SettingOutlined, DashboardOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface Props {
  token?: string;
  user?: any;
}

const Dashboard: React.FC<Props> = ({ token, user }) => {
  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>
            <DashboardOutlined /> Demo Sub-Application Dashboard
          </Title>
          <Paragraph>
            This is a demo micro-frontend sub-application loaded within Nova IAM.
            It demonstrates how sub-applications can be integrated seamlessly.
          </Paragraph>
        </div>

        {/* Token and User Info */}
        <Card title="Authentication Info" bordered={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Token Status"
                  value={token ? 'Authenticated' : 'Not Authenticated'}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: token ? '#3f8600' : '#cf1322' }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="User Info"
                  value={user?.username || 'No user data'}
                  prefix={<SettingOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Demo Features */}
        <Card title="Demo Features" bordered={false}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card size="small" title="Isolated Styles">
                <Paragraph>
                  This sub-app has its own styling that doesn't interfere with the main application.
                </Paragraph>
                <Tag color="blue">CSS Isolation</Tag>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" title="Token Sharing">
                <Paragraph>
                  Authentication tokens are shared from the main application to sub-applications.
                </Paragraph>
                <Tag color="green">Token: {token ? 'Received' : 'Missing'}</Tag>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" title="Independent Routing">
                <Paragraph>
                  Sub-applications can have their own routing system that works independently.
                </Paragraph>
                <Tag color="purple">Route: /dashboard</Tag>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Debug Info */}
        <Card title="Debug Information" bordered={false}>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '4px' }}>
            {JSON.stringify({ 
              hasToken: !!token, 
              tokenLength: token?.length,
              user: user || 'null',
              timestamp: new Date().toISOString()
            }, null, 2)}
          </pre>
        </Card>
      </Space>
    </div>
  );
};

export default Dashboard;