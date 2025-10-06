import {
  AgentKit,
  cdpApiActionProvider,
  erc20ActionProvider,
  pythActionProvider,
  CdpSmartWalletProvider,
  walletActionProvider,
  wethActionProvider,
  CdpApiActionProvider,
  CdpWalletProviderConfig,
} from "@coinbase/agentkit";
import { zoraMcpActionProvider } from "./tools/zora/index.js";
import { Hex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

/**
 * Get the AgentKit instance.
 *
 * @returns {Promise<AgentKit>} The AgentKit instance
 */
export async function getAgentKit(): Promise<AgentKit> {
  try {
    let privateKey: Hex | null = null;

    if (!privateKey) {
      privateKey = (process.env.PRIVATE_KEY || generatePrivateKey()) as Hex;
    }

    const owner = privateKeyToAccount(privateKey);
    const networkId = process.env.NETWORK_ID || "base-sepolia";
    const smartWalletAddress = process.env.SMART_WALLET_ADDRESS as Hex || undefined;

    let walletProvider: CdpSmartWalletProvider;

    if (smartWalletAddress) {
      walletProvider = await CdpSmartWalletProvider.configureWithWallet({
        apiKeyId: process.env.CDP_API_KEY_ID,
        apiKeySecret: process.env.CDP_API_KEY_SECRET,
        walletSecret: process.env.CDP_WALLET_SECRET,
        networkId: networkId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        owner: owner as any,
        address: smartWalletAddress,
        paymasterUrl: undefined, // Sponsor transactions: https://docs.cdp.coinbase.com/paymaster/docs/welcome
      });
    } else {
      walletProvider = await CdpSmartWalletProvider.configureWithWallet({
        apiKeyId: process.env.CDP_API_KEY_ID,
        apiKeySecret: process.env.CDP_API_KEY_SECRET,
        walletSecret: process.env.CDP_WALLET_SECRET,
        networkId: networkId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        owner: owner as any,
        paymasterUrl: undefined, // Sponsor transactions: https://docs.cdp.coinbase.com/paymaster/docs/welcome
      });
    }

    // Initialize AgentKit: https://docs.cdp.coinbase.com/agentkit/docs/agent-actions
    const agentkit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        wethActionProvider(),
        pythActionProvider(),
        walletActionProvider(),
        erc20ActionProvider(),
        cdpApiActionProvider(),
        zoraMcpActionProvider(),
      ],
    });

    return agentkit;
  } catch (error) {
    console.error("Error initializing agent:", error);
    throw new Error("Failed to initialize agent");
  }
}
