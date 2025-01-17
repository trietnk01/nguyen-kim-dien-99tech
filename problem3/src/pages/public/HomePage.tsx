import NumberFormat from "react-number-format";
import * as yup from "yup";
import { RetweetOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Select, Spin } from "antd";
import axios from "axios";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import styles from "@/assets/scss/home.module.scss";
import { country_list } from "@/configs";
import WalletRow from "@/components/WalletRow";
interface WalletBalance {
  productName:string;
  currency: string;
  amount: number;
  blockchain: string;
  urlImg:string;
}
const HomePage = () => {
  const balances: WalletBalance[] = [
    { productName:"Product 1",currency: "TMT", amount: 2000, blockchain: "Osmosis",urlImg:"/product-1.jpg" },
    { productName:"Product 2",currency: "TND", amount: 3000, blockchain: "Ethereum",urlImg:"/product-2.jpg" },
    { productName:"Product 3",currency: "TOP", amount: 4000, blockchain: "Arbitrum",urlImg:"/product-3.png" },
    { productName:"Product 4", currency: "TRY", amount: 5000, blockchain: "Zilliqa",urlImg:"/product-4.jpg" },
    { productName:"Product 5",currency: "TTD", amount: 6000, blockchain: "Neo",urlImg:"/product-5.jpg" },
    { productName:"Product 6",currency: "TVD", amount: 7000, blockchain: "Osmosis",urlImg:"/product-6.jpg"},
    { productName:"Product 7",currency: "TWD", amount: 8000, blockchain: "Arbitrum" ,urlImg:"/product-7.jpg"},
    { productName:"Product 8",currency: "TZS", amount: 9000, blockchain: "Zilliqa",urlImg:"/product-8.jpg" },
    { productName:"Product 9",currency: "TMT", amount: 2000, blockchain: "Osmosis",urlImg:"/product-9.jpg" },
    { productName:"Product 10",currency: "TND", amount: 3000, blockchain: "Ethereum",urlImg:"/product-10.jpg" },
    { productName:"Product 11",currency: "TOP", amount: 4000, blockchain: "Arbitrum",urlImg:"/product-11.jpg" },
    { productName:"Product 12", currency: "TRY", amount: 5000, blockchain: "Zilliqa" ,urlImg:"/product-12.jpg"},
    { productName:"Product 13",currency: "TTD", amount: 6000, blockchain: "Neo" ,urlImg:"/product-13.jpg"},
    { productName:"Product 14",currency: "TVD", amount: 7000, blockchain: "Osmosis",urlImg:"/product-14.jpg" },
    { productName:"Product 15",currency: "TVD", amount: 7000, blockchain: "Osmosis",urlImg:"/product-15.png" },
  ];
  const prices: any = {
    USD: 1,
    AED: 3.6725,
    AFN: 71.0583,
    ALL: 92.6905,
    AMD: 388.1535,
    ANG: 1.79,
    AOA: 872.8072,
    ARS: 918.25,
    AUD: 1.4827,
    AWG: 1.79,
    AZN: 1.7004,
    BAM: 1.8066,
    BBD: 2,
    BDT: 117.5095,
    BGN: 1.8066,
    BHD: 0.376,
    BIF: 2873.1942,
    BMD: 1,
    BND: 1.3491,
    BOB: 6.9066,
    BRL: 5.4694,
    BSD: 1,
    BTN: 83.5263,
    BWP: 13.617,
    BYN: 3.2718,
    BZD: 2,
    CAD: 1.3631,
    CDF: 2834.578,
    CHF: 0.8957,
    CLP: 936.6707,
    CNY: 7.2943,
    COP: 4094.533,
    CRC: 527.935,
    CUP: 24,
    CVE: 101.8525,
    CZK: 23.2459,
    DJF: 177.721,
    DKK: 6.891,
    DOP: 59.0519,
    DZD: 134.4226,
    EGP: 47.9555,
    ERN: 15,
    ETB: 57.884,
    EUR: 0.9237,
    FJD: 2.2323,
    FKP: 0.7815,
    FOK: 6.8912,
    GBP: 0.7815,
    GEL: 2.7968,
    GGP: 0.7815,
    GHS: 15.4624,
    GIP: 0.7815,
    GMD: 65.2826,
    GNF: 8597.2548,
    GTQ: 7.7609,
    GYD: 209.4051,
    HKD: 7.8129,
    HNL: 24.7424,
    HRK: 6.9597,
    HTG: 131.9614,
    HUF: 362.2588,
    IDR: 16278.6441,
    ILS: 3.6902,
    IMP: 0.7815,
    INR: 83.5164,
    IQD: 1311.0944,
    IRR: 42079.6654,
    ISK: 137.9201,
    JEP: 0.7815,
    JMD: 156.5276,
    JOD: 0.709,
    JPY: 160.7947,
    KES: 128.2425,
    KGS: 86.4968,
    KHR: 4132.0327,
    KID: 1.4829,
    KMF: 454.4337,
    KRW: 1377.2648,
    KWD: 0.3062,
    KYD: 0.8333,
    KZT: 478.4111,
    LAK: 22109.5734,
    LBP: 89500,
    LKR: 304.3346,
    LRD: 194.2186,
    LSL: 18.1616,
    LYD: 4.8776,
    MAD: 9.8898,
    MDL: 17.8358,
    MGA: 4476.9615,
    MKD: 56.9192,
    MMK: 2099.4143,
    MNT: 3363.3219,
    MOP: 8.0474,
    MRU: 39.7771,
    MUR: 46.8389,
    MVR: 15.4103,
    MWK: 1743.3076,
    MXN: 18.1096,
    MYR: 4.7089,
    MZN: 63.9404,
    NAD: 18.1616,
    NGN: 1525.2995,
    NIO: 36.7784,
    NOK: 10.5611,
    NPR: 133.642,
    NZD: 1.6286,
    OMR: 0.3845,
    PAB: 1,
    PEN: 3.795,
    PGK: 3.8501,
    PHP: 58.5393,
    PKR: 278.4703,
    PLN: 3.9544,
    PYG: 7527.6162,
    QAR: 3.64,
    RON: 4.5976,
    RSD: 108.1343,
    RUB: 88.0599,
    RWF: 1322.1064,
    SAR: 3.75,
    SBD: 8.5186,
    SCR: 13.7441,
    SDG: 532.9759,
    SEK: 10.4962,
    SGD: 1.349,
    SHP: 0.7815,
    SLE: 22.6679,
    SLL: 22667.9196,
    SOS: 572.149,
    SRD: 30.6557,
    SSP: 2001.8756,
    STN: 22.6308,
    SYP: 12989.2363,
    SZL: 18.1616,
    THB: 36.5235,
    TJS: 10.7527,
    TMT: 3.501,
    TND: 3.1253,
    TOP: 2.3293,
    TRY: 32.6941,
    TTD: 6.7597,
    TVD: 1.4829,
    TWD: 32.4208,
    TZS: 2637.6108,
    UAH: 40.5603,
    UGX: 3695.763,
    UYU: 40.2528,
    UZS: 12578.1541,
    VES: 36.5123,
    VND: 25464.899,
    VUV: 119.419,
    WST: 2.7349,
    XAF: 605.9116,
    XCD: 2.7,
    XDR: 0.7555,
    XOF: 605.9116,
    XPF: 110.2277,
    YER: 250.2883,
    ZAR: 18.1488,
    ZMW: 24.3701,
    ZWL: 13.6946
  };
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };
  const sortedBalances = React.useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return leftPriority - rightPriority;
      });
  }, [balances]);
  const rows = sortedBalances.map((balance: WalletBalance, idx: number) => {
    const usdValue: number = parseFloat(prices[balance.currency]) * balance.amount;
    return (
      <WalletRow
        key={`wallet-idx-${idx}`}
        productName={balance.productName}
        urlImg={balance.urlImg}
        amount={balance.amount}        
        usdValue={usdValue}
      />
    );
  });
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>{rows}</div>
    </div>
  );
};

export default HomePage;
