![Logo](https://fuchsia-defiant-cicada-56.mypinata.cloud/ipfs/bafkreiew6etmtyu4qky6ahpehg7t6jbjxpdiijmkhb6yzj3j5p2yetkju4)

# Zora Protocol MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io/quickstart/server) (MCP) server integrating [Coinbase AgentKit](https://github.com/coinbase/agentkit) and the [Zora Protocol SDK](https://www.npmjs.com/package/@zoralabs/protocol-sdk) for **AI-driven on-chain interactions**.

This package provides the `zora-mcp-server` binary, which Claude Desktop (or any MCP-enabled client) can use to interact with Base via Zora Protocol.

[![npm version](https://img.shields.io/npm/v/@6missedcalls-ai/zora-mcp-server.svg)](https://www.npmjs.com/package/@6missedcalls-ai/zora-mcp-server)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
![Open Issues](https://img.shields.io/github/issues/6missedcalls/zora-mcp?label=Open%20Issues)
![Pull Requests](https://img.shields.io/github/issues-pr/6missedcalls/zora-mcp?label=Pull%20Requests)

## Important Notes

- **Testing environment:** All testing has been performed in **Claude Desktop**.
- **Ephemeral wallets:** Claude Desktop automatically generates a **new wallet every time you open a new instance**. You will not retain the same address across restarts unless you supply your own `PRIVATE_KEY` in the MCP config.

## Installation

```sh
npm install -g @6missedcalls-ai/zora-mcp-server
```

This makes the agentkit command available system-wide.

Configure MCP for Client (Claude, etc.,)

```bash
{
  "mcpServers": {
    "zora-mcp-server": {
      "command": "zora-mcp-server",
      "args": [],
      "env": {
        "CDP_API_KEY_ID": "<CDP_API_KEY_ID>",
        "CDP_API_KEY_SECRET": "<CDP_API_KEY_SECRET>",
        "CDP_WALLET_SECRET": "<CDP_WALLET_SECRET>",
        "PRIVATE_KEY": "<PRIVATE_KEY>",
        "NETWORK_ID": "base-mainnet",
        "ZORA_API_KEY": "<ZORA_API_KEY>"
      }
    }
  }
}
```

## Run Locally

Clone the project

```bash
git clone https://github.com/6missedcalls/zora-mcp.git
```

CD into the Repository

```bash
cd zora-mcp
```

Install NPM Packages

```bash
npm install
```

Build MCP Server

```bash
npm run build
```

Configure MCP for Client (Claude, etc.,)

```bash
{
  "mcpServers": {
    "zora-mcp-server": {
      "command": "node",
      "args": ["<full_path_to_project>/zora-mcp/build/index.js"],
      "env": {
        "CDP_API_KEY_ID": "<CDP_API_KEY_ID>",
        "CDP_API_KEY_SECRET": "<CDP_API_KEY_SECRET>",
        "CDP_WALLET_SECRET": "<CDP_WALLET_SECRET>",
        "PRIVATE_KEY": "<PRIVATE_KEY>",
        "NETWORK_ID": "base-mainnet",
        "ZORA_API_KEY": "<ZORA_API_KEY>"
      }
    }
  }
}
```

## Usage/Examples

Once a client (Claude, etc.) has been properly configured you can use natural language to invoke commands.

- `get top 20 tokens by volume on zora`
- `get token information for 0x1d95c975ef9a1721a69105521b6efaf88348ac80`
- `get new coins on the zora protocol`
- `get last traded tokens on the zora protocol`
- `get the most valuable tokens on zora protocol`
- `get the top gainers on zora protocol today`
- `swap $5 ETH for USDC`
- `send $5 ETH to <wallet_address>`
- `trade 75% my "eth" as my input token with 5% slippage for contract 0xd769d56f479e9e72a77bb1523e866a33098feec5`

## Feedback

If you have any feedback, please create an issue [here](https://github.com/6missedcalls/zora-mcp/issues).

## Contributing

Contributions are always welcome!

Please fork the repository and make your changes. Then create a [Pull Request](https://github.com/6missedcalls/zora-mcp/pulls).

## License

[MIT License](./LICENSE)
