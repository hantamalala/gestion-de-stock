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
  Tag,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { mockCategories } from "@/data/mockData";
import type { ColumnsType } from "antd/es/table";
import type { Category } from "@/types";

const { Title, Text } = Typography;

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddCategory = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    Modal.confirm({
      title: "Confirmer la suppression",
      content: "Etes-vous sur de vouloir supprimer cette categorie ?",
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk: () => {
        setCategories(categories.filter((c) => c.id !== id));
        message.success("Categorie supprimee avec succes");
      },
    });
  };

  const handleFormSubmit = (values: { name: string }) => {
    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id ? { ...c, name: values.name } : c
        )
      );
      message.success("Categorie modifiee avec succes");
    } else {
      const newCategory: Category = {
        id: String(Date.now()),
        name: values.name,
        productCount: 0,
      };
      setCategories([newCategory, ...categories]);
      message.success("Categorie ajoutee avec succes");
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns: ColumnsType<Category> = [
    {
      title: "Categorie",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <AppstoreOutlined className="text-primary text-lg" />
          </div>
          <Text className="text-foreground font-medium">{record.name}</Text>
        </div>
      ),
    },
    {
      title: "Nombre de produits",
      dataIndex: "productCount",
      key: "productCount",
      render: (count) => (
        <Tag color="blue">{count} produit{count > 1 ? "s" : ""}</Tag>
      ),
      sorter: (a, b) => a.productCount - b.productCount,
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
            onClick={() => handleEditCategory(record)}
            className="text-foreground"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCategory(record.id)}
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
            Categories
          </Title>
          <Text className="text-muted-foreground">
            Organisez vos produits par categories
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory}>
          Ajouter une categorie
        </Button>
      </div>

      <Card bordered={false}>
        <Input
          placeholder="Rechercher une categorie..."
          prefix={<SearchOutlined className="text-muted-foreground" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-4 md:w-80"
          allowClear
        />

        <Table
          dataSource={filteredCategories}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `${total} categorie${total > 1 ? "s" : ""}`,
          }}
        />
      </Card>

      <Modal
        title={editingCategory ? "Modifier la categorie" : "Ajouter une categorie"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Nom de la categorie"
            rules={[{ required: true, message: "Veuillez entrer le nom de la categorie" }]}
          >
            <Input placeholder="Ex: Electronique" />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button type="primary" htmlType="submit">
              {editingCategory ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
