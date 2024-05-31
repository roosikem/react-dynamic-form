import React, { useState, useEffect } from "react";
import { useForm, Form, Input, Button, Select } from "@refinedev/antd";
import { Card, Space } from "antd";
import axios from "axios";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

export const DynamicFormCreate = () => {
    const { formProps, saveButtonProps } = useForm();
    const [environment, setEnvironment] = useState(null);
    const [markets, setMarkets] = useState([]);
    const [selectedMarket, setSelectedMarket] = useState(null);
    const [configData, setConfigData] = useState({});

    useEffect(() => {
        // Fetch initial configuration data
        axios.get("http://localhost:8080/api/configs").then(response => {
            setConfigData(response.data);
        });
    }, []);

    useEffect(() => {
        if (environment && configData[environment]) {
            setMarkets(Object.keys(configData[environment]));
        }
    }, [environment, configData]);

    const handleEnvironmentChange = value => {
        setEnvironment(value);
        setSelectedMarket(null);
    };

    const handleMarketChange = value => {
        setSelectedMarket(value);
    };

    const getMarketDetails = () => {
        if (environment && selectedMarket) {
            return configData[environment][selectedMarket];
        }
        return {};
    };

    const marketDetails = getMarketDetails();

    return (
        <Form {...formProps} layout="vertical">
            <Card title="Add Configuration" style={{ marginBottom: 20 }}>
                <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                    <Input placeholder="Enter name" />
                </Form.Item>
                <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                    <Input placeholder="Enter description" />
                </Form.Item>
                <Form.Item label="Environment" name="environment" rules={[{ required: true }]}>
                    <Select placeholder="Select environment" onChange={handleEnvironmentChange}>
                        <Option value="dev">Dev</Option>
                        <Option value="qa">QA</Option>
                        <Option value="pro">Pro</Option>
                        <Option value="staging">Staging</Option>
                    </Select>
                </Form.Item>
                {environment && (
                    <Form.Item label="Market" name="market" rules={[{ required: true }]}>
                        <Select placeholder="Select market" onChange={handleMarketChange}>
                            {markets.map(market => (
                                <Option key={market} value={market}>
                                    {market.toUpperCase()}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}
                {selectedMarket && (
                    <>
                        <Form.Item label="Host URL" name="hosturl" initialValue={marketDetails.hosturl} rules={[{ required: true }]}>
                            <Input placeholder="Host URL" />
                        </Form.Item>
                        <Form.List name="appIds" initialValue={marketDetails.appIds || []}>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                        <Space key={key} direction="horizontal" align="center" style={{ display: 'flex', marginBottom: 8 }}>
                                            <Form.Item
                                                {...restField}
                                                name={[name]}
                                                fieldKey={[fieldKey]}
                                                rules={[{ required: true, message: 'Missing app ID' }]}
                                            >
                                                <Input placeholder="App ID" />
                                            </Form.Item>
                                            <Button type="link" onClick={() => remove(name)} icon={<MinusCircleOutlined />} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add App ID
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                        <Form.Item label="Token URL" name="tokenUrl" initialValue={marketDetails.tokenUrl} rules={[{ required: true }]}>
                            <Input placeholder="Token URL" />
                        </Form.Item>
                    </>
                )}
            </Card>
            <Button {...saveButtonProps} type="primary">
                Save
            </Button>
        </Form>
    );
};
