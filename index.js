const { TextEncoder, TextDecoder } = require('text-encoding');
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const minimist = require('minimist');
const fetch = require('node-fetch');
const args = minimist(process.argv.slice(2));
const defaultEndpoint = 'https://api.eosrio.io';

let interval;
let transactionCount = 0;
let previousTransactionComplete = true;

Object.keys(args).forEach((key) => {
    process.env[key] = args[key];
});

if (!process.env['wif']) {
    console.error(`Did not provide argument: '--wif=<private_key>'`);
    process.exit(1);
}

if (!process.env['endpoint']) {
    process.env['endpoint'] = defaultEndpoint;
}

if (!process.env['account']) {
    console.error(`Did not provide argument: '--account=<private_key>'`);
    process.exit(1);
}

const rpc = new JsonRpc(process.env['endpoint'], { fetch });
const signatureProvider = new JsSignatureProvider([process.env['wif']]);
const api = new Api({
    rpc: rpc,
    signatureProvider,
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder()
});

/**
 * @param  {} value
 */
async function handleDigging() {
    interval = setInterval(handleMiningAction, 5000);
}

async function handleMiningAction() {
    if (!previousTransactionComplete) {
        console.log(`[${transactionCount}] Processing`);
        return;
    }

    previousTransactionComplete = false;
    transactionCount += 1;

    console.log('Beginning Transaction');
    await api
        .transact(
            {
                actions: [
                    {
                        account: 'digcoinsmine',
                        name: 'mine',
                        authorization: [{ actor: process.env['account'], permission: 'active' }],
                        data: { miner: process.env['account'], symbol: '4,DIG' }
                    }
                ]
            },
            { blocksBehind: 3, expireSeconds: 30, sign: true, broadcast: true }
        )
        .then((res) => {
            console.log(`Transaction Complete!`);
            previousTransactionComplete = true;
        })
        .catch((err) => {
            console.log(`Transaction Failed!`);
            console.log(err);
            previousTransactionComplete = true;
        });
}

function killProcess(err) {
    console.log(err);
    console.error(new Error('Failed to fetch ABI for `digcoinsmine`'));
    process.exit(1);
}

console.log(`Started Miner`);
api.getAbi('digcoinsmine').then(handleDigging).catch(killProcess);
