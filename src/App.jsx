import React, { useState } from "react";
import { ethers } from "ethers";
import abi from "./abis/abi.json"; 

const App = () => {
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const contractAddress = "0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99"; 

  const requestAccounts = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const balance = await contract.getBalance();
        setBalance(ethers.utils.formatEther(balance));
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    }
  };

  const deposit = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading(true);
        await requestAccounts();

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.deposit(ethers.utils.parseEther(depositAmount), {
          value: ethers.utils.parseEther(depositAmount), 
        });
        await tx.wait();
        setLoading(false);
        getBalance(); 
        setDepositAmount("");t
        console.log("Deposit successful:", tx);
      } catch (err) {
        setLoading(false);
        setError("Error during deposit: " + err.message);
        console.error("Error during deposit:", err);
      }
    }
  };

  const withdraw = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading(true);
        await requestAccounts();

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.withdraw(ethers.utils.parseEther(withdrawAmount));
        await tx.wait();
        setLoading(false);
        getBalance(); 
        setWithdrawAmount(""); 
        console.log("Withdraw successful:", tx);
      } catch (err) {
        setLoading(false);
        setError("Error during withdrawal: " + err.message);
        console.error("Error during withdrawal:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Blockchain Assessment App</h1>

        <div className="mb-4">
          <button
            onClick={getBalance}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg shadow transition"
          >
            Get Balance
          </button>
          <p className="mt-2 text-lg">Contract Balance: {balance} ETH</p>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter deposit amount (ETH)"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full p-3 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={deposit}
            className={`w-full ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white font-bold py-2 px-4 rounded-lg shadow transition`}
            disabled={loading}
          >
            {loading ? "Depositing..." : "Deposit"}
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter withdrawal amount (ETH)"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full p-3 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={withdraw}
            className={`w-full ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"} text-white font-bold py-2 px-4 rounded-lg shadow transition`}
            disabled={loading}
          >
            {loading ? "Withdrawing..." : "Withdraw"}
          </button>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mt-4">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
