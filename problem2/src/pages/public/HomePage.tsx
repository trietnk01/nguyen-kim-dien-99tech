import NumberFormat from "react-number-format";
import * as yup from "yup";
import { RetweetOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Select } from "antd";
import axios from "axios";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import styles from "@/assets/scss/home.module.scss";
import country_list from "./country-list";
interface IFormInput {
  amount: string;
  currency_from: string;
  currency_to: string;
  total_exchange: number;
}
interface ICountry {
  value: string;
  label: string;
}
const HomePage = () => {
  const [countries, setCountries] = React.useState<ICountry[]>([]);
  const [flagFrom, setFlagFrom] = React.useState<string>("US");
  const [flagTo, setFlagTo] = React.useState<string>("VN");
  const schema = yup
    .object({
      amount: yup.string().required("Amount required!")
    })
    .required();
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
      currency_to: "VND",
      total_exchange: 0
    },
    resolver: yupResolver(schema)
  });
  const onSubmit: SubmitHandler<IFormInput> = async (dataForm) => {
    let amountNumber: number = dataForm.amount
      ? parseInt(dataForm.amount.toString().replace(new RegExp(",", "g"), ""))
      : 0;
    console.log("amountNumber = ", amountNumber);
    let urlExchange = `https://v6.exchangerate-api.com/v6/${
      import.meta.env.VITE_EXCHANGERATE_API
    }/latest/${dataForm.currency_from}`;
    let res = await axios.get(urlExchange);
    if (res && res.data && res.data.conversion_rates) {
      const rateCurrency: number = parseFloat(
        res.data.conversion_rates[dataForm.currency_to].toString()
      );
      let totalExchange: number = Math.round(amountNumber * rateCurrency);
      setValue("total_exchange", totalExchange);
    }
  };
  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined
  ) => {
    setValue("amount", e && e.target && e.target.value ? e?.target.value.toString() : "");
  };
  const handleCurrencyFromChange = (e: any) => {
    setValue("currency_from", e ? e.toString() : "");
    setFlagFrom((country_list as any)[e?.toString()].toString());
  };
  const handleCurrencyToChange = (e: any) => {
    setValue("currency_to", e ? e.toString() : "");
    setFlagTo((country_list as any)[e?.toString()].toString());
  };
  React.useEffect(() => {
    let countryList: ICountry[] = [];
    for (let country in country_list) {
      countryList.push({ value: country, label: country });
    }
    setCountries(countryList);
  }, []);
  const handleSwitchCountry = () => {
    const currencyFrom: string = getValues("currency_from");
    const currencyTo: string = getValues("currency_to");
    const flagFrom: string = (country_list as any)[currencyFrom].toString();
    const flagTo: string = (country_list as any)[currencyTo].toString();
    setValue("currency_from", currencyTo);
    setValue("currency_to", currencyFrom);
    setFlagFrom(flagTo);
    setFlagTo(flagFrom);
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
                  <React.Fragment>
                    <NumberFormat
                      placeholder="Amount *"
                      customInput={Input}
                      thousandSeparator={true}
                      size="large"
                      value={field.value}
                      onChange={handleAmountChange}
                    />
                    {errors.amount && <div className={styles.errors}>{errors.amount.message}</div>}
                  </React.Fragment>
                );
              }}
            />
          </div>
          <div className={styles.dropList}>
            <div className={styles.from}>
              <p>From</p>
              <div className={styles.selectBox}>
                <img
                  src={`https://flagsapi.com/${flagFrom}/flat/64.png`}
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
                          options={countries}
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
              <RetweetOutlined onClick={handleSwitchCountry} />
            </div>
            <div className={styles.to}>
              <p>To</p>
              <div className={styles.selectBox}>
                <img
                  src={`https://flagsapi.com/${flagTo}/flat/64.png`}
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
                          options={countries}
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
            {getValues("currency_from") ? getValues("currency_from") : ""} ={" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0
            })
              .format(getValues("total_exchange"))
              .replace("$", "")}{" "}
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
