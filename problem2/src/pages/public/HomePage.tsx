import React from "react";
import NumberFormat from "react-number-format";
import { Button, Flex, Form, FormProps, Image, Input, Select, Row, Col } from "antd";
import { RetweetOutlined } from "@ant-design/icons";
import styles from "@/assets/scss/home.module.scss";
type FieldType = {
  amount: string;
  currency_from: string;
  currency_to: string;
};
const dataCurrency = [
  { value: "VND", label: "VND" },
  { value: "USD", label: "USD" },
  { value: "AUD", label: "AUD" }
];
const HomePage = () => {
  const [frmNews] = Form.useForm();
  const [flagFrom, setFlagFrom] = React.useState<string>("USD");
  const [flagTo, setFlagTo] = React.useState<string>("VND");
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { amount, currency_from, currency_to } = values;
    frmNews.setFieldValue("amount", amount);
    frmNews.setFieldValue("currency_from", currency_from);
    frmNews.setFieldValue("currency_to", currency_to);
  };
  const handleCurrencyFromChange = (e: any) => {
    setFlagFrom(e.toString());
  };
  const handleCurrencyToChange = (e: any) => {
    setFlagTo(e.toString());
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header>Currency converter</header>
        <Form
          form={frmNews}
          layout="vertical"
          onFinish={onFinish}
          name="newsFrm"
          className={styles.form}
        >
          <div className={styles.amount}>
            <p>Enter Amount</p>
            <Form.Item<FieldType>
              name="amount"
              rules={[{ required: true, message: "Please input your amount!" }]}
              style={{ marginBottom: 0 }}
            >
              <NumberFormat
                placeholder="Amount *"
                customInput={Input}
                thousandSeparator={true}
                size="large"
              />
            </Form.Item>
          </div>
          <div className={styles.dropList}>
            <div className={styles.from}>
              <p>From</p>
              <div className={styles.selectBox}>
                <img src={`/${flagFrom}.png`} alt="Flag" width={30} height={30} />
                <Form.Item<FieldType>
                  name="currency_from"
                  rules={[{ required: true, message: "Please select currency!" }]}
                  initialValue="USD"
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    className={styles.txtSelected}
                    size="large"
                    options={dataCurrency}
                    onChange={handleCurrencyFromChange}
                  />
                </Form.Item>
              </div>
            </div>
            <div className={styles.icon}>
              <RetweetOutlined />
            </div>
            <div className={styles.to}>
              <p>To</p>
              <div className={styles.selectBox}>
                <img src={`/${flagTo}.png`} alt="Flag" width={30} height={30} />
                <Form.Item<FieldType>
                  name="currency_to"
                  rules={[{ required: true, message: "Please select currency!" }]}
                  initialValue="VND"
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    className={styles.txtSelected}
                    size="large"
                    options={dataCurrency}
                    onChange={handleCurrencyToChange}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className={styles.exchangeRate}>
            1 {flagFrom} = 118.16 {flagTo}
          </div>
          <button type="submit">Get Exchange Rate</button>
        </Form>
      </div>
    </div>
  );
};

export default HomePage;
