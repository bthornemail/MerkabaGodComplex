/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyMessage, Wallet } from "ethers";

import { useEffect, useState } from 'react'
import Entity from "../components/Entity";
import HomeSearch from "./Home.Search";
import { marketplaceWallet } from "../App";
import Address from "./Address";
import Locations from "./Locations";
import PricePage from "../components/Price.Page";
import PriceQRcode from "./Price.QR.Code";


export default function useAccount(signature: string) {
    const [address, setAddress] = useState<string>();
    const [provider, setProvider] = useState<string>();
    const [consumer, setConsumer] = useState<string>();
    // useEffect(() => {
        // setProvider(marketplace.address)
        // setAddress(brianThorne.address)
        // setConsumer(deliveryForLocals.address)
    // }, [])
    const observerMap = new Map<string, any>([
        [``, <HomeSearch />],
        [`user`, <Entity entity={address}/>],
        [`address`, <Address />],
        [`deliveryforlocals.com`, <Locations />],
        [`deliveryforlocals.com/:location`, <PricePage />],
        [`deliveryforlocals.com/:location/:consumer`, <h1>{consumer}</h1>],
        [`deliveryforlocals.com/:location/:consumer/:order`, <PriceQRcode />],
        // [`pizza/leimert-park`, <h1>Leimert Park Pizza</h1>],
        // [`pizza/leimert-park/order`, <h1>Order Leimert Park Pizza</h1>],
        // [`sign`, <SigningQRcode />],
        // [`price`, <PriceQRcode />],
        // [`payment`, <PricePage />],
    ])
    function updateAddress(signature: string) {
        verifyMessage(marketplaceWallet.address, signature)
            // || verifyMessage(brianThorne.address, signature)
            // || verifyMessage(deliveryForLocals.address, signature)
        setAddress(address)
    }
    useEffect(() => {
        const addressWallet = Wallet.createRandom();
    //     const providerWallet = Wallet.createRandom();
    //     const consumerWallet = Wallet.createRandom();
        const address = addressWallet.address;
    //     const provider = providerWallet.address;
    //     const consumer = consumerWallet.address;
        setAddress(address)
    //     setProvider(provider)
    //     setConsumer(consumer)
    }, [])
    useEffect(()=>{
        if(!signature)return;
        updateAddress(signature)
    },[signature])
    return {
        address,
        provider,
        consumer,
        observerMap,
        updateAddress
    }
}