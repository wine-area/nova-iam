import React, { useState, useEffect } from 'react';
import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, Switch, message, Popconfirm, Space, Tooltip, Tag, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useParams } from 'umi';
import {
  RoleDto,
  CreateRoleRequest,
  UpdateRoleRequest,
  getRealmRoles,
  createRealmRole,
  updateRealmRole,
  deleteRealmRole,
  getClientRoles,
  createClientRole,
  updateClientRole,
  deleteClientRole,
} from '@/services/roleService';
import { getAllClients, ClientDto } from '@/services/clientService';

const { TabPane } = Tabs;

const RoleList: React.FC = () => {
  const { realmName } = useParams<{ realmName: string }>();
  const [realmRoles, setRealmRoles] = useState<RoleDto[]>([]);
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [clientRoles, setClientRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleDto | null>(null);
  const [isClientRole, setIsClientRole] = useState(false);
  const [activeTab, setActiveTab] = useState('realm');
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const loadRealmRoles = async () => {
    if (!realmName) return;
    
    setLoading(true);
    try {
      const data = await getRealmRoles(realmName);
      setRealmRoles(data);
    } catch (error) {
      message.error('Failed to load realm roles');
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    if (!realmName) return;
    
    try {
      const data = await getAllClients(realmName);
      setClients(data);
      if (data.length > 0 && !selectedClientId) {
        setSelectedClientId(data[0].clientId);
      }
    } catch (error) {
      message.error('Failed to load clients');
    }
  };

  const loadClientRoles = async (clientId?: string) => {
    if (!realmName) return;
    
    const targetClientId = clientId || selectedClientId;
    if (!targetClientId) return;

    setLoading(true);
    try {
      const data = await getClientRoles(realmName, targetClientId);
      setClientRoles(data);
    } catch (error) {
      message.error('Failed to load client roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealmRoles();
    loadClients();
  }, [realmName]);

  useEffect(() => {
    if (selectedClientId && activeTab === 'client') {
      loadClientRoles();
    }
  }, [selectedClientId, activeTab]);

  const handleCreate = async (values: CreateRoleRequest) => {
    if (!realmName) return;
    
    try {
      if (isClientRole && selectedClientId) {
        await createClientRole(realmName, selectedClientId, values);
        message.success('Client role created successfully');
        loadClientRoles();
      } else {
        await createRealmRole(realmName, values);
        message.success('Realm role created successfully');
        loadRealmRoles();
      }
      setCreateModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to create role');
    }
  };

  const handleEdit = async (values: UpdateRoleRequest) => {
    if (!realmName || !selectedRole) return;
    
    try {
      if (selectedRole.clientRole && selectedClientId) {
        await updateClientRole(realmName, selectedClientId, selectedRole.name, values);
        message.success('Client role updated successfully');
        loadClientRoles();
      } else {
        await updateRealmRole(realmName, selectedRole.name, values);
        message.success('Realm role updated successfully');
        loadRealmRoles();
      }
      setEditModalVisible(false);
      editForm.resetFields();
      setSelectedRole(null);
    } catch (error) {
      message.error('Failed to update role');
    }
  };

  const handleDelete = async (role: RoleDto) => {
    if (!realmName) return;
    
    try {
      if (role.clientRole && selectedClientId) {
        await deleteClientRole(realmName, selectedClientId, role.name);
        message.success('Client role deleted successfully');
        loadClientRoles();
      } else {
        await deleteRealmRole(realmName, role.name);
        message.success('Realm role deleted successfully');
        loadRealmRoles();
      }
    } catch (error) {
      message.error('Failed to delete role');
    }
  };

  const openCreateModal = (clientRole: boolean = false) => {
    setIsClientRole(clientRole);
    setCreateModalVisible(true);
  };

  const openEditModal = (role: RoleDto) => {
    setSelectedRole(role);
    editForm.setFieldsValue({
      name: role.name,
      description: role.description,
      composite: role.composite,
    });
    setEditModalVisible(true);
  };

  const columns: ProColumns<RoleDto>[] = [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: RoleDto) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          {record.composite && <Tag size="small" color="purple">Composite</Tag>}
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
      title: 'Type',
      key: 'type',
      width: 100,
      render: (_, record: RoleDto) => (
        <Tag color={record.clientRole ? 'blue' : 'green'}>
          {record.clientRole ? 'Client' : 'Realm'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record: RoleDto) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this role?"
            onConfirm={() => handleDelete(record)}
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
      title={`Role Management - ${realmName}`}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Realm Roles" key="realm">
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openCreateModal(false)}
            >
              Create Realm Role
            </Button>
          </div>
          <ProTable<RoleDto>
            dataSource={realmRoles}
            columns={columns}
            loading={loading}
            rowKey="id"
            search={false}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total ${total} realm roles`,
            }}
          />
        </TabPane>
        <TabPane tab="Client Roles" key="client">
          <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
            <div>
              <label style={{ marginRight: 8 }}>Client:</label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
              >
                {clients.map((client) => (
                  <option key={client.clientId} value={client.clientId}>
                    {client.name || client.clientId}
                  </option>
                ))}
              </select>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openCreateModal(true)}
              disabled={!selectedClientId}
            >
              Create Client Role
            </Button>
          </div>
          <ProTable<RoleDto>
            dataSource={clientRoles}
            columns={columns}
            loading={loading}
            rowKey="id"
            search={false}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total ${total} client roles`,
            }}
          />
        </TabPane>
      </Tabs>

      {/* Create Role Modal */}
      <Modal
        title={`Create ${isClientRole ? 'Client' : 'Realm'} Role`}
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: 'Please enter role name' }]}
          >
            <Input placeholder="Enter role name" />
          </Form.Item>
          
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Enter role description" rows={3} />
          </Form.Item>

          <Form.Item name="composite" label="Composite Role" valuePropName="checked">
            <Switch />
            <div style={{ marginTop: 4, fontSize: '12px', color: '#666' }}>
              Composite roles inherit permissions from other roles
            </div>
          </Form.Item>

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

      {/* Edit Role Modal */}
      <Modal
        title="Edit Role"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
          setSelectedRole(null);
        }}
        footer={null}
        width={500}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEdit}
        >
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: 'Please enter role name' }]}
          >
            <Input placeholder="Enter role name" />
          </Form.Item>
          
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Enter role description" rows={3} />
          </Form.Item>

          <Form.Item name="composite" label="Composite Role" valuePropName="checked">
            <Switch />
            <div style={{ marginTop: 4, fontSize: '12px', color: '#666' }}>
              Composite roles inherit permissions from other roles
            </div>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button onClick={() => {
                setEditModalVisible(false);
                editForm.resetFields();
                setSelectedRole(null);
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default RoleList;