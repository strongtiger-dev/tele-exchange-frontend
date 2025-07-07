import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ExchangeDialog } from "./Exchange";
import { TokenSelect } from "@/components/ui/combobox"
import { getFee, getRate, getSymbolList } from "@/API/exchange";
import { Token } from "@/components/ui/combobox";

export default function PrivateSwaps() {

    const [sendToken, setSendToken] = useState("eth")
    const [receiveToken, setReceiveToken] = useState("xrp")
    const [insize, setInsize] = useState(0);
    const [outsize, setOutsize] = useState(0);
    const [rate, setRate] = useState(1.0);
    const [fee, setFee] = useState(0);
    const [tokenOptions, setTokenOptions] = useState<Token[]>([]);

    const onChangeToken = async ( e: string) => {
        var data = await getRate( { user_id: "KTiger", symbol_1: e, symbol_2: receiveToken });  //send setRate for async data updating
        setRate( Number(data) );
        // data = await getFee( { user_id: "KTiger", symbol_1: e, symbol_2: receiveToken } );  //send setRate for async data updating
        // setFee( Number(data) );
    }

    useEffect( () => {
        setOutsize( rate * insize );
    } , [rate])

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

    // const _onSwitchToken = () => {
    //     var currentToken = sendToken;
    //     setSendToken(receiveToken);
    //     setReceiveToken(currentToken);
    //     var lotsize = insize;
    //     setInsize(outsize);
    //     setOutsize(lotsize);
    //     setRate( prev => 1.0/prev);
    // }

    const handleChangeInsize = (e: React.ChangeEvent<HTMLInputElement> ) => {
        setInsize( Number(e.target.value) ); 
        setOutsize( rate * Number(e.target.value) );
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center px-4 py-8 space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full">
            <section className="flex flex-col items-center justify-center text-center space-y-4 max-w-xl w-full h-full">
                <img src="/img/logo.png" alt="PrivateSwaps Logo" className="w-100 h-50" />
                    <h1 className="text-4xl font-bold">
                        <span className="text-white">Private</span>
                        <span className="text-green-500">Swaps</span>
                    </h1>
                <p className="text-gray-400">Anonymous Crypto Swaps. No KYC.<br />Now supporting <strong>1,250+ coins</strong>.</p>
            </section>

            <section className="w-full max-w-xl">
                <Card className="bg-gray-800">
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-center text-gray-300">Start Your Swap</h2>
                    <div className="space-y-2">
                        <div className="space-y-2 border border-white rounded-md p-4">
                            <label className="block text-sm text-gray-300">You send</label>
                            <div className="flex space-x-2">
                                <Input className="flex-1 bg-gray-800 border border-white text-white" value={insize} onChange={ (e) => { handleChangeInsize(e)  } }/>
                                <TokenSelect
                                    className="!border !border-white !bg-gray-800"
                                    tokens={tokenOptions}
                                    value={sendToken}
                                    onChange={ (e) => { setSendToken(e); onChangeToken(e) }}
                                />
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-400">
                        {
                            fee == 0 ? "No extra fee" : `commission fee: ${fee}`
                        }
                    </p>
                    <p className="text-sm text-gray-400 ">Estimated rate: { `${insize} ${sendToken} = ${outsize} ${receiveToken}`} </p>

                    <div className="space-y-2">
                        <div className="space-y-2 border border-white rounded-md p-4">
                            <label className="block text-sm text-gray-300">You get</label>
                            <div className="flex space-x-2">
                                <Input className="flex-1 bg-gray-800 border border-white text-white" value={outsize} onChange={ (e) => { setOutsize( Number(e.target.value)) } }/>
                                <TokenSelect
                                    className="!border !border-white !bg-gray-800"
                                    tokens={tokenOptions}
                                    value={receiveToken}
                                    onChange={ (e) =>{ setReceiveToken(e); onChangeToken() } }
                                />
                            </div>
                        </div>
                    </div>
                    <ExchangeDialog sendToken = {sendToken} receiveToken = {receiveToken} insize = {insize}/>
                    <p className="text-xs text-gray-500 text-center">Most swaps complete in 5–10 minutes, but network congestion can extend this up to an hour.</p>
                </CardContent>
                </Card>
            </section>
        </div>

        <section className="w-full max-w-6xl">
            <h2 className="text-2xl font-bold text-center mb-6">Why Choose PrivateSwaps?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
                {
                title: "Over 1,250 Coins",
                text: "Choose from a massive variety of cryptocurrencies for your swaps."
                },
                {
                title: "No KYC Required",
                text: "Enjoy complete privacy; no identity checks or account creation needed."
                },
                {
                title: "Fast Swaps",
                text: "Experience quick, reliable exchanges with minimal wait times."
                },
                {
                title: "Secure & Anonymous",
                text: "We never store personal data, so you stay in control of your privacy."
                }
            ].map((item, i) => (
                <Card key={i} className="bg-gray-800 text-center p-4">
                <CardContent>
                    <div className="flex justify-center mb-2">
                    <img src={`/icons/${i + 1}.png`} alt="icon" className="w-15 h-15" />
                    </div>
                    <h3 className="font-semibold text-lg text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400 mt-2">{item.text}</p>
                </CardContent>
                </Card>
            ))}
            </div>
        </section>

        <section className="text-center space-y-2 max-w-xl px-4">
            <p>
            Boost your security with our Telegram bot, <span className="text-green-500 font-semibold">Crypto Swapper</span>. Experience all your swaps fortified with an extra layer of encryption!
            </p>
        </section>

        <footer className="text-sm text-gray-500 text-center pt-6">
            <p>© 2025 Private Swaps — All Rights Reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="underline">Contact Us</a>
            <a href="#" className="underline">Blog</a>
            </div>
        </footer>
        </div>
    )
}
