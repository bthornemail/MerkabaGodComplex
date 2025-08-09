import assert from 'node:assert';
import test from 'node:test';
import { Signer } from '../../unity2d/types/signer';
import { HostWallet } from '../bin/wallets';
import { HDNodeWallet } from 'ethers';
import { Consumer, Order, QuickWheelWash } from '../data/data';
import { Context } from '../../unity2d/types/context';
import { iService, SERVICE, Service } from '../../unity2d/types/service';
import { Asset } from '../../unity2d/types/asset';
import { CONTENT, Content } from '../../unity2d/types/content';
import getContentString from '../bin/get.content.string';
import { HOST, iHost } from '../../unity2d/types/host';

let HostBrianThorne: HOST;
let ProviderBrianThorne: Signer;
let ProviderKeishaThorne: Signer;
let ContractorAzariahFreeman: Signer;
let ContractorAriannaThorne: Signer;
let CustomerBrianThorneJr: Signer;
let CustomerDominicDicks: Signer;
let ServiceQuickWheelWash: iService;


test('Shows an example of a user posting a Wheel Wash Service and Completing Service', async (t) => {
  // const signer = new Signer({ phrase: HostWallet.mnemonic?.phrase!, password: HostWallet.mnemonic?.password, path: HostWallet.path! })
  await t.test('Create Wallets for Test Entities', async (t) => {
    await t.test('Create Host Wallet', (t) => {
      HostBrianThorne = {
        graph:{
          nodes: [],
          links: []
        },
        extendedKey: new Signer({ phrase: HostWallet.mnemonic?.phrase! }).signingKey as unknown as string
      };
      assert.notEqual(HostBrianThorne, null)
      // assert.ok(HostBrianThorne.signingKey.publicKey)
    });
    await t.test('Create Provider Wallet', (t) => {
      const wallet = HDNodeWallet.createRandom(undefined, HostWallet.path!)
      ProviderBrianThorne = new Signer({ phrase: wallet.mnemonic?.phrase!, password: HostWallet.mnemonic?.password, path: HostWallet.path! });
      assert.ok(ProviderBrianThorne.signingKey.privateKey)
    });
    await t.test('Create Second Provider Wallet', (t) => {
      ProviderKeishaThorne = new Signer({ phrase: HostWallet.deriveChild(1).mnemonic?.phrase!, password: HostWallet.mnemonic?.password, path: HostWallet.path! });
      assert.ok(ProviderKeishaThorne.signingKey.privateKey)
    });
    await t.test('Create Contractor Consumer Wallet', (t) => {
      ContractorAzariahFreeman = new Signer({ phrase: HostWallet.deriveChild(0).mnemonic?.phrase!, password: HostWallet.mnemonic?.password, path: HostWallet.path! });
      assert.ok(ContractorAzariahFreeman.signingKey.privateKey)
    });
    await t.test('Create Second Contractor Consumer Wallet', (t) => {
      ContractorAriannaThorne = new Signer({ phrase: HostWallet.deriveChild(1).mnemonic?.phrase!, password: HostWallet.mnemonic?.password, path: HostWallet.path! });
      assert.ok(ContractorAriannaThorne.signingKey.privateKey)
    });
    await t.test('Create Customer Consumer Wallet', (t) => {
      CustomerBrianThorneJr = new Signer({ phrase: HostWallet.deriveChild(1).mnemonic?.phrase!, password: HostWallet.mnemonic?.password, path: HostWallet.path! });
      assert.ok(CustomerBrianThorneJr.signingKey.privateKey)
    });
    await t.test('Create Second Customer Consumer Wallet', (t) => {
      CustomerDominicDicks = new Signer({ phrase: HostWallet.deriveChild(1).mnemonic?.phrase!, password: HostWallet.mnemonic?.password, path: HostWallet.path! });
      assert.ok(CustomerDominicDicks.signingKey.privateKey)
    });
    await t.test('Create Service Wallet', (t) => {
      const content = new Content({author:"Brian Thorne",title:"Quick Wheel Wash"})
      const asset = new Asset({data: QuickWheelWash,mime: "application/json"})
      const service = new Service({inputs: Array.from(Consumer.keys()),outputs: Array.from(Order.keys())})
      ServiceQuickWheelWash = new Context({...content,...asset,...service});
      // ServiceQuickWheelWash = new Context(service);
      assert.ok(service);
    });
    await t.test('Create a Inital Enviornment', async (t) => {
      await t.test('Create Host', (t) => {
        t.todo()
      });
      await t.test('Create Content Options', (t) => {
        t.todo();
      });
      await t.test('Create Asset Options', (t) => {
        t.todo();
      });
      await t.test('Create Service Options', (t) => {
        t.todo();
      });
      await t.test('Create Service Options', (t) => {
        t.todo()
      });
      await t.test('Create Express Service', (t) => {
        t.todo();
      });
      await t.test('Add the server initialzation to the constructor return a content description of inputs and outputs', (t) => {
        t.todo();
      });
      await t.test('Initialize a host node', (t) => {
        t.todo();
      });
      await t.test('Create Provider Wallet', (t) => {
        t.todo();
      });
      await t.test('Create Consumer Wallet', (t) => {
        t.todo();
      });
      await t.test('Create Service Wallet', (t) => {
        t.todo();
      });
    });
  });
  // await t.test('Create Users', (t) => {
  //   assert.ok(signer.signingKey.privateKey);
  //   assert.ok(signer.signingKey.publicKey);
  // });
}); 