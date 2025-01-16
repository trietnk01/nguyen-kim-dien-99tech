import React from "react";
import styles from "@/assets/scss/wallet-item.module.scss";

interface IWallet {
  productName:string;
  amount: number;
  usdValue: number;  
  urlImg:string;
}
const WalletRow: React.FC<IWallet> = ({ productName,amount, usdValue ,urlImg}) => {
  return (
    <div className={styles.box}>
      <div className={styles.boxImg}>
        <img src={urlImg} className={styles.img} />
      </div>
      <h3 className={styles.title}>{productName}</h3>
      <div className={styles.priceBox}>
        <span className={styles.priceLabel}>Amount: </span>
        <span className={styles.totalExchange}>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
          })
            .format(amount)
            .replace("$", "")}
        </span>{" "}
      </div>
      <div className={styles.priceBox}>
        <span className={styles.priceLabel}>UsdValue: </span>
        <span className={styles.totalExchange}>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
          })
            .format(usdValue)
            .replace("$", "")}
        </span>{" "}
        USD
      </div>
      <div className={styles.priceBox}>
        <span className={styles.priceLabel}>FormattedAmount: </span>
        <span className={styles.totalExchange}>{new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
          })
            .format(parseInt(amount.toFixed(2)) )
            .replace("$", "")}</span>&nbsp;<span className={styles.lastUSD}>USD</span>
      </div>
    </div>
  );
};

export default WalletRow;
