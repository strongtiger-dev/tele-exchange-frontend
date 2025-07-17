import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TokenSelect } from "@/components/ui/combobox"
import { SwitchButton } from "@/components/common/SwitchButton"
import { QRScanner } from "@/components/qr/QRScanner";
import { StepProgress } from "@/components/common/StepProgress"
import { Copy } from "lucide-react";
import { QRCodeDisplay } from "@/components/qr/QRCodeDisplay"
import { ScanQrCode } from 'lucide-react';
import { getRate, sendConfirmInfo, getSymbolList } from "@/API/exchange"
import { socket } from "@/lib/socket"
import WAValidator from "wallet-address-validator"
import bs58 from "bs58"
import { bech32 } from '@scure/base';
// import initCardanoWasm from '@emurgo/cardano-serialization-lib-browser';

type Token = {
    label: string
    value: string
}

export function ExchangeCard(  {p_sendToken, p_receiveToken, p_insize} 
    :{
        p_sendToken: string,
        p_receiveToken: string,
        p_insize: number,
    } ) {

    const [sendToken, setSendToken] = useState(p_sendToken)
    const [receiveToken, setReceiveToken] = useState(p_receiveToken)
    const [insize, setInsize] = useState(p_insize);
    const [outsize, setOutsize] = useState(0);
    const [rate, setRate] = useState(1.0);
    const [fee, setFee] = useState(0);

    const [showQR, setShowQR] = useState(false);
    const [receiveAddress, setReceiveAddress] = useState("");
    const [confirm, setConfirm] = useState(true);
    const [stage, setStage] = useState<"first" | "second" | "third">("first");
    const resultWallet = "888tN...vup3H";

    const [copied, setCopied] = useState(false);

    //Third Stage
    const [toAddress, _setToAddress] = useState("35GmPRNU4mFFknd4VWezPMhJPkse3JwK89");
    const [exchangeId, _setExchangeId] = useState("46fe1a4adb87fda");
    const [leftTime, setLeftTime] = useState("");
    const [createTime, setCreateTime] = useState("");

    const [step, setStep] = useState(0);
    
    //General
    const [tokenOptions, setTokenOptions] = useState<Token[]>([]);

    const Roundby5 = (value: number) => {
        return Math.round(value * 1e5) /1e5;
    }

    const onChangeToken = async () => {
        var data = await getRate( { user_id: "KTiger", symbol_1: sendToken, symbol_2: receiveToken });  //send setRate for async data updating
        console.log(data);
        setRate( Roundby5( Number(data.rate) ));
        // data = await getFee( { user_id: "KTiger", symbol_1: sendToken, symbol_2: receiveToken } );  //send setRate for async data updating
        // setFee( Number(data) );
    }

    useEffect( () => {
        onChangeToken();
    }, [sendToken, receiveToken]);

    useEffect( () => {
        setOutsize( Roundby5 (rate * insize) );
    } , [rate])

    
    useEffect(() => {

        const handleStepForward = (message: any) => {
            //Need Check For number / charactor
            setStep(message);
            console.log("message arrived");
        };
        
        const handleLeftTime = (message: any) => {
            setLeftTime(message);
            console.log("Left time message arrived");
        };

        const handleCreatTime = (message: any) => {
            setCreateTime(message);
            console.log("Create Time message arrived");
        };
        
        const handleConnect = () => {
            console.log("Socket connected");
            socket.emit("init", { user_id: "KTiger" });
        };
        
        // Remove first to prevent duplication
        socket.off("create_time", handleCreatTime);
        socket.off("left_time", handleLeftTime);
        socket.off("cur_status", handleStepForward);
        socket.off("connect", handleConnect);
        
        // Add fresh listeners
        socket.on("create_time", handleCreatTime);
        socket.on("left_time", handleLeftTime);
        socket.on("cur_status", handleStepForward);
        socket.on("connect", handleConnect);
        
        // Cleanup when component unmounts
        return () => {
            socket.off("create_time", handleCreatTime);
            socket.off("left_time", handleLeftTime);
            socket.off("cur_status", handleStepForward);
            socket.off("connect", handleConnect);
        };
    }, []);
    
    useEffect( () => {
        const fetchData = async () => {
            try {
              let res = await getSymbolList({ user_id: "KTIGER" });
              //let res = await getSymbolList_coin();
              setTokenOptions(res);
              console.log(res);
            } catch (err) {
              console.error("Error fetching symbol list:", err);
            }
        };
        fetchData();
    }, []);

    useEffect( () => {
        
        var address = receiveAddress;
        var coin = receiveToken.split(" ").at(-1);

        //const currency = WAValidator.findCurrency( coin.toLowerCase() );
        
        // if (!currency) {
        //   console.warn(`Unsupported currency: ${coin}`);
        //   return false;
        // }

        coin = coin == undefined ? "" : coin;
        
        if( validateAddress (address, coin) == true )
        {
            setConfirm(false);
            return;
        }
        else
        {
            setConfirm(true);
            return;
        }

    }, [receiveAddress, receiveToken]);

    const validateAddress = (address: string, chain: string) => {
        
        console.log("address + coin : ", address, chain);

        switch (chain.toLowerCase()) {
            case 'erc20':
            case 'bep20':
            case 'pol':
                return /^0x[a-fA-F0-9]{40}$/.test(address);
            case 'trc20':
                return /^T[a-zA-Z0-9]{33}$/.test(address);
            case 'sol':
                try {
                    const decoded = bs58.decode(address);
                    return decoded.length === 32; // Must decode to 32 bytes
                } catch (e) {
                    return false;
                }
            case 'bnb':
                // Binance Chain (BEP-2) address (Bech32, must start with 'bnb')
                try{
                    const decoded = bech32.decode(address as `${string}1${string}`);
                    return decoded.prefix === 'bnb';    
                } catch (e) {
                    return false;
                }
                
            case 'cardano':
            case 'ada':
                {
                    // Check if Bech32 address (addr1...)
                    if (address.startsWith('addr1')) {
                        const decoded = bech32.decode(address as `${string}1${string}`);
                        return decoded.prefix === 'addr';
                    }

                    // Check legacy Base58 format (Byron-era)
                    if (/^(Ae2|Ddz)[a-zA-Z0-9]{50,}$/.test(address)) {
                        try {
                            bs58.decode(address);
                            return true;
                        } catch {
                            return false;
                        }
                    }
                    return false;
                } 
        }

        return WAValidator.validate(address, chain);
      }

    const onSwitchToken = () => {
        var currentToken = sendToken;
        setSendToken(receiveToken);
        setReceiveToken(currentToken);
        var lotsize = insize;
        setInsize(outsize);
        setOutsize(lotsize);
        setRate( prev => 1.0/prev);
    }
    
    const handleScanSuccess = (scanned: string) => {
        const cleanAddress = scanned.trim();
        setReceiveAddress(cleanAddress);
        setShowQR(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(toAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleChangeInsize = (e: React.ChangeEvent<HTMLInputElement> ) => {
        setInsize( Roundby5( Number(e.target.value) ) ); 
        setOutsize( Roundby5 ( rate * Number(e.target.value) ) );
    }

    const handleConfirm = async () => {
        const data = {
            user_id: "KTiger",
            receive_addr : receiveAddress,
            symbol_1: sendToken,
            symbol_2: receiveToken,
            in_lots: insize,
            out_lots: outsize,
        }
        var res = await sendConfirmInfo(data);
        setStage("second");
        console.log("res after submit => ", res);
    }

    return (
        <Card className="w-full bg-[#1c1c24] text-white rounded-lg shadow-md p-6 space-y-6">
            {
                stage == "first" ?
                ( <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-center">Exchange Crypto</h2>
                    {/* Amounts */}
                    <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
                        <div className="w-full md:w-1/2 space-y-2 border border-white rounded-md p-4">
                            <label className="block text-sm text-gray-300">You send</label>
                            <div className="flex space-x-2">
                                <Input className="flex-1 bg-gray-800 border border-white text-white" value={insize} onChange={ (e) => { handleChangeInsize(e)  } } />
                                <TokenSelect
                                    className="!border !border-white !bg-gray-800"
                                    tokens={tokenOptions}
                                    value={sendToken}
                                    onChange={ (e) => { setSendToken(e); onChangeToken() } }
                                />
                            </div>
                        </div>

                        <div className="flex justify-center items-center">
                            <SwitchButton onClick={() => {onSwitchToken()}}/>
                        </div>
                        
                        <div className="w-full md:w-1/2 space-y-2 border border-white rounded-md p-4">
                            <label className="block text-sm text-gray-300">You get</label>
                            <div className="flex space-x-2">
                                <Input className="flex-1 bg-gray-800 border border-white text-white" readOnly value={outsize}  />
                                <TokenSelect
                                    className="!border !border-white !bg-gray-800"
                                    tokens={tokenOptions}
                                    value={receiveToken}
                                    onChange={ (e) => { setReceiveToken(e); onChangeToken() }}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-start space-y-3 md:space-x-3">
                        <p className="text-sm text-gray-400">
                            {
                                fee == 0 ? "No extra fee" : `Commission fee: ${fee}`
                            }
                        </p>
                        <p className="text-sm text-gray-400 ">Estimated rate: { `${insize} ${sendToken} = ${outsize} ${receiveToken}`} </p>
                    </div>
                    {/* Wallet address */}
                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Recipient Wallet</label>
                        <div className="flex items-center gap-2">
                            <Input placeholder="Enter XMR payout address" value={receiveAddress} onChange={ (e) => setReceiveAddress (e.target.value)} className="!bg-gray-800 text-white !border !border-white" />
                            <Button size="icon" variant="outline" onClick={ () => { setShowQR(prev => !prev) }} className="bg-transparent hover:bg-[#333] !border !border-white">
                                <ScanQrCode />
                            </Button>
                        </div>
                    </div>

                    {showQR && (
                        <div className="mt-4 border border-green-500 rounded p-2">
                            <QRScanner onScanSuccess={handleScanSuccess} />
                        </div>
                    )}

                    {/* Exchange button */} 
                    <Button className="!w-full !bg-green-500 hover:!bg-green-600 !text-white" disabled = {confirm} onClick={ () => { handleConfirm();} }>
                        Exchange
                    </Button>

                    <div className="text-xs text-gray-500 text-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                        I’ve read and agree to the provider’s <a href="#" className="underline">Terms of use</a> and <a href="#" className="underline">Privacy Policy</a>.
                    </div>

                    <div className="text-center text-sm text-gray-500 underline cursor-pointer">
                        ADVANCED SETTINGS
                    </div>
                </div> ) : 
                (
                    <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-center ">
                            <div className="flex flex-col justify-center">
                                <div className="text-left space-y-1">
                                    <p className="text-lg font-bold text-gray-400">Amount</p>
                                    <p className="text-xl font-bold">0.01 BTC</p>
                                </div>

                                <div className="text-left">
                                    <p className="text-lg text-gray-400">To this address</p>
                                    <div className="flex items-center justify-center space-x-2">
                                        <p className="font-mono text-md break-all">{toAddress}</p>
                                        <Button onClick={handleCopy} variant="ghost" size="icon">
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {copied && <p className="text-green-400 text-xs">Copied!</p>}
                                </div>
                            </div>

                            <Button className="block md:hidden !w-full !bg-green-500 hover:!bg-green-600 !text-white" onClick={ () => setShowQR(prev => !prev) } >
                                [#] Show QR
                            </Button>
                            <div className="flex justify-center hidden md:block" >
                                <QRCodeDisplay address={toAddress} />
                            </div>
                            {
                                showQR && (
                                    <div className="flex justify-center">
                                        <QRCodeDisplay address={toAddress} />
                                    </div>
                                )
                            }
                        </div>

                        <div className="flex items-center justify-between mt-6 text-xs text-gray-300" >
                            <StepProgress currentStep={step} />
                        </div>

                        <div className="mt-4 border-t border-gray-600 pt-4 text-xs text-gray-400 space-y-4">
                            <p>
                                You will get result to wallet <span className="text-white">{resultWallet}</span>
                            </p>
                            <p>
                                Exchange ID: <span className="bg-gray-800 px-2 py-1 rounded">{exchangeId}</span>
                            </p>
                        </div>
                    </CardContent>
                )
            }
        </Card>
    )
}
