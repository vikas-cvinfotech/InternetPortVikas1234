import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import AdmZip from 'adm-zip';

// Country name translations (English direction -> Swedish country name)
const COUNTRY_TRANSLATIONS = {
  'Afghanistan': 'Afghanistan',
  'Albania': 'Albanien',
  'Algeria': 'Algeriet',
  'American Samoa': 'Amerikanska Samoaöarna',
  'Andorra': 'Andorra',
  'Angola': 'Angola',
  'Anguilla': 'Anguilla',
  'Antigua': 'Antigua',
  'Argentina': 'Argentina',
  'Armenia': 'Armenien',
  'Aruba': 'Aruba',
  'Ascension': 'Ascension',
  'Australia': 'Australien',
  'Austria': 'Österike',
  'Azerbaijan': 'Azerbajdjan',
  'Bahamas': 'Bahamas',
  'Bahrain': 'Bahrain',
  'Bangladesh': 'Bangladesh',
  'Barbados': 'Barbados',
  'Belarus': 'Vitryssland',
  'Belgium': 'Belgien',
  'Belize': 'Belize',
  'Benin': 'Benin',
  'Bermuda': 'Bermuda',
  'Bhutan': 'Bhutan',
  'Bolivia': 'Bolivia',
  'Bosnia and Herzegovina': 'Bosnien-Hercegovina',
  'Botswana': 'Botswana',
  'Brazil': 'Brasilien',
  'British Virgin Islands': 'Brittiska Jungfruöarna',
  'Brunei': 'Brunei',
  'Bulgaria': 'Bulgarien',
  'Burkina Faso': 'Burkina Faso',
  'Burundi': 'Burundi',
  'Cambodia': 'Kambodja',
  'Cameroon': 'Kamerun',
  'Canada': 'Kanada',
  'Cape Verde Islands': 'Kap Verde öarna',
  'Cayman Islands': 'Caymanöarna',
  'Central African Republic': 'Centralafrikanska Republiken',
  'Chad': 'Tchad',
  'Chile': 'Chile',
  'China': 'Kina',
  'Colombia': 'Colombia',
  'Comoros': 'Comoros',
  'Congo': 'Kongo',
  'Congo Dem Rep.': 'Kongo Dem Rep.',
  'Cook Islands': 'Cooköarna',
  'Costa Rica': 'Costa Rica',
  'Croatia': 'kr/minoatien',
  'Cuba': 'Kuba',
  'Cyprus': 'Cypern',
  'Czech Republic': 'Tjeckien',
  'Denmark': 'Danmark',
  'Diego Garcia': 'Diedo Garcia',
  'Djibouti': 'Djidouti',
  'Dominica': 'Dominica',
  'Dominican Republic': 'Dominokanska Republiken',
  'East Timor': 'Östra Timor',
  'Ecuador': 'Ecuador',
  'Egypt': 'Egypten',
  'El Salvador': 'El Salvador',
  'Equatorial Guinea': 'Ekvatorialguinea',
  'Eritrea': 'Eritrea',
  'Estonia': 'Estland',
  'Estonia Premium': 'Estland Premium',
  'Ethiopia': 'Etiopien',
  'Falkland Islands': 'Falklandsöarna',
  'Faroe Islands': 'Färöarna',
  'Fiji': 'Fiji',
  'Finland': 'Finland',
  'Finland Premium': 'Finland Premium',
  'France/Monaco': 'Frankr/minike',
  'French Guiana': 'Franska Guyana',
  'French Polynesia': 'Franska Polynesien',
  'Gabon': 'Gabon',
  'Gambia': 'Gambia',
  'Georgia': 'Georgien',
  'Germany': 'Tyskland',
  'Germany Personal': 'Tyskland Personal',
  'Germany Shared Cost': 'Tyskland Delad Kostnad',
  'Ghana': 'Ghana',
  'Gibraltar': 'Gibraltar',
  'Global Network – Aicent': 'Global Network – Aicent',
  'Global Network – Voxb.': 'Global Network – Voxb.',
  'GMSS – Ellipspo': 'GMSS – Ellipspo',
  'GMSS – Globalstar': 'GMSS – Globalstar',
  'GMSS – Iridium': 'GMSS – Iridium',
  'Greece': 'Grekland',
  'Greenland': 'Grönland',
  'Grenada': 'Grenada',
  'Guadeloupe': 'Guadeloupe',
  'Guam': 'Guam',
  'Guatemala': 'Guatemala',
  'Guinea': 'Guinea',
  'Guinea-Bissau': 'Guinea-Bissau',
  'Guyana': 'Guyana',
  'Haiti': 'Haiti',
  'Honduras': 'Honduras',
  'Hong Kong': 'Hong Kong',
  'Hungary': 'Ungern',
  'Iceland': 'Island',
  'India': 'Indien',
  'Indonesia': 'Indonesien',
  'Inmarsat – Aero': 'Inmarsat – Aero',
  'Inmarsat – B': 'Inmarsat – B',
  'Inmarsat – B HSD': 'Inmarsat – B HSD',
  'Inmarsat – BGAN': 'Inmarsat – BGAN',
  'Inmarsat – BGAN HSD': 'Inmarsat – BGAN HSD',
  'Inmarsat – GAN HSD': 'Inmarsat – GAN HSD',
  'Inmarsat – M': 'Inmarsat – M',
  'Inmarsat – Mini M': 'Inmarsat – Mini M',
  'Int. Network – Cubio': 'Int. Network – Cubio',
  'Int. Network – DTAG': 'Int. Network – DTAG',
  'Int. Network – Emsat': 'Int. Network – Emsat',
  'Int. Network – Global Network': 'Int. Network – Global Network',
  'Int. Network – Intermatica': 'Int. Network – Intermatica',
  'Int. Network – MCP': 'Int. Network – MCP',
  'Int. Network – Onair': 'Int. Network – Onair',
  'Int. Network – Oration': 'Int. Network – Oration',
  'Int. Network – Seanet M': 'Int. Network – Seanet M',
  'Int. Network – Thuraya': 'Int. Network – Thuraya',
  'Int. Network Aero Norw': 'Int. Network Aero Norw',
  'Iran': 'Iran',
  'Iraq': 'Irak',
  'Ireland': 'Irland',
  'Ireland Premium': 'Irland Premium',
  'Israel': 'Israel',
  'Italy': 'Italien',
  'Ivory Coast': 'Elfenbenskusten',
  'Jamaica': 'Jamaica',
  'Japan': 'Japan',
  'Jordan': 'Jordanien',
  'Kazakhstan': 'Kazakstan',
  'Kenya': 'Kenya',
  'Kiribati': 'Kiribati',
  'Kuwait': 'Kuwait',
  'Kyrgyzstan': 'Kirgizistan',
  'Laos': 'Laos',
  'Latvia': 'Lettland',
  'Lebanon': 'Libanon',
  'Lesotho': 'Lesotho',
  'Liberia': 'Liberia',
  'Libya': 'Libyen',
  'Liechtenstein': 'Liechtenstein',
  'Lithuania': 'Litauen',
  'Lithuania Personal': 'Litauen Personal',
  'Luxembourg': 'Luxemburg',
  'Macau': 'Macau',
  'Macedonia': 'Makedonien',
  'Madagascar': 'Madagaskar',
  'Malawi': 'Malawi',
  'Malaysia': 'Malaysia',
  'Maldives': 'Maldiverna',
  'Mali': 'Mali',
  'Malta': 'Malta',
  'Mariana Islands': 'Marianerna',
  'Marshall Islands': 'Marshallöarna',
  'Martinique': 'Martinique',
  'Mauritania': 'Mauretanien',
  'Mauritius': 'Mauritius',
  'Mayotte': 'Mayotte',
  'Mexico': 'Mexico',
  'Micronesia': 'Mikr/minonesien',
  'Midway Islands': 'Midway Islands',
  'Moldova': 'Moldavien',
  'Monaco': 'Monaco',
  'Mongolia': 'Mongoliet',
  'Montenegro': 'Montenegro',
  'Montserrat': 'Montserrat',
  'Morocco': 'Marocko',
  'Mozambique': 'Mocambique',
  'Myanmar (Burma)': 'Myanmar (Burma)',
  'Namibia': 'Namibia',
  'Nauru': 'Nauru',
  'Nepal': 'Nepal',
  'Netherlands': 'Nederländerna',
  'Netherlands Antilles': 'Nederlänska Antillerna',
  'New Caledonia': 'Nya Kaledonien',
  'New Zealand': 'Nya Zeeland',
  'Nicaragua': 'Niciaragua',
  'Niger': 'Niger',
  'Nigeria': 'Nigeria',
  'Niue': 'Niue',
  'North Korea': 'Nordkorea',
  'Norway': 'Norge',
  'Norway Shared': 'Norge Delad',
  'Oman': 'Oman',
  'Pakistan': 'Pakistan',
  'Palau': 'Palau',
  'Palestine': 'Palestina',
  'Panama': 'Panama',
  'Papua New Guinea': 'Papua Nya Guinea',
  'Paraguay': 'Paraguay',
  'Peru': 'Peru',
  'Philippines': 'Filipinerna',
  'Poland': 'Polen',
  'Portugal': 'Portugal',
  'Puerto Rico': 'Puerto Rico',
  'Qatar': 'Qatar',
  'Reunion': 'Reunion',
  'Romania': 'Rumänien',
  'Russia': 'Ryssland',
  'Rwanda': 'Rwanda',
  'San Marino': 'San Marino',
  'Saudi Arabia': 'Saudiarabien',
  'Senegal': 'Senegal',
  'Serbia': 'Serbien',
  'Seychelles': 'Seychellerna',
  'Sierra Leone': 'Sierra Lione',
  'Singapore': 'Singapore',
  'Slovakia': 'Slovakien',
  'Slovenia': 'Slovenien',
  'Solomon Islands': 'Solomonöarna',
  'Somalia': 'Somalia',
  'South Africa': 'Sydafrika',
  'South Korea': 'Sydkorea',
  'Spain': 'Spanien',
  'Sri Lanka': 'Sri Lanka',
  'St. Helena': 'St. Helena',
  'St. Kitts Navis': 'St. Kitts Navis',
  'St. Lucia': 'St. Lucia',
  'St. Pierre & Miquelon': 'St. Pierre & Miquleon',
  'St. Vincent & the Grenadines': 'St. Vincent & Grenadinerna',
  'Sudan': 'Sudan',
  'Suriname': 'Surinam',
  'Swaziland': 'Swaziland',
  'Switzerland': 'Schweiz',
  'Syria': 'Syrien',
  'Taiwan': 'Taiwan',
  'Tajikistan': 'Tadjikistan',
  'Tanzania': 'Tanzania',
  'Thailand': 'Thailand',
  'Thuraya': 'Turaya',
  'Togo': 'Togo',
  'Tokelau': 'Tokelau',
  'Tonga': 'Tonga',
  'Trinidad & Tobago': 'Trinidad & Tobago',
  'Tunisia': 'Tunisien',
  'Turkey': 'Turkiet',
  'Turkmenistan': 'Turkmenistan',
  'Turks & Caicos Islands': 'Turks & Caicosöarna',
  'Tuvalu': 'Tuvalu',
  'UK – NTS 844': 'UK – NTS 844',
  'UK – NTS 845': 'UK – NTS 845',
  'UK – NTS 870': 'UK – NTS 870',
  'UK – NTS 871': 'UK – NTS 871',
  'UK Personal': 'UK Personal',
  'Uganda': 'Uganda',
  'Ukraine': 'Ukr/minaina',
  'United Arab Emirates': 'Förenade Arabemiraten',
  'United Kingdom/UK': 'Storbritanien/UK',
  'Uruguay': 'Uruguay',
  'USA': 'USA',
  'Uzbekistan': 'Uzbekistan',
  'Vanuatu': 'Vanuatu',
  'Venezuela': 'Venezuela',
  'Vietnam': 'Vietnam',
  'Virgin Islands. USA': 'Jungfruöarna. USA',
  'Wake Island': 'Wake-ön',
  'Wallis & Futuna Islands': 'Wallis & Futunaöarna',
  'Yemen': 'Jemen',
  'Zambia': 'Zambia',
  'Zimbabwe': 'Zimbabwe',
};

