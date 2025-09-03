import { z } from "zod";

export const ZoraExploreCoinsSchema = z.object({
  limit: z.number().describe("The number of tokens to return from the Zora protocol."),
});

export const ZoraGetCoinSchema = z.object({
  address: z.string().describe("The contract address of the token to retrieve."),
});

export const ZoraTradeCoinsSchema = z.object({
  inputToken: z.string().describe("The contract address of the input token. e.g. eth, usdc, contractAddress of erc20 "),
  tokenAddress: z.string().describe("The contract address of the token to purchase."),
  amountIn: z.string().describe("The amount of the input token to trade."),
  slippage: z.number().describe("The slippage tolerance for trading on the Zora protocol. e.g. 0.05 for 5%"),
});
