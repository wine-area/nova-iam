import React, { useState, useEffect } from 'react';
import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, Switch, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RealmDto, getAllRealms, createRealm } from '@/services/realmService';

const RealmList: React.FC = () => {
  const [realms, setRealms] = useState<RealmDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const loadRealms = async () => {
    setLoading(true);
    try {
      const data = await getAllRealms();
      setRealms(data);
    } catch (error) {
      message.error('Failed to load realms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealms();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      await createRealm(values);
      message.success('Realm created successfully');
      setModalVisible(false);
      form.resetFields();
      loadRealms();
    } catch (error) {
      message.error('Failed to create realm');
    }
  };

  const columns: ProColumns<RealmDto>[] = [
    {
      title: 'Realm Name',
      dataIndex: 'realm',
      key: 'realm',
    },
    {
      title: 'Display Name',
      dataIndex: 'displayName',
      key: 'displayName',
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
      title: 'Login Theme',
      dataIndex: 'loginTheme',
      key: 'loginTheme',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            href={`/realms/${record.realm}/users`}
          >
            Manage Users
          </Button>
          <Button
            type="link"
            href={`/realms/${record.realm}/clients`}
          >
            Manage Clients
          </Button>
          <Button
            type="link"
            href={`/realms/${record.realm}/roles`}
          >
            Manage Roles
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'Realm Management',
        extra: [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Create Realm
          </Button>,
        ],
      }}
    >
      <ProTable<RealmDto>
        columns={columns}
        dataSource={realms}
        loading={loading}
        search={false}
        pagination={{
          pageSize: 10,
        }}
        rowKey="realm"
      />

      <Modal
        title="Create New Realm"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="realm"
            label="Realm Name"
            rules={[{ required: true, message: 'Please enter realm name' }]}
          >
            <Input placeholder="Enter realm name" />
          </Form.Item>
          <Form.Item
            name="displayName"
            label="Display Name"
          >
            <Input placeholder="Enter display name" />
          </Form.Item>
          <Form.Item
            name="enabled"
            label="Enabled"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default RealmList;