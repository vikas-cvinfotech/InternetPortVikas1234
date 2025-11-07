import { NextResponse } from 'next/server';
import https from 'https';
import fs from 'fs';
import path from 'path';

const HOSTBILL_API_URL = process.env.HOSTBILL_API_ENDPOINT || 'https://portal.internetport.com/admin/api.php';
const API_ID = process.env.HOSTBILL_API_ID;
const API_KEY = process.env.HOSTBILL_API_KEY;

// Configure SSL
const sslOptions = {};
if (process.env.NODE_EXTRA_CA_CERTS) {
  try {
    const certPaths = process.env.NODE_EXTRA_CA_CERTS.split(':');
    let certContent = '';
    certPaths.forEach(certPath => {
      const resolvedPath = path.resolve(process.cwd(), certPath);
      if (fs.existsSync(resolvedPath)) {
        certContent += fs.readFileSync(resolvedPath, 'utf-8') + '\n';
      }
    });
    if (certContent) {
      sslOptions.ca = certContent;
    }
  } catch (error) {
    console.error('Error loading SSL certificates:', error);
  }
}

// Create HTTPS agent with SSL certificates
const httpsAgent = new https.Agent({
  ...sslOptions,
  rejectUnauthorized: process.env.NODE_ENV === 'production'
});

/**
 * Generate random phone numbers for each area code
 * @param {Object} numbers - Object with area codes as keys and arrays of numbers as values
 * @param {number} count - Number of random numbers to select per area code
 * @returns {Object} Object with area codes as keys and arrays of random numbers as values
 */
function getRandomNumbers(numbers, count = 3) {
  const randomNumbers = {};
  
  for (const [areaCode, availableNumbers] of Object.entries(numbers)) {
    if (!Array.isArray(availableNumbers)) continue;
    
    // If there are fewer numbers than requested, return all
    if (availableNumbers.length <= count) {
      randomNumbers[areaCode] = availableNumbers;
      continue;
    }
    
    // Select random numbers without duplicates
    const selected = [];
    const usedIndexes = new Set();
    
    while (selected.length < count && selected.length < availableNumbers.length) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      if (!usedIndexes.has(randomIndex)) {
        selected.push(availableNumbers[randomIndex]);
        usedIndexes.add(randomIndex);
      }
    }
    
    randomNumbers[areaCode] = selected;
  }
  
  return randomNumbers;
}

/**
 * Static mapping of Swedish area codes to city/region names
 * This is used in both development and production environments
 */
