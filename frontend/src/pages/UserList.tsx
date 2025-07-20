import React, { useState, useEffect } from 'react';
import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, Switch, message } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, history } from '@umijs/max';
import { UserDto, CreateUserRequest, getUsers, createUser } from '@/services/userService';

const UserList: React.FC = () => {
  const { realmName } = useParams<{ realmName: string }>();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const loadUsers = async () => {
    if (!realmName) return;
    setLoading(true);
    try {
      const data = await getUsers(realmName);
      setUsers(data);
    } catch (error) {
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [realmName]);

  const handleCreate = async (values: CreateUserRequest) => {
    if (!realmName) return;
    try {
      await createUser(realmName, values);
      message.success('User created successfully');
      setModalVisible(false);
      form.resetFields();
      loadUsers();
    } catch (error) {
      message.error('Failed to create user');
    }
  };

  const columns: ProColumns<UserDto>[] = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
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
      title: 'Email Verified',
      dataIndex: 'emailVerified',
      key: 'emailVerified',
      render: (verified: boolean) => (
        <Switch checked={verified} disabled />
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: `User Management - ${realmName}`,
        extra: [
          <Button
            key="back"
            icon={<ArrowLeftOutlined />}
            onClick={() => history.push('/realms')}
          >
            Back to Realms
          </Button>,
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Create User
          </Button>,
        ],
      }}
    >
      <ProTable<UserDto>
        columns={columns}
        dataSource={users}
        loading={loading}
        search={false}
        pagination={{
          pageSize: 10,
        }}
        rowKey="id"
      />

      <Modal
        title="Create New User"
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
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: 'email', message: 'Please enter valid email' }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            name="firstName"
            label="First Name"
          >
            <Input placeholder="Enter first name" />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
          >
            <Input placeholder="Enter last name" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password placeholder="Enter password" />
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

export default UserList;