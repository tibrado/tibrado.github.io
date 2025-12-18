import React from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

type Props = {
    onSubmit: (text: string) => void; 
};
const QRScanner: React.FC<Props> = ({onSubmit}) => (
    <Scanner
        onScan={(code) => onSubmit(code[0].rawValue)}
        onError={(error) => console.error(error)}
    />
);

export default QRScanner; 