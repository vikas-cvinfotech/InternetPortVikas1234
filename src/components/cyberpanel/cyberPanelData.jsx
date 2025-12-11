import {
  CPUIcon,
  CyberpanelInstalledIcon,
  DataTransferIcon,
  DiskIcon,
  IPv4Icon,
  IPv6Icon,
  MemoryIcon,
} from '../svgicon/SvgIcon';

export const CyberPanelFaq = [
  {
    question: 'What Is CyberPanel?',
    answer:
      'CyberPanel is a web hosting control panel based on OpenLiteSpeed/LiteSpeed. It provides features such as auto backups, auto SSL, FTP server, and PHP management. You can easily convert your webserver from OpenLiteSpeed to LiteSpeed with one click.',
  },
  {
    question: 'How To Install SSL In CyberPanel?',
    answer: (
      <>
        With CyberPanel you can have unlimited free Let’s Encrypt SSL. Here’s how you install it.{' '}
        <br />
        Log in to CyberPanel <br /> Click “Websites” from the main menu <br /> Click List Websites{' '}
        <br />
        Your website’s main information will show up <br /> Click on the “Issue SSL” link
      </>
    ),
  },
  {
    question: 'How CyberPanel Is Better Than Other Control Panels?',
    answer: (
      <>
        In an era where web hosting has become more accessible and subsequently, more competitive as
        a product, CyberPanel has managed to stand out from competition in various ways.
        <br />
        Firstly, let’s talk about its usability. From installation, to website management, its
        interface is considered to be one of its strongest features against competition.
        Installation is a matter of a single command and navigating the panel is just as easy due to
        its minimal, clean design.
        <br />
        Then, there’s the features lineup that makes the panel rise above its counterparts. For
        instance, the fact that OpenLiteSpeed/LiteSpeed is embedded into the core offering means
        that you immediately get a faster website, automatic website optimisation, and effective
        security protection. In the panel itself, you can do one-click upgrade to LiteSpeed if you
        deem necessary.
        <br />
        Along with that comes a user-favourite, the LSCache module. With that, users can easily
        enable the LSCache plugins on the most popular CMSs such as WordPress, Joomla, and Magento
        for automatic optimisation of the website, built-in page caching and speed acceleration.
        <br />
        Last but not least, comes security. With malicious cyberattacks becoming more prevalent by
        the day, it’s essential to know that any product you use comes with built-in security
        protocols. Fortunately, CyberPanel is packed with security safeguards. For starters,
        LiteSpeed’s Web Application Firewall (WAF) is considered to be top in its class.
        <br />
        Furthermore, OpenLiteSpeed/LiteSpeed is bulletproof to common PHP and HTTP threats, meaning
        that your website is safe. When you also add the fact that SSL Certificates can be added in
        a few clicks to all your websites, you realize that you have an all-around protection
        against cyber-threats.
      </>
    ),
  },
  {
    question: 'How To Enable Multisite In WordPress CyberPanel?',
    answer:
      'Once again, the easy-to-use interface comes into play to show why this web hosting control panel is considered amongst the best. Enabling a multisite network is easy and intuitive. Here is a dedicated resource but also the guide provided by WordPress.',
  },
];

export const cyberCardData = [
  {
    title: 'Virtuell Cyberpanel 20GB',
    configData: [
      { label: 'CPU', value: '1', icon: <CPUIcon /> },
      { label: 'Disk', value: '20GB', icon: <DiskIcon /> },
      { label: 'IP/4', value: '1', icon: <IPv4Icon /> },
      { label: 'IPv6', value: '1', icon: <IPv6Icon /> },
      { label: 'Memory', value: '1GB', icon: <MemoryIcon /> },
      { label: 'Datatransfer', value: '10TB/1GBIT', icon: <DataTransferIcon /> },
      { label: 'Cyberpanel installed', value: 'Yes', icon: <CyberpanelInstalledIcon /> },
    ],
    price: '€ 5 / month',
    buylink: 'https://portal.internetport.com/cart/virtuell-cyberpanel-vps/&step=0',
    buyLabel: 'BUY NOW',
    isPopular: false,
  },
  {
    title: 'Virtuell Cyberpanel 40GB',
    configData: [
      { label: 'CPU', value: '2', icon: <CPUIcon /> },
      { label: 'Disk', value: '40GB', icon: <DiskIcon /> },
      { label: 'IP/4', value: '1', icon: <IPv4Icon /> },
      { label: 'IPv6', value: '1', icon: <IPv6Icon /> },
      { label: 'Memory', value: '2GB', icon: <MemoryIcon /> },
      { label: 'Datatransfer', value: '10TB/1GBIT', icon: <DataTransferIcon /> },
      { label: 'Cyberpanel installed', value: 'Yes', icon: <CyberpanelInstalledIcon /> },
    ],
    // The price is taken from the image (€ 8 / month), correcting the value in your original structure (€ 28 / month).
    price: '€ 8 / month',
    buylink: 'https://portal.internetport.com/cart/virtuell-cyberpanel-vps/&step=0',
    buyLabel: 'BUY NOW',
    isPopular: false,
  },
  {
    title: 'Virtuell Cyberpanel 100GB',
    configData: [
      { label: 'CPU', value: '4', icon: <CPUIcon /> },
      { label: 'Disk', value: '100GB', icon: <DiskIcon /> },
      { label: 'IP/4', value: '1', icon: <IPv4Icon /> },
      { label: 'IPv6', value: '1', icon: <IPv6Icon /> },
      { label: 'Memory', value: '4GB', icon: <MemoryIcon /> },
      { label: 'Datatransfer', value: '10TB/1GBIT', icon: <DataTransferIcon /> },
      { label: 'Cyberpanel installed', value: 'Yes', icon: <CyberpanelInstalledIcon /> },
    ],
    price: '€ 12 / month',
    buylink: 'https://portal.internetport.com/cart/virtuell-cyberpanel-vps/&step=0',
    buyLabel: 'BUY NOW',
    isPopular: false,
  },
  {
    title: 'Virtuell Cyberpanel 200GB',
    configData: [
      { label: 'CPU', value: '6', icon: <CPUIcon /> },
      { label: 'Disk', value: '200GB', icon: <DiskIcon /> },
      { label: 'IP/4', value: '1', icon: <IPv4Icon /> },
      { label: 'IPv6', value: '1', icon: <IPv6Icon /> },
      { label: 'Memory', value: '6GB', icon: <MemoryIcon /> },
      { label: 'Datatransfer', value: '10TB/1GBIT', icon: <DataTransferIcon /> },
      { label: 'Cyberpanel installed', value: 'Yes', icon: <CyberpanelInstalledIcon /> },
    ],
    // The price is taken from the image (€ 20 / month), correcting the value in your original structure (€ 29 / month).
    price: '€ 20 / month',
    buylink: 'https://portal.internetport.com/cart/virtuell-cyberpanel-vps/&step=0',
    buyLabel: 'BUY NOW',
    isPopular: false,
  },
];
