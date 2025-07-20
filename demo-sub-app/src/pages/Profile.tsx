import React from 'react';
import { Card, Descriptions, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Props {
  token?: string;
  user?: any;
}

const Profile: React.FC<Props> = ({ token, user }) => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <UserOutlined /> User Profile
      </Title>
      
      <Card title="Profile Information" bordered={false}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Username">
            {user?.username || 'Not available'}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {user?.email || 'Not available'}
          </Descriptions.Item>
          <Descriptions.Item label="First Name">
            {user?.firstName || 'Not available'}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name">
            {user?.lastName || 'Not available'}
          </Descriptions.Item>
          <Descriptions.Item label="Authentication Status">
            <Tag color={token ? 'green' : 'red'}>
              {token ? 'Authenticated' : 'Not Authenticated'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Token Length">
            {token ? token.length : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      
      <Card title="Raw Data" style={{ marginTop: 16 }} bordered={false}>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '4px' }}>
          {JSON.stringify({ token: token ? '***masked***' : null, user }, null, 2)}
        </pre>
      </Card>
    </div>
  );
};

export default Profile;