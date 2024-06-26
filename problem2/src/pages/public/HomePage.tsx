import React from "react";
import axios from "axios";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import NumberFormat from "react-number-format";
import { Button, Flex, Form, FormProps, Image, Input, Select, Row, Col, SelectProps } from "antd";
import { RetweetOutlined } from "@ant-design/icons";
import styles from "@/assets/scss/home.module.scss";
interface IFormInput {
  amount: string;
  currency_from: string;
  currency_to: string;
}
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
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors }
  } = useForm<IFormInput>({
    defaultValues: {
      amount: "1,000",
      currency_from: "USD",
      currency_to: "VND"
    }
  });
  const onSubmit: SubmitHandler<IFormInput> = async (dataForm) => {
    let amountNumber: number = dataForm.amount ? parseInt(dataForm.amount.replace(",", "")) : 0;
    let urlExchange = `https://v6.exchangerate-api.com/v6/${
      import.meta.env.VITE_EXCHANGERATE_API
    }/latest/${amountNumber}`;
    let res = await axios.get(urlExchange);
    console.log("res = ", res);
  };
  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined
  ) => {
    setValue("amount", e && e.target && e.target.value ? e?.target.value.toString() : "");
  };
  const handleCurrencyFromChange = (e: any) => {
    setValue("currency_from", e ? e.toString() : "");
  };
  const handleCurrencyToChange = (e: any) => {
    setValue("currency_to", e ? e.toString() : "");
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header>Currency converter</header>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.amount}>
            <p>Enter Amount</p>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => {
                return (
                  <NumberFormat
                    placeholder="Amount *"
                    customInput={Input}
                    thousandSeparator={true}
                    size="large"
                    value={field.value}
                    onChange={handleAmountChange}
                  />
                );
              }}
            />
          </div>
          <div className={styles.dropList}>
            <div className={styles.from}>
              <p>From</p>
              <div className={styles.selectBox}>
                <img
                  src={`/${getValues("currency_from").toString()}.png`}
                  alt="Flag"
                  width={30}
                  height={30}
                />
                <Controller
                  name="currency_from"
                  control={control}
                  render={({ field }) => {
                    return (
                      <React.Fragment>
                        <Select
                          className={styles.txtSelected}
                          size="large"
                          options={dataCurrency}
                          value={field.value}
                          onChange={handleCurrencyFromChange}
                        />
                      </React.Fragment>
                    );
                  }}
                />
              </div>
            </div>
            <div className={styles.icon}>
              <RetweetOutlined />
            </div>
            <div className={styles.to}>
              <p>To</p>
              <div className={styles.selectBox}>
                <img
                  src={`/${getValues("currency_to").toString()}.png`}
                  alt="Flag"
                  width={30}
                  height={30}
                />
                <Controller
                  name="currency_to"
                  control={control}
                  render={({ field }) => {
                    return (
                      <React.Fragment>
                        <Select
                          className={styles.txtSelected}
                          size="large"
                          options={dataCurrency}
                          onChange={handleCurrencyToChange}
                          value={field.value}
                        />
                      </React.Fragment>
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className={styles.exchangeRate}>
            {getValues("amount") ? getValues("amount").toString() : ""}{" "}
            {getValues("currency_from") ? getValues("currency_from") : ""} = 118.16{" "}
            {getValues("currency_to") ? getValues("currency_to") : ""}
          </div>
          <Button htmlType="submit" type="primary" size="large">
            Get Exchange Rate
          </Button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
