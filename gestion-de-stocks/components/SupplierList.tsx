"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Typography,
  Modal,
  Form,
  message,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { mockSuppliers } from "@/data/mockData";
import type { ColumnsType } from "antd/es/table";
import type { Supplier } from "@/types";

const { Title, Text } = Typography;

export function SupplierList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [form] = Form.useForm();

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchText.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    form.setFieldsValue(supplier);
    setIsModalOpen(true);
  };

  const handleDeleteSupplier = (id: string) => {
    Modal.confirm({
      title: "Confirmer la suppression",
      content: "Etes-vous sur de vouloir supprimer ce fournisseur ?",
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk: () => {
        setSuppliers(suppliers.filter((s) => s.id !== id));
        message.success("Fournisseur supprime avec succes");
      },
    });
  };

  const handleFormSubmit = (values: Omit<Supplier, "id">) => {
    if (editingSupplier) {
      setSuppliers(
        suppliers.map((s) =>
          s.id === editingSupplier.id ? { ...s, ...values } : s
        )
      );
      message.success("Fournisseur modifie avec succes");
    } else {
      const newSupplier: Supplier = {
        id: String(Date.now()),
        ...values,
      };
      setSuppliers([newSupplier, ...suppliers]);
      message.success("Fournisseur ajoute avec succes");
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns: ColumnsType<Supplier> = [
    {
      title: "Fournisseur",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{ backgroundColor: "#3b82f6" }}
          />
          <div>
            <Text className="text-foreground font-medium">{record.name}</Text>
            <br />
            <Text className="text-muted-foreground text-xs">{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Telephone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => (
        <Space>
          <PhoneOutlined className="text-muted-foreground" />
          <Text className="text-foreground">{phone}</Text>
        </Space>
      ),
    },
    {
      title: "Adresse",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <Space>
          <EnvironmentOutlined className="text-muted-foreground" />
          <Text className="text-muted-foreground">{address}</Text>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditSupplier(record)}
            className="text-foreground"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteSupplier(record.id)}
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <Title level={2} className="text-foreground mb-1">
            Fournisseurs
          </Title>
          <Text className="text-muted-foreground">
            Gerez vos contacts fournisseurs
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSupplier}>
          Ajouter un fournisseur
        </Button>
      </div>

      <Card bordered={false}>
        <Input
          placeholder="Rechercher un fournisseur..."
          prefix={<SearchOutlined className="text-muted-foreground" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-4 md:w-80"
          allowClear
        />

        <Table
          dataSource={filteredSuppliers}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `${total} fournisseur${total > 1 ? "s" : ""}`,
          }}
        />
      </Card>

      <Modal
        title={editingSupplier ? "Modifier le fournisseur" : "Ajouter un fournisseur"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Nom du fournisseur"
            rules={[{ required: true, message: "Veuillez entrer le nom" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Ex: Apple Inc." />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Veuillez entrer l'email" },
              { type: "email", message: "Email invalide" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="contact@example.com" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telephone"
            rules={[{ required: true, message: "Veuillez entrer le telephone" }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="+1 234 567 890" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Adresse"
            rules={[{ required: true, message: "Veuillez entrer l'adresse" }]}
          >
            <Input prefix={<EnvironmentOutlined />} placeholder="Ville, Pays" />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button type="primary" htmlType="submit">
              {editingSupplier ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
