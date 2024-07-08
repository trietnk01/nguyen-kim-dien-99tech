import React from "react";
import styles from "@/assets/scss/wallet-item.module.scss";

interface IWallet {
  amount: number;
  usdValue: number;
  formattedAmount: string;
}
const WalletRow: React.FC<IWallet> = ({ amount, usdValue, formattedAmount }) => {
  return (
    <div className={styles.box}>
      <div className={styles.boxImg}>
        <img src="/laptop.png" className={styles.img} />
      </div>
      <h3 className={styles.title}>Title</h3>
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
        <span className={styles.totalExchange}>{formattedAmount}</span> USD
      </div>
    </div>
  );
};

export default WalletRow;
