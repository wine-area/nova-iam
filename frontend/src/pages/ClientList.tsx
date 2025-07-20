import React, { useState, useEffect } from 'react';
import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, Switch, message, Popconfirm, Space, Tooltip, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined, EyeOutlined } from '@ant-design/icons';
import { useParams } from 'umi';
import {
  ClientDto,
  CreateClientRequest,
  UpdateClientRequest,
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
  regenerateClientSecret,
} from '@/services/clientService';

const ClientList: React.FC = () => {
  const { realmName } = useParams<{ realmName: string }>();
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [secretModalVisible, setSecretModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientDto | null>(null);
  const [newSecret, setNewSecret] = useState<string>('');
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const loadClients = async () => {
    if (!realmName) return;
    
    setLoading(true);
    try {
      const data = await getAllClients(realmName);
      setClients(data);
    } catch (error) {
      message.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, [realmName]);

  const handleCreate = async (values: CreateClientRequest) => {
    if (!realmName) return;
    
    try {
      await createClient(realmName, values);
      message.success('Client created successfully');
      setCreateModalVisible(false);
      form.resetFields();
      loadClients();
    } catch (error) {
      message.error('Failed to create client');
    }
  };

  const handleEdit = async (values: UpdateClientRequest) => {
    if (!realmName || !selectedClient) return;
    
    try {
      await updateClient(realmName, selectedClient.clientId, values);
      message.success('Client updated successfully');
      setEditModalVisible(false);
      editForm.resetFields();
      setSelectedClient(null);
      loadClients();
    } catch (error) {
      message.error('Failed to update client');
    }
  };

  const handleDelete = async (clientId: string) => {
    if (!realmName) return;
    
    try {
      await deleteClient(realmName, clientId);
      message.success('Client deleted successfully');
      loadClients();
    } catch (error) {
      message.error('Failed to delete client');
    }
  };

  const handleRegenerateSecret = async (clientId: string) => {
    if (!realmName) return;
    
    try {
      const result = await regenerateClientSecret(realmName, clientId);
      setNewSecret(result.secret);
      setSecretModalVisible(true);
      message.success('Client secret regenerated');
      loadClients();
    } catch (error) {
      message.error('Failed to regenerate client secret');
    }
  };

  const openEditModal = (client: ClientDto) => {
    setSelectedClient(client);
    editForm.setFieldsValue({
      name: client.name,
      description: client.description,
      enabled: client.enabled,
      redirectUris: client.redirectUris.join('\n'),
      webOrigins: client.webOrigins.join('\n'),
      publicClient: client.publicClient,
      standardFlowEnabled: client.standardFlowEnabled,
      directAccessGrantsEnabled: client.directAccessGrantsEnabled,
      serviceAccountsEnabled: client.serviceAccountsEnabled,
    });
    setEditModalVisible(true);
  };

  const columns: ProColumns<ClientDto>[] = [
    {
      title: 'Client ID',
      dataIndex: 'clientId',
      key: 'clientId',
      width: 200,
      render: (text: string, record: ClientDto) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          {record.name && <div style={{ fontSize: '12px', color: '#666' }}>{record.name}</div>}
        </div>
      ),
    },
    {
      title: 'Type',
      key: 'type',
      width: 100,
      render: (_, record: ClientDto) => (
        <Tag color={record.publicClient ? 'blue' : 'green'}>
          {record.publicClient ? 'Public' : 'Confidential'}
        </Tag>
      ),
    },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Flows',
      key: 'flows',
      width: 150,
      render: (_, record: ClientDto) => (
        <div style={{ fontSize: '12px' }}>
          {record.standardFlowEnabled && <Tag size="small" color="blue">Standard</Tag>}
          {record.directAccessGrantsEnabled && <Tag size="small" color="green">Direct</Tag>}
          {record.serviceAccountsEnabled && <Tag size="small" color="orange">Service</Tag>}
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record: ClientDto) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
              size="small"
            />
          </Tooltip>
          {!record.publicClient && (
            <Tooltip title="Regenerate Secret">
              <Button
                type="text"
                icon={<KeyOutlined />}
                onClick={() => handleRegenerateSecret(record.clientId)}
                size="small"
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Are you sure you want to delete this client?"
            onConfirm={() => handleDelete(record.clientId)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title={`Clients - ${realmName}`}
      extra={[
        <Button
          key="create"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          Create Client
        </Button>,
      ]}
    >
      <ProTable<ClientDto>
        dataSource={clients}
        columns={columns}
        loading={loading}
        rowKey="id"
        search={false}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Total ${total} clients`,
        }}
      />

      {/* Create Client Modal */}
      <Modal
        title="Create Client"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="clientId"
            label="Client ID"
            rules={[{ required: true, message: 'Please enter client ID' }]}
          >
            <Input placeholder="Enter client ID" />
          </Form.Item>
          
          <Form.Item name="name" label="Name">
            <Input placeholder="Enter client name" />
          </Form.Item>
          
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Enter client description" rows={3} />
          </Form.Item>

          <Form.Item name="enabled" label="Enabled" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>

          <Form.Item name="publicClient" label="Public Client" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="redirectUris" label="Valid Redirect URIs">
            <Input.TextArea 
              placeholder="Enter redirect URIs (one per line)"
              rows={3}
            />
          </Form.Item>

          <Form.Item name="webOrigins" label="Web Origins">
            <Input.TextArea 
              placeholder="Enter web origins (one per line)"
              rows={2}
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <Form.Item name="standardFlowEnabled" label="Standard Flow" valuePropName="checked" initialValue={true}>
              <Switch />
            </Form.Item>
            
            <Form.Item name="directAccessGrantsEnabled" label="Direct Access Grants" valuePropName="checked" initialValue={true}>
              <Switch />
            </Form.Item>
            
            <Form.Item name="serviceAccountsEnabled" label="Service Accounts" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
              <Button onClick={() => {
                setCreateModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Client Modal */}
      <Modal
        title="Edit Client"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
          setSelectedClient(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEdit}
        >
          <Form.Item name="name" label="Name">
            <Input placeholder="Enter client name" />
          </Form.Item>
          
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Enter client description" rows={3} />
          </Form.Item>

          <Form.Item name="enabled" label="Enabled" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="publicClient" label="Public Client" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="redirectUris" label="Valid Redirect URIs">
            <Input.TextArea 
              placeholder="Enter redirect URIs (one per line)"
              rows={3}
            />
          </Form.Item>

          <Form.Item name="webOrigins" label="Web Origins">
            <Input.TextArea 
              placeholder="Enter web origins (one per line)"
              rows={2}
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <Form.Item name="standardFlowEnabled" label="Standard Flow" valuePropName="checked">
              <Switch />
            </Form.Item>
            
            <Form.Item name="directAccessGrantsEnabled" label="Direct Access Grants" valuePropName="checked">
              <Switch />
            </Form.Item>
            
            <Form.Item name="serviceAccountsEnabled" label="Service Accounts" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button onClick={() => {
                setEditModalVisible(false);
                editForm.resetFields();
                setSelectedClient(null);
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Secret Modal */}
      <Modal
        title="Client Secret"
        open={secretModalVisible}
        onCancel={() => {
          setSecretModalVisible(false);
          setNewSecret('');
        }}
        footer={[
          <Button key="close" onClick={() => {
            setSecretModalVisible(false);
            setNewSecret('');
          }}>
            Close
          </Button>,
        ]}
      >
        <div style={{ padding: '16px 0' }}>
          <p><strong>New client secret:</strong></p>
          <Input.TextArea
            value={newSecret}
            readOnly
            rows={3}
            style={{ fontFamily: 'monospace' }}
          />
          <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
            ⚠️ Make sure to copy this secret now. You won't be able to see it again!
          </p>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default ClientList;