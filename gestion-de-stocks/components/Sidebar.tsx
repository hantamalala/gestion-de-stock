"use client";

import { Layout, Menu, Typography } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  TeamOutlined,
  SwapOutlined,
  SettingOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  collapsed: boolean;
  activeKey: string;
  onMenuSelect: (key: string) => void;
}

const menuItems = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Tableau de bord",
  },
  {
    key: "products",
    icon: <ShoppingOutlined />,
    label: "Produits",
  },
  {
    key: "categories",
    icon: <AppstoreOutlined />,
    label: "Categories",
  },
  {
    key: "suppliers",
    icon: <TeamOutlined />,
    label: "Fournisseurs",
  },
  {
    key: "movements",
    icon: <SwapOutlined />,
    label: "Mouvements",
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Parametres",
  },
];

export function Sidebar({ collapsed, activeKey, onMenuSelect }: SidebarProps) {
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      className="border-r border-border"
      style={{ background: "#141414" }}
    >
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <DatabaseOutlined className="text-white text-lg" />
        </div>
        {!collapsed && (
          <Text strong className="text-foreground text-lg">
            StockPro
          </Text>
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[activeKey]}
        items={menuItems}
        onClick={({ key }) => onMenuSelect(key)}
        style={{ background: "transparent", borderRight: 0 }}
      />
    </Sider>
  );
}
