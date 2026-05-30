"use client";

import { useState } from "react";
import { Layout, ConfigProvider, theme } from "antd";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { ProductList } from "@/components/ProductList";
import { CategoryList } from "@/components/CategoryList";
import { SupplierList } from "@/components/SupplierList";
import { MovementList } from "@/components/MovementList";
import { Settings } from "@/components/Settings";

const { Content } = Layout;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("dashboard");

  const renderContent = () => {
    switch (activeKey) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <ProductList />;
      case "categories":
        return <CategoryList />;
      case "suppliers":
        return <SupplierList />;
      case "movements":
        return <MovementList />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#3b82f6",
          colorBgContainer: "#141414",
          colorBgElevated: "#1f1f1f",
          colorBorder: "#27272a",
          colorText: "#ededed",
          colorTextSecondary: "#a1a1aa",
          borderRadius: 8,
        },
      }}
    >
      <Layout className="min-h-screen">
        <Sidebar
          collapsed={collapsed}
          activeKey={activeKey}
          onMenuSelect={setActiveKey}
        />
        <Layout>
          <Header
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
          />
          <Content
            className="overflow-auto"
            style={{ background: "#0a0a0a", minHeight: "calc(100vh - 64px)" }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
