import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { useState } from "react";
  import { ExchangeCard } from "./ExchangeCard";
  
  export function ExchangeDialog( {sendToken, receiveToken, insize} 
    :{
        sendToken: string,
        receiveToken: string,
        insize: number,
    }) {

    const [exchangeOpen, setExchangeOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleExchangeOpenChange = (nextOpen: boolean) => {
      if (!nextOpen) {
        setConfirmOpen(true); // Show confirm dialog instead of closing
      } else {
        setExchangeOpen(true); // Open exchange dialog normally
      }
    };
  
    const confirmClose = () => {
      setConfirmOpen(false);     // Close confirmation
      setExchangeOpen(false);    // Close exchange dialog
    };
  
    const cancelClose = () => {
      setConfirmOpen(false);     // Just close the confirm dialog
    };
  
    return (
      <>
        {/* Exchange Dialog */}
        <Dialog open={exchangeOpen} onOpenChange={handleExchangeOpenChange}>
          <DialogTrigger asChild>
            <Button className="w-full !bg-green-500 hover:!bg-green-600 !text-white">
              Open Exchange
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full bg-[#1c1c24] text-white !max-w-4xl border-0 overflow-visible">
            <DialogHeader>
              <DialogTitle className="text-center text-md">
                Please Enter details of your exchange
              </DialogTitle>
            </DialogHeader>
            <ExchangeCard p_sendToken = {sendToken} p_receiveToken = {receiveToken} p_insize = {insize}/>
          </DialogContent>
        </Dialog>
  
        {/* Confirmation Dialog */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="bg-[#1c1c24] text-white">
            <DialogHeader>
              <DialogTitle className="text-center">
                Are you sure you want to close this?
              </DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={cancelClose}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmClose}>
                Yes, close it
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }