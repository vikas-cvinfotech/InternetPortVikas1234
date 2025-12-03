import {
  ApiReady,
  ICAdaptive,
  ICAutomation,
  ICHandshake,
  ICHighCloud,
  ICIntegrations,
  WifiIcon,
} from '../svgicon/SvgIcon';
export const internetExchangeFeatures = [
  {
    name: 'Single Platform',
    description: "Access EMEA's leading Internet Exchanges from a single platform.",
    icon: <ICIntegrations />,
  },
  {
    name: 'Automation',
    description: 'Industry leading on demand ordering and provisioning',
    icon: <ICAutomation />,
  },
  {
    name: 'Adaptive',
    description: 'Multiple bandwidths from 100 Mbps to 10 Gbps',
    icon: <ICAdaptive />,
  },
  {
    name: 'High Availability',
    description: '99.99% service availability',
    icon: <ICHighCloud />,
  },
  {
    name: 'Flexible Contracts',
    description: '30-day contract terms as standard',
    icon: <ICHandshake />,
  },
  {
    name: 'API Ready',
    description: 'Ready for integration using the industry leading API standard',
    icon: <ApiReady />,
  },
];