const swedishAreaCodeMapping = {
  '08': 'Stockholm',
  '010': 'Stockholm',
  '011': 'Norrköping',
  '013': 'Linköping',
  '016': 'Eskilstuna',
  '018': 'Uppsala',
  '019': 'Örebro',
  '020': 'Nässjö',
  '021': 'Västerås',
  '023': 'Falun',
  '026': 'Gävle',
  '031': 'Göteborg',
  '033': 'Borås',
  '035': 'Halmstad',
  '036': 'Jönköping',
  '040': 'Malmö',
  '042': 'Helsingborg',
  '044': 'Kristianstad',
  '046': 'Lund',
  '054': 'Karlstad',
  '060': 'Sundsvall',
  '063': 'Östersund',
  '070': 'Mora',
  '071': 'Karlskrona',
  '072': 'Västervik',
  '073': 'Skövde',
  '074': 'Halmstad',
  '075': 'Karlstad',
  '076': 'Stenungsund',
  '077': 'Mariefred',
  '078': 'Karlstad',
  '079': 'Ånge',
  '090': 'Umeå',
  '099': 'Visby',
  '0100': 'Arjeplog',
  '0120': 'Enköping',
  '0121': 'Nyköping',
  '0122': 'Strängnäs',
  '0123': 'Eskilstuna',
  '0125': 'Mariefred',
  '0140': 'Tranås',
  '0141': 'Motala',
  '0142': 'Mjölby',
  '0143': 'Vadstena',
  '0144': 'Ödeshög',
  '0150': 'Katrineholm',
  '0151': 'Vingåker',
  '0152': 'Strängnäs',
  '0155': 'Nyköping',
  '0156': 'Oxelösund',
  '0157': 'Katrineholm',
  '0158': 'Vingåker',
  '0159': 'Gnesta',
  '0171': 'Nora',
  '0173': 'Hällefors',
  '0174': 'Grythyttan',
  '0175': 'Askersund',
  '0176': 'Karlskoga',
  '0220': 'Torsby',
  '0221': 'Sunne',
  '0222': 'Charlottenberg',
  '0223': 'Sysslebäck',
  '0224': 'Grums',
  '0225': 'Årjäng',
  '0226': 'Branäs',
  '0227': 'Bograngen',
  '0240': 'Ludvika',
  '0241': 'Smedjebacken',
  '0243': 'Borlänge',
  '0246': 'Säter',
  '0247': 'Hedemora',
  '0248': 'Avesta',
  '0250': 'Mora',
  '0251': 'Rättvik',
  '0252': 'Orsa',
  '0253': 'Älvdalen',
  '0254': 'Sälen',
  '0255': 'Leksand',
  '0258': 'Furudal',
  '0270': 'Söderhamn',
  '0271': 'Bollnäs',
  '0278': 'Ljusdal',
  '0280': 'Malung',
  '0281': 'Vansbro',
  '0290': 'Hofors',
  '0291': 'Sandviken',
  '0292': 'Skutskär',
  '0293': 'Tierp',
  '0294': 'Älvkarleby',
  '0295': 'Örbyhus',
  '0297': 'Östhammar',
  '0300': 'Kungsör',
  '0301': 'Köping',
  '0302': 'Kolsva',
  '0303': 'Arboga',
  '0304': 'Kungsör',
  '0320': 'Kungsbacka',
  '0321': 'Hindås',
  '0322': 'Alingsås',
  '0325': 'Lerum',
  '0340': 'Varberg',
  '0345': 'Hyltebruk',
  '0346': 'Falkenberg',
  '0370': 'Värnamo',
  '0371': 'Ljungby',
  '0372': 'Markaryd',
  '0376': 'Älmhult',
  '0378': 'Diö',
  '0379': 'Lagan',
  '0380': 'Växjö',
  '0381': 'Lessebo',
  '0382': 'Nybro',
  '0383': 'Emmaboda',
  '0390': 'Kalmar',
  '0392': 'Borgholm',
  '0393': 'Färjestaden',
  '0394': 'Mörbylånga',
  '0395': 'Mönsterås',
  '0400': 'Tingsryd',
  '0410': 'Skurup',
  '0411': 'Sjöbo',
  '0413': 'Eslöv',
  '0414': 'Höör',
  '0415': 'Perstorp',
  '0416': 'Bjuv',
  '0417': 'Båstad',
  '0418': 'Åstorp',
  '0430': 'Laholm',
  '0431': 'Ängelholm',
  '0433': 'Markaryd',
  '0435': 'Klippan',
  '0451': 'Hässleholm',
  '0454': 'Karlshamn',
  '0455': 'Karlskrona',
  '0456': 'Ronneby',
  '0457': 'Sölvesborg',
  '0459': 'Olofström',
  '0470': 'Växjö',
  '0471': 'Emmaboda',
  '0472': 'Alvesta',
  '0474': 'Åseda',
  '0476': 'Lessebo',
  '0477': 'Tingsryd',
  '0478': 'Lammhult',
  '0479': 'Markaryd',
  '0480': 'Kalmar',
  '0481': 'Nybro',
  '0485': 'Västervik',
  '0486': 'Oskarshamn',
  '0490': 'Borgholm',
  '0491': 'Mörbylånga',
  '0492': 'Färjestaden',
  '0493': 'Köpingsvik',
  '0494': 'Vickleby',
  '0495': 'Mönsterås',
  '0496': 'Figeholm',
  '0498': 'Ålem',
  '0499': 'Hultsfred',
  '0500': 'Rydaholm',
  '0501': 'Unnaryd',
  '0502': 'Hyltebruk',
  '0503': 'Lagan',
  '0504': 'Nissafors',
  '0505': 'Smålandsstenar',
  '0506': 'Landeryd',
  '0510': 'Tidaholm',
  '0511': 'Hjo',
  '0512': 'Karlsborg',
  '0513': 'Töreboda',
  '0514': 'Laxå',
  '0515': 'Hallsberg',
  '0518': 'Mullsjö',
  '0519': 'Askersund',
  '0520': 'Falköping',
  '0521': 'Vara',
  '0522': 'Götene',
  '0523': 'Lidköping',
  '0524': 'Habo',
  '0525': 'Tibro',
  '0526': 'Karlsborg',
  '0528': 'Mariestad',
  '0530': 'Fristad',
  '0531': 'Vårgårda',
  '0532': 'Herrljunga',
  '0533': 'Svenljunga',
  '0534': 'Tranemo',
  '0550': 'Jönköping',
  '0551': 'Gislaved',
  '0552': 'Värnamo',
  '0553': 'Sävsjö',
  '0554': 'Vetlanda',
  '0555': 'Eksjö',
  '0560': 'Bankeryd',
  '0563': 'Gislaved',
  '0564': 'Smålandsstenar',
  '0565': 'Mullsjö',
  '0570': 'Nässjö',
  '0571': 'Sävsjö',
  '0573': 'Tranås',
  '0580': 'Linköping',
  '0581': 'Mjölby',
  '0582': 'Motala',
  '0583': 'Vadstena',
  '0584': 'Åtvidaberg',
  '0585': 'Finspång',
  '0586': 'Kinda',
  '0587': 'Ödeshög',
  '0589': 'Borensberg',
  '0590': 'Boxholm',
  '0591': 'Rimforsa',
  '0600': 'Norrköping',
  '0611': 'Nyköping',
  '0612': 'Oxelösund',
  '0613': 'Katrineholm',
  '0620': 'Strängnäs',
  '0621': 'Eskilstuna',
  '0622': 'Vingåker',
  '0623': 'Flen',
  '0624': 'Mariefred',
  '0640': 'Torshälla',
  '0642': 'Hallstahammar',
  '0643': 'Surahammar',
  '0644': 'Kungsör',
  '0645': 'Köping',
  '0647': 'Kolsva',
  '0649': 'Arboga',
  '0650': 'Karlstad',
  '0651': 'Hammarö',
  '0652': 'Forshaga',
  '0653': 'Grums',
  '0655': 'Kil',
  '0656': 'Kristinehamn',
  '0657': 'Filipstad',
  '0660': 'Årjäng',
  '0661': 'Torsby',
  '0662': 'Sunne',
  '0663': 'Hagfors',
  '0670': 'Arvika',
  '0671': 'Charlottenberg',
  '0672': 'Eda',
  '0673': 'Säffle',
  '0674': 'Åmål',
  '0675': 'Bengtsfors',
  '0676': 'Mellerud',
  '0678': 'Dals Långed',
  '0680': 'Mariestad',
  '0682': 'Töreboda',
  '0684': 'Gullspång',
  '0687': 'Degerfors',
  '0690': 'Karlskoga',
  '0691': 'Hällefors',
  '0692': 'Nora',
  '0693': 'Askersund',
  '0695': 'Laxå',
  '0696': 'Hallsberg',
  '0800': 'Smedjebacken',
  '0900': 'Skellefteå',
  '0910': 'Skellefteå',
  '0911': 'Piteå',
  '0912': 'Byske',
  '0913': 'Luleå',
  '0914': 'Kalix',
  '0915': 'Haparanda',
  '0916': 'Överkalix',
  '0918': 'Övertorneå',
  '0920': 'Kiruna',
  '0921': 'Gällivare',
  '0922': 'Malmberget',
  '0923': 'Jokkmokk',
  '0924': 'Karesuando',
  '0925': 'Pajala',
  '0926': 'Tärendö',
  '0927': 'Junosuando',
  '0928': 'Vittangi',
  '0929': 'Karasjok',
  '0930': 'Nordmaling',
  '0932': 'Bjurholm',
  '0933': 'Vindeln',
  '0934': 'Robertsfors',
  '0935': 'Vännäs',
  '0939': 'Holmsund',
  '0940': 'Vilhelmina',
  '0941': 'Åsele',
  '0942': 'Dorotea',
  '0943': 'Fredrika',
  '0944': 'Bjurholm',
  '0950': 'Lycksele',
  '0951': 'Storuman',
  '0952': 'Sorsele',
  '0953': 'Malå',
  '0954': 'Tärnaby',
  '0958': 'Hemavan',
  '0960': 'Örnsköldsvik',
  '0961': 'Bredbyn',
  '0967': 'Höga Kusten',
  '0969': 'Ramsele',
  '0970': 'Strömsund',
  '0971': 'Backe',
  '0973': 'Hammerdal',
  '0975': 'Krokom',
  '0976': 'Rödön',
  '0977': 'Håsjö',
  '0978': 'Ragunda',
  '0980': 'Sollefteå',
  '0981': 'Junsele'
};

