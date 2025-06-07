import { useState } from 'react';
///import { FirstPage } from './pages/FirstPage';
import  FirstPage  from './pages/FirstPage1';
//import { SecondPage } from './pages/SecondPage';
import  SecondPage from './pages/SecondPage1'
//import { ThirdPage } from './pages/ThirdPage';
import  ThirdPage  from './pages/ThirdPage1';
import  SH_button  from './components/common/Button';
import { Button, buttonVariants  } from "@/components/ui/button"
import { Link } from "react-router-dom";

function App() {
  const [secondPageOpen, setSecondPageOpen] = useState(false);
  const [thirdPageOpen, setThirdPageOpen] = useState(false);

  // States to simulate inputs
  const [fromAmount, setFromAmount] = useState('1.0');
  const [fromCrypto, setFromCrypto] = useState('ETH');
  const [toCrypto, setToCrypto] = useState('BNB');
  const [depositAddress, setDepositAddress] = useState('0x1234567890abcdef1234567890abcdef');
  const [recipientAddress, setRecipientAddress] = useState('48d1kabcxyz...');
  const [exchangeId, setExchangeId] = useState('14374f22077e');
  const [progressStep, setProgressStep] = useState(0);
  const [step, setStep] = useState(1);

  return (
    // <h1 className="text-3xl font-bold underline">
    //   Hello world!
    // </h1>
    <div >
      <FirstPage />
    </div>
    // <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
    //   {/* {
    //     step == 0 &&
    //     <FirstPage onExchangeClick={() => { setSecondPageOpen(true); setStep(1) } } />
    //   }
    //   {
    //     step == 1 &&
    //     <SecondPage
    //       onOpen={ () => {} }
    //       onNext={() => {
    //         setSecondPageOpen(false);
    //         setThirdPageOpen(true);
    //         setStep(2)
    //       }}
    //       onClose = { () => {
    //         setSecondPageOpen(false);
    //         setStep(0)
    //       }}
    //       fromAmount={fromAmount}
    //       setFromAmount = { (e: string) => {
    //         setFromAmount(e);
    //       }}
    //       fromCrypto={fromCrypto}
    //       setFromCrypto = { (e: string) => {
    //         setFromCrypto(e);
    //       }}
    //       toCrypto = { toCrypto}
    //       setToCrypto = { (e: string) => {
    //         setToCrypto(e);
    //       }}
    //       recipientAddress={recipientAddress}
    //       setReceipentAddress = { (e: string) => {
    //         setRecipientAddress (e);
    //       }}
    //       //exchangeId={exchangeId}
    //     />
    //   }
    //   {
    //     step == 2 &&
    //     <ThirdPage
    //       open={thirdPageOpen}
    //       onOpenChange={ () => { setThirdPageOpen(true); setStep(0); } }
    //       fromAmount={fromAmount}
    //       fromCrypto={fromCrypto}
    //       depositAddress={depositAddress}
    //       recipientAddress={recipientAddress}
    //       exchangeId={exchangeId}
    //       progressStep={progressStep}
    //     />
    //   } */}


    // </main>
  );
}

export default App;
