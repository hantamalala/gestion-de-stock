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
  InputNumber,
  Select,
  Tag,
  DatePicker,
  message,
  Radio,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { mockMovements, mockProducts } from "@/data/mockData";
import type { ColumnsType } from "antd/es/table";
import type { Movement } from "@/types";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

export function MovementList() {
  const [movements, setMovements] = useState<Movement[]>(mockMovements);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<"all" | "entry" | "exit">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filteredMovements = movements.filter((mov) => {
    const matchesSearch =
      mov.productName.toLowerCase().includes(searchText.toLowerCase()) ||
      mov.reference.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = filterType === "all" || mov.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddMovement = () => {
    form.resetFields();
    form.setFieldsValue({ type: "entry", date: dayjs() });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (values: {
    productId: string;
    type: "entry" | "exit";
    quantity: number;
    date: dayjs.Dayjs;
    notes?: string;
  }) => {
    const product = mockProducts.find((p) => p.id === values.productId);
    if (!product) return;

    const newMovement: Movement = {
      id: String(Date.now()),
      productId: values.productId,
      productName: product.name,
      type: values.type,
      quantity: values.quantity,
      date: values.date.format("YYYY-MM-DD"),
      reference: `${values.type === "entry" ? "CMD" : "VNT"}-${dayjs().format("YYYY")}-${String(movements.length + 1).padStart(3, "0")}`,
      notes: values.notes,
    };

    setMovements([newMovement, ...movements]);
    message.success(
      `Mouvement de ${values.type === "entry" ? "stock entree" : "stock sortie"} enregistre`
    );
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns: ColumnsType<Movement> = [
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      render: (ref) => (
        <Text className="text-foreground font-mono font-medium">{ref}</Text>
      ),
    },
    {
      title: "Produit",
      dataIndex: "productName",
      key: "productName",
      render: (name) => <Text className="text-foreground">{name}</Text>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag
          color={type === "entry" ? "green" : "red"}
          icon={type === "entry" ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
        >
          {type === "entry" ? "Entree" : "Sortie"}
        </Tag>
      ),
    },
    {
      title: "Quantite",
      dataIndex: "quantity",
      key: "quantity",
      render: (qty, record) => (
        <Text
          className={`font-medium ${
            record.type === "entry" ? "text-green-500" : "text-red-500"
          }`}
        >
          {record.type === "entry" ? "+" : "-"}
          {qty}
        </Text>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <Text className="text-muted-foreground">
          {dayjs(date).format("DD/MM/YYYY")}
        </Text>
      ),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (notes) => (
        <Text className="text-muted-foreground text-sm">
          {notes || "-"}
        </Text>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <Title level={2} className="text-foreground mb-1">
            Mouvements de Stock
          </Title>
          <Text className="text-muted-foreground">
            Historique des entrees et sorties de stock
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMovement}>
          Nouveau mouvement
        </Button>
      </div>

      <Card bordered={false}>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            placeholder="Rechercher un mouvement..."
            prefix={<SearchOutlined className="text-muted-foreground" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="md:w-80"
            allowClear
          />
          <Space>
            <Radio.Group
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value="all">Tous</Radio.Button>
              <Radio.Button value="entry">Entrees</Radio.Button>
              <Radio.Button value="exit">Sorties</Radio.Button>
            </Radio.Group>
            <Button icon={<FilterOutlined />}>Filtres</Button>
          </Space>
        </div>

        <Table
          dataSource={filteredMovements}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} sur ${total} mouvements`,
          }}
        />
      </Card>

      <Modal
        title="Nouveau mouvement de stock"
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
            name="type"
            label="Type de mouvement"
            rules={[{ required: true }]}
          >
            <Radio.Group optionType="button" buttonStyle="solid">
              <Radio.Button value="entry">
                <Space>
                  <ArrowDownOutlined />
                  Entree
                </Space>
              </Radio.Button>
              <Radio.Button value="exit">
                <Space>
                  <ArrowUpOutlined />
                  Sortie
                </Space>
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="productId"
            label="Produit"
            rules={[{ required: true, message: "Selectionnez un produit" }]}
          >
            <Select
              placeholder="Selectionnez un produit"
              showSearch
              optionFilterProp="children"
            >
              {mockProducts.map((product) => (
                <Select.Option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="quantity"
              label="Quantite"
              rules={[{ required: true, message: "Entrez la quantite" }]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Selectionnez une date" }]}
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
          </div>

          <Form.Item name="notes" label="Notes (optionnel)">
            <TextArea rows={3} placeholder="Ajouter des notes..." />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button type="primary" htmlType="submit">
              Enregistrer
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
