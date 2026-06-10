export interface GroupWebsite {
  name: string;
  url: string;
  headerImage: string;
  description: string;
  features: string[];
}

export const groupWebsites: GroupWebsite[] = [
  {
    name: 'One PSS',
    url: 'www.onepss.com',
    headerImage: '/PSS.RES.Banner.jpg?w=1920&h=640',
    description: 'A leading provider of renewable energy solutions and power systems. One PSS specializes in delivering comprehensive services for improving energy efficiency and asset management of rotating machines besides providing leading solutions with leading global companies. PSS Subsidiary company also manufactured Townson Expansion Joints and has PSS brand mechanical seals as well.',
    features: ['Energy efficiency & Hydraulic Upgrade for pumps', 'Partner of OEMS like Siemens, Sulzer, John Crane, etc', 'Service and turnaround of machines', 'Gas Turbine parts & refurbishment with AP&M', 'Expansion Joints - fabric & metallic', 'Engineered and Material Upgrade Parts']
  },
  {
    name: 'TA-TO',
    url: 'www.ta-to.com',
    headerImage: '/Tato.Banner.jpg?w=1920&h=640',
    description: 'TA-TO is your trusted source for contact lenses and eye care products. We offer a wide selection of premium contact lenses from leading brands, ensuring quality and comfort for your vision needs.',
    features: ['Premium Contact Lenses', 'Leading Eye Care Brands', 'Professional Consultation', 'Fast & Reliable Delivery']
  },
  {
    name: 'Pizza Mania',
    url: 'www.pizzamania.com',
    headerImage: '/PizzaMania.Banner.jpg?w=1920&h=640',
    description: 'An authentic New York style pizza bringing the true taste of NYC to your table. Pizza Mania combines traditional recipes with modern culinary innovation.',
    features: ['Authentic NY Pizza', 'Regenerative Farm Products', 'Key Imported Ingredients', 'Fast Deliveries in Town']
  },
  {
    name: 'Le Lapin Bangkok',
    url: 'www.LeLapinbangkok.com',
    headerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1800&h=600&q=80',
    description: 'A sophisticated European style sandwich cloud kitchen in the heart of Bangkok, offering an exquisite experience.',
    features: ['All European bread', 'Regenerative farm products', 'Imported European ingredients', 'Most delicious sauces']
  },
  {
    name: 'Y Cube India',
    url: 'www.ycubeindia.com',
    headerImage: '/YCUBE.IRR.Banner.jpg?w=1920&h=640',
    description: 'An innovative technology solutions provider and system integrator in pressurized irrigation systems. Y Cube India has developed large utility valves up to 2 meter for industry and water under the brand YES Valves.',
    features: ['Pressurized Irrigation Expert', 'System Integrator', 'Valve Manufacturer', 'Solar EPC']
  }
];
