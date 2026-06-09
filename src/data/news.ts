export interface NewsItem {
  title: string;
  date: string;
  summary: string;
  source: string;
  sourceUrl: string;
  image: {
    url: string;
    alt: string;
    aspectRatio: "16:9" | "4:3" | "1:1";
    width: number;
    height: number;
  };
  tags: string[];
}

export const newsItems: NewsItem[] = [
  {
    title: "PSS Partners with Naresuan University for 12MW Solar Project",
    date: "2024-09-05",
    summary: "Naresuan University signed an agreement with Power Systems and Solutions Co., Ltd. to install and operate a 12MW solar power system. The project aims to promote renewable energy, supporting the university's sustainability goals and Thailand's net-zero target. Expected to generate 20 million kWh annually, the system will help reduce electricity costs by 395 million THB over 12 years. Power Systems and Solutions will handle the survey, design, installation, and maintenance, ensuring long-term efficiency and environmental benefits.",
    image: {
      url: "/News_Images/2024-09_2024-09-05_naraesuan-sign.jpg",
      alt: "PSS Powers and Naresuan University signing ceremony",
      aspectRatio: "16:9",
      width: 1200,
      height: 675
    },
    source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/company/pss-powers/",
    tags: ["Project Completion", "Sustainability", "Thailand"]
  },
  {
    title: "PSS Powers Partners with I Squared Capital",
    date: "2025-02-15",
    summary: "PSS Powers is pleased to announce a strategic partnership with I Squared Capital, a leading global infrastructure investment manager. This collaboration combines PSS Powers' local expertise and track record with I Squared Capital's global experience and financial strength. Together, we have established a joint venture with Berde, I Squared Capital's subsidiary, forming Berde PSS Renewable Investment. This entity will focus on renewable energy projects in Thailand, with plans for expansion across Asia. The partnership will prioritize utility-scale solar, wind, BESS, and energy storage projects, strengthening our pipeline and commitment to sustainability.",
    image: {
      url: "/News_Images/2025-02_2025-02-15_isq-partnership-announcement.jpg",
      alt: "PSS Powers and I Squared Capital partnership announcement",
      aspectRatio: "16:9",
      width: 1200,
      height: 675
    },
    source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/company/psspowers/",
    tags: ["Partnership", "Investment", "Growth"]
  },
  {
    title: "Completion of 3 MWp Solar Farm at Maxion Wheels",
    date: "2024-02-20",
    summary: "PSS Powers has successfully completed and commissioned a 3 MWp ground-mounted solar installation at the Maxion Wheels manufacturing facility in Saraburi, Thailand. This project highlights our expertise in industrial-scale solar solutions and commitment to supporting corporate decarbonization. The system, equipped with advanced solar tracking technology and high-efficiency panels, will generate approximately 4,500 MWh of clean energy annually, reducing the facility's carbon footprint by an estimated 2,300 tonnes of CO2 per year. Delivered ahead of schedule, the project exceeds initial performance expectations and marks a significant step in Maxion Wheels' sustainability efforts.",
    source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/company/psspowers/",
    image: {
      url: "/News_Images/2024-02_2024-02-20_maxion-wheels-completion.jpg",
      alt: "Maxion Wheels solar installation",
      aspectRatio: "16:9",
      width: 1200,
      height: 675
    },
    tags: ["Project Completion", "Solar", "Industrial"]
  },
  {
    title: "PSS Powers Expands Operations in India",
    date: "2024-01-15",
    summary: "PSS Powers is pleased to announce the expansion of our operations in India with the opening of a new office in Ahmedabad, Gujarat. This strategic move strengthens our presence in Western India's rapidly growing renewable energy market. The Ahmedabad office will serve as a regional hub, complementing our operations in other key Indian cities. It will house a dedicated technical team, project development specialists, and customer support staff to better serve our clients. The office will focus on utility-scale solar projects, rooftop installations, and energy storage solutions, supporting India's clean energy goals.",
    source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/company/psspowers/",
    image: {
      url: "/News_Images/2024-01_2024-01-15_operations-india.jpg",
      alt: "PSS Powers India operations",
      aspectRatio: "16:9",
      width: 1200,
      height: 675
    },
    tags: ["Expansion", "India", "Growth"]
  },
  {
    title: "Achievement of 100 MW Milestone",
    date: "2024-12-10",
    summary: "PSS Powers is proud to announce a significant milestone in our journey: achieving 100 MW of total installed capacity across our renewable energy projects in Thailand and India. This achievement represents our substantial contribution to the region's clean energy transition and our commitment to advancing sustainable power solutions.\n\nThis milestone encompasses a diverse portfolio of projects, including utility-scale solar farms, commercial rooftop installations, floating solar systems, and innovative energy storage solutions. Our projects now generate enough clean energy to power approximately 75,000 households annually, offsetting over 100,000 tonnes of CO2 emissions each year.\n\nThis achievement is a testament to our team's expertise, dedication, and the trust our clients place in us. It also marks the beginning of our next phase of growth as we continue to expand our presence and impact in the Asian renewable energy market.",
    source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/company/psspowers/",
    image: {
      url: "/project-images/maxion.webp",
      alt: "100 MW Milestone Achievement",
      aspectRatio: "16:9",
      width: 1200,
      height: 675
    },
    tags: ["Milestone", "Achievement", "Growth"]
  },
  {
    title: "PSS Powers Launches New O&M Service Center in Rayong",
    date: "2024-01-05",
    summary: "PSS Powers is pleased to announce the launch of our new state-of-the-art Operations & Maintenance (O&M) service center in Rayong, Thailand. This strategic expansion significantly enhances our operational capabilities and demonstrates our commitment to providing exceptional service to our growing client base in the Eastern Seaboard region.\n\nThe new facility, spanning over 1,000 square meters, is equipped with advanced diagnostic tools, remote monitoring systems, and a dedicated training center for our technical teams. This investment will enable us to provide faster response times, more efficient maintenance services, and improved system performance for our clients.\n\nThe service center features:\n- 24/7 monitoring and control room\n- Advanced diagnostic and testing equipment\n- Spare parts inventory management system\n- Technical training facilities\n- Emergency response team base\n\nThis expansion will create new employment opportunities in the region and allow us to better serve the growing number of renewable energy installations in Thailand's Eastern Economic Corridor.",
    source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/company/pss-powers/",
    image: {
      url: "/project-images/irpc.webp",
      alt: "New O&M Service Center in Rayong",
      aspectRatio: "16:9",
      width: 1200,
      height: 675
    },
    tags: ["Expansion", "O&M", "Thailand"]
  },
  {
    title: "PSS Powers Wins Sustainability Excellence Award",
    date: "2023-11-30",
    summary: "PSS Powers is honored to announce our receipt of the prestigious Sustainability Excellence Award 2023, recognizing our outstanding contributions to renewable energy development and environmental stewardship in the Asia-Pacific region. This award, presented at the annual Asia Clean Energy Summit, acknowledges our commitment to driving sustainable development and promoting clean energy solutions.\n\nThe award specifically recognizes our achievements in:\n- Implementing innovative renewable energy solutions across diverse sectors\n- Reducing carbon emissions through our projects by over 100,000 tonnes annually\n- Promoting sustainable practices in project development and execution\n- Supporting local communities through green energy initiatives\n- Developing workforce capabilities in the renewable energy sector\n\nThis recognition reinforces our position as a leader in sustainable energy solutions and motivates us to continue our mission of accelerating the transition to clean energy across Asia.",
    source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/company/pss-powers/",
    image: {
      url: "/project-images/soltech.webp",
      alt: "Sustainability Excellence Award",
      aspectRatio: "16:9",
      width: 1200,
      height: 675
    },
    tags: ["Award", "Sustainability", "Recognition"]
  },
  {
    title: "Successful Completion of Bangkok's Largest C&I Solar Project",
    date: "2023-11-01",
    summary: "PSS Powers is proud to announce the successful completion of Thailand's largest Commercial & Industrial (C&I) solar installation project at Seacon Square, marking a significant milestone in the country's commercial solar sector. This groundbreaking project encompasses two major installations:\n\n1. Seacon Square Srinakharin:\n- 5 MWp solar installation\n- Advanced bifacial solar panel technology\n- Smart monitoring and control systems\n- Expected annual generation of 7,500 MWh\n\n2. Seacon Square Bangkhae:\n- 3.4 MWp rooftop solar system\n- High-efficiency solar panels\n- Innovative mounting system design\n- Projected annual output of 5,100 MWh\n\nCombined, these installations will reduce CO2 emissions by approximately 8,000 tonnes annually and significantly lower the shopping centers' operational costs. The project showcases our expertise in large-scale commercial solar installations and our commitment to supporting Thailand's transition to renewable energy.\n\nThe installation features cutting-edge technology including:\n- Advanced monitoring and control systems\n- Weather-adaptive power optimization\n- Integrated safety features\n- Real-time performance analytics",
    source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/company/pss-powers/",
    image: {
      url: "/project-images/seacon.webp",
      alt: "Seacon Square Solar Installation",
      aspectRatio: "16:9",
      width: 1200,
      height: 675
    },
    tags: ["Project Completion", "Solar", "C&I"]
  }
];