/**
 * Enhance prefixes array with Swedish city/region names
 * @param {Array} prefixes - Original prefixes from HostBill API
 * @returns {Array} Enhanced prefixes with city names
 */
function enhancePrefixesWithCityNames(prefixes) {
  return prefixes.map(prefix => ({
    ...prefix,
    text: `${prefix.value} - ${swedishAreaCodeMapping[prefix.value] || 'Sweden'}`
  }));
}

/**
 * Generate mock Swedish phone numbers for development environment
 * @returns {Object} Object with numbers and prefixes structure matching HostBill API
 */
function generateMockSwedishNumbers() {
  // All Swedish area codes with their corresponding cities/regions
  const swedishAreaCodes = [
    { code: '8', name: 'Stockholm' },
    { code: '10', name: 'Stockholm' },
    { code: '11', name: 'Norrköping' },
    { code: '13', name: 'Linköping' },
    { code: '16', name: 'Eskilstuna' },
    { code: '18', name: 'Uppsala' },
    { code: '19', name: 'Örebro' },
    { code: '20', name: 'Nässjö' },
    { code: '21', name: 'Västerås' },
    { code: '23', name: 'Falun' },
    { code: '26', name: 'Gävle' },
    { code: '31', name: 'Göteborg' },
    { code: '33', name: 'Borås' },
    { code: '35', name: 'Halmstad' },
    { code: '36', name: 'Jönköping' },
    { code: '40', name: 'Malmö' },
    { code: '42', name: 'Helsingborg' },
    { code: '44', name: 'Kristianstad' },
    { code: '46', name: 'Lund' },
    { code: '54', name: 'Karlstad' },
    { code: '60', name: 'Sundsvall' },
    { code: '63', name: 'Östersund' },
    { code: '70', name: 'Mora' },
    { code: '71', name: 'Karlskrona' },
    { code: '72', name: 'Västervik' },
    { code: '73', name: 'Skövde' },
    { code: '74', name: 'Halmstad' },
    { code: '75', name: 'Karlstad' },
    { code: '76', name: 'Stenungsund' },
    { code: '77', name: 'Mariefred' },
    { code: '78', name: 'Karlstad' },
    { code: '79', name: 'Ånge' },
    { code: '90', name: 'Umeå' },
    { code: '99', name: 'Visby' },
    { code: '100', name: 'Arjeplog' },
    { code: '120', name: 'Enköping' },
    { code: '121', name: 'Nyköping' },
    { code: '122', name: 'Strängnäs' },
    { code: '123', name: 'Eskilstuna' },
    { code: '125', name: 'Mariefred' },
    { code: '140', name: 'Tranås' },
    { code: '141', name: 'Motala' },
    { code: '142', name: 'Mjölby' },
    { code: '143', name: 'Vadstena' },
    { code: '144', name: 'Ödeshög' },
    { code: '150', name: 'Katrineholm' },
    { code: '151', name: 'Vingåker' },
    { code: '152', name: 'Strängnäs' },
    { code: '155', name: 'Nyköping' },
    { code: '156', name: 'Oxelösund' },
    { code: '157', name: 'Katrineholm' },
    { code: '158', name: 'Vingåker' },
    { code: '159', name: 'Gnesta' },
    { code: '171', name: 'Nora' },
    { code: '173', name: 'Hällefors' },
    { code: '174', name: 'Grythyttan' },
    { code: '175', name: 'Askersund' },
    { code: '176', name: 'Karlskoga' },
    { code: '220', name: 'Torsby' },
    { code: '221', name: 'Sunne' },
    { code: '222', name: 'Charlottenberg' },
    { code: '223', name: 'Sysslebäck' },
    { code: '224', name: 'Grums' },
    { code: '225', name: 'Årjäng' },
    { code: '226', name: 'Branäs' },
    { code: '227', name: 'Bograngen' },
    { code: '240', name: 'Ludvika' },
    { code: '241', name: 'Smedjebacken' },
    { code: '243', name: 'Borlänge' },
    { code: '246', name: 'Säter' },
    { code: '247', name: 'Hedemora' },
    { code: '248', name: 'Avesta' },
    { code: '250', name: 'Mora' },
    { code: '251', name: 'Rättvik' },
    { code: '252', name: 'Orsa' },
    { code: '253', name: 'Älvdalen' },
    { code: '254', name: 'Sälen' },
    { code: '255', name: 'Leksand' },
    { code: '258', name: 'Furudal' },
    { code: '270', name: 'Söderhamn' },
    { code: '271', name: 'Bollnäs' },
    { code: '278', name: 'Ljusdal' },
    { code: '280', name: 'Malung' },
    { code: '281', name: 'Vansbro' },
    { code: '290', name: 'Hofors' },
    { code: '291', name: 'Sandviken' },
    { code: '292', name: 'Skutskär' },
    { code: '293', name: 'Tierp' },
    { code: '294', name: 'Älvkarleby' },
    { code: '295', name: 'Örbyhus' },
    { code: '297', name: 'Östhammar' },
    { code: '300', name: 'Kungsör' },
    { code: '301', name: 'Köping' },
    { code: '302', name: 'Kolsva' },
    { code: '303', name: 'Arboga' },
    { code: '304', name: 'Kungsör' },
    { code: '320', name: 'Kungsbacka' },
    { code: '321', name: 'Hindås' },
    { code: '322', name: 'Alingsås' },
    { code: '325', name: 'Lerum' },
    { code: '340', name: 'Varberg' },
    { code: '345', name: 'Hyltebruk' },
    { code: '346', name: 'Falkenberg' },
    { code: '370', name: 'Värnamo' },
    { code: '371', name: 'Ljungby' },
    { code: '372', name: 'Markaryd' },
    { code: '376', name: 'Älmhult' },
    { code: '378', name: 'Diö' },
    { code: '379', name: 'Lagan' },
    { code: '380', name: 'Växjö' },
    { code: '381', name: 'Lessebo' },
    { code: '382', name: 'Nybro' },
    { code: '383', name: 'Emmaboda' },
    { code: '390', name: 'Kalmar' },
    { code: '392', name: 'Borgholm' },
    { code: '393', name: 'Färjestaden' },
    { code: '394', name: 'Mörbylånga' },
    { code: '395', name: 'Mönsterås' },
    { code: '400', name: 'Tingsryd' },
    { code: '410', name: 'Skurup' },
    { code: '411', name: 'Sjöbo' },
    { code: '413', name: 'Eslöv' },
    { code: '414', name: 'Höör' },
    { code: '415', name: 'Perstorp' },
    { code: '416', name: 'Bjuv' },
    { code: '417', name: 'Båstad' },
    { code: '418', name: 'Åstorp' },
    { code: '430', name: 'Laholm' },
    { code: '431', name: 'Ängelholm' },
    { code: '433', name: 'Markaryd' },
    { code: '435', name: 'Klippan' },
    { code: '451', name: 'Hässleholm' },
    { code: '454', name: 'Karlshamn' },
    { code: '455', name: 'Karlskrona' },
    { code: '456', name: 'Ronneby' },
    { code: '457', name: 'Sölvesborg' },
    { code: '459', name: 'Olofström' },
    { code: '470', name: 'Växjö' },
    { code: '471', name: 'Emmaboda' },
    { code: '472', name: 'Alvesta' },
    { code: '474', name: 'Åseda' },
    { code: '476', name: 'Lessebo' },
    { code: '477', name: 'Tingsryd' },
    { code: '478', name: 'Lammhult' },
    { code: '479', name: 'Markaryd' },
    { code: '480', name: 'Kalmar' },
    { code: '481', name: 'Nybro' },
    { code: '485', name: 'Västervik' },
    { code: '486', name: 'Oskarshamn' },
    { code: '490', name: 'Borgholm' },
    { code: '491', name: 'Mörbylånga' },
    { code: '492', name: 'Färjestaden' },
    { code: '493', name: 'Köpingsvik' },
    { code: '494', name: 'Vickleby' },
    { code: '495', name: 'Mönsterås' },
    { code: '496', name: 'Figeholm' },
    { code: '498', name: 'Ålem' },
    { code: '499', name: 'Hultsfred' },
    { code: '500', name: 'Rydaholm' },
    { code: '501', name: 'Unnaryd' },
    { code: '502', name: 'Hyltebruk' },
    { code: '503', name: 'Lagan' },
    { code: '504', name: 'Nissafors' },
    { code: '505', name: 'Smålandsstenar' },
    { code: '506', name: 'Landeryd' },
    { code: '510', name: 'Tidaholm' },
    { code: '511', name: 'Hjo' },
    { code: '512', name: 'Karlsborg' },
    { code: '513', name: 'Töreboda' },
    { code: '514', name: 'Laxå' },
    { code: '515', name: 'Hallsberg' },
    { code: '518', name: 'Mullsjö' },
    { code: '519', name: 'Askersund' },
    { code: '520', name: 'Falköping' },
    { code: '521', name: 'Vara' },
    { code: '522', name: 'Götene' },
    { code: '523', name: 'Lidköping' },
    { code: '524', name: 'Habo' },
    { code: '525', name: 'Tibro' },
    { code: '526', name: 'Karlsborg' },
    { code: '528', name: 'Mariestad' },
    { code: '530', name: 'Fristad' },
    { code: '531', name: 'Vårgårda' },
    { code: '532', name: 'Herrljunga' },
    { code: '533', name: 'Svenljunga' },
    { code: '534', name: 'Tranemo' },
    { code: '550', name: 'Jönköping' },
    { code: '551', name: 'Gislaved' },
    { code: '552', name: 'Värnamo' },
    { code: '553', name: 'Sävsjö' },
    { code: '554', name: 'Vetlanda' },
    { code: '555', name: 'Eksjö' },
    { code: '560', name: 'Bankeryd' },
    { code: '563', name: 'Gislaved' },
    { code: '564', name: 'Smålandsstenar' },
    { code: '565', name: 'Mullsjö' },
    { code: '570', name: 'Nässjö' },
    { code: '571', name: 'Sävsjö' },
    { code: '573', name: 'Tranås' },
    { code: '580', name: 'Linköping' },
    { code: '581', name: 'Mjölby' },
    { code: '582', name: 'Motala' },
    { code: '583', name: 'Vadstena' },
    { code: '584', name: 'Åtvidaberg' },
    { code: '585', name: 'Finspång' },
    { code: '586', name: 'Kinda' },
    { code: '587', name: 'Ödeshög' },
    { code: '589', name: 'Borensberg' },
    { code: '590', name: 'Boxholm' },
    { code: '591', name: 'Rimforsa' },
    { code: '600', name: 'Norrköping' },
    { code: '611', name: 'Nyköping' },
    { code: '612', name: 'Oxelösund' },
    { code: '613', name: 'Katrineholm' },
    { code: '620', name: 'Strängnäs' },
    { code: '621', name: 'Eskilstuna' },
    { code: '622', name: 'Vingåker' },
    { code: '623', name: 'Flen' },
    { code: '624', name: 'Mariefred' },
    { code: '640', name: 'Torshälla' },
    { code: '642', name: 'Hallstahammar' },
    { code: '643', name: 'Surahammar' },
    { code: '644', name: 'Kungsör' },
    { code: '645', name: 'Köping' },
    { code: '647', name: 'Kolsva' },
    { code: '649', name: 'Arboga' },
    { code: '650', name: 'Karlstad' },
    { code: '651', name: 'Hammarö' },
    { code: '652', name: 'Forshaga' },
    { code: '653', name: 'Grums' },
    { code: '655', name: 'Kil' },
    { code: '656', name: 'Kristinehamn' },
    { code: '657', name: 'Filipstad' },
    { code: '660', name: 'Årjäng' },
    { code: '661', name: 'Torsby' },
    { code: '662', name: 'Sunne' },
    { code: '663', name: 'Hagfors' },
    { code: '670', name: 'Arvika' },
    { code: '671', name: 'Charlottenberg' },
    { code: '672', name: 'Eda' },
    { code: '673', name: 'Säffle' },
    { code: '674', name: 'Åmål' },
    { code: '675', name: 'Bengtsfors' },
    { code: '676', name: 'Mellerud' },
    { code: '678', name: 'Dals Långed' },
    { code: '680', name: 'Mariestad' },
    { code: '682', name: 'Töreboda' },
    { code: '684', name: 'Gullspång' },
    { code: '687', name: 'Degerfors' },
    { code: '690', name: 'Karlskoga' },
    { code: '691', name: 'Hällefors' },
    { code: '692', name: 'Nora' },
    { code: '693', name: 'Askersund' },
    { code: '695', name: 'Laxå' },
    { code: '696', name: 'Hallsberg' },
    { code: '800', name: 'Smedjebacken' },
    { code: '900', name: 'Skellefteå' },
    { code: '910', name: 'Skellefteå' },
    { code: '911', name: 'Piteå' },
    { code: '912', name: 'Byske' },
    { code: '913', name: 'Luleå' },
    { code: '914', name: 'Kalix' },
    { code: '915', name: 'Haparanda' },
    { code: '916', name: 'Överkalix' },
    { code: '918', name: 'Övertorneå' },
    { code: '920', name: 'Kiruna' },
    { code: '921', name: 'Gällivare' },
    { code: '922', name: 'Malmberget' },
    { code: '923', name: 'Jokkmokk' },
    { code: '924', name: 'Karesuando' },
    { code: '925', name: 'Pajala' },
    { code: '926', name: 'Tärendö' },
    { code: '927', name: 'Junosuando' },
    { code: '928', name: 'Vittangi' },
    { code: '929', name: 'Karasjok' },
    { code: '930', name: 'Nordmaling' },
    { code: '932', name: 'Bjurholm' },
    { code: '933', name: 'Vindeln' },
    { code: '934', name: 'Robertsfors' },
    { code: '935', name: 'Vännäs' },
    { code: '939', name: 'Holmsund' },
    { code: '940', name: 'Vilhelmina' },
    { code: '941', name: 'Åsele' },
    { code: '942', name: 'Dorotea' },
    { code: '943', name: 'Fredrika' },
    { code: '944', name: 'Bjurholm' },
    { code: '950', name: 'Lycksele' },
    { code: '951', name: 'Storuman' },
    { code: '952', name: 'Sorsele' },
    { code: '953', name: 'Malå' },
    { code: '954', name: 'Tärnaby' },
    { code: '958', name: 'Hemavan' },
    { code: '960', name: 'Örnsköldsvik' },
    { code: '961', name: 'Bredbyn' },
    { code: '967', name: 'Höga Kusten' },
    { code: '969', name: 'Ramsele' },
    { code: '970', name: 'Strömsund' },
    { code: '971', name: 'Backe' },
    { code: '973', name: 'Hammerdal' },
    { code: '975', name: 'Krokom' },
    { code: '976', name: 'Rödön' },
    { code: '977', name: 'Håsjö' },
    { code: '978', name: 'Ragunda' },
    { code: '980', name: 'Sollefteå' },
    { code: '981', name: 'Junsele' }
  ];
  
  const mockNumbers = {};
  const mockPrefixes = [];
  
  // Generate mock numbers and prefixes
  swedishAreaCodes.forEach(({ code, name }) => {
    const numbers = [];
    // Generate 5-20 mock numbers per area code (more realistic variety)
    const numbersToGenerate = Math.floor(Math.random() * 16) + 5;
    
    for (let i = 0; i < numbersToGenerate; i++) {
      // Generate realistic Swedish phone numbers
      const baseLength = code.length <= 2 ? 7 : 6;
      const numberLength = Math.random() > 0.7 ? baseLength - 1 : baseLength;
      
      let number = '';
      for (let j = 0; j < numberLength; j++) {
        // First digit shouldn't be 0
        if (j === 0) {
          number += Math.floor(Math.random() * 9) + 1;
        } else {
          number += Math.floor(Math.random() * 10);
        }
      }
      numbers.push(number);
    }
    
    // Format area code with leading zero for display
    const formattedAreaCode = code.length === 1 ? `0${code}` : 
                             code.length === 2 ? `0${code}` :
                             code.length === 3 ? `0${code}` : code;
    
    mockNumbers[formattedAreaCode] = numbers.sort();
    
    // Add to prefixes array with city/region name (matching HostBill API structure)
    mockPrefixes.push({
      value: formattedAreaCode,
      text: `${formattedAreaCode} - ${name}`
    });
  });
  
  return {
    numbers: mockNumbers,
    prefixes: mockPrefixes
  };
}

