# Digcoin Miner for EOSIO

Naive Javascript Miner for DigCoin on the EOS Main Network.

## Installation

NodeJS 13+

Clone the Repository.

**Go Into Directory**

```sh
cd digcoin-miner-js
```

**Installation**

```sh
npm install
```

**Start Mining**

```sh
node ./index.js --wif=<private_key>
```

**Use a Special Endpoint**

```sh
node ./index.js --wif=<private_key> --endpoint=<some_bp_endpoint>
```

## Why is the Key Exposed Locally?

This is just a naive approach to mining with JavaScript.

It's very simple and this approach should not be used if you care about your keys.

If you just want to try out mining, this doesn't require Python and all that noise.

Review the source code before using this if you're unsure.

```

```
