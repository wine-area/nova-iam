import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Alert } from 'antd';

const ThemeDesigner: React.FC = () => {
  return (
    <PageContainer
      header={{
        title: 'Theme Designer',
      }}
    >
      <Card>
        <Alert
          message="Theme Designer Coming Soon"
          description="This feature will allow you to visually design custom login themes for different Keycloak realms. Stay tuned for the next update!"
          type="info"
          showIcon
        />
      </Card>
    </PageContainer>
  );
};

export default ThemeDesigner;