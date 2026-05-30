"use client";

import { Row, Col, Card, Statistic, Typography, Table, Tag, Progress } from "antd";
import {
  ShoppingOutlined,
  DollarOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { mockProducts, mockMovements } from "@/data/mockData";
import type { ColumnsType } from "antd/es/table";
import type { Movement, Product } from "@/types";

const { Title, Text } = Typography;

const stats = [
  {
    title: "Total Produits",
    value: mockProducts.length,
    icon: <ShoppingOutlined />,
    color: "#3b82f6",
    trend: "+12%",
    trendUp: true,
  },
  {
    title: "Valeur Totale",
    value: mockProducts.reduce((acc, p) => acc + p.price * p.quantity, 0),
    prefix: "Ar ",
    icon: <DollarOutlined />,
    color: "#10b981",
    trend: "+8.2%",
    trendUp: true,
  },
  {
    title: "Stock Faible",
    value: mockProducts.filter((p) => p.status === "low_stock").length,
    icon: <WarningOutlined />,
    color: "#f59e0b",
    trend: "-3",
    trendUp: false,
  },
  {
    title: "Rupture Stock",
    value: mockProducts.filter((p) => p.status === "out_of_stock").length,
    icon: <CloseCircleOutlined />,
    color: "#ef4444",
    trend: "+1",
    trendUp: true,
  },
];

const movementColumns: ColumnsType<Movement> = [
  {
    title: "Produit",
    dataIndex: "productName",
    key: "productName",
    render: (text) => <Text className="text-foreground">{text}</Text>,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (type) => (
      <Tag color={type === "entry" ? "green" : "red"}>
        {type === "entry" ? "Entree" : "Sortie"}
      </Tag>
    ),
  },
  {
    title: "Quantite",
    dataIndex: "quantity",
    key: "quantity",
    render: (qty, record) => (
      <span className={record.type === "entry" ? "text-green-500" : "text-red-500"}>
        {record.type === "entry" ? "+" : "-"}{qty}
      </span>
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (date) => <Text className="text-muted-foreground">{date}</Text>,
  },
  {
    title: "Reference",
    dataIndex: "reference",
    key: "reference",
    render: (ref) => <Text className="text-muted-foreground font-mono">{ref}</Text>,
  },
];

const lowStockColumns: ColumnsType<Product> = [
  {
    title: "Produit",
    dataIndex: "name",
    key: "name",
    render: (text) => <Text className="text-foreground">{text}</Text>,
  },
  {
    title: "Stock",
    dataIndex: "quantity",
    key: "quantity",
    render: (qty, record) => (
      <div className="flex items-center gap-2">
        <Progress
          percent={Math.round((qty / record.minQuantity) * 100)}
          size="small"
          status={qty === 0 ? "exception" : qty < record.minQuantity ? "active" : "success"}
          showInfo={false}
          className="w-16"
        />
        <Text className="text-foreground">{qty}/{record.minQuantity}</Text>
      </div>
    ),
  },
  {
    title: "Statut",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      const statusConfig = {
        in_stock: { color: "green", text: "En stock" },
        low_stock: { color: "orange", text: "Stock faible" },
        out_of_stock: { color: "red", text: "Rupture" },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      return <Tag color={config.color}>{config.text}</Tag>;
    },
  },
];

export function Dashboard() {
  const lowStockProducts = mockProducts.filter(
    (p) => p.status === "low_stock" || p.status === "out_of_stock"
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2} className="text-foreground mb-1">
          Tableau de bord
        </Title>
        <Text className="text-muted-foreground">
          Vue d&apos;ensemble de votre inventaire
        </Text>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="h-full" bordered={false}>
              <div className="flex items-start justify-between">
                <div>
                  <Text className="text-muted-foreground text-sm">{stat.title}</Text>
                  <div className="flex items-baseline gap-2 mt-1">
                    <Statistic
                      value={stat.value}
                      prefix={stat.prefix}
                      valueStyle={{ color: "#ededed", fontSize: "1.5rem" }}
                      formatter={(value) =>
                        typeof value === "number"
                          ? stat.prefix
                            ? value.toLocaleString("fr-FR", { minimumFractionDigits: 2 })
                            : value.toLocaleString("fr-FR")
                          : value
                      }
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trendUp ? (
                      <ArrowUpOutlined className="text-green-500 text-xs" />
                    ) : (
                      <ArrowDownOutlined className="text-red-500 text-xs" />
                    )}
                    <Text
                      className={`text-xs ${
                        stat.trendUp ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stat.trend} ce mois
                    </Text>
                  </div>
                </div>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <span style={{ color: stat.color, fontSize: "1.25rem" }}>
                    {stat.icon}
                  </span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <RiseOutlined className="text-primary" />
                <span className="text-foreground">Derniers Mouvements</span>
              </div>
            }
            bordered={false}
          >
            <Table
              dataSource={mockMovements}
              columns={movementColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <WarningOutlined className="text-warning" />
                <span className="text-foreground">Alertes Stock</span>
              </div>
            }
            bordered={false}
          >
            <Table
              dataSource={lowStockProducts}
              columns={lowStockColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
