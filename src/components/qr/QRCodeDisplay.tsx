// components/QRCodeDisplay.tsx
import { QRCodeCanvas }  from "qrcode.react";

type QRCodeDisplayProps = {
    address: string;
  };
  
  export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ address }) => {
    return (
      <div className="flex flex-col items-center p-4">
        <QRCodeCanvas
          value={address}
          size={160}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin
        />
        {/* <p className="mt-2 text-sm text-gray-300 break-all text-center">
          {address}
        </p> */}
      </div>
    );
  };