// Cache file path
const CACHE_FILE_PATH = path.join(process.cwd(), 'src', 'config', '.mor-cache.json');
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Check if cache is valid
async function isCacheValid() {
  try {
    const cacheData = await fs.readFile(CACHE_FILE_PATH, 'utf8');
    const cache = JSON.parse(cacheData);
    const now = Date.now();
    return (now - cache.timestamp) < CACHE_DURATION;
  } catch (error) {
    return false;
  }
}

// Update cache timestamp
async function updateCacheTimestamp() {
  const cacheData = {
    timestamp: Date.now(),
  };
  await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(cacheData, null, 2));
}

export async function GET() {
  try {
    console.log('MOR sync-rates: Checking cache validity...');

    // Check if cache is still valid
    if (await isCacheValid()) {
      console.log('MOR sync-rates: Cache is valid, skipping sync');
      return NextResponse.json({
        success: true,
        message: 'Rates are up to date (cached)',
        cached: true,
      });
    }

    console.log('MOR sync-rates: Cache expired or not found, fetching new rates...');

    // Fetch tariff from MOR API
    const morUrl = `${process.env.MOR_API_BASE_URL}/get_tariff?u=${process.env.MOR_API_USERNAME}&tariff_id=${process.env.MOR_TARIFF_ID}&hash=${process.env.MOR_API_HASH}`;

    console.log('MOR sync-rates: Fetching from MOR API...');
    const response = await fetch(morUrl, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`MOR API returned ${response.status}: ${response.statusText}`);
    }

    // Save ZIP file temporarily
    const zipBuffer = Buffer.from(await response.arrayBuffer());
    const tempZipPath = path.join(process.cwd(), 'src', 'config', 'temp-tariff.zip');
    await fs.writeFile(tempZipPath, zipBuffer);

    console.log('MOR sync-rates: ZIP file downloaded, unzipping...');

    // Unzip the file
    const zip = new AdmZip(tempZipPath);
    const zipEntries = zip.getEntries();

    if (zipEntries.length === 0) {
      throw new Error('ZIP file is empty');
    }

    // Find the XML file (usually the first entry)
    const xmlEntry = zipEntries.find(entry => entry.entryName.endsWith('.xml'));
    if (!xmlEntry) {
      throw new Error('No XML file found in ZIP');
    }

    const xmlContent = xmlEntry.getData().toString('utf8');
    console.log('MOR sync-rates: XML extracted, parsing...');

    // Parse XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseTagValue: true,
    });
    const xmlData = parser.parse(xmlContent);

    // Process rates
    const rates = xmlData.page.rates.rate;
    if (!Array.isArray(rates)) {
      throw new Error('Invalid XML structure: rates is not an array');
    }

    console.log(`MOR sync-rates: Processing ${rates.length} rate entries...`);

    // Group rates by country (direction field)
    const ratesMap = new Map();

    for (const rate of rates) {
      const direction = rate.direction || '';
      const destination = rate.destination || '';
      const tariffRate = parseFloat(rate.tariff_rate || 0);
      const connectionFee = parseFloat(rate.con_fee || 0);
      const prefix = rate.prefix || '';
      const code = rate.code || '';

      if (!direction) continue;

      // Determine if this is a mobile or fixed/landline rate
      const isMobile = destination.toUpperCase().includes('MOBILE') ||
                      destination.toUpperCase().includes('MOBIL');

      if (!ratesMap.has(direction)) {
        ratesMap.set(direction, {
          country: direction,
          countryCode: code,
          prefix: prefix,
          m_price: 0,
          m_con_fee: 0,
          f_price: 0,
          f_con_fee: 0,
        });
      }

      const entry = ratesMap.get(direction);
      if (isMobile) {
        // Take the maximum mobile rate if multiple mobile rates exist
        entry.m_price = Math.max(entry.m_price, tariffRate);
        entry.m_con_fee = Math.max(entry.m_con_fee, connectionFee);
      } else {
        // Take the maximum fixed rate if multiple fixed rates exist
        entry.f_price = Math.max(entry.f_price, tariffRate);
        entry.f_con_fee = Math.max(entry.f_con_fee, connectionFee);
      }
    }

    // Convert map to arrays for both languages
    const ratesEn = [];
    const ratesSv = [];

    for (const [direction, rateData] of ratesMap.entries()) {
      // English version
      ratesEn.push({
        country: direction,
        countryCode: rateData.countryCode,
        prefix: rateData.prefix,
        m_price: rateData.m_price,
        m_con_fee: rateData.m_con_fee,
        f_price: rateData.f_price,
        f_con_fee: rateData.f_con_fee,
      });

      // Swedish version (translate country name)
      const swedishCountry = COUNTRY_TRANSLATIONS[direction] || direction;
      ratesSv.push({
        country: swedishCountry,
        countryCode: rateData.countryCode,
        prefix: rateData.prefix,
        m_price: rateData.m_price,
        m_con_fee: rateData.m_con_fee,
        f_price: rateData.f_price,
        f_con_fee: rateData.f_con_fee,
      });
    }

    // Sort by country name
    ratesEn.sort((a, b) => a.country.localeCompare(b.country));
    ratesSv.sort((a, b) => a.country.localeCompare(b.country, 'sv'));

    console.log(`MOR sync-rates: Generated ${ratesEn.length} rate entries`);

    // Write JSON files
    const enPath = path.join(process.cwd(), 'src', 'config', 'internationalRates-en.json');
    const svPath = path.join(process.cwd(), 'src', 'config', 'internationalRates-sv.json');

    await fs.writeFile(enPath, JSON.stringify(ratesEn, null, 2));
    await fs.writeFile(svPath, JSON.stringify(ratesSv, null, 2));

    console.log('MOR sync-rates: JSON files written successfully');

    // Clean up temporary files
    await fs.unlink(tempZipPath).catch(() => {});
    console.log('MOR sync-rates: Cleaned up temporary files');

    // Update cache timestamp
    await updateCacheTimestamp();

    return NextResponse.json({
      success: true,
      message: 'International rates synced successfully',
      ratesCount: ratesEn.length,
      cached: false,
    });

  } catch (error) {
    console.error('MOR sync-rates error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
