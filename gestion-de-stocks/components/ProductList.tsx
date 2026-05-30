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
  Row,
  Col,
  Statistic,
  Tabs,
  Image,
  Avatar,
  Tooltip,
  Badge,
  Segmented,
  Empty,
  Drawer,
  Descriptions,
  Timeline,
  Divider,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  FilterOutlined,
  ExportOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ShoppingOutlined,
  DollarOutlined,
  WarningOutlined,
  EyeOutlined,
  InboxOutlined,
  TagOutlined,
  BarChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { mockProducts, mockCategories, mockSuppliers } from "@/data/mockData";
import type { ColumnsType } from "antd/es/table";
import type { Product } from "@/types";
import type { MenuProps } from "antd";

const { Title, Text, Paragraph } = Typography;

const statusConfig = {
  in_stock: { color: "green", text: "En stock", bgColor: "bg-emerald-500/10", textColor: "text-emerald-500" },
  low_stock: { color: "orange", text: "Stock faible", bgColor: "bg-amber-500/10", textColor: "text-amber-500" },
  out_of_stock: { color: "red", text: "Rupture", bgColor: "bg-red-500/10", textColor: "text-red-500" },
};

const categoryIcons: Record<string, string> = {
  "Electronique": "💻",
  "Accessoires": "🎧",
  "Mobilier": "🪑",
  "Audio": "🔊",
  "Stockage": "💾",
};