export async function GET(request) {
  try {
    // Check if we have the necessary credentials
    if (!API_ID || !API_KEY) {
      return NextResponse.json(
        { error: 'API credentials not configured' },
        { status: 500 }
      );
    }

    // Development environment mockup - return sample data if in dev mode or API fails
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    let availableNumbers = {};
    let prefixes = [];
    
    try {
      // Prepare the API request to HostBill - using correct parameter order
      const formData = new URLSearchParams();
      formData.append('call', 'module');
      formData.append('module', 'phonenumbermng');
      formData.append('fn', 'getAvailableNumbers');
      formData.append('api_id', API_ID);
      formData.append('api_key', API_KEY);

      // Make request to HostBill API
      const response = await fetch(HOSTBILL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        agent: httpsAgent
      });

      if (!response.ok) {
        throw new Error(`HostBill API responded with status: ${response.status}`);
      }

      const data = await response.json();


      // Check if the API returned an error or empty result
      if (data.error || !data.result?.numbers || Object.keys(data.result.numbers).length === 0) {
        if (isDevelopment) {
          console.warn('HostBill API returned empty/error result, using development mockup');
          throw new Error('Using development mockup');
        } else {
          console.error('HostBill API error:', data.error);
          return NextResponse.json(
            { error: 'Failed to fetch phone numbers', details: data.error },
            { status: 500 }
          );
        }
      }

      // Extract numbers and prefixes from the result
      availableNumbers = data.result.numbers;
      prefixes = data.result.prefixes || [];

    } catch (error) {
      console.error('Error fetching from HostBill API:', error);
      
      // If in development or API fails, use mockup data
      if (isDevelopment) {
        const mockData = generateMockSwedishNumbers();
        availableNumbers = mockData.numbers;
        
        // Get random selection of numbers for each area code
        const randomSelections = getRandomNumbers(availableNumbers, 3);
        
        // Return mockup data with prefixes (matching HostBill API structure)
        return NextResponse.json({
          success: true,
          allNumbers: availableNumbers,
          randomNumbers: randomSelections,
          prefixes: mockData.prefixes,
          timestamp: new Date().toISOString(),
          developmentMode: true
        });
      } else {
        throw error;
      }
    }
    
    // Get random selection of numbers for each area code
    const randomSelections = getRandomNumbers(availableNumbers, 3);

    const responseData = {
      success: true,
      allNumbers: availableNumbers,
      randomNumbers: randomSelections,
      prefixes: enhancePrefixesWithCityNames(prefixes),
      timestamp: new Date().toISOString()
    };

    // Return production data (includes prefixes enhanced with city names)
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': `public, max-age=${process.env.BROWSER_CACHE_SECONDS || 300}, must-revalidate`
      }
    });

  } catch (error) {
    console.error('Error fetching phone numbers:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch phone numbers',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Optional: POST endpoint for specific area code requests
export async function POST(request) {
  try {
    const body = await request.json();
    const { areaCode } = body;

    // Check if we have the necessary credentials
    if (!API_ID || !API_KEY) {
      return NextResponse.json(
        { error: 'API credentials not configured' },
        { status: 500 }
      );
    }

    const isDevelopment = process.env.NODE_ENV === 'development';
    let allNumbers = {};
    let prefixes = [];

    try {
      // Prepare the API request to HostBill - using correct parameter order
      const formData = new URLSearchParams();
      formData.append('call', 'module');
      formData.append('module', 'phonenumbermng');
      formData.append('fn', 'getAvailableNumbers');
      formData.append('api_id', API_ID);
      formData.append('api_key', API_KEY);

      // Make request to HostBill API
      const response = await fetch(HOSTBILL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        agent: httpsAgent
      });

      if (!response.ok) {
        throw new Error(`HostBill API responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Check if the API returned an error or empty result
      if (data.error || !data.result?.numbers || Object.keys(data.result.numbers).length === 0) {
        if (isDevelopment) {
          throw new Error('Using development mockup');
        } else {
          console.error('HostBill API error:', data.error);
          return NextResponse.json(
            { error: 'Failed to fetch phone numbers', details: data.error },
            { status: 500 }
          );
        }
      }

      // Extract numbers and prefixes from the result
      allNumbers = data.result.numbers;
      prefixes = data.result.prefixes || [];

    } catch (error) {
      if (isDevelopment) {
        // Use mockup data for development
        const mockData = generateMockSwedishNumbers();
        allNumbers = mockData.numbers;
        prefixes = mockData.prefixes;
      } else {
        throw error;
      }
    }
    
    // If specific area code requested, return numbers for that area code
    if (areaCode && allNumbers[areaCode]) {
      const availableForArea = allNumbers[areaCode];
      const randomSelection = getRandomNumbers({ [areaCode]: availableForArea }, 3);
      
      return NextResponse.json({
        success: true,
        areaCode,
        availableNumbers: availableForArea,
        randomNumbers: randomSelection[areaCode] || [],
        prefixes: enhancePrefixesWithCityNames(prefixes),
        timestamp: new Date().toISOString(),
        ...(isDevelopment && { developmentMode: true })
      });
    }
    
    // Return all numbers if no specific area code requested
    const randomSelections = getRandomNumbers(allNumbers, 3);
    
    return NextResponse.json({
      success: true,
      allNumbers,
      randomNumbers: randomSelections,
      prefixes: enhancePrefixesWithCityNames(prefixes),
      timestamp: new Date().toISOString(),
      ...(isDevelopment && { developmentMode: true })
    });

  } catch (error) {
    console.error('Error fetching phone numbers:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch phone numbers',
        details: error.message 
      },
      { status: 500 }
    );
  }
}