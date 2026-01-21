import {
  CPUIcon,
  CyberpanelInstalledIcon,
  DataTransferStorage,
  DiskIcon,
  IPv4Icon,
  IPv6Icon,
  MemoryIcon,
} from '../svgicon/SvgIcon';

export const CyberPanelFaq = (t) => {
  return Array.from({ length: 4 }).map((_, index) => ({
    question: t(`cyberPanelFaq.questions.${index}.q`),
    answer: t(`cyberPanelFaq.questions.${index}.a`),
  }));
};

export const getCyberCardData = (t) => {
  const prices = [5, 8, 12, 29];
  const specs = [
    { cpu: '1', disk: '20GB', ram: '1GB' },
    { cpu: '2', disk: '40GB', ram: '2GB' },
    { cpu: '4', disk: '100GB', ram: '4GB' },
    { cpu: '6', disk: '200GB', ram: '6GB' },
  ];

  return specs.map((spec, index) => ({
    title: t(`cyberPanelConfig.cards.${index}.title`),
    price: `kr ${prices[index]} ${t('cyberPanelConfig.perMonth')} (excl. VAT)`,
    buylink: 'https://portal.internetport.com/cart/virtuell-cyberpanel-vps/&step=0',
    buyLabel: t('cyberPanelConfig.buyLabel'),
    isPopular: false,
    configData: [
      { label: t('cyberPanelConfig.labels.cpu'), value: spec.cpu, icon: <CPUIcon /> },
      { label: t('cyberPanelConfig.labels.disk'), value: spec.disk, icon: <DiskIcon /> },
      { label: t('cyberPanelConfig.labels.ipv4'), value: '1', icon: <IPv4Icon /> },
      { label: t('cyberPanelConfig.labels.ipv6'), value: '1', icon: <IPv6Icon /> },
      { label: t('cyberPanelConfig.labels.memory'), value: spec.ram, icon: <MemoryIcon /> },
      {
        label: t('cyberPanelConfig.labels.dataTransfer'),
        value: '10TB/1GBIT',
        icon: <DataTransferStorage />,
      },
      {
        label: t('cyberPanelConfig.labels.installed'),
        value: t('cyberPanelConfig.yes'),
        icon: <CyberpanelInstalledIcon />,
      },
    ],
  }));
};
