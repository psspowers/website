interface Office {
  country: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  coordinates: [number, number];
  showInList?: boolean;
}

export const offices: Office[] = [
  {
    country: 'Thailand',
    name: 'Bangkok',
    address: 'Ocean Tower 2 (26th Floor), 75/56 Sukhumvit Soi 19, Bangkok, TH 10110',
    phone: '+66 2 016 2611',
    email: 'info@psspowers.com',
    coordinates: [100.5617, 13.7375],
    showInList: true
  },
  {
    country: 'Thailand',
    name: 'Rayong',
    address: '12 Khlong Nam Hu 1, Soi Sri Sut Tambon Noen Phra, Mueang Rayong District, Rayong 21150',
    phone: '+66 2 016 2611',
    coordinates: [101.2812, 12.6828],
    showInList: true
  },
  {
    country: 'India',
    name: 'Gurgaon',
    address: 'Unit No 225-229 Sector 62, Bhondsi, Gurgaon, Bhondsi, Haryana, India, 122102',
    phone: '+91 79 4032 7898',
    email: 'india@psspowers.com',
    coordinates: [77.0266, 28.4595],
    showInList: true
  },
  {
    country: 'India',
    name: 'Ahmedabad',
    address: '310, 3 Floor, Central By Sangath IPL B/H 4D Square, Visat-Gandhinagar, Highway, Motera, Ahmedabad, Gujarat 380005',
    phone: '+91 79 4032 7898',
    coordinates: [72.5714, 23.0225],
    showInList: false
  },
  {
    country: 'Singapore',
    name: 'Singapore',
    address: 'Pss Orange Pte Ltd, 7 Temasek Boulevard, #12-07, Suntec Tower One, Singapore 038987',
    coordinates: [103.8587, 1.2956],
    showInList: true
  }
];