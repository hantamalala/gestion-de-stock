"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Typography,
  Modal,
  Form,
  InputNumber,
  Select,
  Dropdown,
  message,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  FilterOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { mockProducts, mockCategories, mockSuppliers } from "@/data/mockData";
import type { ColumnsType } from "antd/es/table";
import type { Product } from "@/types";
import type { MenuProps } from "antd";

const { Title, Text } = Typography;

const statusConfig = {
  in_stock: { color: "green", text: "En stock" },
  low_stock: { color: "orange", text: "Stock faible" },
  out_of_stock: { color: "red", text: "Rupture" },
};

export function ProductList() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchText.toLowerCase()) ||
      product.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    Modal.confirm({
      title: "Confirmer la suppression",
      content: "Etes-vous sur de vouloir supprimer ce produit ?",
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk: () => {
        setProducts(products.filter((p) => p.id !== id));
        message.success("Produit supprime avec succes");
      },
    });
  };

  const handleFormSubmit = (values: Partial<Product>) => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...values,
                status:
                  values.quantity === 0
                    ? "out_of_stock"
                    : values.quantity! < values.minQuantity!
                    ? "low_stock"
                    : "in_stock",
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : p
        )
      );
      message.success("Produit modifie avec succes");
    } else {
      const newProduct: Product = {
        id: String(Date.now()),
        name: values.name!,
        sku: values.sku!,
        category: values.category!,
        quantity: values.quantity!,
        minQuantity: values.minQuantity!,
        price: values.price!,
        supplier: values.supplier!,
        lastUpdated: new Date().toISOString().split("T")[0],
        status:
          values.quantity === 0
            ? "out_of_stock"
            : values.quantity! < values.minQuantity!
            ? "low_stock"
            : "in_stock",
      };
      setProducts([newProduct, ...products]);
      message.success("Produit ajoute avec succes");
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const getActionItems = (record: Product): MenuProps["items"] => [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Modifier",
      onClick: () => handleEditProduct(record),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Supprimer",
      danger: true,
      onClick: () => handleDeleteProduct(record.id),
    },
  ];

  const columns: ColumnsType<Product> = [
    {
      title: "Produit",
      key: "product",
      render: (_, record) => (
        <div>
          <Text className="text-foreground font-medium">{record.name}</Text>
          <br />
          <Text className="text-muted-foreground text-xs font-mono">{record.sku}</Text>
        </div>
      ),
    },
    {
      title: "Categorie",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag>{category}</Tag>,
      filters: mockCategories.map((c) => ({ text: c.name, value: c.name })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Stock",
      key: "stock",
      render: (_, record) => (
        <div>
          <Text className="text-foreground">{record.quantity}</Text>
          <Text className="text-muted-foreground text-xs"> / {record.minQuantity} min</Text>
        </div>
      ),
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Prix",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Text className="text-foreground">
          {price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} Ar
        </Text>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Fournisseur",
      dataIndex: "supplier",
      key: "supplier",
      render: (supplier) => <Text className="text-muted-foreground">{supplier}</Text>,
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status: keyof typeof statusConfig) => {
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: "En stock", value: "in_stock" },
        { text: "Stock faible", value: "low_stock" },
        { text: "Rupture", value: "out_of_stock" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "",
      key: "actions",
      width: 50,
      render: (_, record) => (
        <Dropdown menu={{ items: getActionItems(record) }} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} className="text-foreground" />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <Title level={2} className="text-foreground mb-1">
            Produits
          </Title>
          <Text className="text-muted-foreground">
            Gerez votre inventaire de produits
          </Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />}>Exporter</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
            Ajouter un produit
          </Button>
        </Space>
      </div>

      <Card bordered={false}>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            placeholder="Rechercher un produit..."
            prefix={<SearchOutlined className="text-muted-foreground" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="md:w-80"
            allowClear
          />
          <Button icon={<FilterOutlined />}>Filtres</Button>
        </div>

        <Table
          dataSource={filteredProducts}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} sur ${total} produits`,
          }}
        />
      </Card>

      <Modal
        title={editingProduct ? "Modifier le produit" : "Ajouter un produit"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Nom du produit"
            rules={[{ required: true, message: "Veuillez entrer le nom du produit" }]}
          >
            <Input placeholder="Ex: MacBook Pro 14&quot;" />
          </Form.Item>

          <Form.Item
            name="sku"
            label="Reference (SKU)"
            rules={[{ required: true, message: "Veuillez entrer la reference" }]}
          >
            <Input placeholder="Ex: APPLE-MBP14-001" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="category"
              label="Categorie"
              rules={[{ required: true, message: "Selectionnez une categorie" }]}
            >
              <Select placeholder="Selectionnez">
                {mockCategories.map((cat) => (
                  <Select.Option key={cat.id} value={cat.name}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="supplier"
              label="Fournisseur"
              rules={[{ required: true, message: "Selectionnez un fournisseur" }]}
            >
              <Select placeholder="Selectionnez">
                {mockSuppliers.map((sup) => (
                  <Select.Option key={sup.id} value={sup.name}>
                    {sup.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              name="quantity"
              label="Quantite"
              rules={[{ required: true, message: "Entrez la quantite" }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item
              name="minQuantity"
              label="Seuil minimum"
              rules={[{ required: true, message: "Entrez le seuil" }]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Prix (Ar)"
              rules={[{ required: true, message: "Entrez le prix" }]}
            >
              <InputNumber min={0} step={0.01} className="w-full" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button type="primary" htmlType="submit">
              {editingProduct ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
