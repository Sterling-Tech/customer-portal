
"use client";

import { useEffect, useState } from "react";

import FundWallet from "@/app/components/customer/FundWallet";

import { getAccountDetails } from "@/app/services/accountService";

import {
  fundWallet,
  walletHistory,
  type WalletHistory,
} from "@/app/services/walletService";

export default function FundWalletPage() {
  const [balance, setBalance] = useState(0);

  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [topUps, setTopUps] = useState<WalletHistory[]>([]);

  const [loadingAccount, setLoadingAccount] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);

  /**
   * -------------------------------------------------------
   * Load customer account details
   * -------------------------------------------------------
   */
  useEffect(() => {
    const loadAccount = async () => {
      try {
        setLoadingAccount(true);

        const response = await getAccountDetails();

        setAccountName(response.personal.name);
        setAccountNumber(response.personal.account_number);
      } catch (error) {
        console.error(
          "Failed to load account:",
          error
        );
      } finally {
        setLoadingAccount(false);
      }
    };

    loadAccount();
  }, []);

  /**
   * -------------------------------------------------------
   * Load wallet
   * -------------------------------------------------------
   *
   * /customer/me/wallet/
   *
   * returns:
   *
   * {
   *   count,
   *   next,
   *   previous,
   *   results,
   *   balance
   * }
   *
   */
  useEffect(() => {
    const loadWallet = async () => {
      try {
        setHistoryLoading(true);

        const response = await walletHistory();

        console.log("WALLET RESPONSE:", response);

        // Wallet balance comes from this endpoint
        setBalance(
          Number(response.balance) || 0
        );

        // Funding history comes from results
        setTopUps(
          Array.isArray(response.results)
            ? response.results
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load wallet:",
          error
        );

        setBalance(0);
        setTopUps([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadWallet();
  }, []);

  /**
   * -------------------------------------------------------
   * Start wallet funding
   * -------------------------------------------------------
   */
  const handleTopUp = async ({
    amount,
  }: {
    amount: number;
  }) => {
    const response = await fundWallet({
      amount: amount.toString(),
    });

    if (!response?.payment_link) {
      throw new Error(
        "Payment link was not returned by the server."
      );
    }

    sessionStorage.setItem(
      "wallet_funding_reference",
      response.reference
    );

    sessionStorage.setItem(
      "wallet_funding_amount",
      response.amount
    );

    // Open Flutterwave
    window.location.href = response.payment_link;
  };

  /**
   * -------------------------------------------------------
   * Send money
   * -------------------------------------------------------
   */
  const handleSendMoney = async ({
    recipientWalletId,
    amount,
  }: {
    recipientWalletId: string;
    amount: number;
  }) => {
    console.log("Send:", {
      recipientWalletId,
      amount,
    });
  };

  /**
   * -------------------------------------------------------
   * Loading
   * -------------------------------------------------------
   */
  if (loadingAccount || historyLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-500" />
      </div>
    );
  }

  /**
   * -------------------------------------------------------
   * Calculate wallet statistics
   * -------------------------------------------------------
   */
  const currentMonth = new Date();

  const addedThisMonth = topUps
    .filter((topUp) => {
      if (topUp.status !== "successful") {
        return false;
      }

      const date = new Date(topUp.completed_at ?? topUp.created_at);

      return (
        date.getMonth() === currentMonth.getMonth() &&
        date.getFullYear() === currentMonth.getFullYear()
      );
    })
    .reduce(
      (total, topUp) =>
        total + (Number(topUp.amount) || 0),
      0
    );

  return (
    <FundWallet
      balance={balance}
      accountName={accountName}
      accountNumber={accountNumber}
      addedThisMonth={addedThisMonth}
      topUps={topUps}
      currency="NGN"
      onTopUp={handleTopUp}
      onSendMoney={handleSendMoney}
    />
  );
}

