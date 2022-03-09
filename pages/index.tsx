import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import DemoWalletConnect from "../src/component/DemoWalletConnect";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <DemoWalletConnect />
    </div>
  );
};

export default Home;
