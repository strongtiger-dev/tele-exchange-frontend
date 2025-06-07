// src/components/QRScanner.tsx
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QRScannerProps {
  onScanSuccess: (address: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!isScanning && scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250 },
        false
      );

      scanner.render(
        (decodedText) => {
          onScanSuccess(decodedText);
          scanner.clear();
          setIsScanning(false);
        },
        (error) => {
          // console.warn(`QR scan error:`, error)
        }
      );
      setIsScanning(true);
    }
  }, [isScanning, onScanSuccess]);

  return <div id="qr-reader" ref={scannerRef} className="w-full mx-auto" />;
};
