import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

/**
 * Displays the BankID QR code or a loading placeholder.
 * @param {{qrImageUrl: string}} props - The component props.
 * @returns {JSX.Element}
 */
export default function QRCodeDisplay({ qrImageUrl, onDisplay }) {
  const t = useTranslations('bankid.qrCode');
  const dynamicQrUrl = qrImageUrl ? `${qrImageUrl}?t=${new Date().getTime()}` : '';

  useEffect(() => {
    if (dynamicQrUrl && onDisplay) {
      onDisplay();
    }
  }, [dynamicQrUrl, onDisplay]);

  return (
    <div className="flex flex-col items-center my-4">
      {dynamicQrUrl ? (
        <div className="flex flex-col items-center space-y-3">
          <div className="bg-primary p-2 rounded-lg shadow-md border border-divider">
            <Image
              src={dynamicQrUrl}
              alt={t('alt')}
              width={224}
              height={224}
              unoptimized
              priority
            />
          </div>
          <p className="text-sm text-secondary/80 max-w-[240px] text-center">
            {t('scanInstruction')}
          </p>
        </div>
      ) : (
        <div className="w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center bg-secondary/5 rounded-lg animate-pulse">
          <p className="text-sm text-secondary/50">{t('loading')}</p>
        </div>
      )}
    </div>
  );
}