export function ProductList() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [form] = Form.useForm();

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchText.toLowerCase()) ||
      product.category.toLowerCase().includes(searchText.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "in_stock") return matchesSearch && product.status === "in_stock";
    if (activeTab === "low_stock") return matchesSearch && product.status === "low_stock";
    if (activeTab === "out_of_stock") return matchesSearch && product.status === "out_of_stock";
    return matchesSearch;
  });

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.status === "in_stock").length,
    lowStock: products.filter(p => p.status === "low_stock").length,
    outOfStock: products.filter(p => p.status === "out_of_stock").length,
    totalValue: products.reduce((acc, p) => acc + p.price * p.quantity, 0),
  };

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

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
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
      key: "view",
      icon: <EyeOutlined />,
      label: "Voir details",
      onClick: () => handleViewProduct(record),
    },
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
        <div className="flex items-center gap-3">
          <Avatar 
            size={48} 
            className="bg-primary/10 text-primary flex-shrink-0"
            icon={<ShoppingOutlined />}
          />
          <div className="min-w-0">
            <Text className="text-foreground font-medium block truncate">{record.name}</Text>
            <Text className="text-muted-foreground text-xs font-mono">{record.sku}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Categorie",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tag className="border-0 bg-primary/10 text-primary">
          {categoryIcons[category] || "📦"} {category}
        </Tag>
      ),
      filters: mockCategories.map((c) => ({ text: c.name, value: c.name })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Stock",
      key: "stock",
      render: (_, record) => (
        <div className="flex flex-col">
          <Text className="text-foreground font-semibold text-lg">{record.quantity}</Text>
          <Text className="text-muted-foreground text-xs">Min: {record.minQuantity}</Text>
        </div>
      ),
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Prix unitaire",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Text className="text-foreground font-medium">
          {price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} Ar
        </Text>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Valeur stock",
      key: "stockValue",
      render: (_, record) => (
        <Text className="text-accent font-medium">
          {(record.price * record.quantity).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} Ar
        </Text>
      ),
      sorter: (a, b) => (a.price * a.quantity) - (b.price * b.quantity),
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
        return (
          <Tag className={`border-0 ${config.bgColor} ${config.textColor}`}>
            {config.text}
          </Tag>
        );
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

  const ProductCard = ({ product }: { product: Product }) => {
    const config = statusConfig[product.status];
    return (
      <Card 
        className="h-full hover:border-primary/50 transition-all cursor-pointer group"
        hoverable
        onClick={() => handleViewProduct(product)}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <Avatar 
              size={56} 
              className="bg-primary/10 text-primary"
              icon={<ShoppingOutlined />}
            />
            <Dropdown menu={{ items: getActionItems(product) }} trigger={["click"]}>
              <Button 
                type="text" 
                icon={<MoreOutlined />} 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          </div>
          
          <div className="flex-1 min-w-0">
            <Text className="text-foreground font-semibold text-base block truncate mb-1">
              {product.name}
            </Text>
            <Text className="text-muted-foreground text-xs font-mono block mb-3">
              {product.sku}
            </Text>
            
            <Tag className="border-0 bg-primary/10 text-primary mb-3">
              {categoryIcons[product.category] || "📦"} {product.category}
            </Tag>
          </div>
          
          <Divider className="my-3" />
          
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-muted-foreground text-xs block">Stock</Text>
              <Text className="text-foreground font-bold text-xl">{product.quantity}</Text>
            </div>
            <div className="text-right">
              <Text className="text-muted-foreground text-xs block">Prix</Text>
              <Text className="text-foreground font-semibold">
                {product.price.toLocaleString("fr-FR")} Ar
              </Text>
            </div>
          </div>
          
          <div className="mt-3">
            <Tag className={`w-full text-center border-0 ${config.bgColor} ${config.textColor}`}>
              {config.text}
            </Tag>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <Title level={2} className="text-foreground mb-1">
            Gestion des Produits
          </Title>
          <Text className="text-muted-foreground">
            Gerez votre inventaire et suivez vos stocks en temps reel
          </Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />}>Exporter</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct} size="large">
            Ajouter un produit
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="h-full">
            <Statistic
              title={<span className="text-muted-foreground">Total Produits</span>}
              value={stats.total}
              prefix={<ShoppingOutlined className="text-primary mr-2" />}
              valueStyle={{ color: "#3b82f6" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="h-full">
            <Statistic
              title={<span className="text-muted-foreground">En Stock</span>}
              value={stats.inStock}
              prefix={<InboxOutlined className="text-emerald-500 mr-2" />}
              valueStyle={{ color: "#10b981" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="h-full">
            <Statistic
              title={<span className="text-muted-foreground">Stock Faible</span>}
              value={stats.lowStock}
              prefix={<WarningOutlined className="text-amber-500 mr-2" />}
              valueStyle={{ color: "#f59e0b" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="h-full">
            <Statistic
              title={<span className="text-muted-foreground">Valeur Totale</span>}
              value={stats.totalValue}
              precision={2}
              suffix=" Ar"
              prefix={<DollarOutlined className="text-accent mr-2" />}
              valueStyle={{ color: "#22c55e" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card bordered={false} className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: "all", label: `Tous (${stats.total})` },
              { key: "in_stock", label: `En stock (${stats.inStock})` },
              { key: "low_stock", label: `Stock faible (${stats.lowStock})` },
              { key: "out_of_stock", label: `Rupture (${stats.outOfStock})` },
            ]}
          />
          <div className="flex gap-3 w-full lg:w-auto">
            <Input
              placeholder="Rechercher un produit..."
              prefix={<SearchOutlined className="text-muted-foreground" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full lg:w-80"
              allowClear
            />
            <Segmented
              options={[
                { value: "list", icon: <UnorderedListOutlined /> },
                { value: "grid", icon: <AppstoreOutlined /> },
              ]}
              value={viewMode}
              onChange={(value) => setViewMode(value as "list" | "grid")}
            />
          </div>
        </div>
      </Card>

      {/* Products View */}
      {viewMode === "list" ? (
        <Card bordered={false}>
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
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Aucun produit trouve"
                >
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
                    Ajouter un produit
                  </Button>
                </Empty>
              ),
            }}
          />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredProducts.length === 0 ? (
            <Col span={24}>
              <Card bordered={false}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Aucun produit trouve"
                >
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
                    Ajouter un produit
                  </Button>
                </Empty>
              </Card>
            </Col>
          ) : (
            filteredProducts.map((product) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))
          )}
        </Row>
      )}

      {/* Add/Edit Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ShoppingOutlined className="text-primary" />
            {editingProduct ? "Modifier le produit" : "Ajouter un nouveau produit"}
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="mt-6"
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="name"
                label="Nom du produit"
                rules={[{ required: true, message: "Veuillez entrer le nom du produit" }]}
              >
                <Input placeholder="Ex: MacBook Pro 14&quot;" size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="sku"
                label="Reference (SKU)"
                rules={[{ required: true, message: "Veuillez entrer la reference" }]}
              >
                <Input placeholder="Ex: APPLE-MBP14-001" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Categorie"
                rules={[{ required: true, message: "Selectionnez une categorie" }]}
              >
                <Select placeholder="Selectionnez une categorie" size="large">
                  {mockCategories.map((cat) => (
                    <Select.Option key={cat.id} value={cat.name}>
                      {categoryIcons[cat.name] || "📦"} {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="supplier"
                label="Fournisseur"
                rules={[{ required: true, message: "Selectionnez un fournisseur" }]}
              >
                <Select placeholder="Selectionnez un fournisseur" size="large">
                  {mockSuppliers.map((sup) => (
                    <Select.Option key={sup.id} value={sup.name}>
                      {sup.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="quantity"
                label="Quantite en stock"
                rules={[{ required: true, message: "Entrez la quantite" }]}
              >
                <InputNumber 
                  min={0} 
                  className="w-full" 
                  size="large"
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="minQuantity"
                label="Seuil d&apos;alerte"
                rules={[{ required: true, message: "Entrez le seuil" }]}
                tooltip="Alerte quand le stock descend en dessous"
              >
                <InputNumber 
                  min={1} 
                  className="w-full" 
                  size="large"
                  placeholder="10"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Prix unitaire (Ar)"
                rules={[{ required: true, message: "Entrez le prix" }]}
              >
                <InputNumber 
                  min={0} 
                  step={100} 
                  className="w-full" 
                  size="large"
                  placeholder="0.00"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <div className="flex justify-end gap-3">
            <Button size="large" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="primary" htmlType="submit" size="large" icon={editingProduct ? <EditOutlined /> : <PlusOutlined />}>
              {editingProduct ? "Enregistrer les modifications" : "Ajouter le produit"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Product Detail Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <Avatar size={40} className="bg-primary/10 text-primary" icon={<ShoppingOutlined />} />
            <div>
              <Text className="font-semibold block">{selectedProduct?.name}</Text>
              <Text className="text-muted-foreground text-xs font-mono">{selectedProduct?.sku}</Text>
            </div>
          </div>
        }
        placement="right"
        width={500}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        extra={
          <Space>
            <Button icon={<EditOutlined />} onClick={() => {
              if (selectedProduct) {
                handleEditProduct(selectedProduct);
                setIsDrawerOpen(false);
              }
            }}>
              Modifier
            </Button>
          </Space>
        }
      >
        {selectedProduct && (
          <div className="space-y-6">
            <Card bordered={false} className="bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-muted-foreground text-sm block">Statut actuel</Text>
                  <Tag className={`mt-2 border-0 ${statusConfig[selectedProduct.status].bgColor} ${statusConfig[selectedProduct.status].textColor}`}>
                    {statusConfig[selectedProduct.status].text}
                  </Tag>
                </div>
                <div className="text-right">
                  <Text className="text-muted-foreground text-sm block">Derniere mise a jour</Text>
                  <Text className="text-foreground">{selectedProduct.lastUpdated}</Text>
                </div>
              </div>
            </Card>

            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Categorie">
                <Tag className="border-0 bg-primary/10 text-primary">
                  {categoryIcons[selectedProduct.category] || "📦"} {selectedProduct.category}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Fournisseur">{selectedProduct.supplier}</Descriptions.Item>
              <Descriptions.Item label="Quantite en stock">
                <Text className="font-bold text-lg">{selectedProduct.quantity}</Text>
                <Text className="text-muted-foreground"> unites</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Seuil d&apos;alerte">{selectedProduct.minQuantity} unites</Descriptions.Item>
              <Descriptions.Item label="Prix unitaire">
                <Text className="font-semibold">
                  {selectedProduct.price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} Ar
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Valeur totale du stock">
                <Text className="font-bold text-accent text-lg">
                  {(selectedProduct.price * selectedProduct.quantity).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} Ar
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <Card bordered={false} className="bg-card">
              <Title level={5} className="mb-4">Historique recent</Title>
              <Timeline
                items={[
                  {
                    color: "green",
                    children: (
                      <div>
                        <Text className="text-foreground">Entree de stock</Text>
                        <Text className="text-muted-foreground block text-xs">+10 unites - il y a 2 jours</Text>
                      </div>
                    ),
                  },
                  {
                    color: "red",
                    children: (
                      <div>
                        <Text className="text-foreground">Sortie de stock</Text>
                        <Text className="text-muted-foreground block text-xs">-5 unites - il y a 5 jours</Text>
                      </div>
                    ),
                  },
                  {
                    color: "blue",
                    children: (
                      <div>
                        <Text className="text-foreground">Modification prix</Text>
                        <Text className="text-muted-foreground block text-xs">Mise a jour - il y a 1 semaine</Text>
                      </div>
                    ),
                  },
                ]}
              />
            </Card>

            <div className="flex gap-3">
              <Button 
                type="primary" 
                icon={<ArrowDownOutlined />} 
                block
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Entree de stock
              </Button>
              <Button 
                danger 
                icon={<ArrowUpOutlined />} 
                block
              >
                Sortie de stock
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
