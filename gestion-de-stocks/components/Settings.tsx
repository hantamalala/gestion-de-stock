"use client";

import { Card, Typography, Switch, Select, Form, Button, Divider, message } from "antd";
import {
  BellOutlined,
  GlobalOutlined,
  LockOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export function Settings() {
  const handleSave = () => {
    message.success("Parametres enregistres avec succes");
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <Title level={2} className="text-foreground mb-1">
          Parametres
        </Title>
        <Text className="text-muted-foreground">
          Configurez les parametres de l&apos;application
        </Text>
      </div>

      <div className="space-y-6">
        <Card bordered={false}>
          <div className="flex items-center gap-3 mb-4">
            <GlobalOutlined className="text-primary text-xl" />
            <Title level={4} className="text-foreground m-0">
              Preferences generales
            </Title>
          </div>
          <Divider className="my-4 border-border" />
          <Form layout="vertical">
            <Form.Item label={<span className="text-foreground">Langue</span>}>
              <Select defaultValue="fr" className="w-48">
                <Select.Option value="fr">Francais</Select.Option>
                <Select.Option value="en">English</Select.Option>
                <Select.Option value="mg">Malagasy</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label={<span className="text-foreground">Devise</span>}>
              <Select defaultValue="mga" className="w-48">
                <Select.Option value="mga">Ariary (Ar)</Select.Option>
                <Select.Option value="eur">Euro (EUR)</Select.Option>
                <Select.Option value="usd">Dollar (USD)</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label={<span className="text-foreground">Format de date</span>}>
              <Select defaultValue="dmy" className="w-48">
                <Select.Option value="dmy">DD/MM/YYYY</Select.Option>
                <Select.Option value="mdy">MM/DD/YYYY</Select.Option>
                <Select.Option value="ymd">YYYY-MM-DD</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Card>

        <Card bordered={false}>
          <div className="flex items-center gap-3 mb-4">
            <BellOutlined className="text-primary text-xl" />
            <Title level={4} className="text-foreground m-0">
              Notifications
            </Title>
          </div>
          <Divider className="my-4 border-border" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-foreground">Alertes de stock faible</Text>
                <br />
                <Text className="text-muted-foreground text-sm">
                  Recevoir une notification quand un produit atteint le seuil minimum
                </Text>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-foreground">Ruptures de stock</Text>
                <br />
                <Text className="text-muted-foreground text-sm">
                  Recevoir une notification en cas de rupture de stock
                </Text>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-foreground">Rapports hebdomadaires</Text>
                <br />
                <Text className="text-muted-foreground text-sm">
                  Recevoir un resume hebdomadaire par email
                </Text>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        <Card bordered={false}>
          <div className="flex items-center gap-3 mb-4">
            <DatabaseOutlined className="text-primary text-xl" />
            <Title level={4} className="text-foreground m-0">
              Donnees et stockage
            </Title>
          </div>
          <Divider className="my-4 border-border" />
          <Form layout="vertical">
            <Form.Item
              label={<span className="text-foreground">Seuil d&apos;alerte par defaut</span>}
            >
              <Select defaultValue="10" className="w-48">
                <Select.Option value="5">5 unites</Select.Option>
                <Select.Option value="10">10 unites</Select.Option>
                <Select.Option value="15">15 unites</Select.Option>
                <Select.Option value="20">20 unites</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={<span className="text-foreground">Retention des mouvements</span>}
            >
              <Select defaultValue="365" className="w-48">
                <Select.Option value="90">3 mois</Select.Option>
                <Select.Option value="180">6 mois</Select.Option>
                <Select.Option value="365">1 an</Select.Option>
                <Select.Option value="730">2 ans</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Card>

        <Card bordered={false}>
          <div className="flex items-center gap-3 mb-4">
            <LockOutlined className="text-primary text-xl" />
            <Title level={4} className="text-foreground m-0">
              Securite
            </Title>
          </div>
          <Divider className="my-4 border-border" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-foreground">Authentification a deux facteurs</Text>
                <br />
                <Text className="text-muted-foreground text-sm">
                  Ajouter une couche de securite supplementaire
                </Text>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-foreground">Deconnexion automatique</Text>
                <br />
                <Text className="text-muted-foreground text-sm">
                  Deconnexion apres 30 minutes d&apos;inactivite
                </Text>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="primary" size="large" onClick={handleSave}>
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  );
}
