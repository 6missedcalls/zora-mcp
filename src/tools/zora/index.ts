import {
  ActionProvider,
  CreateAction,
  EvmWalletProvider,          // use the same generic they do, or keep WalletProvider but stay consistent
  type Network,
} from "@coinbase/agentkit";
import {
  setApiKey,
  getCoinsTopGainers,
  getCoinsTopVolume24h,
  getCoinsMostValuable,
  getCoinsNew,
  getCoinsLastTraded,
  getCoin,
  TradeParameters,
  createTradeCall,
} from "@zoralabs/coins-sdk";
import { z } from "zod";
import { Address, Hex, parseEther } from "viem";
import { base, baseSepolia } from "viem/chains";
import { ZoraExploreCoinsSchema, ZoraTradeCoinsSchema, ZoraGetCoinSchema } from "./schemas.js"
import { BASE_MAINNET_USDC_ADDRESS } from "../../constants/smart-contracts.js";

export class ZoraMcpActionProvider extends ActionProvider<EvmWalletProvider> {
  constructor() { super("zoraMcp", []); }

  @CreateAction({
    name: "zoraMcp_getTopGainers",
    description: "Get the top gainers from the Zora protocol",
    schema: ZoraExploreCoinsSchema,
  })
  async zoraGetTopGainers(
    walletProvider: EvmWalletProvider,                // param #1 (kept even if unused)
    args: z.infer<typeof ZoraExploreCoinsSchema>      // param #2
  ): Promise<string> {
    if (!process.env.ZORA_API_KEY) throw new Error("ZORA_API_KEY is not set");
    setApiKey(process.env.ZORA_API_KEY);

    const limit = args.limit;                         // no destructuring at signature
    // If your coins-sdk expects `count`, map it: { count: limit, after: undefined }
    const response = await getCoinsTopGainers({ limit, after: undefined });
    return JSON.stringify(response);                  // actions should resolve to a string
  }

  @CreateAction({
    name: "zoraMcp_getTop24hVolume",
    description: "Get the top tokens by 24h volume from the Zora protocol",
    schema: ZoraExploreCoinsSchema
  })
  async zoraGetTop24hVolume(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof ZoraExploreCoinsSchema>
  ): Promise<string> {
    if (!process.env.ZORA_API_KEY) throw new Error("ZORA_API_KEY is not set");
    setApiKey(process.env.ZORA_API_KEY);

    const limit = args.limit;
    const response = await getCoinsTopVolume24h({ limit, after: undefined });
    return JSON.stringify(response);
  }

  @CreateAction({
    name: "zoraMcp_getMostValuable",
    description: "Get the most valuable tokens from the Zora protocol",
    schema: ZoraExploreCoinsSchema
  })
  async zoraGetMostValuable(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof ZoraExploreCoinsSchema>
  ): Promise<string> {
    if (!process.env.ZORA_API_KEY) throw new Error("ZORA_API_KEY is not set");
    setApiKey(process.env.ZORA_API_KEY);

    const limit = args.limit;
    const response = await getCoinsMostValuable({ limit, after: undefined });
    return JSON.stringify(response);
  }

  @CreateAction({
    name: "zoraMcp_getNewCoins",
    description: "Get the newest tokens from the Zora protocol",
    schema: ZoraExploreCoinsSchema
  })
  async zoraGetNewCoins(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof ZoraExploreCoinsSchema>
  ): Promise<string> {
    if (!process.env.ZORA_API_KEY) throw new Error("ZORA_API_KEY is not set");
    setApiKey(process.env.ZORA_API_KEY);

    const limit = args.limit;
    const response = await getCoinsNew({ limit, after: undefined });
    return JSON.stringify(response);
  }

  @CreateAction({
    name: "zoraMcp_getLastTraded",
    description: "Get the last traded tokens from the Zora protocol",
    schema: ZoraExploreCoinsSchema
  })
  async zoraGetLastTraded(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof ZoraExploreCoinsSchema>
  ): Promise<string> {
    if (!process.env.ZORA_API_KEY) throw new Error("ZORA_API_KEY is not set");
    setApiKey(process.env.ZORA_API_KEY);

    const limit = args.limit;
    const response = await getCoinsLastTraded({ limit, after: undefined });
    return JSON.stringify(response);
  }

  @CreateAction({
    name: "zoraMcp_getCoin",
    description: "Get a coin by its contract address from the Zora protocol",
    schema: ZoraGetCoinSchema
  })
  async zoraGetCoin(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof ZoraGetCoinSchema>
  ): Promise<string> {
    if (!process.env.ZORA_API_KEY) throw new Error("ZORA_API_KEY is not set");
    setApiKey(process.env.ZORA_API_KEY);

    const response = await getCoin({
      address: args.address as Address,
    });
    return JSON.stringify(response);
  }

  @CreateAction({
    name: "zoraMcp_tradeCoin",
    description: "Trade a coin on the Zora protocol",
    schema: ZoraTradeCoinsSchema
  })
  async zoraTradeCoin(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof ZoraTradeCoinsSchema>
  ): Promise<string> {
    if (!process.env.ZORA_API_KEY) throw new Error("ZORA_API_KEY is not set");
    setApiKey(process.env.ZORA_API_KEY);

    const account = walletProvider.getAddress();

    let sellArg: { type: "eth" } | { type: "erc20", address: Address };
    if(args.inputToken.toLowerCase() === "eth") {
      sellArg = { type: "eth" };
    } else if (args.inputToken.toLowerCase() === "usdc") {
      sellArg = { type: "erc20", address: BASE_MAINNET_USDC_ADDRESS as Address };
    } else {
      sellArg = { type: "erc20", address: args.inputToken as Address };
    }

    const tradeParameters: TradeParameters = {
      sell: sellArg,
      buy: {
        type: "erc20",
        address: args.tokenAddress as Address,
      },
      amountIn: parseEther(args.amountIn),
      slippage: args.slippage,
      sender: account,
    };

    const quote = await createTradeCall(tradeParameters);

    const tx = await walletProvider.sendTransaction({
      to: quote.call.target as Address,
      data: quote.call.data as Hex,
      value: BigInt(quote.call.value),
    });

    return JSON.stringify(tx);
  }

  supportsNetwork(network: Network): boolean {
    return network.chainId === String(base.id) || network.chainId === String(baseSepolia.id);
  }
}

export const zoraMcpActionProvider = () => new ZoraMcpActionProvider();
