"use client";

import { Layout, Input, Badge, Avatar, Dropdown, Button, Space } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const userMenuItems: MenuProps["items"] = [
  {
    key: "profile",
    icon: <UserOutlined />,
    label: "Mon Profil",
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Parametres",
  },
  {
    type: "divider",
  },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: "Deconnexion",
    danger: true,
  },
];

export function Header({ collapsed, onToggle }: HeaderProps) {
  return (
    <AntHeader
      className="flex items-center justify-between px-4 border-b border-border"
      style={{ background: "#141414", height: 64 }}
    >
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="text-foreground"
        />
        <Input
          placeholder="Rechercher..."
          prefix={<SearchOutlined className="text-muted-foreground" />}
          className="w-64"
          style={{ background: "#1f1f1f" }}
        />
      </div>
      <Space size="middle">
        <Badge count={3} size="small">
          <Button
            type="text"
            icon={<BellOutlined className="text-lg" />}
            className="text-foreground"
          />
        </Badge>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar
              size="small"
              icon={<UserOutlined />}
              style={{ backgroundColor: "#3b82f6" }}
            />
            <span className="text-foreground hidden md:inline">Admin</span>
          </div>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
