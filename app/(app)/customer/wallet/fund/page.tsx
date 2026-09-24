
"use client";

import FundWallet from "@/app/components/customer/FundWallet";

export default function FundWalletPage() {
  const handleSetup = () => {
    console.log("Open wallet setup");
  };

  const handleTopUp = async ({
    amount,
  }: {
    amount: number;
  }) => {
    console.log("Top up:", amount);

    // Example:
    // await axiosWithCookies.post("/wallets/fund/", {
    //   amount,
    // });
  };

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

    // Example:
    // await axiosWithCookies.post("/wallets/transfer/", {
    //   recipient_wallet_id: recipientWalletId,
    //   amount,
    // });
  };

  return (
    <FundWallet
      balance={0}
      accountName="Test account"
      accountNumber="6516853173"
      addedThisMonth={0}
      totalTopUps={0}
      currency="NGN"
      walletFound={false}
      onSetup={handleSetup}
      onTopUp={handleTopUp}
      onSendMoney={handleSendMoney}
    />
  );
}