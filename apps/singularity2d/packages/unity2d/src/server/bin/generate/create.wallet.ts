/*
  contact registry is a module to register contacts for transport through ann mqtt broker on the prescence topic
  it will accept:
  mqtt.options.clientId as the session id
  ethers.HDVoidWallet as user
*/
import { HDNodeVoidWallet, HDNodeWallet } from 'ethers';
import * as openpgp from 'openpgp';
import * as mqtt from 'mqtt';
import { CustomerWallet } from '../../../car.wash/bin/wallets';
import getContentString from '../get.content.string';
import getContent from '../get.content.wallet';
import getHost from '../get.host.wallet';
import Blockchain, { Block } from '../components/blockchain';

type walletType = "host" | "provider" | "consumer" | "contractor" | "customer";

export default async function createWallet(signer: HDNodeWallet, path: walletType) {
    return signer.derivePath(getHost(path))
}