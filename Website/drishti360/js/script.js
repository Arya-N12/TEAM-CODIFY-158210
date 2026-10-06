/**
 * Drishti360 — Smart Inspection & Monitoring System
 * Complete Government Administrator Dashboard Logic
 */

// City Geocoding Fallback Lookup Dictionary for Indian Cities
const CITY_COORDINATES = {
    'bengaluru': [12.9716, 77.5946],
    'bangalore': [12.9716, 77.5946],
    'mumbai': [19.0760, 72.8777],
    'delhi': [28.6139, 77.2090],
    'new delhi': [28.6139, 77.2090],
    'chennai': [13.0827, 80.2707],
    'hyderabad': [17.3850, 78.4867],
    'pune': [18.5204, 73.8567],
    'kolkata': [22.5726, 88.3639],
    'ahmedabad': [23.0225, 72.5714],
    'jaipur': [26.9124, 75.7873],
    'lucknow': [26.8467, 80.9462],
    'patna': [25.5941, 85.1376],
    'bhopal': [23.2599, 77.4126],
    'chandigarh': [30.7333, 76.7794],
    'thiruvananthapuram': [8.5241, 76.9366],
    'guwahati': [26.1445, 91.7362],
    'bhubaneswar': [20.2961, 85.8245],
    'ranchi': [23.3441, 85.3096],
    'dehradun': [30.3165, 78.0322],
    'shimla': [31.1048, 77.1734],
    'srinagar': [34.0837, 74.7973],
    'surat': [21.1702, 72.8311],
    'nagpur': [21.1458, 79.0882],
    'indore': [22.7196, 75.8577],
    'kochi': [9.9312, 76.2673],
    'coimbatore': [11.0168, 76.9558],
    'varanasi': [25.3176, 82.9739],
    'visakhapatnam': [17.6868, 83.2185]
};

// 1. Centralized Data Store with localStorage Persistence
const AppStore = {
    STORAGE_KEY: 'drishti360_app_data_v6',

    defaultData: {
        ngos: [
            { id: 'ngo-1', name: 'NavPrerna Foundation', city: 'Nagpur', state: 'Maharashtra', address: 'Civil Lines, Nagpur, Maharashtra 440001', lat: 21.1458, lng: 79.0882, sector: 'Education', regNo: 'MH-EDU-2018-0914', regDate: '14 Sep 2018', status: 'Verified', email: 'contact@navprerna.org', phone: '+91 9823011223', sanctioned: '₹48.50 L', released: '₹38.00 L', spent: '₹31.40 L', beneficiaries: 1420 },
            { id: 'ngo-2', name: 'Aarohan Community Trust', city: 'Mysuru', state: 'Karnataka', address: 'Vijayanagar 2nd Stage, Mysuru, Karnataka 570017', lat: 12.2958, lng: 76.6394, sector: 'Rural Development', regNo: 'KA-RD-2015-0342', regDate: '22 Mar 2015', status: 'Verified', email: 'info@aarohantrust.org', phone: '+91 9448022334', sanctioned: '₹36.00 L', released: '₹29.50 L', spent: '₹24.80 L', beneficiaries: 980 },
            { id: 'ngo-3', name: 'Udaan Seva Initiative', city: 'Jodhpur', state: 'Rajasthan', address: 'Shastri Nagar, Jodhpur, Rajasthan 342003', lat: 26.2389, lng: 73.0243, sector: 'Skill Development', regNo: 'RJ-SD-2019-0711', regDate: '11 Jul 2019', status: 'Verified', email: 'reach@udaanseva.org', phone: '+91 9829033445', sanctioned: '₹31.50 L', released: '₹25.00 L', spent: '₹20.30 L', beneficiaries: 850 },
            { id: 'ngo-4', name: 'Saksham Rural Development Society', city: 'Varanasi', state: 'Uttar Pradesh', address: 'Sigra, Varanasi, Uttar Pradesh 221002', lat: 25.3176, lng: 82.9739, sector: 'Rural Development', regNo: 'UP-RD-2016-0523', regDate: '23 May 2016', status: 'Verified', email: 'admin@sakshamrural.org', phone: '+91 9415044556', sanctioned: '₹52.00 L', released: '₹41.50 L', spent: '₹35.60 L', beneficiaries: 1650 },
            { id: 'ngo-5', name: 'Prerna Health & Welfare Foundation', city: 'Surat', state: 'Gujarat', address: 'Athwa Lines, Surat, Gujarat 395007', lat: 21.1702, lng: 72.8311, sector: 'Healthcare', regNo: 'GJ-HLT-2017-0188', regDate: '18 Jan 2017', status: 'Verified', email: 'care@prernahealth.org', phone: '+91 9825055667', sanctioned: '₹58.00 L', released: '₹47.00 L', spent: '₹39.20 L', beneficiaries: 2100 },
            { id: 'ngo-6', name: 'JanSetu Development Trust', city: 'Delhi', state: 'Delhi', address: 'District Centre, Janakpuri, New Delhi 110058', lat: 28.6139, lng: 77.2090, sector: 'Women Welfare', regNo: 'DL-WW-2020-0412', regDate: '12 Apr 2020', status: 'Verified', email: 'support@jansetu.org', phone: '+91 9810066778', sanctioned: '₹39.00 L', released: '₹31.00 L', spent: '₹26.50 L', beneficiaries: 1120 },
            { id: 'ngo-7', name: 'Nayi Disha Education Foundation', city: 'Kolkata', state: 'West Bengal', address: 'Salt Lake Sector 5, Kolkata, West Bengal 700091', lat: 22.5726, lng: 88.3639, sector: 'Education', regNo: 'WB-EDU-2014-0831', regDate: '31 Aug 2014', status: 'Verified', email: 'contact@nayidisha.org', phone: '+91 9830077889', sanctioned: '₹44.00 L', released: '₹35.50 L', spent: '₹29.80 L', beneficiaries: 1350 },
            { id: 'ngo-8', name: 'GreenRoots Community Initiative', city: 'Nashik', state: 'Maharashtra', address: 'College Road, Nashik, Maharashtra 422005', lat: 19.9975, lng: 73.7898, sector: 'Environment', regNo: 'MH-ENV-2019-0604', regDate: '04 Jun 2019', status: 'Verified', email: 'earth@greenroots.org', phone: '+91 9822088990', sanctioned: '₹34.00 L', released: '₹27.00 L', spent: '₹22.10 L', beneficiaries: 780 },
            { id: 'ngo-9', name: 'Samarth Women Empowerment Trust', city: 'Jaipur', state: 'Rajasthan', address: 'Malviya Nagar, Jaipur, Rajasthan 302017', lat: 26.9124, lng: 75.7873, sector: 'Women Welfare', regNo: 'RJ-WW-2016-0925', regDate: '25 Sep 2016', status: 'Verified', email: 'empower@samarthtrust.org', phone: '+91 9829099001', sanctioned: '₹46.50 L', released: '₹37.00 L', spent: '₹31.00 L', beneficiaries: 1280 },
            { id: 'ngo-10', name: 'GramVikas Resource Foundation', city: 'Bhubaneswar', state: 'Odisha', address: 'Saheed Nagar, Bhubaneswar, Odisha 751007', lat: 20.2961, lng: 85.8245, sector: 'Rural Development', regNo: 'OD-RD-2018-0155', regDate: '15 Jan 2018', status: 'Verified', email: 'info@gramvikasrf.org', phone: '+91 9437011223', sanctioned: '₹38.00 L', released: '₹30.00 L', spent: '₹25.20 L', beneficiaries: 1050 },
            { id: 'ngo-11', name: 'JeevanJyoti Social Development Trust', city: 'Indore', state: 'Madhya Pradesh', address: 'Vijay Nagar, Indore, Madhya Pradesh 452010', lat: 22.7196, lng: 75.8577, sector: 'Healthcare', regNo: 'MP-HLT-2015-0477', regDate: '27 Apr 2015', status: 'Verified', email: 'help@jeevanjyotitrust.org', phone: '+91 9826022334', sanctioned: '₹41.00 L', released: '₹33.00 L', spent: '₹27.40 L', beneficiaries: 1180 },
            { id: 'ngo-12', name: 'Pragati Community Foundation', city: 'Kochi', state: 'Kerala', address: 'MG Road, Ernakulam, Kochi, Kerala 682016', lat: 9.9312, lng: 76.2673, sector: 'Skill Development', regNo: 'KL-SD-2017-0839', regDate: '03 Aug 2017', status: 'Verified', email: 'connect@pragaticommunity.org', phone: '+91 9847033445', sanctioned: '₹32.00 L', released: '₹25.50 L', spent: '₹21.00 L', beneficiaries: 890 }
        ],

        projects: [
            { id: 'prj-101', ngoId: 'ngo-1', title: 'Rural Digital Learning Centre', category: 'Education', status: 'Active', startDate: '15 Jan 2026', prjCode: 'PRJ-101', sanctioned: '₹18.50 L', released: '₹14.00 L', spent: '₹10.80 L', remaining: '₹3.20 L', progressPct: 77, utilizationPct: 77, openAlertsCount: 1, city: 'Nagpur', state: 'Maharashtra', description: 'Smart classroom setup, digital learning tools, interactive whiteboards, and tablet-based learning modules for rural secondary school students.', beneficiaries: 520, inspector: 'Field Inspector - Vaishnavi Sathe' },
            { id: 'prj-102', ngoId: 'ngo-1', title: 'Tribal Youth Computer Literacy Hub', category: 'Education', status: 'Active', startDate: '01 Feb 2026', prjCode: 'PRJ-102', sanctioned: '₹16.00 L', released: '₹13.00 L', spent: '₹11.20 L', remaining: '₹1.80 L', progressPct: 86, utilizationPct: 86, openAlertsCount: 0, city: 'Gadchiroli', state: 'Maharashtra', description: 'Computer lab installation, internet connectivity, and foundational IT skills training for tribal youth in remote districts.', beneficiaries: 480, inspector: 'Field Inspector - Tanmay Sawant' },
            { id: 'prj-103', ngoId: 'ngo-1', title: 'STEM Learning Infrastructure Program', category: 'Education', status: 'Active', startDate: '10 Mar 2026', prjCode: 'PRJ-103', sanctioned: '₹14.00 L', released: '₹11.00 L', spent: '₹9.40 L', remaining: '₹1.60 L', progressPct: 85, utilizationPct: 85, openAlertsCount: 0, city: 'Chandrapur', state: 'Maharashtra', description: 'Practical science kits, robotics mini-labs, and interactive experimentation tools for government school students.', beneficiaries: 420, inspector: 'Field Inspector - Siddhi Pawar' },
            { id: 'prj-201', ngoId: 'ngo-2', title: 'Rural Water Conservation Initiative', category: 'Rural Development', status: 'Active', startDate: '20 Jan 2026', prjCode: 'PRJ-201', sanctioned: '₹20.00 L', released: '₹16.50 L', spent: '₹13.80 L', remaining: '₹2.70 L', progressPct: 84, utilizationPct: 84, openAlertsCount: 0, city: 'Mysuru', state: 'Karnataka', description: 'Construction of rainwater harvesting structures, check dams, and groundwater recharge pits in drought-prone villages.', beneficiaries: 550, inspector: 'Field Inspector - Priyanka Marne' },
            { id: 'prj-202', ngoId: 'ngo-2', title: 'Community Sanitation & Hygiene Program', category: 'Rural Development', status: 'Active', startDate: '05 Feb 2026', prjCode: 'PRJ-202', sanctioned: '₹16.00 L', released: '₹13.00 L', spent: '₹11.00 L', remaining: '₹2.00 L', progressPct: 85, utilizationPct: 85, openAlertsCount: 0, city: 'Hassan', state: 'Karnataka', description: 'Community sanitation complexes, bio-toilets, and village awareness campaigns on safe hygiene practices.', beneficiaries: 430, inspector: 'Field Inspector - Tanmay Sawant' },
            { id: 'prj-301', ngoId: 'ngo-3', title: 'Vocational Skills & Employment Centre', category: 'Skill Development', status: 'Active', startDate: '12 Jan 2026', prjCode: 'PRJ-301', sanctioned: '₹17.50 L', released: '₹14.00 L', spent: '₹11.50 L', remaining: '₹2.50 L', progressPct: 82, utilizationPct: 82, openAlertsCount: 0, city: 'Jodhpur', state: 'Rajasthan', description: 'Vocational trade training in electrical maintenance, tailoring, mobile repairing, and computer accounting for rural youth.', beneficiaries: 460, inspector: 'Field Inspector - Siddhi Pawar' },
            { id: 'prj-302', ngoId: 'ngo-3', title: 'Youth Apprentice Training Hub', category: 'Skill Development', status: 'Active', startDate: '15 Feb 2026', prjCode: 'PRJ-302', sanctioned: '₹14.00 L', released: '₹11.00 L', spent: '₹8.80 L', remaining: '₹2.20 L', progressPct: 80, utilizationPct: 80, openAlertsCount: 0, city: 'Pali', state: 'Rajasthan', description: 'On-job apprenticeship placements, soft-skills training, and job interview preparation for unemployed rural youth.', beneficiaries: 390, inspector: 'Field Inspector - Vaishnavi Sathe' },
            { id: 'prj-401', ngoId: 'ngo-4', title: 'Accessible Learning Infrastructure', category: 'Rural Development', status: 'Active', startDate: '10 Jan 2026', prjCode: 'PRJ-401', sanctioned: '₹22.00 L', released: '₹17.50 L', spent: '₹15.20 L', remaining: '₹2.30 L', progressPct: 87, utilizationPct: 87, openAlertsCount: 0, city: 'Varanasi', state: 'Uttar Pradesh', description: 'Barrier-free ramps, accessible sanitation facilities, and specialized study aids for specially-abled rural students.', beneficiaries: 680, inspector: 'Field Inspector - Priyanka Marne' },
            { id: 'prj-402', ngoId: 'ngo-4', title: 'Rural Solar Learning Initiative', category: 'Rural Development', status: 'Active', startDate: '01 Feb 2026', prjCode: 'PRJ-402', sanctioned: '₹18.00 L', released: '₹14.50 L', spent: '₹12.40 L', remaining: '₹2.10 L', progressPct: 85, utilizationPct: 85, openAlertsCount: 0, city: 'Mirzapur', state: 'Uttar Pradesh', description: 'Solar micro-grid electrification for village study centers and distribution of solar study lamps to students in off-grid areas.', beneficiaries: 520, inspector: 'Field Inspector - Tanmay Sawant' },
            { id: 'prj-403', ngoId: 'ngo-4', title: 'Village Resource & Information Hub', category: 'Rural Development', status: 'Active', startDate: '01 Mar 2026', prjCode: 'PRJ-403', sanctioned: '₹12.00 L', released: '₹9.50 L', spent: '₹8.00 L', remaining: '₹1.50 L', progressPct: 84, utilizationPct: 84, openAlertsCount: 0, city: 'Jaunpur', state: 'Uttar Pradesh', description: 'Community digital kiosk providing access to government welfare scheme portals, land record updates, and farming advisories.', beneficiaries: 450, inspector: 'Field Inspector - Vaishnavi Sathe' },
            { id: 'prj-501', ngoId: 'ngo-5', title: 'Community Telehealth Program', category: 'Healthcare', status: 'Active', startDate: '05 Jan 2026', prjCode: 'PRJ-501', sanctioned: '₹24.00 L', released: '₹19.50 L', spent: '₹16.30 L', remaining: '₹3.20 L', progressPct: 83, utilizationPct: 83, openAlertsCount: 1, city: 'Surat', state: 'Gujarat', description: 'Mobile telemedicine vans with diagnostic equipment, remote specialist doctor consultations, and electronic health record tracking.', beneficiaries: 890, inspector: 'Field Inspector - Siddhi Pawar' },
            { id: 'prj-502', ngoId: 'ngo-5', title: 'Maternal & Child Health Outreach', category: 'Healthcare', status: 'Active', startDate: '15 Jan 2026', prjCode: 'PRJ-502', sanctioned: '₹19.00 L', released: '₹15.50 L', spent: '₹13.10 L', remaining: '₹2.40 L', progressPct: 84, utilizationPct: 84, openAlertsCount: 0, city: 'Bharuch', state: 'Gujarat', description: 'Antenatal health checkups, nutritional kit distribution, and infant immunization monitoring in rural healthcare sectors.', beneficiaries: 670, inspector: 'Field Inspector - Priyanka Marne' },
            { id: 'prj-503', ngoId: 'ngo-5', title: 'Mobile Medical Diagnostic Van', category: 'Healthcare', status: 'Active', startDate: '20 Feb 2026', prjCode: 'PRJ-503', sanctioned: '₹15.00 L', released: '₹12.00 L', spent: '₹9.80 L', remaining: '₹2.20 L', progressPct: 82, utilizationPct: 82, openAlertsCount: 0, city: 'Navsari', state: 'Gujarat', description: 'Doorstep blood testing, ECG facilities, and doctor consultation services for elderly and rural patients.', beneficiaries: 540, inspector: 'Field Inspector - Vaishnavi Sathe' },
            { id: 'prj-601', ngoId: 'ngo-6', title: 'Women Entrepreneurship Hub', category: 'Women Welfare', status: 'Active', startDate: '10 Jan 2026', prjCode: 'PRJ-601', sanctioned: '₹21.00 L', released: '₹17.00 L', spent: '₹14.50 L', remaining: '₹2.50 L', progressPct: 85, utilizationPct: 85, openAlertsCount: 1, city: 'Delhi', state: 'Delhi', description: 'Micro-enterprise incubation centre providing artisan training, digital marketing guidance, and seed capital mentorship.', beneficiaries: 620, inspector: 'Field Inspector - Tanmay Sawant' },
            { id: 'prj-602', ngoId: 'ngo-6', title: 'Urban Micro-Loan Assistance Cell', category: 'Women Welfare', status: 'Active', startDate: '01 Feb 2026', prjCode: 'PRJ-602', sanctioned: '₹18.00 L', released: '₹14.00 L', spent: '₹12.00 L', remaining: '₹2.00 L', progressPct: 86, utilizationPct: 86, openAlertsCount: 0, city: 'New Delhi', state: 'Delhi', description: 'Financial literacy workshops, micro-credit linkage, and self-help group management support for urban women entrepreneurs.', beneficiaries: 500, inspector: 'Field Inspector - Siddhi Pawar' },
            { id: 'prj-701', ngoId: 'ngo-7', title: 'Tribal Education Support Program', category: 'Education', status: 'Active', startDate: '05 Jan 2026', prjCode: 'PRJ-701', sanctioned: '₹18.00 L', released: '₹14.50 L', spent: '₹12.20 L', remaining: '₹2.30 L', progressPct: 84, utilizationPct: 84, openAlertsCount: 1, city: 'Kolkata', state: 'West Bengal', description: 'Supplementary coaching, learning materials distribution, and mid-day nutritional support for tribal school children.', beneficiaries: 560, inspector: 'Field Inspector - Priyanka Marne' },
            { id: 'prj-702', ngoId: 'ngo-7', title: 'Community Learning & Reading Hub', category: 'Education', status: 'Active', startDate: '20 Jan 2026', prjCode: 'PRJ-702', sanctioned: '₹14.00 L', released: '₹11.50 L', spent: '₹9.60 L', remaining: '₹1.90 L', progressPct: 83, utilizationPct: 83, openAlertsCount: 0, city: 'Howrah', state: 'West Bengal', description: 'Neighborhood libraries with multi-lingual books, e-learning tablets, and quiet study spaces for underprivileged students.', beneficiaries: 430, inspector: 'Field Inspector - Vaishnavi Sathe' },
            { id: 'prj-703', ngoId: 'ngo-7', title: 'Rural Girl Child Scholarship Scheme', category: 'Education', status: 'Active', startDate: '10 Feb 2026', prjCode: 'PRJ-703', sanctioned: '₹12.00 L', released: '₹9.50 L', spent: '₹8.00 L', remaining: '₹1.50 L', progressPct: 84, utilizationPct: 84, openAlertsCount: 0, city: 'Purulia', state: 'West Bengal', description: 'Educational stipends, school uniform distribution, and bicycle access to reduce dropout rates among rural girls.', beneficiaries: 360, inspector: 'Field Inspector - Tanmay Sawant' },
            { id: 'prj-801', ngoId: 'ngo-8', title: 'Sustainable Farming Training Program', category: 'Environment', status: 'Active', startDate: '15 Jan 2026', prjCode: 'PRJ-801', sanctioned: '₹19.00 L', released: '₹15.00 L', spent: '₹12.30 L', remaining: '₹2.70 L', progressPct: 82, utilizationPct: 82, openAlertsCount: 1, city: 'Nashik', state: 'Maharashtra', description: 'Organic farming workshops, soil testing labs, bio-pesticide preparation, and drip irrigation awareness for small farmers.', beneficiaries: 440, inspector: 'Field Inspector - Siddhi Pawar' },
            { id: 'prj-802', ngoId: 'ngo-8', title: 'Community Afforestation & Biodiversity Project', category: 'Environment', status: 'Active', startDate: '01 Feb 2026', prjCode: 'PRJ-802', sanctioned: '₹15.00 L', released: '₹12.00 L', spent: '₹9.80 L', remaining: '₹2.20 L', progressPct: 81, utilizationPct: 81, openAlertsCount: 0, city: 'Ahmednagar', state: 'Maharashtra', description: 'Plantation of 25,000 native tree saplings, setting up community plant nurseries, and urban mini-forest development.', beneficiaries: 340, inspector: 'Field Inspector - Tanmay Sawant' },
            { id: 'prj-901', ngoId: 'ngo-9', title: 'Women Artisans Training Hub', category: 'Women Welfare', status: 'Active', startDate: '10 Jan 2026', prjCode: 'PRJ-901', sanctioned: '₹18.50 L', released: '₹15.00 L', spent: '₹12.60 L', remaining: '₹2.40 L', progressPct: 84, utilizationPct: 84, openAlertsCount: 1, city: 'Jaipur', state: 'Rajasthan', description: 'Traditional handicraft skill refinement, quality control training, and e-commerce platform onboarding for rural women artisans.', beneficiaries: 510, inspector: 'Field Inspector - Vaishnavi Sathe' },
            { id: 'prj-902', ngoId: 'ngo-9', title: 'Rural Women Self-Help Financial Network', category: 'Women Welfare', status: 'Active', startDate: '25 Jan 2026', prjCode: 'PRJ-902', sanctioned: '₹15.00 L', released: '₹12.00 L', spent: '₹10.10 L', remaining: '₹1.90 L', progressPct: 84, utilizationPct: 84, openAlertsCount: 0, city: 'Ajmer', state: 'Rajasthan', description: 'Self-Help Group (SHG) formation, micro-credit access, and bank linkage program for rural home-based businesses.', beneficiaries: 420, inspector: 'Field Inspector - Priyanka Marne' },
            { id: 'prj-903', ngoId: 'ngo-9', title: 'Adolescent Girls Health & Literacy Centre', category: 'Women Welfare', status: 'Active', startDate: '15 Feb 2026', prjCode: 'PRJ-903', sanctioned: '₹13.00 L', released: '₹10.00 L', spent: '₹8.30 L', remaining: '₹1.70 L', progressPct: 83, utilizationPct: 83, openAlertsCount: 0, city: 'Sikar', state: 'Rajasthan', description: 'Health awareness workshops, sanitary hygiene kit distribution, and life skills counseling for school-going adolescent girls.', beneficiaries: 350, inspector: 'Field Inspector - Siddhi Pawar' },
            { id: 'prj-1001', ngoId: 'ngo-10', title: 'Community Nutrition & Wellness Centre', category: 'Rural Development', status: 'Active', startDate: '12 Jan 2026', prjCode: 'PRJ-1001', sanctioned: '₹20.00 L', released: '₹16.00 L', spent: '₹13.40 L', remaining: '₹2.60 L', progressPct: 83, utilizationPct: 83, openAlertsCount: 0, city: 'Bhubaneswar', state: 'Odisha', description: 'Malnutrition eradication camps, fortified food grain distribution, and maternal nutrition counseling in coastal villages.', beneficiaries: 570, inspector: 'Field Inspector - Tanmay Sawant' },
            { id: 'prj-1002', ngoId: 'ngo-10', title: 'Rural Clean Energy & Bio-Gas Initiative', category: 'Rural Development', status: 'Active', startDate: '01 Feb 2026', prjCode: 'PRJ-1002', sanctioned: '₹18.00 L', released: '₹14.00 L', spent: '₹11.80 L', remaining: '₹2.20 L', progressPct: 84, utilizationPct: 84, openAlertsCount: 0, city: 'Cuttack', state: 'Odisha', description: 'Household biogas plant construction and smokeless solar cookstove installation for rural households.', beneficiaries: 480, inspector: 'Field Inspector - Priyanka Marne' },
            { id: 'prj-1101', ngoId: 'ngo-11', title: 'Mobile Health Clinic & Diagnostic Care', category: 'Healthcare', status: 'Active', startDate: '08 Jan 2026', prjCode: 'PRJ-1101', sanctioned: '₹22.00 L', released: '₹17.50 L', spent: '₹14.60 L', remaining: '₹2.90 L', progressPct: 83, utilizationPct: 83, openAlertsCount: 0, city: 'Indore', state: 'Madhya Pradesh', description: 'Fully equipped mobile medical clinic visiting remote villages twice a week for primary healthcare and essential medicine distribution.', beneficiaries: 640, inspector: 'Field Inspector - Vaishnavi Sathe' },
            { id: 'prj-1102', ngoId: 'ngo-11', title: 'Preventive Healthcare & Vaccination Campaign', category: 'Healthcare', status: 'Active', startDate: '20 Jan 2026', prjCode: 'PRJ-1102', sanctioned: '₹19.00 L', released: '₹15.50 L', spent: '₹12.80 L', remaining: '₹2.70 L', progressPct: 82, utilizationPct: 82, openAlertsCount: 0, city: 'Ujjain', state: 'Madhya Pradesh', description: 'Community health awareness programs, routine child immunization drives, and blood pressure/diabetes screening camps.', beneficiaries: 540, inspector: 'Field Inspector - Siddhi Pawar' },
            { id: 'prj-1201', ngoId: 'ngo-12', title: 'Youth Skill Development Hub', category: 'Skill Development', status: 'Active', startDate: '10 Jan 2026', prjCode: 'PRJ-1201', sanctioned: '₹18.00 L', released: '₹14.50 L', spent: '₹12.00 L', remaining: '₹2.50 L', progressPct: 83, utilizationPct: 83, openAlertsCount: 0, city: 'Kochi', state: 'Kerala', description: 'Training in digital graphics, web development basics, solar technician skills, and hospitality assistance.', beneficiaries: 490, inspector: 'Field Inspector - Tanmay Sawant' },
            { id: 'prj-1202', ngoId: 'ngo-12', title: 'Coastal Fishermen Livelihood Training', category: 'Skill Development', status: 'Active', startDate: '15 Feb 2026', prjCode: 'PRJ-1202', sanctioned: '₹14.00 L', released: '₹11.00 L', spent: '₹9.00 L', remaining: '₹2.00 L', progressPct: 81, utilizationPct: 81, openAlertsCount: 0, city: 'Alappuzha', state: 'Kerala', description: 'Safety equipment usage, modern fish processing techniques, and cooperative marketing for traditional fishing communities.', beneficiaries: 400, inspector: 'Field Inspector - Priyanka Marne' }
        ],

        alerts: [
            { id: 'alt-101', code: 'ALT-101', type: 'Equipment Mismatch', ngoId: 'ngo-1', projectId: 'prj-101', ngoName: 'NavPrerna Foundation', projectTitle: 'Rural Digital Learning Centre', severity: 'Critical', datetime: '26 Sept 2026, 10:15 am', status: 'Open', reason: 'Interactive digital smart boards count mismatch during automated CCTV analysis.', expected: '5 Smart Boards', detected: '3 Smart Boards', diff: '-2 Units', remarks: 'Physical equipment count does not match the invoice schedule submitted in Q2.' },
            { id: 'alt-102', code: 'ALT-102', type: 'Attendance Discrepancy', ngoId: 'ngo-5', projectId: 'prj-501', ngoName: 'Prerna Health & Welfare Foundation', projectTitle: 'Community Telehealth Program', severity: 'High', datetime: '25 Sept 2026, 02:30 pm', status: 'Under Review', reason: 'Telehealth doctor attendance logs show absence during scheduled consultation hours.', expected: '4 Medical Staff', detected: '1 Staff Present', diff: '-3 Medical Staff', remarks: 'CCTV camera stream detected only 1 staff member present during peak patient hours.' },
            { id: 'alt-103', code: 'ALT-103', type: 'Geo-tagging Mismatch', ngoId: 'ngo-8', projectId: 'prj-801', ngoName: 'GreenRoots Community Initiative', projectTitle: 'Sustainable Farming Training Program', severity: 'High', datetime: '24 Sept 2026, 11:45 am', status: 'Open', reason: 'Field inspector check-in location differs from sanctioned training center location.', expected: 'Nashik Center (19.9975, 73.7898)', detected: '3.8 km Off-site', diff: '3.8 km Discrepancy', remarks: 'GPS coordinates of submitted verification report do not match registered plot.' },
            { id: 'alt-104', code: 'ALT-104', type: 'Documentation Gap', ngoId: 'ngo-9', projectId: 'prj-901', ngoName: 'Samarth Women Empowerment Trust', projectTitle: 'Women Artisans Training Hub', severity: 'Medium', datetime: '22 Sept 2026, 04:10 pm', status: 'Under Review', reason: 'Missing vendor tax invoices for artisan raw material procurement.', expected: '₹3.50 L Verified Bills', detected: '₹1.80 L Submitted', diff: '₹1.70 L Unverified', remarks: 'Utilization Certificate requires complete supporting bill audit.' },
            { id: 'alt-105', code: 'ALT-105', type: 'Delayed Milestone', ngoId: 'ngo-4', projectId: 'prj-402', ngoName: 'Saksham Rural Development Society', projectTitle: 'Rural Solar Learning Initiative', severity: 'Low', datetime: '20 Sept 2026, 09:30 am', status: 'Resolved', reason: 'Delay in solar panel installation for village study center.', expected: 'Milestone 2 Completed', detected: '12 Days Delay', diff: '+12 Days', remarks: 'Vendor supply delay resolved after field supervisor inspection.' },
            { id: 'alt-106', code: 'ALT-106', type: 'Beneficiary Count Variance', ngoId: 'ngo-7', projectId: 'prj-701', ngoName: 'Nayi Disha Education Foundation', projectTitle: 'Tribal Education Support Program', severity: 'Medium', datetime: '18 Sept 2026, 01:20 pm', status: 'Under Review', reason: 'Student daily register count lower than target beneficiary count.', expected: '120 Students Daily', detected: '85 Students Present', diff: '-35 Students', remarks: 'Harvest season caused temporary attendance drop; field report pending.' },
            { id: 'alt-107', code: 'ALT-107', type: 'Utilization Variance', ngoId: 'ngo-6', projectId: 'prj-601', ngoName: 'JanSetu Development Trust', projectTitle: 'Women Entrepreneurship Hub', severity: 'Medium', datetime: '15 Sept 2026, 03:40 pm', status: 'Open', reason: 'Discrepancy between released tranche and recorded center expenses.', expected: '₹17.00 L Tranche', detected: '₹12.50 L Expense Logged', diff: '₹4.50 L Unutilized', remarks: 'Financial statement audit requested by central monitoring officer.' }
        ],

        inspections: [
            { id: 'insp-195', code: '#195', ngoId: 'ngo-1', projectId: 'prj-101', ngoName: 'NavPrerna Foundation', projectTitle: 'Rural Digital Learning Centre', status: 'ASSIGNED', result: 'PENDING', overallResult: 'PENDING', govReview: 'Pending', governmentReview: 'PENDING', assignedDate: '26 Sept 2026', submittedDate: '—', inspector: 'Field Inspector - Vaishnavi Sathe', target: 'Equipment & Infrastructure', reason: 'Verify actual classroom equipment and interactive smart board installation.', progress: 0, finalRemarks: '' },
            { id: 'insp-194', code: '#194', ngoId: 'ngo-5', projectId: 'prj-501', ngoName: 'Prerna Health & Welfare Foundation', projectTitle: 'Community Telehealth Program', status: 'ASSIGNED', result: 'PENDING', overallResult: 'PENDING', govReview: 'Pending', governmentReview: 'PENDING', assignedDate: '25 Sept 2026', submittedDate: '—', inspector: 'Field Inspector - Priyanka Marne', target: 'Staff & Medical Facility', reason: 'Surprise audit on doctor consultation hours and diagnostic equipment.', progress: 0, finalRemarks: '' },
            { id: 'insp-193', code: '#193', ngoId: 'ngo-8', projectId: 'prj-801', ngoName: 'GreenRoots Community Initiative', projectTitle: 'Sustainable Farming Training Program', status: 'SUBMITTED', result: 'Requires Further Action', overallResult: 'REQUIRES FURTHER ACTION', govReview: 'Reviewed', governmentReview: 'REVIEWED', assignedDate: '24 Sept 2026', submittedDate: '24 Sept 2026, 03:45 pm', inspector: 'Field Inspector - Tanmay Sawant', target: 'Beneficiary Log & Location', reason: 'Verify farmer training attendance log and GPS coordinates.', progress: 100, finalRemarks: 'Location check-in verified 3.8 km away from registered plot. Re-inspection recommended.' },
            { id: 'insp-192', code: '#192', ngoId: 'ngo-9', projectId: 'prj-901', ngoName: 'Samarth Women Empowerment Trust', projectTitle: 'Women Artisans Training Hub', status: 'SUBMITTED', result: 'Verified', overallResult: 'VERIFIED', govReview: 'Reviewed', governmentReview: 'REVIEWED', assignedDate: '22 Sept 2026', submittedDate: '22 Sept 2026, 05:10 pm', inspector: 'Field Inspector - Siddhi Pawar', target: 'Financial & Procurement Audit', reason: 'Verify artisan training center machinery and raw material invoices.', progress: 100, finalRemarks: 'Physical verification completed successfully. Equipment and artisan register verified on site.' },
            { id: 'insp-191', code: '#191', ngoId: 'ngo-2', projectId: 'prj-201', ngoName: 'Aarohan Community Trust', projectTitle: 'Rural Water Conservation Initiative', status: 'SUBMITTED', result: 'Verified', overallResult: 'VERIFIED', govReview: 'Reviewed', governmentReview: 'REVIEWED', assignedDate: '20 Sept 2026', submittedDate: '20 Sept 2026, 02:15 pm', inspector: 'Field Inspector - Vaishnavi Sathe', target: 'Water Structures & Physical Work', reason: 'Physical inspection of constructed rainwater harvesting check dams.', progress: 100, finalRemarks: 'All 4 check dams inspected and operational. Beneficiary community feedback positive.' }
        ],

        auditTrail: [
            { id: 'aud-1', user: 'admin', role: 'government', action: 'Surprise video verification room created', entity: 'VC Room 0B1D6296 | Inspection #195', timestamp: '26 Sept 2026, 10:20 am' },
            { id: 'aud-2', user: 'admin', role: 'government', action: 'Random surprise inspection created', entity: 'Inspection #195 | Project PRJ-101 | Inspector Vaishnavi Sathe', timestamp: '26 Sept 2026, 10:15 am' },
            { id: 'aud-3', user: 'system', role: 'system', action: 'CCTV anomaly alert generated', entity: 'Alert #ALT-101 (Equipment Mismatch) on Rural Digital Learning Centre', timestamp: '26 Sept 2026, 10:15 am' },
            { id: 'aud-4', user: 'admin', role: 'government', action: 'Inspection reviewed', entity: 'Inspection #193 → Requires Further Action', timestamp: '24 Sept 2026, 04:08 pm' },
            { id: 'aud-5', user: 'inspector2', role: 'inspector', action: 'Inspection report submitted', entity: 'Inspection #193', timestamp: '24 Sept 2026, 03:45 pm' },
            { id: 'aud-6', user: 'inspector3', role: 'inspector', action: 'Inspection report submitted', entity: 'Inspection #192', timestamp: '22 Sept 2026, 05:10 pm' },
            { id: 'aud-7', user: 'admin', role: 'government', action: 'Grant disbursement verified', entity: 'Tranche 2 | NavPrerna Foundation (₹14.00 L)', timestamp: '18 Sept 2026, 11:30 am' }
        ],

        expenses: [
            { id: 'exp-1', projectId: 'prj-101', txnId: 'TXN-2026-00101', purpose: 'Interactive Digital Smart Boards (3 Units)', amount: '₹3.40 L', vendor: 'TechEdu Solutions Pvt Ltd', date: '18 Aug 2026', status: 'Verified' },
            { id: 'exp-2', projectId: 'prj-101', txnId: 'TXN-2026-00102', purpose: 'Student E-Learning Tablets & Power Backup UPS', amount: '₹4.20 L', vendor: 'Infotech Digital India', date: '05 Aug 2026', status: 'Verified' },
            { id: 'exp-3', projectId: 'prj-101', txnId: 'TXN-2026-00103', purpose: 'Teacher Training & Digital Pedagogy Workshops', amount: '₹1.80 L', vendor: 'Shiksha Learning Academy', date: '15 Jul 2026', status: 'Verified' },
            { id: 'exp-4', projectId: 'prj-101', txnId: 'TXN-2026-00104', purpose: 'Classroom Networking & Broadband Connectivity Setup', amount: '₹1.40 L', vendor: 'NetConnect Communications', date: '02 Jun 2026', status: 'Verified' }
        ],

        documents: [
            { id: 'doc-1', projectId: 'prj-101', name: 'Government Sanction Order (SAN-DoSJE-2026-101).pdf', type: 'Sanction Order', uploaded: '15 Jan 2026', size: '2.4 MB' },
            { id: 'doc-2', projectId: 'prj-101', name: 'Detailed Project Proposal & Technical Specifications.pdf', type: 'Project Proposal', uploaded: '10 Jan 2026', size: '4.1 MB' },
            { id: 'doc-3', projectId: 'prj-101', name: 'Q1 & Q2 Utilization Certificate (Form GFR 12-A).pdf', type: 'Utilization Certificate', uploaded: '15 Aug 2026', size: '1.8 MB' },
            { id: 'doc-4', projectId: 'prj-101', name: 'Field Inspection Verification Report.pdf', type: 'Inspection Report', uploaded: '26 Sep 2026', size: '3.5 MB' },
            { id: 'doc-5', projectId: 'prj-101', name: 'Vendor Procurement & Bill Schedule.pdf', type: 'Invoices & Bills', uploaded: '20 Aug 2026', size: '5.2 MB' }
        ],

        beneficiaries: [
            { id: 'ben-1', projectId: 'prj-101', name: 'Kavya Deshmukh', age: 14, gender: 'Female', service: 'Digital Education Classroom Access', date: '12 Sep 2026' },
            { id: 'ben-2', projectId: 'prj-101', name: 'Aditya Kulkarni', age: 15, gender: 'Male', service: 'E-Learning Tablet & STEM Kit', date: '05 Sep 2026' },
            { id: 'ben-3', projectId: 'prj-101', name: 'Neha Patil', age: 13, gender: 'Female', service: 'Computer Literacy Workshop', date: '20 Aug 2026' },
            { id: 'ben-4', projectId: 'prj-101', name: 'Siddharth Joshi', age: 14, gender: 'Male', service: 'Interactive Smart Board Session', date: '10 Aug 2026' }
        ],

        funding: [
            { id: 'fnd-1', projectId: 'prj-101', installment: '1st Installment (40%)', amount: '₹7.40 L', date: '15 Jan 2026', orderNo: 'SAN-DoSJE-2026-101', status: 'Released' },
            { id: 'fnd-2', projectId: 'prj-101', installment: '2nd Installment (35%)', amount: '₹6.60 L', date: '18 May 2026', orderNo: 'SAN-DoSJE-2026-142', status: 'Released' },
            { id: 'fnd-3', projectId: 'prj-101', installment: '3rd Installment (20%)', amount: '₹3.70 L', date: '12 Aug 2026', orderNo: 'SAN-DoSJE-2026-198', status: 'Pending Release' },
            { id: 'fnd-4', projectId: 'prj-101', installment: 'Final Tranche (5%)', amount: '₹80,000', date: 'Pending Audit', orderNo: 'SAN-DoSJE-2026-215', status: 'Pending Completion' }
        ]
    },

    get() {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        let storeData;
        if (!raw) {
            storeData = JSON.parse(JSON.stringify(this.defaultData));
            this.set(storeData);
            return storeData;
        }
        try {
            storeData = JSON.parse(raw);
        } catch (e) {
            storeData = JSON.parse(JSON.stringify(this.defaultData));
            this.set(storeData);
            return storeData;
        }

        // Normalize NGOs location data if missing
        if (storeData && Array.isArray(storeData.ngos)) {
            let updated = false;
            storeData.ngos.forEach(ngo => {
                if (ngo.lat === undefined || ngo.lat === null || isNaN(parseFloat(ngo.lat))) {
                    const searchKey = (ngo.city || ngo.state || '').toLowerCase();
                    let matched = false;
                    for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
                        if (searchKey.includes(key)) {
                            ngo.lat = coords[0];
                            ngo.lng = coords[1];
                            matched = true;
                            break;
                        }
                    }
                    if (!matched) {
                        ngo.lat = parseFloat((20.5937 + (Math.random() - 0.5) * 6).toFixed(4));
                        ngo.lng = parseFloat((78.9629 + (Math.random() - 0.5) * 6).toFixed(4));
                    }
                    updated = true;
                } else {
                    ngo.lat = parseFloat(ngo.lat);
                    ngo.lng = parseFloat(ngo.lng);
                }
                if (!ngo.address) {
                    ngo.address = `${ngo.city || 'Central'}, ${ngo.state || 'India'}`;
                    updated = true;
                }
            });
            if (updated) {
                this.set(storeData);
            }
        }

        // Normalize Inspections dynamic lifecycle fields if missing
        if (storeData && Array.isArray(storeData.inspections)) {
            let updated = false;
            const defaultChecklistTexts = [
                "Project location exists & geofence verified",
                "Project activity is operational",
                "Beneficiaries are present on site",
                "Reported beneficiaries appear reasonable & matched with attendance log",
                "Project materials & digital smart boards exist",
                "Expenses have valid supporting invoices",
                "Project progress matches submitted physical report",
                "Photographic evidence captured with timestamp"
            ];

            storeData.inspections.forEach(insp => {
                const isSubOrComp = insp.status === 'Submitted' || insp.status === 'SUBMITTED' || insp.status === 'Completed' || insp.status === 'COMPLETED';

                if (!insp.checklist || !Array.isArray(insp.checklist) || insp.checklist.length === 0) {
                    insp.checklist = defaultChecklistTexts.map(text => ({
                        item: text,
                        status: isSubOrComp ? "PASS" : "PENDING"
                    }));
                    updated = true;
                }

                if (insp.status === 'Assigned' || insp.status === 'ASSIGNED') {
                    insp.status = "ASSIGNED";
                    insp.result = "PENDING";
                    insp.overallResult = "PENDING";
                    insp.govReview = "Pending";
                    insp.governmentReview = "PENDING";
                    insp.progress = 0;
                    insp.finalRemarks = "";
                    insp.submittedDate = "—";
                    if (insp.checklist) insp.checklist.forEach(c => c.status = "PENDING");
                    updated = true;
                } else if (insp.status === 'Submitted' || insp.status === 'SUBMITTED') {
                    insp.status = "SUBMITTED";
                    insp.progress = 100;
                    insp.govReview = insp.govReview || "Pending";
                    insp.governmentReview = insp.governmentReview || "PENDING";
                    if (!insp.finalRemarks) {
                        insp.finalRemarks = "Physical verification completed successfully. Project activities were found operational and beneficiary records were verified during the field visit.";
                    }
                    updated = true;
                }
            });
            if (updated) {
                this.set(storeData);
            }
        }

        return storeData;
    },

    set(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
};

// 2. Main Application Controller
class Drishti360App {
    constructor() {
        this.currentView = 'command-center';
        this.selectedNgoId = null;
        this.selectedProjectId = null;
        this.selectedInspectionId = null;
        this.selectedAlertId = null;
        this.activeTabId = 'tab-overview';
        this.historyStack = [];
        this.authUser = null;
        this.mapInitialized = false;
        this.chartsInitialized = false;
    }

    async init() {
        if (window.lucide) lucide.createIcons();
        this.bindEvents();
        this.bindAuthEvents();
        await this.checkAuth();
    }

    async checkAuth() {
        try {
            const res = await fetch('/api/auth/me', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.user) {
                    this.authUser = data.user;
                    this.updateNavProfile(data.user);
                    this.showMainApp();
                    return true;
                }
            }
        } catch (err) {
            console.warn('[AUTH CHECK WARN]', err);
        }
        this.showLoginView();
        return false;
    }

    showMainApp() {
        const loginView = document.getElementById('view-login');
        if (loginView) loginView.classList.remove('active');

        const mainApp = document.getElementById('mainAppContainer');
        if (mainApp) mainApp.style.display = 'flex';

        if (!this.mapInitialized) {
            this.initMap();
            this.mapInitialized = true;
        }
        if (!this.chartsInitialized) {
            this.initCharts();
            this.chartsInitialized = true;
        }

        this.renderNgoRegistry();

        if (window.location.hash) {
            const hash = window.location.hash;
            const match = hash.match(/#projects\/([^?]+)(\?tab=(.+))?/);
            if (match) {
                const projectId = match[1];
                const tabName = match[3] || 'overview';
                this.showView('project-details', { projectId: projectId, tabId: `tab-${tabName}` });
                return;
            }
        }

        this.showView(this.currentView || 'command-center');
    }

    showLoginView() {
        const mainApp = document.getElementById('mainAppContainer');
        if (mainApp) mainApp.style.display = 'none';

        const loginView = document.getElementById('view-login');
        if (loginView) loginView.classList.add('active');

        this.authUser = null;
        this.historyStack = [];

        window.history.pushState(null, "", window.location.href);
        window.onpopstate = () => {
            if (!this.authUser) {
                window.history.pushState(null, "", window.location.href);
            }
        };

        if (window.lucide) lucide.createIcons();
    }

    updateNavProfile(user) {
        if (!user) return;
        const navName = document.getElementById('navUserName');
        const navRole = document.getElementById('navUserRole');
        const navAvatar = document.getElementById('navUserAvatar');

        if (navName) navName.textContent = user.fullName || 'Rajesh Kumar Sharma';
        if (navRole) navRole.textContent = user.role || 'Government Administrator';

        if (navAvatar) {
            if (user.profileImage) {
                navAvatar.style.backgroundImage = `url('${user.profileImage}')`;
                navAvatar.textContent = '';
            } else {
                navAvatar.style.backgroundImage = 'none';
                navAvatar.textContent = user.initials || 'RKS';
            }
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        const rememberMe = document.getElementById('loginRememberMe')?.checked;

        const alertBox = document.getElementById('loginAlertBox');
        const alertMsg = document.getElementById('loginAlertMessage');
        const submitBtn = document.getElementById('loginSubmitBtn');
        const spinner = document.getElementById('loginSpinner');
        const btnText = document.getElementById('loginBtnText');

        if (alertBox) alertBox.style.display = 'none';
        if (submitBtn) submitBtn.disabled = true;
        if (spinner) spinner.style.display = 'block';
        if (btnText) btnText.textContent = 'Authenticating...';

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password, rememberMe })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                this.authUser = data.user;
                this.updateNavProfile(data.user);
                this.showMainApp();
                this.showToast(`Welcome back, ${data.user.fullName}!`);
                this.logAudit(data.user.fullName, 'government', 'Administrator Logged In', `Session initialized via ${data.user.email}`);
            } else {
                if (alertMsg) alertMsg.textContent = data.message || 'Invalid email address or password.';
                if (alertBox) alertBox.style.display = 'flex';
            }
        } catch (err) {
            console.error('[LOGIN ERR]', err);
            if (alertMsg) alertMsg.textContent = 'Server connection error. Please try again.';
            if (alertBox) alertBox.style.display = 'flex';
        } finally {
            if (submitBtn) submitBtn.disabled = false;
            if (spinner) spinner.style.display = 'none';
            if (btnText) btnText.textContent = 'Sign In to Overview';
        }
    }

    async handleLogout() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (e) {
            console.warn('[LOGOUT WARN]', e);
        }

        this.closeModal('logoutConfirmModal');
        this.showLoginView();
        this.showToast('Logged out successfully.');
    }

    openProfileModal() {
        const u = this.authUser || { fullName: 'Rajesh Kumar Sharma', email: 'admin@dosje.gov.in', role: 'Government Administrator', department: 'DoSJE • Gov of India', status: 'Active', initials: 'RKS' };
        document.getElementById('profileModalName').textContent = u.fullName;
        document.getElementById('profileModalEmail').textContent = u.email;
        document.getElementById('profileModalRole').textContent = u.role;
        document.getElementById('profileModalDept').textContent = u.department || 'Ministry of Social Justice & Empowerment';
        document.getElementById('profileModalStatus').textContent = u.status || 'Active';

        const av = document.getElementById('profileModalAvatar');
        if (av) {
            if (u.profileImage) {
                av.style.backgroundImage = `url('${u.profileImage}')`;
                av.textContent = '';
            } else {
                av.style.backgroundImage = 'none';
                av.textContent = u.initials || 'RKS';
            }
        }

        this.openModal('profileModal');
    }

    openEditProfileModal() {
        const u = this.authUser || { fullName: 'Rajesh Kumar Sharma', email: 'admin@dosje.gov.in', profileImage: '' };
        document.getElementById('editProfileFullName').value = u.fullName;
        document.getElementById('editProfileEmail').value = u.email;
        document.getElementById('editProfileImage').value = u.profileImage || '';

        this.closeModal('profileModal');
        this.openModal('editProfileModal');
    }

    async handleEditProfileSubmit(e) {
        e.preventDefault();
        const fullName = document.getElementById('editProfileFullName')?.value;
        const profileImage = document.getElementById('editProfileImage')?.value;

        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ fullName, profileImage })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                this.authUser = data.user;
                this.updateNavProfile(data.user);
                this.closeModal('editProfileModal');
                this.showToast('Profile updated successfully!');
                this.logAudit(data.user.fullName, 'government', 'Profile Updated', `Updated profile details for ${data.user.email}`);
            } else {
                this.showToast(data.message || 'Failed to update profile.');
            }
        } catch (err) {
            this.showToast('Server connection error.');
        }
    }

    bindAuthEvents() {
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));

        document.getElementById('togglePasswordBtn')?.addEventListener('click', () => {
            const passInput = document.getElementById('loginPassword');
            const icon = document.getElementById('togglePasswordIcon');
            if (passInput) {
                const isPass = passInput.type === 'password';
                passInput.type = isPass ? 'text' : 'password';
                if (icon) icon.setAttribute('data-lucide', isPass ? 'eye-off' : 'eye');
                if (window.lucide) lucide.createIcons();
            }
        });

        document.getElementById('btnFillDemoCreds')?.addEventListener('click', () => {
            const emailInput = document.getElementById('loginEmail');
            const passInput = document.getElementById('loginPassword');
            if (emailInput) emailInput.value = 'admin@dosje.gov.in';
            if (passInput) passInput.value = 'Admin@123456';
            this.showToast('Demo Credentials populated!');
        });

        document.getElementById('forgotPasswordBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal('forgotPasswordModal');
        });

        const dropToggle = document.getElementById('userProfileDropdownToggle');
        const dropMenu = document.getElementById('profileDropdownMenu');

        if (dropToggle && dropMenu) {
            dropToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                dropMenu.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                dropMenu.classList.remove('active');
            });
        }

        document.getElementById('menuMyProfile')?.addEventListener('click', (e) => {
            e.preventDefault();
            dropMenu?.classList.remove('active');
            this.openProfileModal();
        });

        document.getElementById('profileModalEditBtn')?.addEventListener('click', () => {
            this.openEditProfileModal();
        });

        document.getElementById('menuEditProfile')?.addEventListener('click', (e) => {
            e.preventDefault();
            dropMenu?.classList.remove('active');
            this.openEditProfileModal();
        });

        document.getElementById('editProfileForm')?.addEventListener('submit', (e) => this.handleEditProfileSubmit(e));

        const triggerLogout = (e) => {
            if (e) e.preventDefault();
            dropMenu?.classList.remove('active');
            this.openModal('logoutConfirmModal');
        };

        document.getElementById('logoutBtn')?.addEventListener('click', triggerLogout);
        document.getElementById('menuLogout')?.addEventListener('click', triggerLogout);

        document.getElementById('confirmLogoutBtn')?.addEventListener('click', () => this.handleLogout());
    }

    showToast(message) {
        if (window.showToast) window.showToast(message);
    }

    logAudit(user, role, action, entity) {
        const store = AppStore.get();
        const now = new Date();
        const timestamp = `${now.getDate()} Sept ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()}`;
        
        const newLog = {
            id: `aud-${Date.now()}`,
            user,
            role,
            action,
            entity,
            timestamp
        };

        store.auditTrail.unshift(newLog);
        AppStore.set(store);

        if (this.currentView === 'command-center') {
            this.renderRecentActivity();
            this.renderProgramInsights();
        }
    }

    showView(viewName, params = {}, isBack = false) {
        if (!this.authUser) {
            this.showLoginView();
            return;
        }

        if (!isBack && this.currentView !== viewName) {
            this.historyStack.push({
                view: this.currentView,
                ngoId: this.selectedNgoId,
                projectId: this.selectedProjectId,
                inspectionId: this.selectedInspectionId,
                alertId: this.selectedAlertId,
                tabId: this.activeTabId
            });
        }

        this.currentView = viewName;
        document.querySelectorAll('.page-view').forEach(v => v.classList.remove('active'));

        const targetView = document.getElementById(`view-${viewName}`);
        if (targetView) targetView.classList.add('active');

        // Sidebar Active Highlight
        document.querySelectorAll('.nav-item').forEach(item => {
            const page = item.getAttribute('data-page');
            if (page === viewName || (viewName.startsWith('ngo') && page === 'ngos') || (viewName.startsWith('inspection') && page === 'inspections')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Header Title Updates
        const headerTitle = document.getElementById('mainHeaderTitle');
        const headerSubtitle = document.getElementById('mainHeaderSubtitle');

        if (viewName === 'command-center') {
            if (headerTitle) headerTitle.textContent = 'Overview';
            if (headerSubtitle) headerSubtitle.textContent = 'National overview of NGO-funded projects, field activity, risks and program performance.';
            document.title = 'Drishti360 — Overview';
            if (this.mapInstance) {
                setTimeout(() => this.mapInstance.invalidateSize(), 150);
            }
            this.renderProgramInsights();
            this.renderRecentActivity();
            this.initCctvMonitoringRoom();
        } else if (viewName === 'ngos') {
            if (headerTitle) headerTitle.textContent = 'Organizations';
            if (headerSubtitle) headerSubtitle.textContent = 'Registered organizations and their government-funded projects';
            document.title = 'Drishti360 — Organizations';
            this.renderNgoRegistry();
        } else if (viewName === 'ngo-profile') {
            if (headerTitle) headerTitle.textContent = 'Organizations';
            if (headerSubtitle) headerSubtitle.textContent = 'Registered organizations and their government-funded projects';
            document.title = 'Drishti360 — Organizations';
            if (params.ngoId) this.selectedNgoId = params.ngoId;
            this.renderNgoProfile(this.selectedNgoId);
        } else if (viewName === 'project-details') {
            if (headerTitle) headerTitle.textContent = 'Overview';
            if (headerSubtitle) headerSubtitle.textContent = 'National overview of NGO-funded projects, field activity, risks and program performance.';
            document.title = 'Drishti360 — Project Details';
            if (params.projectId) this.selectedProjectId = params.projectId;
            this.renderProjectDetails(this.selectedProjectId, params.tabId || 'tab-overview');
        } else if (viewName === 'alerts') {
            if (headerTitle) headerTitle.textContent = 'Risk Alerts';
            if (headerSubtitle) headerSubtitle.textContent = 'AI CCTV anomalies, attendance issues & system generated alerts';
            document.title = 'Drishti360 — Risk Alerts';
            this.renderAlertsDashboard();
        } else if (viewName === 'inspections') {
            if (headerTitle) headerTitle.textContent = 'Field Verification';
            if (headerSubtitle) headerSubtitle.textContent = 'Field verification assignments, inspection reports and verification status.';
            document.title = 'Drishti360 — Field Verification';
            this.renderInspectionsDashboard();
        } else if (viewName === 'inspection-details') {
            if (headerTitle) headerTitle.textContent = 'Field Verification';
            if (headerSubtitle) headerSubtitle.textContent = 'Field verification assignments, inspection reports and verification status.';
            document.title = 'Drishti360 — Field Verification';
            if (params.inspectionId) this.selectedInspectionId = params.inspectionId;
            this.renderInspectionDetails(this.selectedInspectionId);
        } else if (viewName === 'video-verification') {
            if (headerTitle) headerTitle.textContent = 'Field Verification';
            if (headerSubtitle) headerSubtitle.textContent = 'Live remote video verification session.';
            document.title = 'Drishti360 — Video Verification Room';
            if (params && params.inspectionId) this.selectedInspectionId = params.inspectionId;
            if (params && params.projectId) this.selectedProjectId = params.projectId;
            this.renderVideoVerificationRoom(this.selectedInspectionId, params ? params.projectId : null);
        } else if (viewName === 'cctv-stream') {
            if (headerTitle) headerTitle.textContent = 'CCTV Monitoring Directory';
            if (headerSubtitle) headerSubtitle.textContent = 'Select a registered organization to inspect its active project snapshot streams and AI telemetry.';
            document.title = 'Drishti360 — CCTV Monitoring Directory';
            this.renderCctvNgoTable();
        } else if (viewName === 'cctv-ngo-projects') {
            if (headerTitle) headerTitle.textContent = 'CCTV Monitoring Directory';
            if (headerSubtitle) headerSubtitle.textContent = 'Registered organization projects and snapshot camera feeds.';
            document.title = 'Drishti360 — NGO Projects';
            if (params && params.ngoId) this.selectedCctvNgoId = params.ngoId;
            this.renderCctvNgoProjects(this.selectedCctvNgoId);
        } else if (viewName === 'cctv-project-select') {
            if (headerTitle) headerTitle.textContent = 'CCTV Monitoring Directory';
            if (headerSubtitle) headerSubtitle.textContent = 'Select monitoring actions for the selected project.';
            document.title = 'Drishti360 — Select Project Action';
            if (params) {
                if (params.ngoId) this.selectedCctvNgoId = params.ngoId;
                if (params.projectId) this.selectedCctvProjectId = params.projectId;
            }
            this.renderCctvProjectSelect(this.selectedCctvNgoId, this.selectedCctvProjectId);
        } else if (viewName === 'video-conferencing') {
            if (headerTitle) headerTitle.textContent = 'Video Conferencing';
            if (headerSubtitle) headerSubtitle.textContent = 'Manage and launch live video verification sessions for registered NGO projects.';
            document.title = 'Drishti360 — Video Conferencing';
            this.renderVideoConferencingLanding();
        } else if (viewName === 'vc-ngo-projects') {
            if (headerTitle) headerTitle.textContent = 'Video Conferencing';
            if (headerSubtitle) headerSubtitle.textContent = 'Manage and launch live video verification sessions for registered NGO projects.';
            document.title = 'Drishti360 — NGO Projects';
            if (params && params.ngoId) this.selectedVcNgoId = params.ngoId;
            this.renderVcProjectsForNgo(this.selectedVcNgoId);
        } else if (viewName === 'analytics') {
            if (headerTitle) headerTitle.textContent = 'Analytics';
            if (headerSubtitle) headerSubtitle.textContent = 'Advanced inspection, risk, AI and compliance intelligence.';
            document.title = 'Drishti360 — Analytics';
            this.renderAnalyticsPage();
        } else if (viewName === 'reports') {
            if (headerTitle) headerTitle.textContent = 'Reports';
            if (headerSubtitle) headerSubtitle.textContent = 'Registered NGO, project, inspection and verification reports.';
            document.title = 'Drishti360 — Reports';
            this.renderReportsRegistry();
        } else if (viewName === 'ngo-report-details') {
            if (headerTitle) headerTitle.textContent = 'Reports';
            if (headerSubtitle) headerSubtitle.textContent = 'Registered NGO, project, inspection and verification reports.';
            document.title = 'Drishti360 — NGO Report Details';
            if (params && params.ngoId) this.selectedReportNgoId = params.ngoId;
            this.renderNgoReportDetails(this.selectedReportNgoId);
        } else if (viewName === 'comprehensive-report') {
            if (headerTitle) headerTitle.textContent = 'Reports';
            if (headerSubtitle) headerSubtitle.textContent = 'Comprehensive Government NGO & Project Verification Audit Report.';
            document.title = 'Drishti360 — Comprehensive Audit Report';
            if (params) {
                if (params.ngoId) this.selectedReportNgoId = params.ngoId;
                if (params.projectId) this.selectedReportProjectId = params.projectId;
            }
            this.renderComprehensiveReport(this.selectedReportNgoId, this.selectedReportProjectId);
        } else if (viewName === 'audit-trail') {
            if (headerTitle) headerTitle.textContent = 'Activity Log';
            if (headerSubtitle) headerSubtitle.textContent = 'Track administrative actions, system events and verification activity.';
            document.title = 'Drishti360 — Activity Log';
            this.renderAuditTrail();
        }

        if (window.lucide) lucide.createIcons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    goBack() {
        if (this.historyStack.length > 0) {
            const prev = this.historyStack.pop();
            this.showView(prev.view, { ngoId: prev.ngoId, projectId: prev.projectId, inspectionId: prev.inspectionId, alertId: prev.alertId, tabId: prev.tabId }, true);
        } else {
            if (this.currentView === 'inspection-details' || this.currentView === 'video-verification') this.showView('inspections', {}, true);
            else if (this.currentView === 'project-details') this.showView('ngo-profile', { ngoId: this.selectedNgoId }, true);
            else if (this.currentView === 'ngo-profile') this.showView('ngos', {}, true);
            else this.showView('command-center', {}, true);
        }
    }

    openModal(modalId) {
        const m = document.getElementById(modalId);
        if (m) {
            m.classList.add('active');
            if (modalId === 'addNgoModal') {
                setTimeout(() => {
                    if (this.ngoPreviewMap) {
                        this.ngoPreviewMap.invalidateSize();
                    }
                }, 150);
            }
        }
    }

    closeModal(modalId) {
        const m = document.getElementById(modalId);
        if (m) m.classList.remove('active');
    }

    // ALERTS DASHBOARD RENDERER
    renderAlertsDashboard() {
        const store = AppStore.get();
        const tbody = document.getElementById('alertsTableBody');
        if (!tbody) return;

        const total = store.alerts.length;
        const critical = store.alerts.filter(a => a.severity === 'Critical' || a.severity === 'High').length;
        const unresolved = store.alerts.filter(a => a.status === 'New' || a.status === 'Under Review').length;
        const resolved = store.alerts.filter(a => a.status === 'Resolved' || a.status === 'Dismissed').length;

        document.getElementById('alertsTotalCount').textContent = total;
        document.getElementById('alertsCriticalCount').textContent = critical;
        document.getElementById('alertsUnresolvedCount').textContent = unresolved;
        document.getElementById('alertsResolvedCount').textContent = resolved;

        const searchVal = (document.getElementById('alertSearchInput')?.value || '').toLowerCase();
        const sevVal = document.getElementById('alertSeverityFilter')?.value || '';
        const typeVal = document.getElementById('alertTypeFilter')?.value || '';
        const statusVal = document.getElementById('alertStatusFilter')?.value || '';

        const filtered = store.alerts.filter(a => {
            const matchesSearch = a.code.toLowerCase().includes(searchVal) ||
                                  a.ngoName.toLowerCase().includes(searchVal) ||
                                  a.projectTitle.toLowerCase().includes(searchVal) ||
                                  a.type.toLowerCase().includes(searchVal);
            const matchesSev = sevVal === '' || a.severity === sevVal;
            const matchesType = typeVal === '' || a.type === typeVal;
            const matchesStatus = statusVal === '' || a.status === statusVal;

            return matchesSearch && matchesSev && matchesType && matchesStatus;
        });

        tbody.innerHTML = filtered.map(a => `
            <tr>
                <td class="bold-code">${a.code}</td>
                <td><strong>${a.type}</strong></td>
                <td>${a.ngoName}</td>
                <td>${a.projectTitle}</td>
                <td><span class="status-badge status-${a.severity === 'Critical' || a.severity === 'High' ? 'rejected' : 'pending'}">${a.severity}</span></td>
                <td>${a.datetime}</td>
                <td><span class="status-badge status-${a.status === 'Resolved' ? 'verified' : (a.status === 'Under Review' ? 'pending' : 'rejected')}">${a.status}</span></td>
                <td>
                    <button class="btn-view-link" onclick="app.openAlertModal('${a.id}')">
                        View Details &rarr;
                    </button>
                </td>
            </tr>
        `).join('');
    }

    openAlertModal(alertId) {
        const store = AppStore.get();
        const alert = store.alerts.find(a => a.id === alertId) || store.alerts[0];
        if (!alert) return;

        this.selectedAlertId = alert.id;

        const codeEl = document.getElementById('mAlertIdCode');
        if (codeEl) codeEl.textContent = alert.code;

        // Severity pill styling
        const sevEl = document.getElementById('mAlertSeverity');
        if (sevEl) {
            sevEl.textContent = alert.severity;
            const sevClass = alert.severity === 'Critical' ? 'severity-critical' : (alert.severity === 'High' ? 'severity-high' : 'severity-medium');
            sevEl.className = `alert-pill-badge ${sevClass}`;
        }

        // Status pill styling
        const statusEl = document.getElementById('mAlertStatus');
        if (statusEl) {
            statusEl.textContent = alert.status;
            const statusClass = alert.status === 'Resolved' ? 'status-resolved' : (alert.status === 'Under Review' ? 'status-under-review' : (alert.status === 'Dismissed' ? 'status-dismissed' : 'status-new'));
            statusEl.className = `alert-pill-badge ${statusClass}`;
        }

        // Status urgency message
        const msgEl = document.getElementById('mAlertStatusMsg');
        if (msgEl) {
            if (alert.status === 'Resolved') {
                msgEl.innerHTML = '<i data-lucide="check-circle"></i> Resolved by Administrator';
                msgEl.style.color = '#059669';
            } else if (alert.status === 'Dismissed') {
                msgEl.innerHTML = '<i data-lucide="x-circle"></i> Alert Dismissed';
                msgEl.style.color = '#64748B';
            } else if (alert.status === 'Under Review') {
                msgEl.innerHTML = '<span class="urgency-pulse-dot amber"></span> Currently under government review';
                msgEl.style.color = '#D97706';
            } else {
                msgEl.innerHTML = '<span class="urgency-pulse-dot"></span> Requires immediate review';
                msgEl.style.color = '#DC2626';
            }
        }

        // Alert info cells
        const typeEl = document.getElementById('mAlertType');
        if (typeEl) typeEl.textContent = alert.type;
        const ngoEl = document.getElementById('mAlertNgo');
        if (ngoEl) ngoEl.textContent = alert.ngoName;
        const prjEl = document.getElementById('mAlertProject');
        if (prjEl) prjEl.textContent = alert.projectTitle;
        const timeEl = document.getElementById('mAlertTimestamp');
        if (timeEl) timeEl.textContent = alert.datetime;
        const reasonEl = document.getElementById('mAlertReason');
        if (reasonEl) reasonEl.textContent = alert.reason;

        // Discrepancy Parsing & Dynamic Cards
        const discGrid = document.getElementById('discrepancyGrid');
        if (discGrid) {
            const reasonText = alert.reason || '';
            const detectedMatch = reasonText.match(/detected\s+(\d+)/i);
            const expectedMatch = reasonText.match(/expected\s*:\s*(\d+)|while\s+(\d+)\s+were\s+expected|expected\s+(\d+)/i);
            const diffMatch = reasonText.match(/difference\s*:\s*(\d+)/i);

            let detectedVal = detectedMatch ? parseInt(detectedMatch[1], 10) : null;
            let expectedVal = expectedMatch ? parseInt(expectedMatch[1] || expectedMatch[2] || expectedMatch[3], 10) : null;
            let diffVal = diffMatch ? parseInt(diffMatch[1], 10) : (expectedVal !== null && detectedVal !== null ? Math.abs(expectedVal - detectedVal) : null);

            if (expectedVal !== null && detectedVal !== null) {
                discGrid.style.display = 'grid';
                document.getElementById('mAlertExpected').textContent = expectedVal;
                document.getElementById('mAlertDetected').textContent = detectedVal;
                document.getElementById('mAlertDiff').textContent = diffVal !== null ? diffVal : '—';
            } else if (reasonText.toLowerCase().includes('monitor')) {
                discGrid.style.display = 'grid';
                document.getElementById('mAlertExpected').textContent = '20';
                document.getElementById('mAlertDetected').textContent = '2';
                document.getElementById('mAlertDiff').textContent = '18';
            } else {
                discGrid.style.display = 'none';
            }
        }

        // AI Confidence display (only when data exists in alert object)
        const confWrap = document.getElementById('mAlertConfidenceWrap');
        if (confWrap) {
            if (alert.confidence) {
                confWrap.style.display = 'flex';
                document.getElementById('mAlertConfidenceVal').textContent = alert.confidence;
                const barEl = document.getElementById('mAlertConfidenceBar');
                if (barEl) barEl.style.width = alert.confidence;
            } else {
                confWrap.style.display = 'none';
            }
        }

        // Metadata footer
        const metaCode = document.getElementById('metaAlertCode');
        if (metaCode) metaCode.textContent = alert.code;
        const metaCreated = document.getElementById('metaAlertCreated');
        if (metaCreated) metaCreated.textContent = alert.datetime;
        const metaStatus = document.getElementById('metaAlertStatus');
        if (metaStatus) metaStatus.textContent = alert.status;

        // Reset Remarks & Char Counter
        const remarksEl = document.getElementById('alertAdminRemarks');
        const counterEl = document.getElementById('adminRemarksCharCount');
        if (remarksEl) {
            remarksEl.value = '';
            if (counterEl) counterEl.textContent = '0 / 500 characters';
            
            remarksEl.oninput = () => {
                const len = remarksEl.value.length;
                if (counterEl) counterEl.textContent = `${len} / 500 characters`;
            };
        }

        this.openModal('alertDetailsModal');

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    openInspectionAlertDetails(inspId) {
        const store = AppStore.get();
        const idToUse = inspId || this.selectedInspectionId;
        const insp = store.inspections.find(i => i.id === idToUse) || store.inspections[0];
        if (!insp) return;

        let targetAlert = null;
        if (insp.alertId) {
            targetAlert = store.alerts.find(a => a.id === insp.alertId || a.code === insp.alertId);
        }
        if (!targetAlert && insp.projectId) {
            targetAlert = store.alerts.find(a => a.projectId === insp.projectId);
        }
        if (!targetAlert && insp.ngoId) {
            targetAlert = store.alerts.find(a => a.ngoId === insp.ngoId);
        }
        if (!targetAlert) {
            targetAlert = store.alerts[0];
        }

        if (targetAlert) {
            this.openAlertModal(targetAlert.id);
        }
    }

    handleAlertAction(actionType) {
        const store = AppStore.get();
        const alert = store.alerts.find(a => a.id === this.selectedAlertId);
        if (!alert) return;

        const remarksInput = document.getElementById('alertAdminRemarks');
        const remarks = remarksInput?.value?.trim() || '';

        // Validation for empty remarks
        if (!remarks) {
            this.showToast('Please enter admin remarks before taking action.', 'error');
            if (remarksInput) {
                remarksInput.focus();
                remarksInput.style.borderColor = '#DC2626';
                remarksInput.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.2)';
                setTimeout(() => {
                    remarksInput.style.borderColor = '';
                    remarksInput.style.boxShadow = '';
                }, 1500);
            }
            return;
        }

        // Confirmation step
        const confirmMsg = actionType === 'Dismissed' 
            ? `Are you sure you want to DISMISS alert ${alert.code}?\n\nReason: "${remarks}"`
            : actionType === 'Resolved' || actionType === 'Mark Resolved'
            ? `Confirm marking alert ${alert.code} as RESOLVED?\n\nRemarks: "${remarks}"`
            : actionType === 'Create Surprise Inspection'
            ? `Create a Surprise Field Inspection for ${alert.ngoName} based on Alert ${alert.code}?`
            : `Mark alert ${alert.code} as UNDER REVIEW?`;

        if (!confirm(confirmMsg)) {
            return;
        }

        if (actionType === 'Under Review') {
            alert.status = 'Under Review';
            this.logAudit('admin', 'government', 'Alert marked Under Review', `Alert ${alert.code} (${alert.type}) — Remarks: ${remarks}`);
            this.showToast(`Alert ${alert.code} marked as Under Review.`);
            this.closeModal('alertDetailsModal');
            this.renderAlertsDashboard();
        } else if (actionType === 'Mark Resolved' || actionType === 'Resolved') {
            alert.status = 'Resolved';
            this.logAudit('admin', 'government', 'Alert resolved', `Alert ${alert.code} resolved — Remarks: ${remarks}`);
            this.showToast(`Alert ${alert.code} resolved successfully.`);
            this.closeModal('alertDetailsModal');
            this.renderAlertsDashboard();
        } else if (actionType === 'Dismissed') {
            alert.status = 'Dismissed';
            this.logAudit('admin', 'government', 'Alert dismissed', `Alert ${alert.code} dismissed — Reason: ${remarks}`);
            this.showToast(`Alert ${alert.code} dismissed.`);
            this.closeModal('alertDetailsModal');
            this.renderAlertsDashboard();
        } else if (actionType === 'Create Surprise Inspection') {
            this.closeModal('alertDetailsModal');
            this.openSurpriseInspectionModal(alert.ngoId, alert.projectId, `Generated from Alert ${alert.code}: ${alert.type}. Remarks: ${remarks}`);
        }

        AppStore.set(store);
    }

    // INSPECTIONS DASHBOARD RENDERER
    renderInspectionsDashboard() {
        const store = AppStore.get();
        const inspections = store.inspections || [];

        // 1. Calculate & Update Summary Cards
        const totalCount = inspections.length;
        const assignedCount = inspections.filter(i => i.status === 'Assigned').length;
        const submittedCount = inspections.filter(i => i.status === 'Submitted' || i.status === 'Verified').length;
        const pendingReviewCount = inspections.filter(i => i.govReview === 'Pending' || i.govReview !== 'Reviewed').length;

        const statTotal = document.getElementById('inspStatTotal');
        if (statTotal) statTotal.textContent = totalCount;
        const statAssigned = document.getElementById('inspStatAssigned');
        if (statAssigned) statAssigned.textContent = assignedCount;
        const statSubmitted = document.getElementById('inspStatSubmitted');
        if (statSubmitted) statSubmitted.textContent = submittedCount;
        const statPending = document.getElementById('inspStatPendingReview');
        if (statPending) statPending.textContent = pendingReviewCount;

        // 2. Calculate & Update Status Distribution Overview Bar
        const statusDistEl = document.getElementById('inspStatusDistribution');
        if (statusDistEl) {
            const counts = {
                Assigned: inspections.filter(i => i.status === 'Assigned').length,
                Submitted: inspections.filter(i => i.status === 'Submitted').length,
                'Under Review': inspections.filter(i => i.status === 'Under Review' || i.govReview === 'Under Review').length,
                Verified: inspections.filter(i => i.result === 'Verified' || i.status === 'Verified').length,
                Rejected: inspections.filter(i => i.result === 'Rejected' || i.status === 'Rejected').length
            };

            const maxCount = Math.max(1, totalCount);

            statusDistEl.innerHTML = Object.entries(counts).map(([label, count]) => {
                const pct = Math.round((count / maxCount) * 100);
                const colorClass = label === 'Assigned' ? 'orange' : (label === 'Submitted' ? 'green' : (label === 'Under Review' ? 'blue' : (label === 'Verified' ? 'green' : 'red')));
                return `
                    <div class="dist-item">
                        <div class="dist-item-meta">
                            <span class="dist-lbl">${label}</span>
                            <span class="dist-val">${count}</span>
                        </div>
                        <div class="dist-bar-bg">
                            <div class="dist-bar-fill ${colorClass}" style="width: ${Math.max(6, pct)}%;"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // 3. Filter Table Rows
        const searchInput = document.getElementById('inspSearchInput')?.value?.toLowerCase()?.trim() || '';
        const statusFilter = document.getElementById('inspStatusFilter')?.value || '';
        const reviewFilter = document.getElementById('inspReviewFilter')?.value || '';

        const filtered = inspections.filter(i => {
            const matchesSearch = !searchInput || 
                (i.code && i.code.toLowerCase().includes(searchInput)) ||
                (i.ngoName && i.ngoName.toLowerCase().includes(searchInput)) ||
                (i.projectTitle && i.projectTitle.toLowerCase().includes(searchInput)) ||
                (i.inspector && i.inspector.toLowerCase().includes(searchInput));

            const matchesStatus = !statusFilter || i.status === statusFilter || (statusFilter === 'Verified' && i.result === 'Verified');
            const matchesReview = !reviewFilter || (reviewFilter === 'Pending' && i.govReview === 'Pending') || (reviewFilter === 'Reviewed' && i.govReview === 'Reviewed') || (reviewFilter === 'Under Review' && i.govReview === 'Under Review');

            return matchesSearch && matchesStatus && matchesReview;
        });

        const tbody = document.getElementById('inspectionsTableBody');
        const emptyState = document.getElementById('inspEmptyState');

        if (tbody) {
            if (filtered.length === 0) {
                tbody.innerHTML = '';
                if (emptyState) emptyState.style.display = 'flex';
            } else {
                if (emptyState) emptyState.style.display = 'none';
                tbody.innerHTML = filtered.map(i => {
                    // Status Badge (Text-Only)
                    let statusLabel = i.status || 'Assigned';
                    let statusBadgeClass = 'status-assigned';
                    if (i.status === 'Submitted' || i.status === 'Completed') {
                        statusBadgeClass = 'status-verified';
                        statusLabel = 'Completed';
                    } else if (i.status === 'Assigned') {
                        statusBadgeClass = 'status-assigned';
                        statusLabel = 'Assigned';
                    } else if (i.status === 'Under Review' || i.status === 'Review') {
                        statusBadgeClass = 'status-pending';
                        statusLabel = 'Review';
                    }

                    const statusBadgeHTML = `<span class="status-badge ${statusBadgeClass}">${statusLabel}</span>`;

                    // Result Column Badge Styling (Text-Only)
                    let resultBadgeHTML = '<span class="status-badge status-neutral">Report Due</span>';
                    if (i.result === 'Verified') {
                        resultBadgeHTML = '<span class="status-badge status-verified">Verified</span>';
                    } else if (i.result === 'Rejected' || i.result === 'Discrepancy Found') {
                        resultBadgeHTML = '<span class="status-badge status-rejected">Rejected</span>';
                    }

                    // Government Review Badge Styling (Text-Only)
                    let govReviewHTML = '<span class="status-badge status-pending">Review</span>';
                    if (i.govReview === 'Reviewed' || i.govReview === 'Approved') {
                        govReviewHTML = '<span class="status-badge status-verified">Approved</span>';
                    } else if (i.govReview === 'Under Review' || i.govReview === 'Pending') {
                        govReviewHTML = '<span class="status-badge status-pending">Review</span>';
                    } else if (i.govReview === 'Rejected') {
                        govReviewHTML = '<span class="status-badge status-rejected">Rejected</span>';
                    }

                    // Dates Formatting
                    const assignedDateStr = i.assignedDate && i.assignedDate !== '—' ? `<span class="date-chip"><i data-lucide="calendar"></i> ${i.assignedDate}</span>` : '—';
                    const submittedDateStr = i.submittedDate && i.submittedDate !== '—' ? `<span class="date-chip green"><i data-lucide="calendar"></i> ${i.submittedDate}</span>` : '<span class="subdued-text">— Not submitted</span>';

                    return `
                        <tr class="insp-table-row">
                            <td class="bold-code-cell">
                                <span class="insp-code-badge">${i.code}</span>
                            </td>
                            <td>
                                <div class="insp-target-info">
                                    <strong class="ngo-name-text">${i.ngoName || 'N/A NGO'}</strong>
                                    <span class="project-title-sub">${i.projectTitle || 'N/A Project'}</span>
                                    <span class="inspector-tag"><i data-lucide="user"></i> ${i.inspector || 'Field Inspector'}</span>
                                </div>
                            </td>
                            <td>${assignedDateStr}</td>
                            <td>${statusBadgeHTML}</td>
                            <td>${resultBadgeHTML}</td>
                            <td>${govReviewHTML}</td>
                            <td>${submittedDateStr}</td>
                            <td>
                                <button class="btn-view-inspection-hero" onclick="app.showView('inspection-details', { inspectionId: '${i.id}' })">
                                    <span>View Details</span>
                                    <i data-lucide="arrow-right"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }

        // 4. Update Activity Log Feed
        const actList = document.getElementById('inspActivityList');
        if (actList) {
            const recentAct = store.auditTrail ? store.auditTrail.filter(a => a.entity && a.entity.toLowerCase().includes('inspection')).slice(0, 3) : [];
            if (recentAct.length > 0) {
                actList.innerHTML = recentAct.map(a => `
                    <div class="act-item">
                        <span class="act-dot"></span>
                        <div class="act-info">
                            <strong>${a.action}</strong>
                            <span>${a.entity} • ${a.timestamp}</span>
                        </div>
                    </div>
                `).join('');
            } else {
                actList.innerHTML = `
                    <div class="act-item">
                        <span class="act-dot green"></span>
                        <div class="act-info">
                            <strong>Inspection #207 assigned to field inspector</strong>
                            <span>11 Sept 2026 • Field Inspector Meena Iyer</span>
                        </div>
                    </div>
                    <div class="act-item">
                        <span class="act-dot blue"></span>
                        <div class="act-info">
                            <strong>Inspection #192 submitted report</strong>
                            <span>11 Sept 2026 • Classroom verified</span>
                        </div>
                    </div>
                `;
            }
        }

        this.bindInspectionFilterEvents();

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    bindInspectionFilterEvents() {
        const searchInput = document.getElementById('inspSearchInput');
        const statusFilter = document.getElementById('inspStatusFilter');
        const reviewFilter = document.getElementById('inspReviewFilter');
        const dateFilter = document.getElementById('inspDateFilter');
        const resetBtn = document.getElementById('inspResetFiltersBtn');

        if (searchInput && !searchInput.dataset.bound) {
            searchInput.dataset.bound = 'true';
            searchInput.addEventListener('input', () => this.renderInspectionsDashboard());
        }
        if (statusFilter && !statusFilter.dataset.bound) {
            statusFilter.dataset.bound = 'true';
            statusFilter.addEventListener('change', () => this.renderInspectionsDashboard());
        }
        if (reviewFilter && !reviewFilter.dataset.bound) {
            reviewFilter.dataset.bound = 'true';
            reviewFilter.addEventListener('change', () => this.renderInspectionsDashboard());
        }
        if (dateFilter && !dateFilter.dataset.bound) {
            dateFilter.dataset.bound = 'true';
            dateFilter.addEventListener('change', () => this.renderInspectionsDashboard());
        }
        if (resetBtn && !resetBtn.dataset.bound) {
            resetBtn.dataset.bound = 'true';
            resetBtn.addEventListener('click', () => this.resetInspectionFilters());
        }
    }

    resetInspectionFilters() {
        const searchInput = document.getElementById('inspSearchInput');
        const statusFilter = document.getElementById('inspStatusFilter');
        const reviewFilter = document.getElementById('inspReviewFilter');
        const dateFilter = document.getElementById('inspDateFilter');

        if (searchInput) searchInput.value = '';
        if (statusFilter) statusFilter.value = '';
        if (reviewFilter) reviewFilter.value = '';
        if (dateFilter) dateFilter.value = '';

        this.renderInspectionsDashboard();
    }

    openSurpriseInspectionModal(prefillNgoId = null, prefillProjectId = null, prefillReason = null) {
        const store = AppStore.get();
        const ngoSelect = document.getElementById('inspNgoSelect');
        const prjSelect = document.getElementById('inspProjectSelect');

        if (ngoSelect) {
            ngoSelect.innerHTML = store.ngos.map(n => `<option value="${n.id}">${n.name} (${n.city})</option>`).join('');
            if (prefillNgoId) ngoSelect.value = prefillNgoId;
        }

        const updatePrjOptions = () => {
            const ngoId = ngoSelect ? ngoSelect.value : null;
            const ngoProjects = store.projects.filter(p => p.ngoId === ngoId);
            if (prjSelect) {
                if (ngoProjects.length === 0) {
                    prjSelect.innerHTML = `<option value="prj-101">Default Project (Digital Classroom)</option>`;
                } else {
                    prjSelect.innerHTML = ngoProjects.map(p => `<option value="${p.id}">${p.title}</option>`).join('');
                }
                if (prefillProjectId) prjSelect.value = prefillProjectId;
            }
        };

        if (ngoSelect) ngoSelect.onchange = updatePrjOptions;
        updatePrjOptions();

        // Reason prefill & dynamic trigger badge
        const reasonEl = document.getElementById('inspReasonInput') || document.querySelector('#launchSurpriseInspectionForm textarea[name="reason"]');
        const triggerBadge = document.getElementById('surpriseTriggerAlertBadge');
        
        if (reasonEl) {
            if (prefillReason) {
                reasonEl.value = prefillReason;
            } else {
                reasonEl.value = 'Verify actual project activities, CCTV compliance and staff presence.';
            }

            // Reason character counter
            const counterEl = document.getElementById('inspReasonCharCount');
            if (counterEl) {
                counterEl.textContent = `${reasonEl.value.length} / 500 characters`;
                reasonEl.oninput = () => {
                    counterEl.textContent = `${reasonEl.value.length} / 500 characters`;
                };
            }
        }

        if (triggerBadge) {
            if (prefillReason && prefillReason.includes('Alert')) {
                const alertMatch = prefillReason.match(/Alert\s+(ALT-\d+)\s*:\s*([^.]+)/i);
                if (alertMatch) {
                    triggerBadge.textContent = `Triggered by: ${alertMatch[1]} • ${alertMatch[2].trim()}`;
                } else {
                    triggerBadge.textContent = `Triggered by: Risk Alert System`;
                }
            } else {
                triggerBadge.textContent = `Triggered by: Routine Administrative Check`;
            }
        }

        // Reset submit button state
        const btnSubmit = document.getElementById('btnLaunchInsp');
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = `<i data-lucide="zap"></i> <span>Launch Inspection</span>`;
        }

        this.openModal('surpriseInspectionModal');

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    handleLaunchSurpriseInspection(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const btnSubmit = document.getElementById('btnLaunchInsp');
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<i data-lucide="loader-2" class="spin-icon"></i> <span>Launching Inspection...</span>`;
        }

        setTimeout(() => {
            const store = AppStore.get();
            const ngo = store.ngos.find(n => n.id === formData.get('ngoId')) || store.ngos[0];
            const prj = store.projects.find(p => p.id === formData.get('projectId')) || store.projects[0];

            const inspNum = Math.floor(196 + Math.random() * 50);
            const defaultChecklistTexts = [
                "Project location exists & geofence verified",
                "Project activity is operational",
                "Beneficiaries are present on site",
                "Reported beneficiaries appear reasonable & matched with attendance log",
                "Project materials & digital smart boards exist",
                "Expenses have valid supporting invoices",
                "Project progress matches submitted physical report",
                "Photographic evidence captured with timestamp"
            ];

            const newInsp = {
                id: `insp-${Date.now()}`,
                code: `#${inspNum}`,
                ngoId: ngo.id,
                projectId: prj.id,
                ngoName: ngo.name,
                projectTitle: prj.title,
                city: ngo.city || 'Pune',
                state: ngo.state || 'Maharashtra',
                status: 'ASSIGNED',
                result: 'PENDING',
                overallResult: 'PENDING',
                govReview: 'Pending',
                governmentReview: 'PENDING',
                assignedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                submittedDate: '—',
                submittedAt: null,
                completedAt: null,
                inspector: formData.get('inspector'),
                target: formData.get('target'),
                reason: formData.get('reason'),
                progress: 0,
                finalRemarks: '',
                checklist: defaultChecklistTexts.map(text => ({ item: text, status: "PENDING" }))
            };

            store.inspections.unshift(newInsp);

            // Audit Trail entry
            const vcRoomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
            this.logAudit('admin', 'government', 'Surprise video verification room created', `VC Room ${vcRoomCode} | Inspection #${inspNum}`);
            this.logAudit('admin', 'government', 'Random surprise inspection created', `Inspection #${inspNum} | Project ${prj.prjCode || 'PRJ-001'} | Inspector: ${newInsp.inspector}`);

            AppStore.set(store);

            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = `<i data-lucide="zap"></i> <span>Launch Inspection</span>`;
            }

            this.closeModal('surpriseInspectionModal');
            this.showToast(`✓ Surprise Inspection #${inspNum} launched successfully!`);
            this.showView('inspection-details', { inspectionId: newInsp.id });
        }, 500);
    }

    // INSPECTION REPORT DETAILS RENDERER (Dynamic Inspection Lifecycle)
    renderInspectionDetails(inspId) {
        const store = AppStore.get();
        const insp = store.inspections.find(i => i.id === inspId) || store.inspections[0];
        if (!insp) return;

        this.selectedInspectionId = insp.id;

        const rawCode = insp.code ? insp.code.replace('#', '') : '204';
        const displayCode = `#${rawCode}`;

        // Dynamic status normalization
        const isAssigned = insp.status === 'ASSIGNED' || insp.status === 'Assigned';
        const isInProgress = insp.status === 'IN_PROGRESS' || insp.status === 'In Progress';
        const isSubmitted = insp.status === 'SUBMITTED' || insp.status === 'Submitted';
        const isCompleted = insp.status === 'COMPLETED' || insp.status === 'Completed';

        // Checklist normalization
        const defaultChecklistTexts = [
            "Project location exists & geofence verified",
            "Project activity is operational",
            "Beneficiaries are present on site",
            "Reported beneficiaries appear reasonable & matched with attendance log",
            "Project materials & digital smart boards exist",
            "Expenses have valid supporting invoices",
            "Project progress matches submitted physical report",
            "Photographic evidence captured with timestamp"
        ];

        if (!insp.checklist || !Array.isArray(insp.checklist) || insp.checklist.length === 0) {
            insp.checklist = defaultChecklistTexts.map(text => ({
                item: text,
                status: (isSubmitted || isCompleted) ? "PASS" : "PENDING"
            }));
        }

        const verifiedCount = insp.checklist.filter(c => c.status && c.status !== 'PENDING').length;
        const totalCount = insp.checklist.length; // 8
        const passPct = Math.round((verifiedCount / totalCount) * 100);
        insp.progress = passPct;

        // Header Elements
        const breadcrumbCode = document.getElementById('inspDetailBreadcrumbCode');
        if (breadcrumbCode) breadcrumbCode.textContent = `Inspection ${displayCode}`;

        const titleEl = document.getElementById('inspDetailTitle');
        if (titleEl) titleEl.textContent = `Inspection ${displayCode}`;

        const statusBadge = document.getElementById('inspHeroStatusBadge');
        if (statusBadge) {
            let statusText = insp.status || 'ASSIGNED';
            let statusClass = 'blue';
            let statusIcon = 'user-check';

            if (isAssigned) { statusText = 'ASSIGNED'; statusClass = 'blue'; statusIcon = 'user-check'; }
            else if (isInProgress) { statusText = 'IN PROGRESS'; statusClass = 'blue'; statusIcon = 'loader-2'; }
            else if (isSubmitted) { statusText = 'SUBMITTED'; statusClass = 'amber'; statusIcon = 'file-check'; }
            else if (isCompleted) { statusText = 'COMPLETED'; statusClass = 'green'; statusIcon = 'check-circle-2'; }

            statusBadge.className = `badge-status-pill ${statusClass}`;
            statusBadge.innerHTML = `<i data-lucide="${statusIcon}"></i> ${statusText}`;
        }

        const reviewBadge = document.getElementById('inspHeroReviewBadge');
        if (reviewBadge) {
            const revText = (isCompleted || insp.govReview === 'Reviewed' || insp.govReview === 'Verified' || insp.governmentReview === 'VERIFIED') ? 'VERIFIED' : 'PENDING';
            const isRev = revText === 'VERIFIED';
            reviewBadge.className = `badge-status-pill ${isRev ? 'green' : 'amber'}`;
            reviewBadge.innerHTML = `<i data-lucide="${isRev ? 'shield-check' : 'clock'}"></i> GOVERNMENT REVIEW: ${revText}`;
        }

        const prjTitle = document.getElementById('inspDetailProjectTitle');
        if (prjTitle) prjTitle.textContent = insp.projectTitle || 'Digital Learning Hub';

        const ngoName = document.getElementById('inspDetailNgoName');
        if (ngoName) ngoName.innerHTML = `<i data-lucide="building-2"></i> ${insp.ngoName || 'Sahyog Foundation'}`;

        const idCode = document.getElementById('inspHeroIdCode');
        if (idCode) idCode.textContent = displayCode;

        const inspectorName = document.getElementById('inspHeroInspectorName');
        if (inspectorName) {
            const nameOnly = (insp.inspector || 'Meena Iyer').replace('Field Inspector - ', '');
            inspectorName.innerHTML = `<i data-lucide="user"></i> ${nameOnly}`;
        }

        // Summary 4-grid
        const sumCity = document.getElementById('inspSumCity');
        if (sumCity) sumCity.textContent = insp.city || 'Pune';

        const sumState = document.getElementById('inspSumState');
        if (sumState) sumState.textContent = insp.state || 'Maharashtra';

        const sumInspector = document.getElementById('inspSumInspector');
        if (sumInspector) sumInspector.textContent = (insp.inspector || 'Meena Iyer').replace('Field Inspector - ', '');

        const sumStatus = document.getElementById('inspSumStatus');
        if (sumStatus) sumStatus.textContent = isAssigned ? 'Assigned' : (isInProgress ? 'In Progress' : (isSubmitted ? 'Submitted' : 'Completed'));

        const sumGovRev = document.getElementById('inspSumGovReview');
        if (sumGovRev) sumGovRev.textContent = (isCompleted || insp.govReview === 'Reviewed' || insp.govReview === 'Verified' || insp.governmentReview === 'VERIFIED') ? 'Verified' : 'Review';

        const sumResult = document.getElementById('inspSumResult');
        if (sumResult) sumResult.textContent = (insp.result && insp.result !== '—') ? insp.result : 'PENDING';

        // GPS & Location Section
        const gpsBadge = document.getElementById('inspGpsBadge');
        const gpsLocText = document.getElementById('inspGpsLocText');
        const gpsDateText = document.getElementById('inspGpsDateText');
        const gpsLatText = document.getElementById('inspGpsLatText');
        const gpsLngText = document.getElementById('inspGpsLngText');

        const hasGps = isSubmitted || isCompleted || (insp.lat && insp.lng);
        if (gpsBadge) {
            gpsBadge.className = `badge-status-pill ${hasGps ? 'green' : 'amber'}`;
            gpsBadge.innerHTML = `<i data-lucide="${hasGps ? 'check-circle-2' : 'alert-triangle'}"></i> ${hasGps ? 'GPS Captured & Verified' : 'Pending GPS Capture'}`;
        }
        if (gpsLocText) gpsLocText.textContent = hasGps ? `${insp.city || 'Pune'}, ${insp.state || 'Maharashtra'}` : 'Not captured yet';
        if (gpsDateText) gpsDateText.textContent = (insp.submittedDate && insp.submittedDate !== '—') ? insp.submittedDate : (insp.assignedDate || '11 Sept 2026');
        if (gpsLatText) gpsLatText.textContent = hasGps ? (insp.lat || '18.5204° N') : '18.5204 (Pending)';
        if (gpsLngText) gpsLngText.textContent = hasGps ? (insp.lng || '73.8567° E') : '73.8567 (Pending)';

        // Map Preview / Fallback
        const mapContainer = document.getElementById('inspGpsMapContainer');
        if (mapContainer) {
            if (hasGps && window.L) {
                const lat = parseFloat(insp.lat) || 18.5204;
                const lng = parseFloat(insp.lng) || 73.8567;
                mapContainer.innerHTML = `<div id="inspGpsLeafletMap" style="width: 100%; height: 200px; border-radius: 12px; overflow: hidden;"></div>`;
                setTimeout(() => {
                    if (document.getElementById('inspGpsLeafletMap')) {
                        const leafMap = L.map('inspGpsLeafletMap').setView([lat, lng], 13);
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '&copy; OpenStreetMap'
                        }).addTo(leafMap);
                        L.marker([lat, lng]).addTo(leafMap)
                            .bindPopup(`<b>Inspection Check-in Location</b><br>${insp.projectTitle}`)
                            .openPopup();
                    }
                }, 100);
            } else {
                mapContainer.innerHTML = `
                    <div class="empty-gps-dashed-box">
                        <i data-lucide="map-pin-off" class="dashed-gps-icon"></i>
                        <span>GPS coordinates will be plotted automatically upon inspector check-in.</span>
                    </div>
                `;
            }
        }

        // Result Summary List
        const resInspector = document.getElementById('inspResInspector');
        if (resInspector) resInspector.textContent = insp.inspector || 'Field Inspector - Meena Iyer';

        const resStatusBadge = document.getElementById('inspResStatusBadge');
        if (resStatusBadge) {
            resStatusBadge.textContent = isAssigned ? 'Assigned' : (isInProgress ? 'In Progress' : (isSubmitted ? 'Submitted' : 'Completed'));
            resStatusBadge.className = `badge-status-pill ${isSubmitted || isCompleted ? 'green' : 'blue'}`;
        }

        const resResultBadge = document.getElementById('inspResResultBadge');
        if (resResultBadge) {
            const resVal = (insp.result && insp.result !== '—') ? insp.result : 'PENDING';
            resResultBadge.textContent = resVal;
            let cls = 'amber';
            if (resVal === 'Pass' || resVal === 'Verified') cls = 'green';
            else if (resVal === 'Violation Flagged' || resVal === 'Requires Further Action') cls = 'red';
            resResultBadge.className = `badge-status-pill ${cls}`;
        }

        const resGovReviewBadge = document.getElementById('inspResGovReviewBadge');
        if (resGovReviewBadge) {
            const gRev = (isCompleted || insp.govReview === 'Reviewed' || insp.govReview === 'Verified' || insp.governmentReview === 'VERIFIED') ? 'Verified' : 'Pending';
            resGovReviewBadge.textContent = gRev;
            resGovReviewBadge.className = `badge-status-pill ${gRev === 'Verified' ? 'green' : 'amber'}`;
        }

        // Checklist Banner & Dynamic Progress Bar
        const chkSummaryText = document.getElementById('inspChecklistSummaryText');
        if (chkSummaryText) chkSummaryText.textContent = `${verifiedCount} / ${totalCount} Works Verified`;

        const chkPctBadge = document.getElementById('inspChecklistPctBadge');
        if (chkPctBadge) chkPctBadge.textContent = `${passPct}% Completed`;

        const chkStatusTag = document.getElementById('inspChecklistStatusTag');
        if (chkStatusTag) {
            if (passPct === 100) {
                chkStatusTag.className = `badge-status-pill green`;
                chkStatusTag.innerHTML = `<i data-lucide="check-circle-2"></i> 8 / 8 Verified (100%)`;
            } else if (passPct > 0) {
                chkStatusTag.className = `badge-status-pill blue`;
                chkStatusTag.innerHTML = `<i data-lucide="loader-2" class="spin-icon"></i> ${verifiedCount} / 8 Verified (${passPct}%)`;
            } else {
                chkStatusTag.className = `badge-status-pill amber`;
                chkStatusTag.innerHTML = `<i data-lucide="clock"></i> 0 / 8 Verified (0%)`;
            }
        }

        const chkBar = document.getElementById('inspChecklistBar');
        if (chkBar) {
            chkBar.style.width = `${passPct}%`;
            chkBar.className = `progress-bar-fill ${passPct === 100 ? 'green' : (passPct > 0 ? 'blue' : 'amber')}`;
        }

        // Checklist Item Rows Container
        const chkContainer = document.getElementById('inspChecklistContainer');
        if (chkContainer) {
            if (isSubmitted || isCompleted) {
                // Fixed Readonly Badges for Submitted / Completed
                chkContainer.innerHTML = insp.checklist.map(c => {
                    let badgeClass = 'pending';
                    let badgeIcon = 'clock';
                    let badgeText = c.status || 'PENDING';

                    if (c.status === 'PASS') { badgeClass = 'pass'; badgeIcon = 'check'; badgeText = 'PASS'; }
                    else if (c.status === 'FAIL') { badgeClass = 'fail'; badgeIcon = 'x'; badgeText = 'FAIL'; }
                    else if (c.status === 'REQUIRES_ACTION') { badgeClass = 'req'; badgeIcon = 'alert-triangle'; badgeText = 'ACTION'; }

                    return `
                        <div class="checklist-row-card">
                            <div class="chk-row-left">
                                <div class="chk-icon-circle ${badgeClass}">
                                    <i data-lucide="${badgeIcon}"></i>
                                </div>
                                <span class="chk-row-text">${c.item}</span>
                            </div>
                            <span class="chk-status-pill ${badgeClass}">${badgeText}</span>
                        </div>
                    `;
                }).join('');
            } else {
                // Interactive Selector for Inspector Mode (ASSIGNED or IN_PROGRESS)
                chkContainer.innerHTML = insp.checklist.map((c, index) => {
                    return `
                        <div class="checklist-row-card">
                            <div class="chk-row-left">
                                <div class="chk-icon-circle ${c.status === 'PASS' ? 'pass' : (c.status === 'FAIL' ? 'fail' : (c.status === 'REQUIRES_ACTION' ? 'req' : 'pending'))}">
                                    <i data-lucide="${c.status === 'PASS' ? 'check' : (c.status === 'FAIL' ? 'x' : (c.status === 'REQUIRES_ACTION' ? 'alert-triangle' : 'clock'))}"></i>
                                </div>
                                <span class="chk-row-text">${c.item}</span>
                            </div>
                            <div class="chk-status-selector">
                                <button type="button" class="chk-btn pending ${c.status === 'PENDING' ? 'active' : ''}" onclick="app.updateChecklistItemStatus('${insp.id}', ${index}, 'PENDING')">○ PENDING</button>
                                <button type="button" class="chk-btn pass ${c.status === 'PASS' ? 'active' : ''}" onclick="app.updateChecklistItemStatus('${insp.id}', ${index}, 'PASS')">✓ PASS</button>
                                <button type="button" class="chk-btn fail ${c.status === 'FAIL' ? 'active' : ''}" onclick="app.updateChecklistItemStatus('${insp.id}', ${index}, 'FAIL')">✗ FAIL</button>
                                <button type="button" class="chk-btn req ${c.status === 'REQUIRES_ACTION' ? 'active' : ''}" onclick="app.updateChecklistItemStatus('${insp.id}', ${index}, 'REQUIRES_ACTION')">⚠ ACTION</button>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            // Complete Inspection Button Footer Inside Checklist Panel
            if (isAssigned || isInProgress) {
                const canComplete = verifiedCount === 8;
                const footerBtnHTML = `
                    <div class="complete-inspection-bar">
                        <button type="button" id="btnOpenCompleteModal" class="btn-complete-inspection ${canComplete ? 'enabled' : 'disabled'}" ${canComplete ? '' : 'disabled'} onclick="app.openCompleteInspectionModal('${insp.id}')">
                            ${canComplete ? '<i data-lucide="check-circle-2"></i> <span>✓ Complete Inspection</span>' : '<i data-lucide="lock"></i> <span>Complete all 8 required verification items first (' + verifiedCount + '/8 Completed)</span>'}
                        </button>
                    </div>
                `;
                chkContainer.insertAdjacentHTML('beforeend', footerBtnHTML);
            }
        }

        // Final Remarks Card Insertion (if present)
        const existingRemarksBox = document.getElementById('inspFinalRemarksCardBox');
        if (existingRemarksBox) existingRemarksBox.remove();

        if (insp.finalRemarks) {
            const remarksCardHTML = `
                <div class="panel-card final-remarks-card margin-bottom-card" id="inspFinalRemarksCardBox">
                    <h4 class="remarks-title"><i data-lucide="file-text"></i> Final Inspection Remarks</h4>
                    <p class="remarks-body">"${insp.finalRemarks}"</p>
                    <p class="remarks-footer"><i data-lucide="user"></i> Submitted by ${insp.inspector || 'Field Inspector'} • ${insp.submittedDate || 'Recently'}</p>
                </div>
            `;
            const obsCard = document.getElementById('inspObservationsText')?.closest('.panel-card');
            if (obsCard) {
                obsCard.insertAdjacentHTML('beforebegin', remarksCardHTML);
            }
        }

        // Observations Section
        const targetChip = document.getElementById('inspObsTargetChip');
        if (targetChip) {
            targetChip.innerHTML = `<i data-lucide="target"></i> Target: ${insp.target || 'Staff & Equipment'}`;
        }

        const obsText = document.getElementById('inspObservationsText');
        if (obsText) {
            obsText.textContent = insp.reason ? `Reason: ${insp.reason}` : `Verification completed on site. Project activities found to be operational with staff attendance verified via AI camera system.`;
        }

        // Evidence Gallery Grid
        const evidenceGrid = document.getElementById('inspEvidenceGrid');
        if (evidenceGrid) {
            if (isSubmitted || isCompleted) {
                const photos = [
                    { title: 'Smart Classroom & Interactive Board Setup', date: insp.submittedDate !== '—' ? insp.submittedDate : '11 Sept 2026', icon: 'monitor' },
                    { title: 'Computer Lab Hardware & Monitor Verification', date: insp.submittedDate !== '—' ? insp.submittedDate : '11 Sept 2026', icon: 'cpu' },
                    { title: 'Student Beneficiary Attendance & Engagement', date: insp.submittedDate !== '—' ? insp.submittedDate : '11 Sept 2026', icon: 'users' }
                ];
                evidenceGrid.innerHTML = photos.map(p => `
                    <div class="evidence-photo-card" onclick="app.openPhotoPreview('${p.title}', '${p.date}')">
                        <div class="photo-placeholder-box">
                            <i data-lucide="${p.icon}" class="photo-box-icon"></i>
                            <span class="photo-zoom-tag"><i data-lucide="zoom-in"></i> Preview Photo</span>
                        </div>
                        <div class="photo-caption-strip">
                            <span class="photo-caption-title">${p.title}</span>
                            <span class="photo-timestamp"><i data-lucide="clock"></i> Captured: ${p.date}</span>
                        </div>
                    </div>
                `).join('');
            } else {
                evidenceGrid.innerHTML = `
                    <div class="empty-evidence-box">
                        <i data-lucide="camera-off" class="empty-ev-icon"></i>
                        <h4>No Photographic Evidence Uploaded</h4>
                        <p>Field inspector will upload photographic evidence upon completing the on-site verification.</p>
                    </div>
                `;
            }
        }

        // Government Review Action Cards & Locked State Banner
        const reviewActionsCard = document.querySelector('.review-actions-card');
        if (reviewActionsCard) {
            if (isAssigned || isInProgress) {
                reviewActionsCard.innerHTML = `
                    <div class="panel-header">
                        <div class="panel-title-group">
                            <div class="panel-icon-wrap navy">
                                <i data-lucide="shield-check"></i>
                            </div>
                            <div>
                                <h3 class="panel-title">Government Review</h3>
                                <p class="panel-subtitle">Review field verification report and take administrative action.</p>
                            </div>
                        </div>
                        <span class="badge-status-pill amber"><i data-lucide="lock"></i> Awaiting Inspector Submission</span>
                    </div>
                    <div style="background: #FFFBEB; border: 1px dashed #FCD34D; border-radius: 12px; padding: 20px; text-align: center; color: #B45309; font-size: 0.88rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <i data-lucide="lock" style="width: 20px; height: 20px;"></i>
                        <span>Government Review actions will unlock automatically once the field inspector completes and submits the verification report.</span>
                    </div>
                `;
            } else {
                reviewActionsCard.innerHTML = `
                    <div class="panel-header">
                        <div class="panel-title-group">
                            <div class="panel-icon-wrap navy">
                                <i data-lucide="shield-check"></i>
                            </div>
                            <div>
                                <h3 class="panel-title">Government Review</h3>
                                <p class="panel-subtitle">Review field verification report and take administrative action.</p>
                            </div>
                        </div>
                        <span class="badge-status-pill ${isCompleted ? 'green' : 'amber'}"><i data-lucide="${isCompleted ? 'check-circle-2' : 'clock'}"></i> Status: ${isCompleted ? 'VERIFIED' : 'PENDING'}</span>
                    </div>

                    <div class="gov-action-cards-grid">
                        <div class="gov-action-card red" onclick="app.openInspectionAlertDetails('${insp.id}')">
                            <div class="act-card-icon red"><i data-lucide="alert-triangle"></i></div>
                            <div class="act-card-info">
                                <h4 class="act-card-title">REQUIRES FURTHER ACTION</h4>
                                <p class="act-card-desc">Send the inspection back for additional field verification or administrative audit.</p>
                            </div>
                            <i data-lucide="arrow-right" class="act-card-arrow"></i>
                        </div>

                        <div class="gov-action-card navy" id="launchVcBtn" onclick="app.launchVideoRoom()">
                            <div class="act-card-icon navy"><i data-lucide="video"></i></div>
                            <div class="act-card-info">
                                <h4 class="act-card-title">VIDEO VERIFICATION ROOM</h4>
                                <p class="act-card-desc">Launch an instant live video verification session with the field inspector.</p>
                            </div>
                            <i data-lucide="arrow-right" class="act-card-arrow"></i>
                        </div>
                    </div>
                `;
            }
        }

        // Inspection Timeline Section
        const timelineContainer = document.getElementById('inspTimelineContainer');
        if (timelineContainer) {
            timelineContainer.innerHTML = `
                <div class="timeline-step-item completed">
                    <div class="t-step-marker"><i data-lucide="check"></i></div>
                    <div class="t-step-content">
                        <div class="t-step-top">
                            <span class="t-step-title">Surprise Inspection Launched</span>
                            <span class="t-step-date">${insp.assignedDate || 'Recently'}</span>
                        </div>
                        <p class="t-step-desc">Inspection ${displayCode} created and assigned to ${insp.inspector || 'Field Inspector'} targeting ${insp.target || 'Staff & Equipment'}.</p>
                    </div>
                </div>

                <div class="timeline-step-item ${isSubmitted || isCompleted ? 'completed' : 'active'}">
                    <div class="t-step-marker"><i data-lucide="${isSubmitted || isCompleted ? 'check' : 'loader-2'}" class="${isSubmitted || isCompleted ? '' : 'spin-icon'}"></i></div>
                    <div class="t-step-content">
                        <div class="t-step-top">
                            <span class="t-step-title">Field Inspection Conducted</span>
                            <span class="t-step-date">${(isSubmitted || isCompleted) ? (insp.submittedDate || 'Completed') : (isInProgress ? 'In Progress (' + passPct + '%)' : 'Assigned')}</span>
                        </div>
                        <p class="t-step-desc">${(isSubmitted || isCompleted) ? 'Inspector completed check-in, verified 8 compliance items, and uploaded photographic evidence.' : 'Field officer currently verifying site compliance items.'}</p>
                    </div>
                </div>

                <div class="timeline-step-item ${isCompleted ? 'completed' : ((isSubmitted) ? 'active' : 'upcoming')}">
                    <div class="t-step-marker"><i data-lucide="${isCompleted ? 'check' : (isSubmitted ? 'clock' : 'shield')}"></i></div>
                    <div class="t-step-content">
                        <div class="t-step-top">
                            <span class="t-step-title">Government Review & Action</span>
                            <span class="t-step-date">${isCompleted ? 'Completed' : (isSubmitted ? 'Pending Action' : 'Locked')}</span>
                        </div>
                        <p class="t-step-desc">${isCompleted ? `Government administrator marked report as "${insp.result}".` : (isSubmitted ? 'Awaiting administrative verification, audit clearance, or live video verification session.' : 'Awaiting field inspector report submission.')}</p>
                    </div>
                </div>
            `;
        }

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    updateChecklistItemStatus(inspId, index, newStatus) {
        const store = AppStore.get();
        const insp = store.inspections.find(i => i.id === inspId);
        if (!insp) return;

        if (!insp.checklist || !insp.checklist[index]) return;

        insp.checklist[index].status = newStatus;

        const verifiedCount = insp.checklist.filter(c => c.status && c.status !== 'PENDING').length;
        insp.progress = Math.round((verifiedCount / insp.checklist.length) * 100);

        if (verifiedCount > 0 && insp.status !== 'SUBMITTED' && insp.status !== 'COMPLETED') {
            insp.status = 'IN_PROGRESS';
        } else if (verifiedCount === 0 && insp.status !== 'SUBMITTED' && insp.status !== 'COMPLETED') {
            insp.status = 'ASSIGNED';
        }

        AppStore.set(store);
        this.renderInspectionDetails(insp.id);
    }

    openCompleteInspectionModal(inspId) {
        const store = AppStore.get();
        const insp = store.inspections.find(i => i.id === inspId);
        if (!insp) return;

        this.selectedInspectionId = insp.id;

        const rawCode = insp.code ? insp.code.replace('#', '') : '204';
        const codeEl = document.getElementById('cmpModalCode');
        if (codeEl) codeEl.textContent = `INSPECTION #${rawCode}`;

        const prjEl = document.getElementById('cmpModalProject');
        if (prjEl) prjEl.textContent = insp.projectTitle || 'Digital Learning Hub';

        const ngoEl = document.getElementById('cmpModalNgo');
        if (ngoEl) ngoEl.textContent = insp.ngoName || 'Sahyog Foundation';

        const remarksEl = document.getElementById('modalFinalRemarks');
        if (remarksEl) remarksEl.value = '';

        this.openModal('completeInspectionModal');
    }

    handleCompleteInspectionSubmit(e) {
        e.preventDefault();
        const store = AppStore.get();
        const insp = store.inspections.find(i => i.id === this.selectedInspectionId);
        if (!insp) return;

        const remarksEl = document.getElementById('modalFinalRemarks');
        const remarks = remarksEl ? remarksEl.value.trim() : '';

        const resultEl = document.querySelector('input[name="inspectionResult"]:checked');
        const resultVal = resultEl ? resultEl.value : 'Verified';

        if (!remarks) {
            this.showToast('⚠️ Please enter your final inspection remarks before submitting.');
            return;
        }

        insp.status = 'SUBMITTED';
        insp.result = resultVal;
        insp.overallResult = resultVal;
        insp.govReview = 'Pending';
        insp.governmentReview = 'PENDING';
        insp.finalRemarks = remarks;
        insp.submittedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        insp.submittedAt = new Date().toISOString();

        this.logAudit('inspector', 'field_inspector', 'Inspection submitted', `Inspection ${insp.code} submitted with result "${resultVal}"`);
        AppStore.set(store);

        this.closeModal('completeInspectionModal');
        this.showToast(`✓ Field Inspection ${insp.code} submitted successfully for Government Review!`);
        this.renderInspectionDetails(insp.id);
        this.renderInspectionsDashboard();
    }

    openPhotoPreview(title, date) {
        this.showToast(`📷 Inspecting high-res evidence: "${title}" (${date})`);
    }

    reviewInspection(statusResult) {
        const store = AppStore.get();
        const insp = store.inspections.find(i => i.id === this.selectedInspectionId);
        if (!insp) return;

        insp.result = statusResult;
        insp.overallResult = statusResult;
        insp.govReview = 'Reviewed';
        insp.governmentReview = 'VERIFIED';
        insp.status = 'COMPLETED';
        insp.completedAt = new Date().toISOString();

        this.logAudit('admin', 'government', 'Report reviewed', `Inspection ${insp.code} → ${statusResult}`);
        AppStore.set(store);

        this.showToast(`Inspection ${insp.code} marked as "${statusResult}"`);
        this.renderInspectionDetails(this.selectedInspectionId);
        this.renderInspectionsDashboard();
    }

    launchVideoRoom() {
        const store = AppStore.get();
        const insp = store.inspections.find(i => i.id === this.selectedInspectionId) || store.inspections[0];

        const rawCode = insp.code ? insp.code.replace('#', '') : '215';
        const roomCode = Math.random().toString(36).substring(2, 10).toUpperCase();

        // Populate metadata header and info 7-grid
        const inspCodeDisp = document.getElementById('vcInspCodeDisplay');
        if (inspCodeDisp) inspCodeDisp.textContent = `INSPECTION #${rawCode}`;

        const vcInspCode = document.getElementById('vcInspCode');
        if (vcInspCode) vcInspCode.textContent = `#${rawCode}`;

        const vcNgoName = document.getElementById('vcNgoName');
        if (vcNgoName) vcNgoName.textContent = insp.ngoName || 'Sahyog Foundation';

        const vcProjTitle = document.getElementById('vcProjectTitle');
        if (vcProjTitle) vcProjTitle.textContent = insp.projectTitle || 'Digital Learning Hub';

        const vcRoomCode = document.getElementById('vcRoomCode');
        if (vcRoomCode) vcRoomCode.textContent = roomCode;

        const vcWaitingRoomId = document.getElementById('vcWaitingRoomId');
        if (vcWaitingRoomId) vcWaitingRoomId.textContent = roomCode;

        const vcSecRoomId = document.getElementById('vcSecRoomId');
        if (vcSecRoomId) vcSecRoomId.textContent = roomCode;

        const vcTargetVal = document.getElementById('vcTargetVal');
        if (vcTargetVal) vcTargetVal.textContent = insp.target || 'Staff & Equipment';

        const vcReasonVal = document.getElementById('vcReasonVal');
        if (vcReasonVal) vcReasonVal.textContent = insp.reason || 'Surprise verification';

        // Populate sidebar detail panel
        const detailsInspCode = document.getElementById('vcDetailsInspCode');
        if (detailsInspCode) detailsInspCode.textContent = `#${rawCode}`;

        const detailsNgoName = document.getElementById('vcDetailsNgoName');
        if (detailsNgoName) detailsNgoName.textContent = insp.ngoName || 'Sahyog Foundation';

        const detailsProjTitle = document.getElementById('vcDetailsProjectTitle');
        if (detailsProjTitle) detailsProjTitle.textContent = insp.projectTitle || 'Digital Learning Hub';

        // Reset Hero Status Badge & Timer
        const heroBadge = document.getElementById('vcHeroStatusBadge');
        if (heroBadge) {
            heroBadge.className = 'vc-status-pill amber';
            heroBadge.innerHTML = `<i data-lucide="clock"></i> WAITING FOR INSPECTOR`;
        }

        // Reset Timer
        if (this.vcTimerInterval) clearInterval(this.vcTimerInterval);
        this.vcSecondsElapsed = 0;
        const timerVal = document.getElementById('vcCallTimer');
        if (timerVal) timerVal.textContent = '00:00:00';

        this.vcTimerInterval = setInterval(() => {
            this.vcSecondsElapsed++;
            const hrs = String(Math.floor(this.vcSecondsElapsed / 3600)).padStart(2, '0');
            const mins = String(Math.floor((this.vcSecondsElapsed % 3600) / 60)).padStart(2, '0');
            const secs = String(this.vcSecondsElapsed % 60).padStart(2, '0');
            if (timerVal) timerVal.textContent = `${hrs}:${mins}:${secs}`;
        }, 1000);

        // Reset Video Viewports
        const myCamOff = document.getElementById('myCamOffScreen');
        if (myCamOff) myCamOff.style.display = 'none';

        const remoteWaiting = document.getElementById('remoteWaitingScreen');
        if (remoteWaiting) remoteWaiting.style.display = 'flex';

        const remoteVideo = document.getElementById('remoteCameraVideo');
        if (remoteVideo) remoteVideo.style.display = 'none';

        const remoteBadge = document.getElementById('remoteStatusBadge');
        if (remoteBadge) {
            remoteBadge.textContent = '🟠 WAITING TO JOIN...';
            remoteBadge.style.color = '#F59E0B';
        }

        // Log Audit Event
        this.logAudit('admin', 'government', 'Surprise video verification room created', `VC Room ${roomCode} | Inspection #${rawCode}`);

        // Navigate to view
        this.showView('video-verification');

        // Simulate inspector joining after 2.5 seconds
        setTimeout(() => {
            if (this.currentView !== 'video-verification') return;

            if (heroBadge) {
                heroBadge.className = 'vc-status-pill green';
                heroBadge.innerHTML = `<i data-lucide="check-circle-2"></i> INSPECTOR CONNECTED`;
            }

            if (remoteWaiting) remoteWaiting.style.display = 'none';
            if (remoteVideo) remoteVideo.style.display = 'block';

            if (remoteBadge) {
                remoteBadge.textContent = '🟢 CONNECTED (1080p HD)';
                remoteBadge.style.color = '#10B981';
            }

            const stepInspector = document.getElementById('tlStepInspectorJoin');
            if (stepInspector) {
                stepInspector.classList.add('completed');
                const dateEl = stepInspector.querySelector('.t-step-date');
                if (dateEl) dateEl.textContent = 'Connected (00:00:02)';
            }

            this.showToast(`🟢 ${insp.inspector || 'Field Inspector'} joined Video Verification Room!`);
            if (window.lucide) lucide.createIcons();
        }, 2500);

        if (window.lucide) lucide.createIcons();
    }

    startVideoVerificationCall() {
        const heroBadge = document.getElementById('vcHeroStatusBadge');
        if (heroBadge) {
            heroBadge.className = 'vc-status-pill green';
            heroBadge.innerHTML = `<i data-lucide="video"></i> VERIFICATION IN PROGRESS`;
        }

        const stepStarted = document.getElementById('tlStepVerificationStarted');
        if (stepStarted) {
            stepStarted.classList.add('active');
            const dateEl = stepStarted.querySelector('.t-step-date');
            if (dateEl) dateEl.textContent = 'In Progress';
        }

        const btnStart = document.getElementById('btnStartVcSession');
        if (btnStart) btnStart.style.display = 'none';

        const btnEnd = document.getElementById('btnEndVcSession');
        if (btnEnd) btnEnd.style.display = 'inline-flex';

        this.showToast('▶ Live Video Verification session active.');
        if (window.lucide) lucide.createIcons();
    }

    endVideoVerificationCall() {
        if (this.vcTimerInterval) {
            clearInterval(this.vcTimerInterval);
            this.vcTimerInterval = null;
        }

        const heroBadge = document.getElementById('vcHeroStatusBadge');
        if (heroBadge) {
            heroBadge.className = 'vc-status-pill red';
            heroBadge.innerHTML = `<i data-lucide="phone-off"></i> CALL ENDED`;
        }

        const remoteWaiting = document.getElementById('remoteWaitingScreen');
        if (remoteWaiting) {
            remoteWaiting.style.display = 'flex';
            remoteWaiting.innerHTML = `
                <div class="vc-waiting-pulsar" style="border-color: #EF4444; background: rgba(239, 68, 68, 0.2);">
                    <i data-lucide="phone-off" style="color: #FCA5A5;"></i>
                </div>
                <h4 class="vc-waiting-title">Video Verification Session Ended</h4>
                <p class="vc-waiting-sub">Duration: ${document.getElementById('vcCallTimer')?.textContent || '00:00:00'}</p>
            `;
        }

        const remoteVideo = document.getElementById('remoteCameraVideo');
        if (remoteVideo) remoteVideo.style.display = 'none';

        const remoteBadge = document.getElementById('remoteStatusBadge');
        if (remoteBadge) {
            remoteBadge.textContent = '⚫ DISCONNECTED';
            remoteBadge.style.color = '#94A3B8';
        }

        this.showToast('⏹ Video Verification call ended.');
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            if (this.selectedVcNgoId) {
                this.showView('vc-ngo-projects', { ngoId: this.selectedVcNgoId });
            } else {
                this.showView('video-conferencing');
            }
        }, 1200);
    }

    renderVideoConferencingLanding() {
        const store = AppStore.get();
        const ngos = store.ngos || [];
        const projects = store.projects || [];

        const searchQuery = (document.getElementById('vcNgoSearchInput')?.value || '').toLowerCase().trim();
        const statusFilter = document.getElementById('vcNgoStatusFilter')?.value || 'ALL';

        const filteredNgos = ngos.filter(n => {
            const matchesSearch = !searchQuery ||
                n.name.toLowerCase().includes(searchQuery) ||
                (n.regNo || '').toLowerCase().includes(searchQuery) ||
                n.city.toLowerCase().includes(searchQuery) ||
                n.state.toLowerCase().includes(searchQuery) ||
                (n.sector || '').toLowerCase().includes(searchQuery);

            const isVerified = (n.status || '').toLowerCase() === 'verified';
            const matchesStatus = statusFilter === 'ALL' ||
                (statusFilter === 'Verified' && isVerified) ||
                (statusFilter === 'Pending' && !isVerified);

            return matchesSearch && matchesStatus;
        });

        const countBadge = document.getElementById('vcNgoCountBadge');
        if (countBadge) countBadge.textContent = `Showing ${filteredNgos.length} Registered NGO${filteredNgos.length !== 1 ? 's' : ''}`;

        const tableCountText = document.getElementById('vcNgoTableCountText');
        if (tableCountText) tableCountText.textContent = `Showing ${filteredNgos.length} of ${ngos.length} Registered NGOs`;

        const tbody = document.getElementById('vcNgoTableBody');
        if (tbody) {
            if (filteredNgos.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 40px; color: #64748B;">
                            <i data-lucide="building-2" style="width: 32px; height: 32px; color: #94A3B8; margin-bottom: 8px;"></i>
                            <div style="font-weight: 700;">No registered NGOs match your search criteria.</div>
                            <div style="font-size: 0.8rem; margin-top: 4px;">Try resetting the search query or status filter.</div>
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = filteredNgos.map((n, idx) => {
                    const ngoProjects = projects.filter(p => p.ngoId === n.id);
                    const prjCount = ngoProjects.length > 0 ? ngoProjects.length : 1;
                    const isVerified = (n.status || '').toLowerCase() === 'verified';
                    const badgeClass = isVerified ? 'status-verified-badge' : 'badge-status-pill amber';
                    const statusLabel = isVerified ? 'Verified' : 'Pending';
                    const regDate = n.regDate || `${10 + (idx % 15)} Feb 2026`;

                    return `
                        <tr>
                            <td><strong>${n.name}</strong></td>
                            <td><code class="bold-code">${n.regNo || 'KA-EDU-2011-0451'}</code></td>
                            <td>${n.sector || 'Education'}</td>
                            <td>${n.city}, ${n.state}</td>
                            <td>${regDate}</td>
                            <td><span class="badge-status-pill blue">${prjCount} Project${prjCount > 1 ? 's' : ''}</span></td>
                            <td><span class="${badgeClass}"><i data-lucide="${isVerified ? 'check-circle-2' : 'clock'}"></i> ${statusLabel}</span></td>
                            <td>
                                <button class="btn-navy" style="font-size: 0.8rem; padding: 6px 14px;" onclick="app.openVcProjectsForNgo('${n.id}')">
                                    View Projects &rarr;
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    openVcProjectsForNgo(ngoId) {
        this.selectedVcNgoId = ngoId;
        this.showView('vc-ngo-projects', { ngoId: ngoId });
    }

    renderVcProjectsForNgo(ngoId) {
        const store = AppStore.get();
        const ngo = store.ngos.find(n => n.id === ngoId) || store.ngos[0];
        if (!ngo) return;

        this.selectedVcNgoId = ngo.id;

        // NGO Header
        const regNoEl = document.getElementById('vcSelectedNgoRegNo'); if (regNoEl) regNoEl.textContent = ngo.regNo || 'KA-EDU-2011-0451';
        const nameEl = document.getElementById('vcSelectedNgoName'); if (nameEl) nameEl.textContent = ngo.name;
        const metaEl = document.getElementById('vcSelectedNgoMeta');
        if (metaEl) metaEl.innerHTML = `<i data-lucide="map-pin" style="width: 14px; height: 14px; color: #1D64C8;"></i> ${ngo.city}, ${ngo.state} • Registered NGO`;

        const isVerified = (ngo.status || '').toLowerCase() === 'verified';
        const badgeEl = document.getElementById('vcSelectedNgoBadge');
        if (badgeEl) {
            badgeEl.className = isVerified ? 'status-verified-badge' : 'badge-status-pill amber';
            badgeEl.innerHTML = `<i data-lucide="${isVerified ? 'check-circle-2' : 'clock'}"></i> ${isVerified ? 'Registered' : 'Pending'}`;
        }

        let ngoProjects = store.projects.filter(p => p.ngoId === ngo.id);
        if (ngoProjects.length === 0) {
            ngoProjects = [{
                id: `prj-${ngo.id}`,
                ngoId: ngo.id,
                title: `${ngo.name} Project`,
                category: ngo.sector || 'Education',
                status: 'Active',
                startDate: '02 Mar 2026',
                prjCode: 'PRJ-201',
                sanctioned: ngo.sanctioned || '₹15.00 L',
                released: ngo.released || '₹12.00 L',
                spent: '₹11.70 L',
                progressPct: 78
            }];
        }

        const countText = document.getElementById('vcNgoProjectsCountText');
        if (countText) countText.textContent = `Showing ${ngoProjects.length} Project${ngoProjects.length > 1 ? 's' : ''}`;

        const grid = document.getElementById('vcNgoProjectsGrid');
        if (grid) {
            grid.innerHTML = ngoProjects.map((p, idx) => {
                const insp = store.inspections.find(i => i.projectId === p.id || i.ngoId === ngo.id);
                const inspectorName = insp ? (insp.inspector || 'Meena Iyer') : 'Meena Iyer';
                const inspStatusLabel = insp ? (insp.status || 'Assigned') : (idx === 0 ? 'Assigned' : 'Completed');
                const inspStatusBadgeClass = (inspStatusLabel === 'Submitted' || inspStatusLabel === 'SUBMITTED' || inspStatusLabel === 'Completed') ? 'green' : 'amber';
                const lastVerifDate = insp ? (insp.assignedDate || '11 Sept 2026') : '11 Sept 2026';

                // Determine Action Button Logic based on Requirement 7
                const hasActiveVerification = idx === 0 || (insp && (insp.status === 'ASSIGNED' || insp.status === 'Assigned' || insp.govReview === 'Pending'));
                const isSessionActive = insp && insp.vcSessionActive;

                let actionButtonHTML = '';
                if (isSessionActive) {
                    actionButtonHTML = `
                        <button class="btn-navy" style="width: 100%; justify-content: center; background: #059669; font-weight: 700; padding: 10px 16px; border-radius: 8px;" onclick="app.startVideoVerificationForProject('${p.id}', '${insp ? insp.id : ''}')">
                            <i data-lucide="video"></i> Join Active Session &rarr;
                        </button>
                    `;
                } else if (hasActiveVerification) {
                    actionButtonHTML = `
                        <button class="btn-navy" style="width: 100%; justify-content: center; font-weight: 700; padding: 10px 16px; border-radius: 8px;" onclick="app.startVideoVerificationForProject('${p.id}', '${insp ? insp.id : ''}')">
                            <i data-lucide="video"></i> Start Video Verification &rarr;
                        </button>
                    `;
                } else {
                    actionButtonHTML = `
                        <button class="btn-secondary" style="width: 100%; justify-content: center; opacity: 0.65; cursor: not-allowed; padding: 10px 16px; border-radius: 8px;" disabled>
                            <i data-lucide="video-off"></i> No Active Verification
                        </button>
                    `;
                }

                return `
                    <div class="panel-card" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 14px; border: 1px solid #CBD5E1;">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 10px;">
                                <div>
                                    <span class="bold-code" style="font-size: 0.78rem;">Project ID: ${p.prjCode || 'PRJ-201'}</span>
                                    <h4 style="font-size: 1.1rem; font-weight: 800; color: #0B2347; margin-top: 2px;">${p.title}</h4>
                                </div>
                                <span class="badge-status-pill ${p.status === 'Active' ? 'green' : 'blue'}" style="font-size: 0.75rem;">${p.status}</span>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #F8FAFC; padding: 12px; border-radius: 10px; border: 1px solid #E2E8F0; margin-bottom: 14px; font-size: 0.82rem;">
                                <div>
                                    <span style="color: #64748B; font-weight: 600; font-size: 0.7rem; text-transform: uppercase; display: block;">Category</span>
                                    <strong style="color: #0F172A;">${p.category || ngo.sector || 'Education'}</strong>
                                </div>
                                <div>
                                    <span style="color: #64748B; font-weight: 600; font-size: 0.7rem; text-transform: uppercase; display: block;">Location</span>
                                    <strong style="color: #0F172A;">${ngo.city}, ${ngo.state}</strong>
                                </div>
                                <div>
                                    <span style="color: #64748B; font-weight: 600; font-size: 0.7rem; text-transform: uppercase; display: block;">Assigned Inspector</span>
                                    <strong style="color: #0B2347;">${inspectorName}</strong>
                                </div>
                                <div>
                                    <span style="color: #64748B; font-weight: 600; font-size: 0.7rem; text-transform: uppercase; display: block;">Inspection Status</span>
                                    <span class="badge-status-pill ${inspStatusBadgeClass}">${inspStatusLabel}</span>
                                </div>
                            </div>

                            <div style="font-size: 0.78rem; color: #64748B; margin-bottom: 16px;">
                                📅 Last Verification: <strong>${lastVerifDate}</strong>
                            </div>
                        </div>

                        <div>
                            ${actionButtonHTML}
                        </div>
                    </div>
                `;
            }).join('');
        }

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    startVideoVerificationForProject(projectId, inspectionId) {
        const store = AppStore.get();
        let prj = store.projects.find(p => p.id === projectId);
        let ngo = store.ngos.find(n => n.id === (prj ? prj.ngoId : this.selectedVcNgoId)) || store.ngos[0];
        let insp = store.inspections.find(i => (inspectionId && i.id === inspectionId) || (prj && i.projectId === prj.id));

        if (!insp) {
            insp = {
                id: `insp-${Date.now()}`,
                code: '#241',
                ngoId: ngo.id,
                projectId: prj ? prj.id : 'prj-101',
                ngoName: ngo.name,
                projectTitle: prj ? prj.title : 'Digital Classroom Initiative',
                status: 'ASSIGNED',
                target: 'Staff & Equipment',
                inspector: 'Vaishnavi Sathe',
                assignedDate: '11 Sept 2026',
                reason: 'Verify actual project activities, CCTV compliance, and staff presence on site.'
            };
            store.inspections.unshift(insp);
            AppStore.set(store);
        }

        insp.vcSessionActive = true;
        AppStore.set(store);

        this.selectedInspectionId = insp.id;
        this.selectedProjectId = prj ? prj.id : 'prj-101';
        this.selectedVcNgoId = ngo.id;

        this.showView('video-verification', { inspectionId: insp.id, projectId: this.selectedProjectId });
    }

    renderVideoVerificationRoom(inspectionId, projectId) {
        const store = AppStore.get();
        const insp = store.inspections.find(i => i.id === (inspectionId || this.selectedInspectionId)) || store.inspections[0];
        const ngo = store.ngos.find(n => n.id === insp.ngoId) || store.ngos[0];
        const prj = store.projects.find(p => p.id === (projectId || insp.projectId)) || store.projects[0];

        const rawCode = insp.code ? insp.code.replace('#', '') : '241';
        const roomCode = insp.roomId || 'RSHLMANS';

        // 1. Header Title & Subtitle
        const dispCode = document.getElementById('vcInspCodeDisplay');
        if (dispCode) dispCode.textContent = `INSPECTION #${rawCode}`;

        const ngoNameEl = document.getElementById('vcNgoName');
        if (ngoNameEl) ngoNameEl.textContent = ngo.name;

        const prjTitleEl = document.getElementById('vcProjectTitle');
        if (prjTitleEl) prjTitleEl.textContent = prj ? prj.title : insp.projectTitle;

        // 2. Info Strip Fields
        const vcInspCode = document.getElementById('vcInspCode');
        if (vcInspCode) vcInspCode.textContent = `#${rawCode}`;

        const vcTargetVal = document.getElementById('vcTargetVal');
        if (vcTargetVal) vcTargetVal.textContent = insp.target || 'Staff & Equipment';

        const inspectorName = insp.inspector ? insp.inspector.replace('Field Inspector - ', '') : 'Vaishnavi Sathe';

        const vcDetailsInspector = document.getElementById('vcDetailsInspector');
        if (vcDetailsInspector) vcDetailsInspector.textContent = inspectorName;

        const remoteInspectorName = document.getElementById('remoteInspectorName');
        if (remoteInspectorName) remoteInspectorName.textContent = inspectorName;

        const vcRoomCode = document.getElementById('vcRoomCode');
        if (vcRoomCode) vcRoomCode.textContent = roomCode;

        const vcWaitingRoomId = document.getElementById('vcWaitingRoomId');
        if (vcWaitingRoomId) vcWaitingRoomId.textContent = roomCode;

        const vcSecRoomId = document.getElementById('vcSecRoomId');
        if (vcSecRoomId) vcSecRoomId.textContent = roomCode;

        const vcReasonVal = document.getElementById('vcReasonVal');
        if (vcReasonVal) vcReasonVal.textContent = insp.reason || 'Verify actual project activities, CCTV compliance, and staff presence on site.';

        // 3. Status Badges & Connected Video Preview
        const heroBadge = document.getElementById('vcHeroStatusBadge');
        if (heroBadge) {
            heroBadge.className = 'vc-status-pill green';
            heroBadge.innerHTML = `<i data-lucide="check-circle-2"></i> INSPECTOR CONNECTED`;
        }

        const remoteBadge = document.getElementById('remoteStatusBadge');
        if (remoteBadge) {
            remoteBadge.textContent = '🟢 CONNECTED (1080p HD)';
            remoteBadge.style.color = '#10B981';
        }

        const remoteWaiting = document.getElementById('remoteWaitingScreen');
        if (remoteWaiting) remoteWaiting.style.display = 'none';

        const remoteVideo = document.getElementById('remoteCameraVideo');
        if (remoteVideo) remoteVideo.style.display = 'block';

        const btnStart = document.getElementById('btnStartVcSession');
        if (btnStart) btnStart.style.display = 'inline-flex';

        const btnEnd = document.getElementById('btnEndVcSession');
        if (btnEnd) btnEnd.style.display = 'inline-flex';

        // Log audit event
        this.logAudit('admin', 'government', 'Video verification room joined', `VC Room ${roomCode} | Inspection #${rawCode} | ${ngo.name}`);

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    toggleVcMic() {
        const btn = document.getElementById('btnToggleMic');
        if (!btn) return;
        this.vcMicMuted = !this.vcMicMuted;
        btn.classList.toggle('muted', this.vcMicMuted);
        btn.innerHTML = `<i data-lucide="${this.vcMicMuted ? 'mic-off' : 'mic'}"></i>`;
        this.showToast(this.vcMicMuted ? '🔇 Microphone Muted' : '🎙️ Microphone Unmuted');
        if (window.lucide) lucide.createIcons();
    }

    toggleVcCam() {
        const btn = document.getElementById('btnToggleCam');
        const offScreen = document.getElementById('myCamOffScreen');
        const camVideo = document.getElementById('myCameraVideo');
        if (!btn) return;

        this.vcCamOff = !this.vcCamOff;
        btn.classList.toggle('muted', this.vcCamOff);
        btn.innerHTML = `<i data-lucide="${this.vcCamOff ? 'video-off' : 'video'}"></i>`;

        if (offScreen) offScreen.style.display = this.vcCamOff ? 'flex' : 'none';
        if (camVideo) camVideo.style.display = this.vcCamOff ? 'none' : 'block';

        this.showToast(this.vcCamOff ? '📷 Camera Turned Off' : '📷 Camera Turned On');
        if (window.lucide) lucide.createIcons();
    }

    copyVcRoomId() {
        const code = document.getElementById('vcRoomCode')?.textContent || 'ROOM-001';
        if (navigator.clipboard) {
            navigator.clipboard.writeText(code);
        }
        this.showToast(`✓ Room ID "${code}" copied to clipboard!`);
    }

    copyVcJoinLink() {
        const code = document.getElementById('vcRoomCode')?.textContent || 'ROOM-001';
        const link = `${window.location.origin}${window.location.pathname}#join/${code}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(link);
        }
        this.showToast(`✓ NGO Join Link copied to clipboard!`);
    }

    saveVcNotes() {
        const input = document.getElementById('vcVerificationNotesInput');
        const notes = input ? input.value.trim() : '';
        if (!notes) {
            this.showToast('⚠️ Please enter verification notes first.');
            return;
        }

        const roomCode = document.getElementById('vcRoomCode')?.textContent || 'ROOM-001';
        this.logAudit('admin', 'government', 'Verification notes saved', `VC Room ${roomCode}: "${notes}"`);
        this.showToast('✓ Video verification notes saved successfully!');
    }

    renderProgramInsights() {
        const store = AppStore.get();
        const ngos = store.ngos || [];
        const projects = store.projects || [];
        const inspections = store.inspections || [];
        const alerts = store.alerts || [];

        // 1. CARD 1: FUNDING INSIGHTS
        let totalSanctionedLakhs = 0;
        let totalReleasedLakhs = 0;
        let totalSpentLakhs = 0;

        ngos.forEach(n => {
            const sVal = parseFloat((n.sanctioned || '0').replace(/[^0-9.]/g, ''));
            const rVal = parseFloat((n.released || '0').replace(/[^0-9.]/g, ''));
            if (sVal) totalSanctionedLakhs += sVal;
            if (rVal) totalReleasedLakhs += rVal;
        });

        projects.forEach(p => {
            const spVal = parseFloat((p.spent || '0').replace(/[^0-9.]/g, ''));
            if (spVal) totalSpentLakhs += spVal;
        });

        if (totalSanctionedLakhs === 0) totalSanctionedLakhs = 197.30;
        if (totalReleasedLakhs === 0) totalReleasedLakhs = 164.20;
        if (totalSpentLakhs === 0) totalSpentLakhs = 138.80;

        let totalBeneficiaries = 0;
        ngos.forEach(n => {
            if (n.beneficiaries) totalBeneficiaries += parseInt(n.beneficiaries, 10);
        });
        if (totalBeneficiaries === 0) totalBeneficiaries = 826;

        const activeAlertsCount = alerts.filter(a => a.status !== 'Resolved' && a.status !== 'Dismissed').length || alerts.length || 5;

        const remainingLakhs = Math.max(0, totalSanctionedLakhs - totalSpentLakhs);
        const utilPct = Math.min(100, Math.round((totalSpentLakhs / totalReleasedLakhs) * 100));

        const formatCurrency = (lakhs) => {
            if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(2)} Cr`;
            return `₹${lakhs.toFixed(2)} L`;
        };

        // Top KPI Grid Updates
        const kpiSancEl = document.getElementById('kpiFundsSanctioned');
        if (kpiSancEl) kpiSancEl.textContent = formatCurrency(totalSanctionedLakhs);

        const kpiBenEl = document.getElementById('kpiTotalBeneficiaries');
        if (kpiBenEl) kpiBenEl.textContent = totalBeneficiaries.toLocaleString();

        const kpiAlertsEl = document.getElementById('kpiAlertsCount');
        if (kpiAlertsEl) kpiAlertsEl.textContent = activeAlertsCount;

        const sancEl = document.getElementById('ovInsightSanctioned');
        if (sancEl) sancEl.textContent = formatCurrency(totalSanctionedLakhs);

        const relEl = document.getElementById('ovInsightReleased');
        if (relEl) relEl.textContent = formatCurrency(totalReleasedLakhs);

        const spentEl = document.getElementById('ovInsightSpent');
        if (spentEl) spentEl.textContent = formatCurrency(totalSpentLakhs);

        const remEl = document.getElementById('ovInsightRemaining');
        if (remEl) remEl.textContent = formatCurrency(remainingLakhs);

        const utilPctEl = document.getElementById('ovInsightUtilPct');
        if (utilPctEl) utilPctEl.textContent = `${utilPct}%`;

        const utilBarEl = document.getElementById('ovInsightUtilBar');
        if (utilBarEl) utilBarEl.style.width = `${utilPct}%`;

        // 2. CARD 2: INSPECTION INSIGHTS
        const totalInsp = inspections.length || 157;
        const assignedInsp = inspections.filter(i => i.status === 'Assigned').length || 15;
        const submittedInsp = inspections.filter(i => i.status === 'Submitted').length || 18;
        const verifiedInsp = inspections.filter(i => i.result === 'Verified' || i.govReview === 'Reviewed' || i.status === 'Verified').length || 124;
        const pendingInsp = inspections.filter(i => i.govReview === 'Pending' || i.status === 'Under Review').length || 15;
        const completionPct = Math.min(100, Math.round((verifiedInsp / totalInsp) * 100)) || 79;

        const totalInspEl = document.getElementById('ovInspTotalCount');
        if (totalInspEl) totalInspEl.textContent = totalInsp;

        const assignedInspEl = document.getElementById('ovInspAssignedCount');
        if (assignedInspEl) assignedInspEl.textContent = assignedInsp;

        const submittedInspEl = document.getElementById('ovInspSubmittedCount');
        if (submittedInspEl) submittedInspEl.textContent = submittedInsp;

        const verifiedInspEl = document.getElementById('ovInspVerifiedCount');
        if (verifiedInspEl) verifiedInspEl.textContent = verifiedInsp;

        const compPctEl = document.getElementById('ovInspCompletionPct');
        if (compPctEl) compPctEl.textContent = `${completionPct}%`;

        const compBarEl = document.getElementById('ovInspCompletionBar');
        if (compBarEl) compBarEl.style.width = `${completionPct}%`;

        // 3. CARD 3: REGIONAL PERFORMANCE
        const stateCounts = {};
        ngos.forEach(ngo => {
            const st = ngo.state || 'Other';
            const ngoProjs = projects.filter(p => p.ngoId === ngo.id).length || 1;
            stateCounts[st] = (stateCounts[st] || 0) + ngoProjs;
        });

        if (Object.keys(stateCounts).length === 0) {
            stateCounts['Maharashtra'] = 7;
            stateCounts['Karnataka'] = 4;
            stateCounts['Delhi'] = 3;
            stateCounts['Tamil Nadu'] = 2;
            stateCounts['Gujarat'] = 2;
            stateCounts['Rajasthan'] = 2;
        }

        const sortedStates = Object.entries(stateCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const maxProjects = Math.max(...sortedStates.map(s => s[1]), 1);

        const regionalContainer = document.getElementById('ovRegionalBarsContainer');
        if (regionalContainer) {
            regionalContainer.innerHTML = sortedStates.map(([stateName, count]) => {
                const pct = Math.min(100, Math.round((count / maxProjects) * 100));
                return `
                    <div class="regional-bar-item">
                        <span class="reg-state-name" title="${stateName}">${stateName}</span>
                        <div class="reg-bar-track">
                            <div class="reg-bar-fill" style="width: ${pct}%;"></div>
                        </div>
                        <span class="reg-count-badge">${count} ${count === 1 ? 'Project' : 'Projects'}</span>
                    </div>
                `;
            }).join('');
        }

        // 4. CARD 4: RISK & COMPLIANCE
        const criticalCount = alerts.filter(a => a.severity === 'Critical').length || 42;
        const highCount = alerts.filter(a => a.severity === 'High').length || 38;
        const mediumCount = alerts.filter(a => a.severity === 'Medium').length || 44;
        const lowCount = alerts.filter(a => a.severity === 'Low').length || 12;

        const openAlerts = alerts.filter(a => a.status !== 'Resolved' && a.status !== 'Dismissed').length || 128;
        const totalAlerts = alerts.length || 136;
        const resolvedAlerts = alerts.filter(a => a.status === 'Resolved').length || 8;
        const resolutionRate = Math.round((resolvedAlerts / totalAlerts) * 100) || 6;

        const critEl = document.getElementById('ovRiskCritical');
        if (critEl) critEl.textContent = criticalCount;

        const highEl = document.getElementById('ovRiskHigh');
        if (highEl) highEl.textContent = highCount;

        const medEl = document.getElementById('ovRiskMedium');
        if (medEl) medEl.textContent = mediumCount;

        const lowEl = document.getElementById('ovRiskLow');
        if (lowEl) lowEl.textContent = lowCount;

        const openEl = document.getElementById('ovRiskOpenAlerts');
        if (openEl) openEl.textContent = openAlerts;

        const rateEl = document.getElementById('ovRiskResolutionRate');
        if (rateEl) rateEl.textContent = `${resolutionRate}%`;
    }

    renderRecentActivity() {
        const store = AppStore.get();
        const logs = store.auditTrail || [];
        const activityContainer = document.getElementById('ovRecentActivityContainer');
        if (!activityContainer) return;

        const getActivityIcon = (actionStr) => {
            const act = (actionStr || '').toLowerCase();
            if (act.includes('ngo') || act.includes('registered') || act.includes('organization')) {
                return { icon: 'building-2', color: 'blue', badge: 'info' };
            }
            if (act.includes('project') || act.includes('created')) {
                return { icon: 'folder-kanban', color: 'navy', badge: 'info' };
            }
            if (act.includes('funding') || act.includes('spent') || act.includes('expense')) {
                return { icon: 'indian-rupee', color: 'green', badge: 'completed' };
            }
            if (act.includes('inspection') && (act.includes('created') || act.includes('assigned'))) {
                return { icon: 'user-check', color: 'orange', badge: 'pending' };
            }
            if (act.includes('inspection') && (act.includes('submitted') || act.includes('reviewed') || act.includes('verified'))) {
                return { icon: 'clipboard-check', color: 'green', badge: 'completed' };
            }
            if (act.includes('alert') && (act.includes('generated') || act.includes('anomaly'))) {
                return { icon: 'alert-triangle', color: 'red', badge: 'alert' };
            }
            if (act.includes('alert') && act.includes('resolved')) {
                return { icon: 'shield-check', color: 'green', badge: 'completed' };
            }
            if (act.includes('document') || act.includes('upload')) {
                return { icon: 'file-text', color: 'blue', badge: 'info' };
            }
            if (act.includes('beneficiary')) {
                return { icon: 'users', color: 'purple', badge: 'info' };
            }
            return { icon: 'activity', color: 'navy', badge: 'info' };
        };

        const displayLogs = logs.slice(0, 6);

        if (displayLogs.length === 0) {
            activityContainer.innerHTML = `<div style="padding: 20px; text-align: center; color: #64748B;">No recent activity logs recorded.</div>`;
            return;
        }

        activityContainer.innerHTML = displayLogs.map(log => {
            const meta = getActivityIcon(log.action);
            return `
                <div class="activity-feed-item">
                    <div class="act-icon-wrap ${meta.color}">
                        <i data-lucide="${meta.icon}"></i>
                    </div>
                    <div class="act-content-wrap">
                        <div class="act-title-row">
                            <span class="act-description">${log.action}</span>
                            <span class="act-timestamp">${log.timestamp}</span>
                        </div>
                        <div class="act-entity-row">
                            <span class="act-entity-name">${log.entity || 'Drishti360 System'}</span>
                            <span class="act-badge ${meta.badge}">${(log.role || 'system').toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
    }

    // AUDIT TRAIL RENDERER (Reference Screenshot 2)
    renderAuditTrail() {
        const store = AppStore.get();
        const tbody = document.getElementById('auditTrailTableBody');
        if (!tbody) return;

        tbody.innerHTML = store.auditTrail.map(log => `
            <tr>
                <td><strong>${log.user}</strong></td>
                <td><span class="status-badge status-${log.role === 'government' ? 'verified' : (log.role === 'inspector' ? 'pending' : 'rejected')}">${log.role}</span></td>
                <td><strong>${log.action}</strong></td>
                <td>${log.entity}</td>
                <td>${log.timestamp}</td>
            </tr>
        `).join('');
    }

    // Other Renderers
    renderNgoRegistry() {
        const store = AppStore.get();
        const tbody = document.getElementById('ngoRegistryTableBody');
        if (!tbody) return;

        const searchVal = (document.getElementById('ngoSearchInput')?.value || '').toLowerCase();
        const sectorVal = document.getElementById('ngoSectorFilter')?.value || '';
        const statusVal = document.getElementById('ngoStatusFilter')?.value || '';

        const filtered = store.ngos.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchVal) ||
                                  item.city.toLowerCase().includes(searchVal) ||
                                  item.sector.toLowerCase().includes(searchVal) ||
                                  item.regNo.toLowerCase().includes(searchVal);
            const matchesSector = sectorVal === '' || item.sector === sectorVal;
            const matchesStatus = statusVal === '' || item.status === statusVal;

            return matchesSearch && matchesSector && matchesStatus;
        });

        tbody.innerHTML = filtered.map(item => `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td>${item.city}</td>
                <td>${item.state}</td>
                <td>${item.sector}</td>
                <td class="bold-code">${item.regNo}</td>
                <td><span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></td>
                <td>
                    <button class="btn-view-link" onclick="app.showView('ngo-profile', { ngoId: '${item.id}' })">
                        View Profile &rarr;
                    </button>
                </td>
            </tr>
        `).join('');

        const kpiCount = document.getElementById('kpiNgosCount');
        if (kpiCount) kpiCount.textContent = store.ngos.length;
    }

    renderNgoProfile(ngoId) {
        const store = AppStore.get();
        const ngo = store.ngos.find(n => n.id === ngoId) || store.ngos[0];
        if (!ngo) return;

        this.selectedNgoId = ngo.id;

        const breadcrumbName = document.getElementById('ngoProfileBreadcrumbName');
        if (breadcrumbName) breadcrumbName.textContent = ngo.name;

        const title = document.getElementById('ngoProfileTitle');
        if (title) title.textContent = ngo.name;

        const meta = document.getElementById('ngoProfileMeta');
        if (meta) meta.innerHTML = `<i data-lucide="map-pin"></i> ${ngo.city}, ${ngo.state} • ${ngo.sector}`;

        const statusBadges = document.querySelectorAll('#ngoProfileStatus, #ngoProfileStatusBadge');
        statusBadges.forEach(badge => {
            const isVerified = (ngo.status || '').toLowerCase() === 'verified';
            badge.className = `status-verified-badge ${isVerified ? '' : 'status-pending-badge'}`;
            badge.innerHTML = `<i data-lucide="${isVerified ? 'check-circle-2' : 'clock'}"></i> ${ngo.status || 'Verified'}`;
        });

        const regNo = document.getElementById('ngoProfileRegNo');
        if (regNo) regNo.textContent = ngo.regNo || 'KA-345-shq';

        const sector = document.getElementById('ngoProfileSector');
        if (sector) sector.textContent = ngo.sector || 'Healthcare';

        const cityState = document.getElementById('ngoProfileCityState');
        if (cityState) cityState.textContent = `${ngo.city}, ${ngo.state}`;

        const email = document.getElementById('ngoProfileEmail');
        if (email) email.textContent = ngo.email || 'sahyogfoundation@gmail.com';

        const phone = document.getElementById('ngoProfilePhone');
        if (phone) phone.textContent = ngo.phone || '8956436758';

        const ngoProjects = store.projects.filter(p => p.ngoId === ngo.id);

        const activeProjectsEl = document.getElementById('ngoFinActiveProjects');
        if (activeProjectsEl) activeProjectsEl.textContent = ngoProjects.length;

        const beneficiariesEl = document.getElementById('ngoFinBeneficiaries');
        if (beneficiariesEl) beneficiariesEl.textContent = ngo.beneficiaries || 76;

        const sanctionedEl = document.getElementById('ngoFinSanctioned');
        if (sanctionedEl) sanctionedEl.textContent = ngo.sanctioned || '₹15.00 L';

        const releasedEl = document.getElementById('ngoFinReleased');
        if (releasedEl) releasedEl.textContent = ngo.released || '₹10.00 L';

        // Calculate dynamic funding utilization
        const releasedStr = ngo.released || '₹10.00 L';
        const releasedVal = parseFloat(releasedStr.replace(/[^0-9.]/g, '')) || 10.0;
        
        let totalSpent = 0;
        ngoProjects.forEach(p => {
            const spentNum = parseFloat((p.spent || '0').replace(/[^0-9.]/g, ''));
            if (spentNum) totalSpent += spentNum;
        });
        if (totalSpent === 0) totalSpent = Math.min(releasedVal * 0.966, 16.14);

        const pctUtilized = Math.min(Math.round((totalSpent / releasedVal) * 100), 100);
        
        const utilTextEl = document.getElementById('ngoUtilizedText');
        if (utilTextEl) utilTextEl.textContent = `₹${totalSpent.toFixed(2)} L / ${releasedStr} (${pctUtilized}%)`;

        const utilBarEl = document.getElementById('ngoUtilizedBar');
        if (utilBarEl) utilBarEl.style.width = `${pctUtilized}%`;

        // Render Projects Cards or Empty State
        const grid = document.getElementById('ngoProjectsGrid');
        if (grid) {
            if (ngoProjects.length === 0) {
                grid.innerHTML = `
                    <div class="empty-projects-card">
                        <div class="empty-icon-wrap">
                            <i data-lucide="folder-open"></i>
                        </div>
                        <h4 class="empty-title">No projects added yet</h4>
                        <p class="empty-desc">Add projects to start tracking implementation, funding, and beneficiaries.</p>
                        <button class="btn-navy" onclick="app.openModal('addProjectModal')">
                            <i data-lucide="plus"></i> Add Project
                        </button>
                    </div>
                `;
            } else {
                grid.innerHTML = ngoProjects.map(p => {
                    const statusClass = (p.status === 'Active') ? 'active' : (p.status === 'Completed') ? 'completed' : 'pending';
                    const progress = p.progressPct || 78;
                    return `
                        <div class="project-card">
                            <div class="project-card-header">
                                <div>
                                    <h4 class="project-card-title">${p.title}</h4>
                                    <p class="project-card-sub">${p.category} • ${ngo.city}, ${ngo.state}</p>
                                </div>
                                <span class="status-badge status-${statusClass}">${p.status}</span>
                            </div>
                            <div class="project-card-body">
                                <div class="proj-card-metric">
                                    <span class="p-lbl">Beneficiaries</span>
                                    <span class="p-val">${p.beneficiaries || 120}</span>
                                </div>
                                <div class="proj-card-metric">
                                    <span class="p-lbl">Budget (Sanctioned)</span>
                                    <span class="p-val">${p.sanctioned || '₹5.20 L'}</span>
                                </div>
                            </div>
                            <div class="project-card-progress">
                                <div class="proj-prog-top">
                                    <span class="prog-lbl">Progress</span>
                                    <span class="prog-val">${progress}%</span>
                                </div>
                                <div class="progress-bar-bg">
                                    <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                                </div>
                            </div>
                            <div class="project-card-footer">
                                <button class="btn-view-link" onclick="app.showView('project-details', { projectId: '${p.id}' })">
                                    View Details &rarr;
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        if (window.lucide) lucide.createIcons();
    }

    renderProjectDetails(projectId, tabId = 'tab-overview') {
        const store = AppStore.get();
        const project = store.projects.find(p => p.id === projectId) || store.projects[0];
        if (!project) return;

        this.selectedProjectId = project.id;
        this.activeTabId = tabId;

        const parentNgo = store.ngos.find(n => n.id === project.ngoId) || { name: 'Sahyog Foundation', id: 'ngo-1', city: 'Pune', state: 'Maharashtra' };

        const ngoLink = document.getElementById('projBreadcrumbNgoLink');
        if (ngoLink) {
            ngoLink.textContent = parentNgo.name;
            ngoLink.onclick = (e) => {
                e.preventDefault();
                this.showView('ngo-profile', { ngoId: parentNgo.id });
            };
        }
        const prjBreadTitle = document.getElementById('projBreadcrumbTitle');
        if (prjBreadTitle) prjBreadTitle.textContent = project.title;

        const detailTitle = document.getElementById('projectDetailTitle');
        if (detailTitle) detailTitle.textContent = project.title;

        const detailMeta = document.getElementById('projectDetailMeta');
        if (detailMeta) detailMeta.innerHTML = `<i data-lucide="map-pin"></i> ${project.category} • ${parentNgo.city}, ${parentNgo.state}`;

        // Dynamic Calculations
        const sanctionedStr = project.sanctioned || '₹15.00 L';
        const releasedStr = project.released || '₹12.00 L';
        const spentStr = project.spent || '₹10.20 L';

        const sanctionedVal = parseFloat(sanctionedStr.replace(/[^0-9.]/g, '')) || 15.0;
        const releasedVal = parseFloat(releasedStr.replace(/[^0-9.]/g, '')) || 12.0;
        const spentVal = parseFloat(spentStr.replace(/[^0-9.]/g, '')) || 10.2;

        const remainingVal = Math.max(0, releasedVal - spentVal);
        const remainingFormatted = (remainingVal < 1.0) 
            ? `₹${Math.round(remainingVal * 100000).toLocaleString('en-IN')}` 
            : `₹${remainingVal.toFixed(2)} L`;

        const utilizationPct = Math.min(Math.round((spentVal / releasedVal) * 100), 100);

        const kpiSanctioned = document.getElementById('prjKpiSanctioned');
        if (kpiSanctioned) kpiSanctioned.textContent = sanctionedStr;

        const kpiReleased = document.getElementById('prjKpiReleased');
        if (kpiReleased) kpiReleased.textContent = releasedStr;

        const kpiSpent = document.getElementById('prjKpiSpent');
        if (kpiSpent) kpiSpent.textContent = spentStr;

        const kpiRemaining = document.getElementById('prjKpiRemaining');
        if (kpiRemaining) kpiRemaining.textContent = project.remaining || remainingFormatted;

        document.querySelectorAll('.tab-item').forEach(t => {
            const isTabActive = t.getAttribute('data-tab') === tabId;
            t.classList.toggle('active', isTabActive);
        });

        document.querySelectorAll('.project-tab-content').forEach(c => {
            const isContentActive = (c.id === tabId);
            c.classList.toggle('active', isContentActive);
            c.style.display = isContentActive ? 'block' : 'none';
        });

        if (window.history && window.history.replaceState) {
            const cleanTab = tabId.replace('tab-', '');
            window.history.replaceState(null, '', `#projects/${project.id}?tab=${cleanTab}`);
        }

        this.renderTabData(tabId, project, parentNgo, { sanctionedVal, releasedVal, spentVal, utilizationPct, remainingFormatted });
    }

    renderTabData(tabId, project, parentNgo, calcData = {}) {
        const store = AppStore.get();
        const { sanctionedVal = 15.0, releasedVal = 12.0, spentVal = 10.2, utilizationPct = 85, remainingFormatted = '₹1,80,000' } = calcData;

        if (tabId === 'tab-overview') {
            const progressPct = project.progressPct || 65;
            const beneficiaryCount = store.beneficiaries.filter(b => b.projectId === project.id).length || 33;
            const alertsCount = store.alerts.filter(a => a.projectId === project.id).length || project.openAlertsCount || 136;
            const inspectionsCount = store.inspections.filter(i => i.projectId === project.id).length || 157;

            const desc = document.getElementById('overviewDescription');
            if (desc) desc.textContent = project.description || `${project.title} project created for ${project.category.toLowerCase()} development in ${parentNgo.city}, ${parentNgo.state}.`;

            const ovStatusBadges = document.querySelectorAll('#overviewStatusBadge, #ovInfoStatus, #headerProjectStatusBadge');
            ovStatusBadges.forEach(badge => {
                const isActive = project.status === 'Active';
                badge.className = `status-verified-badge ${isActive ? '' : 'status-pending-badge'}`;
                badge.innerHTML = `<i data-lucide="${isActive ? 'check-circle-2' : 'clock'}"></i> ${project.status || 'Active'}`;
            });

            const ovProgVal = document.getElementById('ovProgressVal');
            if (ovProgVal) ovProgVal.textContent = `${progressPct}%`;

            const ovProgBar = document.getElementById('ovProgressBar');
            if (ovProgBar) ovProgBar.style.width = `${progressPct}%`;

            const ovBenVal = document.getElementById('ovBeneficiariesVal');
            if (ovBenVal) ovBenVal.textContent = beneficiaryCount;

            const ovUtilVal = document.getElementById('ovUtilizationVal');
            if (ovUtilVal) ovUtilVal.textContent = `${utilizationPct}%`;

            const ovAlertsVal = document.getElementById('ovAlertsVal');
            if (ovAlertsVal) ovAlertsVal.textContent = alertsCount;

            const ovPrjId = document.getElementById('ovPrjId');
            if (ovPrjId) ovPrjId.textContent = project.prjCode || 'PRJ-001';

            const ovCat = document.getElementById('ovCategory');
            if (ovCat) ovCat.textContent = project.category;

            const ovStart = document.getElementById('ovStartDate');
            if (ovStart) ovStart.textContent = project.startDate || '02 Mar 2026';

            const ovBenRecords = document.getElementById('ovBeneficiaryRecords');
            if (ovBenRecords) ovBenRecords.textContent = beneficiaryCount;

            const ovFinSanc = document.getElementById('ovFinSanctioned');
            if (ovFinSanc) ovFinSanc.textContent = project.sanctioned || '₹15.00 L';

            const ovFinRel = document.getElementById('ovFinReleased');
            if (ovFinRel) ovFinRel.textContent = project.released || '₹12.00 L';

            const ovFinSp = document.getElementById('ovFinSpent');
            if (ovFinSp) ovFinSp.textContent = project.spent || '₹10.20 L';

            const ovFinRem = document.getElementById('ovFinRemaining');
            if (ovFinRem) ovFinRem.textContent = project.remaining || remainingFormatted;

            const ovFinPct = document.getElementById('ovFinUtilPct');
            if (ovFinPct) ovFinPct.textContent = `${utilizationPct}%`;

            const ovFinBar = document.getElementById('ovFinUtilBar');
            if (ovFinBar) ovFinBar.style.width = `${utilizationPct}%`;

            const monProgText = document.getElementById('monProgText');
            if (monProgText) monProgText.textContent = `${progressPct}%`;

            const monInspCount = document.getElementById('monInspCount');
            if (monInspCount) monInspCount.textContent = inspectionsCount;

            const monAlertsCount = document.getElementById('monAlertsCount');
            if (monAlertsCount) monAlertsCount.textContent = alertsCount;

            this.initProjectOverviewCharts(sanctionedVal, releasedVal, spentVal, utilizationPct);
        }
        else if (tabId === 'tab-funding') {
            const fundingList = store.funding.filter(f => f.projectId === project.id);
            const listToRender = fundingList.length > 0 ? fundingList : store.funding;
            
            const tab2Sanc = document.getElementById('tab2Sanctioned');
            if (tab2Sanc) tab2Sanc.textContent = project.sanctioned || '₹15.00 L';
            const tab2Rel = document.getElementById('tab2Released');
            if (tab2Rel) tab2Rel.textContent = project.released || '₹12.00 L';
            const tab2Sp = document.getElementById('tab2Spent');
            if (tab2Sp) tab2Sp.textContent = project.spent || '₹10.20 L';
            const tab2Rem = document.getElementById('tab2Remaining');
            if (tab2Rem) tab2Rem.textContent = project.remaining || remainingFormatted;

            const tbody = document.getElementById('fundingTableBody');
            if (tbody) {
                tbody.innerHTML = listToRender.map(f => {
                    const isPending = (f.status || '').toLowerCase().includes('pending');
                    const badgeClass = isPending ? 'status-pending-badge' : 'status-verified-badge';
                    const iconName = isPending ? 'clock' : 'check-circle-2';
                    const statusText = f.status === 'Pending Completion' ? 'Pending' : f.status;
                    return `
                    <tr>
                        <td><strong>${f.installment}</strong></td>
                        <td class="bold-navy">${f.amount}</td>
                        <td>${f.date}</td>
                        <td class="bold-code">${f.orderNo}</td>
                        <td><span class="${badgeClass}"><i data-lucide="${iconName}"></i> ${statusText}</span></td>
                        <td><button class="btn-view-link" onclick="showToast('Viewing Sanction Order ${f.orderNo}')"><i data-lucide="file-text"></i> View Order</button></td>
                    </tr>
                `;
                }).join('');
            }
        }
        else if (tabId === 'tab-expenses') {
            const expList = store.expenses.filter(e => e.projectId === project.id);
            const listToRender = expList.length > 0 ? expList : store.expenses;

            const tab3Sp = document.getElementById('tab3Spent');
            if (tab3Sp) tab3Sp.textContent = project.spent || '₹10.20 L';
            const tab3Txn = document.getElementById('tab3TxnCount');
            if (tab3Txn) tab3Txn.textContent = listToRender.length;

            const tbody = document.getElementById('expensesTableBody');
            if (tbody) {
                tbody.innerHTML = listToRender.map(e => `
                    <tr>
                        <td class="bold-code">${e.txnId}</td>
                        <td><strong>${e.purpose}</strong></td>
                        <td class="bold-navy">${e.amount}</td>
                        <td>${e.vendor}</td>
                        <td>${e.date}</td>
                        <td><span class="status-verified-badge"><i data-lucide="shield-check"></i> ${e.status}</span></td>
                    </tr>
                `).join('');
            }
        }
        else if (tabId === 'tab-documents') {
            const docList = store.documents.filter(d => d.projectId === project.id);
            const listToRender = docList.length > 0 ? docList : store.documents;
            const container = document.getElementById('documentsGridContainer');
            if (container) {
                container.innerHTML = listToRender.map(d => `
                    <div class="doc-card">
                        <div class="doc-top">
                            <div class="doc-icon"><i data-lucide="file-text"></i></div>
                            <div class="doc-info">
                                <span class="doc-tag">${d.type}</span>
                                <h4 class="doc-title">${d.name}</h4>
                            </div>
                        </div>
                        <div class="doc-meta">
                            <span><i data-lucide="calendar"></i> ${d.uploaded}</span>
                            <span><i data-lucide="hard-drive"></i> ${d.size || '2.4 MB'}</span>
                            <span class="status-verified-badge"><i data-lucide="check"></i> Verified</span>
                        </div>
                        <div class="doc-actions">
                            <button class="btn-doc-view" onclick="showToast('Viewing document ${d.name}')"><i data-lucide="eye"></i> View</button>
                            <button class="btn-doc-download" onclick="showToast('Downloading document ${d.name}')"><i data-lucide="download"></i> Download</button>
                        </div>
                    </div>
                `).join('');
            }
        }
        else if (tabId === 'tab-beneficiaries') {
            const benList = store.beneficiaries.filter(b => b.projectId === project.id);
            const listToRender = benList.length > 0 ? benList : store.beneficiaries;
            const benTotalCount = document.getElementById('benTotalCount');
            if (benTotalCount) benTotalCount.textContent = project.beneficiariesCount || 145;

            const tbody = document.getElementById('beneficiariesTableBody');
            if (tbody) {
                tbody.innerHTML = listToRender.map(b => `
                    <tr>
                        <td><strong>${b.name}</strong></td>
                        <td>${b.age} yrs</td>
                        <td><span class="g-pill ${b.gender.toLowerCase()}">${b.gender}</span></td>
                        <td>${b.service}</td>
                        <td>${b.date}</td>
                    </tr>
                `).join('');
            }
        }
        else if (tabId === 'tab-progress') {
            const progressPct = project.progressPct || 65;
            const progTabPct = document.getElementById('progTabPct');
            if (progTabPct) progTabPct.textContent = `${progressPct}%`;

            const progTabFill = document.getElementById('progTabFill');
            if (progTabFill) progTabFill.style.width = `${progressPct}%`;
        }
        else if (tabId === 'tab-cctv') {
            const cctvTitle = document.getElementById('cctvProjectTitle');
            if (cctvTitle) cctvTitle.textContent = project.title;

            const now = new Date();
            const timeStr = `${now.getDate()} Sep ${now.getFullYear()} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
            const t1 = document.getElementById('cctvTimeCam1');
            if (t1) t1.textContent = timeStr;
            const t2 = document.getElementById('cctvTimeCam2');
            if (t2) t2.textContent = timeStr;

            setTimeout(() => this.initCctvOccupancyChart(), 50);
        }
        else if (tabId === 'tab-alerts') {
            const alertList = store.alerts.filter(a => a.projectId === project.id);
            const listToRender = alertList.length > 0 ? alertList : store.alerts;

            const tab8Tot = document.getElementById('tab8TotalAlerts');
            if (tab8Tot) tab8Tot.textContent = listToRender.length;
            const tab8Crit = document.getElementById('tab8CriticalAlerts');
            if (tab8Crit) tab8Crit.textContent = listToRender.filter(a => a.severity === 'Critical' || a.severity === 'High').length;
            const tab8Rev = document.getElementById('tab8ReviewAlerts');
            if (tab8Rev) tab8Rev.textContent = listToRender.filter(a => a.status === 'Under Review' || a.status === 'New').length;

            const tbody = document.getElementById('projectAlertsTableBody');
            if (tbody) {
                tbody.innerHTML = listToRender.map(a => `
                    <tr>
                        <td><strong>${a.type}</strong></td>
                        <td><span class="status-badge status-${a.severity === 'High' || a.severity === 'Critical' ? 'rejected' : 'pending'}">${a.severity}</span></td>
                        <td>${a.reason}</td>
                        <td><span class="status-badge status-pending">${a.status}</span></td>
                        <td><button class="btn-view-link" onclick="app.openAlertModal('${a.id}')"><i data-lucide="settings"></i> Manage</button></td>
                    </tr>
                `).join('');
            }
        }
        else if (tabId === 'tab-inspections') {
            const inspList = store.inspections.filter(i => i.projectId === project.id);
            const listToRender = inspList.length > 0 ? inspList : store.inspections;

            const tab9Tot = document.getElementById('tab9TotalInsp');
            if (tab9Tot) tab9Tot.textContent = listToRender.length;

            const tbody = document.getElementById('projectInspectionsTableBody');
            if (tbody) {
                tbody.innerHTML = listToRender.map(i => `
                    <tr>
                        <td class="bold-code">${i.code}</td>
                        <td>${i.inspector || 'Field Inspector'}</td>
                        <td><span class="status-badge status-${i.status === 'Submitted' ? 'verified' : 'pending'}">${i.status}</span></td>
                        <td>${i.result !== '—' ? `<span class="status-badge status-${i.result === 'Verified' ? 'verified' : 'rejected'}">${i.result}</span>` : '—'}</td>
                        <td><span class="status-badge status-pending">${i.govReview}</span></td>
                        <td>${i.submittedDate !== '—' ? i.submittedDate : i.assignedDate}</td>
                        <td><button class="btn-view-link" onclick="app.showView('inspection-details', { inspectionId: '${i.id}' })"><i data-lucide="eye"></i> View</button></td>
                    </tr>
                `).join('');
            }
        }

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    renderAnalyticsPage() {
        const period = document.getElementById('analyticsTimePeriodFilter')?.value || '30d';

        const analyticsData = {
            '7d': {
                avgInspTime: '16.2 hrs',
                avgReviewTime: '4.8 hrs',
                aiAccuracy: '94.1%',
                cctvUptime: '98.2%',
                complianceRate: '93.4%',
                improvement: '18%',
                stage1: '6 hrs',
                stage2: '11 hrs',
                stage3: '4 hrs',
                turnaroundLabels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                turnaroundData: [21.5, 19.8, 18.2, 17.5, 16.8, 16.5, 16.2],
                riskCounts: [10, 6, 4, 3, 2],
                riskTable: [
                    { type: 'CCTV Anomaly', count: 10, time: '16 min', cls: 'red' },
                    { type: 'Attendance Issue', count: 6, time: '15 min', cls: 'amber' },
                    { type: 'Equipment Mismatch', count: 4, time: '18 min', cls: 'amber' },
                    { type: 'Geo-tagging Mismatch', count: 3, time: '14 min', cls: 'blue' },
                    { type: 'Documentation Issue', count: 2, time: '17 min', cls: 'blue' }
                ],
                aiTotal: 84, aiConfirmed: 80, aiFalsePos: 3, aiFalseNeg: 1,
                cctvUptimeText: '98.2%', cctvActive: 48, cctvOffline: 1, cctvAttention: 1,
                cctvHealthRows: [
                    { name: 'CAM-01 (Bengaluru Hub)', uptime: '99.8%', events: 12, cls: 'green' },
                    { name: 'CAM-02 (Mumbai Clinic)', uptime: '98.5%', events: 8, cls: 'green' },
                    { name: 'CAM-03 (Pune Center)', uptime: '94.2%', events: 4, cls: 'amber' },
                    { name: 'CAM-04 (Mysuru Outreach)', uptime: '99.1%', events: 6, cls: 'green' }
                ],
                cctvComp: 96, gpsComp: 98, docComp: 91, equipComp: 89, benComp: 94,
                att1: { title: 'Equipment Verification (89%)', desc: 'Delay in serial number asset verification by field inspectors in rural health centers.' },
                att2: { title: 'Documentation (91%)', desc: 'Incomplete GST invoice uploads for grant tranche disbursements.' }
            },
            '30d': {
                avgInspTime: '18.4 hrs',
                avgReviewTime: '6.2 hrs',
                aiAccuracy: '92.8%',
                cctvUptime: '97.4%',
                complianceRate: '91.6%',
                improvement: '14%',
                stage1: '8 hrs',
                stage2: '14 hrs',
                stage3: '6 hrs',
                turnaroundLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                turnaroundData: [22.4, 20.8, 19.1, 18.4],
                riskCounts: [32, 21, 16, 12, 9],
                riskTable: [
                    { type: 'CCTV Anomaly', count: 32, time: '18 min', cls: 'red' },
                    { type: 'Attendance Issue', count: 21, time: '16 min', cls: 'amber' },
                    { type: 'Equipment Mismatch', count: 16, time: '19 min', cls: 'amber' },
                    { type: 'Geo-tagging Mismatch', count: 12, time: '15 min', cls: 'blue' },
                    { type: 'Documentation Issue', count: 9, time: '17 min', cls: 'blue' }
                ],
                aiTotal: 342, aiConfirmed: 317, aiFalsePos: 18, aiFalseNeg: 7,
                cctvUptimeText: '97.4%', cctvActive: 48, cctvOffline: 3, cctvAttention: 2,
                cctvHealthRows: [
                    { name: 'CAM-01 (Bengaluru Hub)', uptime: '99.2%', events: 42, cls: 'green' },
                    { name: 'CAM-02 (Mumbai Clinic)', uptime: '96.8%', events: 31, cls: 'green' },
                    { name: 'CAM-03 (Pune Center)', uptime: '91.4%', events: 18, cls: 'amber' },
                    { name: 'CAM-04 (Mysuru Outreach)', uptime: '98.1%', events: 24, cls: 'green' }
                ],
                cctvComp: 94, gpsComp: 97, docComp: 88, equipComp: 86, benComp: 91,
                att1: { title: 'Equipment Verification (86%)', desc: 'Delay in serial number asset verification by field inspectors in rural health centers.' },
                att2: { title: 'Documentation (88%)', desc: 'Incomplete GST invoice uploads for grant tranche disbursements.' }
            },
            '3m': {
                avgInspTime: '20.1 hrs',
                avgReviewTime: '7.5 hrs',
                aiAccuracy: '91.5%',
                cctvUptime: '96.8%',
                complianceRate: '90.2%',
                improvement: '11%',
                stage1: '9 hrs',
                stage2: '16 hrs',
                stage3: '7 hrs',
                turnaroundLabels: ['Jul 2026', 'Aug 2026', 'Sept 2026'],
                turnaroundData: [24.1, 22.0, 20.1],
                riskCounts: [88, 62, 45, 31, 22],
                riskTable: [
                    { type: 'CCTV Anomaly', count: 88, time: '19 min', cls: 'red' },
                    { type: 'Attendance Issue', count: 62, time: '17 min', cls: 'amber' },
                    { type: 'Equipment Mismatch', count: 45, time: '20 min', cls: 'amber' },
                    { type: 'Geo-tagging Mismatch', count: 31, time: '16 min', cls: 'blue' },
                    { type: 'Documentation Issue', count: 22, time: '18 min', cls: 'blue' }
                ],
                aiTotal: 980, aiConfirmed: 896, aiFalsePos: 54, aiFalseNeg: 30,
                cctvUptimeText: '96.8%', cctvActive: 48, cctvOffline: 4, cctvAttention: 3,
                cctvHealthRows: [
                    { name: 'CAM-01 (Bengaluru Hub)', uptime: '98.5%', events: 112, cls: 'green' },
                    { name: 'CAM-02 (Mumbai Clinic)', uptime: '95.4%', events: 88, cls: 'green' },
                    { name: 'CAM-03 (Pune Center)', uptime: '89.8%', events: 54, cls: 'amber' },
                    { name: 'CAM-04 (Mysuru Outreach)', uptime: '97.2%', events: 72, cls: 'green' }
                ],
                cctvComp: 92, gpsComp: 95, docComp: 86, equipComp: 84, benComp: 89,
                att1: { title: 'Equipment Verification (84%)', desc: 'Delay in serial number asset verification by field inspectors in rural health centers.' },
                att2: { title: 'Documentation (86%)', desc: 'Incomplete GST invoice uploads for grant tranche disbursements.' }
            },
            '6m': {
                avgInspTime: '22.5 hrs',
                avgReviewTime: '8.9 hrs',
                aiAccuracy: '90.2%',
                cctvUptime: '95.9%',
                complianceRate: '89.1%',
                improvement: '8%',
                stage1: '10 hrs',
                stage2: '18 hrs',
                stage3: '8 hrs',
                turnaroundLabels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                turnaroundData: [26.8, 25.2, 24.0, 23.1, 22.8, 22.5],
                riskCounts: [164, 115, 82, 58, 41],
                riskTable: [
                    { type: 'CCTV Anomaly', count: 164, time: '20 min', cls: 'red' },
                    { type: 'Attendance Issue', count: 115, time: '18 min', cls: 'amber' },
                    { type: 'Equipment Mismatch', count: 82, time: '21 min', cls: 'amber' },
                    { type: 'Geo-tagging Mismatch', count: 58, time: '17 min', cls: 'blue' },
                    { type: 'Documentation Issue', count: 41, time: '19 min', cls: 'blue' }
                ],
                aiTotal: 1840, aiConfirmed: 1660, aiFalsePos: 112, aiFalseNeg: 68,
                cctvUptimeText: '95.9%', cctvActive: 48, cctvOffline: 5, cctvAttention: 4,
                cctvHealthRows: [
                    { name: 'CAM-01 (Bengaluru Hub)', uptime: '97.8%', events: 210, cls: 'green' },
                    { name: 'CAM-02 (Mumbai Clinic)', uptime: '94.1%', events: 162, cls: 'amber' },
                    { name: 'CAM-03 (Pune Center)', uptime: '88.5%', events: 104, cls: 'amber' },
                    { name: 'CAM-04 (Mysuru Outreach)', uptime: '96.5%', events: 135, cls: 'green' }
                ],
                cctvComp: 90, gpsComp: 94, docComp: 85, equipComp: 82, benComp: 87,
                att1: { title: 'Equipment Verification (82%)', desc: 'Delay in serial number asset verification by field inspectors in rural health centers.' },
                att2: { title: 'Documentation (85%)', desc: 'Incomplete GST invoice uploads for grant tranche disbursements.' }
            },
            'year': {
                avgInspTime: '24.0 hrs',
                avgReviewTime: '9.4 hrs',
                aiAccuracy: '89.4%',
                cctvUptime: '95.1%',
                complianceRate: '88.5%',
                improvement: '6%',
                stage1: '11 hrs',
                stage2: '20 hrs',
                stage3: '9 hrs',
                turnaroundLabels: ['Q1 2026', 'Q2 2026', 'Q3 2026'],
                turnaroundData: [27.5, 25.0, 24.0],
                riskCounts: [310, 210, 148, 105, 76],
                riskTable: [
                    { type: 'CCTV Anomaly', count: 310, time: '21 min', cls: 'red' },
                    { type: 'Attendance Issue', count: 210, time: '19 min', cls: 'amber' },
                    { type: 'Equipment Mismatch', count: 148, time: '22 min', cls: 'amber' },
                    { type: 'Geo-tagging Mismatch', count: 105, time: '18 min', cls: 'blue' },
                    { type: 'Documentation Issue', count: 76, time: '20 min', cls: 'blue' }
                ],
                aiTotal: 3450, aiConfirmed: 3085, aiFalsePos: 220, aiFalseNeg: 145,
                cctvUptimeText: '95.1%', cctvActive: 48, cctvOffline: 6, cctvAttention: 5,
                cctvHealthRows: [
                    { name: 'CAM-01 (Bengaluru Hub)', uptime: '97.0%', events: 380, cls: 'green' },
                    { name: 'CAM-02 (Mumbai Clinic)', uptime: '93.5%', events: 290, cls: 'amber' },
                    { name: 'CAM-03 (Pune Center)', uptime: '87.2%', events: 195, cls: 'amber' },
                    { name: 'CAM-04 (Mysuru Outreach)', uptime: '95.8%', events: 240, cls: 'green' }
                ],
                cctvComp: 89, gpsComp: 93, docComp: 84, equipComp: 81, benComp: 86,
                att1: { title: 'Equipment Verification (81%)', desc: 'Delay in serial number asset verification by field inspectors in rural health centers.' },
                att2: { title: 'Documentation (84%)', desc: 'Incomplete GST invoice uploads for grant tranche disbursements.' }
            }
        };

        const d = analyticsData[period] || analyticsData['30d'];

        // Update KPIs
        const el1 = document.getElementById('kpiAvgInspTime'); if (el1) el1.textContent = d.avgInspTime;
        const el2 = document.getElementById('kpiAvgReviewTime'); if (el2) el2.textContent = d.avgReviewTime;
        const el3 = document.getElementById('kpiAiAccuracy'); if (el3) el3.textContent = d.aiAccuracy;
        const el4 = document.getElementById('kpiCctvUptime'); if (el4) el4.textContent = d.cctvUptime;
        const el5 = document.getElementById('kpiComplianceRate'); if (el5) el5.textContent = d.complianceRate;

        // Update Stages & Insights
        const badge = document.getElementById('efficiencyInsightBadge');
        if (badge) badge.innerHTML = `<i data-lucide="trending-down"></i> Average turnaround improved by ${d.improvement} compared with previous period`;

        const s1 = document.getElementById('stageTime1'); if (s1) s1.textContent = d.stage1;
        const s2 = document.getElementById('stageTime2'); if (s2) s2.textContent = d.stage2;
        const s3 = document.getElementById('stageTime3'); if (s3) s3.textContent = d.stage3;

        // Update Risk Pattern Table
        const riskTbody = document.getElementById('riskPatternTableBody');
        if (riskTbody) {
            riskTbody.innerHTML = d.riskTable.map(r => `
                <tr>
                    <td><strong>${r.type}</strong></td>
                    <td><span class="badge-status-pill ${r.cls}">${r.count}</span></td>
                    <td class="bold-navy">${r.time}</td>
                </tr>
            `).join('');
        }

        // Update AI Detections
        const aiProgText = document.getElementById('aiAccuracyProgressText'); if (aiProgText) aiProgText.textContent = d.aiAccuracy;
        const aiProgBar = document.getElementById('aiAccuracyProgressBar'); if (aiProgBar) aiProgBar.style.width = d.aiAccuracy;
        const aiTot = document.getElementById('aiTotalDetections'); if (aiTot) aiTot.textContent = d.aiTotal;
        const aiConf = document.getElementById('aiConfirmedDetections'); if (aiConf) aiConf.textContent = d.aiConfirmed;
        const aiFp = document.getElementById('aiFalsePositives'); if (aiFp) aiFp.textContent = d.aiFalsePos;
        const aiFn = document.getElementById('aiFalseNegatives'); if (aiFn) aiFn.textContent = d.aiFalseNeg;

        // Update CCTV Health
        const cUp = document.getElementById('cctvAvgUptimeText'); if (cUp) cUp.textContent = d.cctvUptimeText;
        const cAct = document.getElementById('cctvActiveCamsText'); if (cAct) cAct.textContent = d.cctvActive;
        const cOff = document.getElementById('cctvOfflineText'); if (cOff) cOff.textContent = d.cctvOffline;
        const cAtt = document.getElementById('cctvAttentionText'); if (cAtt) cAtt.textContent = d.cctvAttention;

        const cctvTbody = document.getElementById('cctvHealthTableBody');
        if (cctvTbody) {
            cctvTbody.innerHTML = d.cctvHealthRows.map(c => `
                <tr>
                    <td><strong>${c.name}</strong></td>
                    <td><span class="badge-status-pill ${c.cls}">${c.uptime}</span></td>
                    <td class="bold-navy">${c.events}</td>
                </tr>
            `).join('');
        }

        // Update Compliance Bars
        const cctvC = document.getElementById('valCctvComp'); if (cctvC) cctvC.textContent = `${d.cctvComp}%`;
        const cctvB = document.getElementById('barCctvComp'); if (cctvB) cctvB.style.width = `${d.cctvComp}%`;

        const gpsC = document.getElementById('valGpsComp'); if (gpsC) gpsC.textContent = `${d.gpsComp}%`;
        const gpsB = document.getElementById('barGpsComp'); if (gpsB) gpsB.style.width = `${d.gpsComp}%`;

        const docC = document.getElementById('valDocComp'); if (docC) docC.textContent = `${d.docComp}%`;
        const docB = document.getElementById('barDocComp'); if (docB) docB.style.width = `${d.docComp}%`;

        const equipC = document.getElementById('valEquipComp'); if (equipC) equipC.textContent = `${d.equipComp}%`;
        const equipB = document.getElementById('barEquipComp'); if (equipB) equipB.style.width = `${d.equipComp}%`;

        const benC = document.getElementById('valBenComp'); if (benC) benC.textContent = `${d.benComp}%`;
        const benB = document.getElementById('barBenComp'); if (benB) benB.style.width = `${d.benComp}%`;

        // Update Attention Cards
        const card1 = document.getElementById('attentionCard1');
        if (card1) card1.innerHTML = `<div style="font-weight: 700; font-size: 0.85rem; color: #0F172A;">${d.att1.title}</div><div style="font-size: 0.78rem; color: #64748B; margin-top: 2px;">${d.att1.desc}</div>`;

        const card2 = document.getElementById('attentionCard2');
        if (card2) card2.innerHTML = `<div style="font-weight: 700; font-size: 0.85rem; color: #0F172A;">${d.att2.title}</div><div style="font-size: 0.78rem; color: #64748B; margin-top: 2px;">${d.att2.desc}</div>`;

        // Re-render Turnaround Chart
        this.renderTurnaroundChart(d.turnaroundLabels, d.turnaroundData);

        // Re-render Risk Category Bar Chart
        this.renderRiskCategoryChart(d.riskCounts);

        // Initialize / Refresh Risk Map
        setTimeout(() => this.initAnalyticsRiskMap(), 100);

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    renderTurnaroundChart(labels, data) {
        const ctx = document.getElementById('inspectionTurnaroundChart');
        if (!ctx) return;
        if (this.turnaroundChartInstance) {
            this.turnaroundChartInstance.destroy();
        }
        this.turnaroundChartInstance = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Avg Turnaround Time (Hours)',
                    data: data,
                    borderColor: '#1D64C8',
                    backgroundColor: 'rgba(29, 100, 200, 0.08)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: '#1D64C8',
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Hours', color: '#64748B', font: { size: 11, weight: 'bold' } },
                        grid: { color: '#E2E8F0' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }

    renderRiskCategoryChart(counts) {
        const ctx = document.getElementById('riskCategoryBarChart');
        if (!ctx) return;
        if (this.riskCategoryChartInstance) {
            this.riskCategoryChartInstance.destroy();
        }
        this.riskCategoryChartInstance = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['CCTV Anomaly', 'Attendance', 'Equipment', 'Geo-tagging', 'Documentation'],
                datasets: [{
                    label: 'Occurrences',
                    data: counts,
                    backgroundColor: ['#DC2626', '#F59E0B', '#F59E0B', '#0284C7', '#64748B'],
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: '#E2E8F0' }
                    },
                    y: {
                        grid: { display: false }
                    }
                }
            }
        });
    }

    initAnalyticsRiskMap() {
        const container = document.getElementById('analyticsRiskLeafletMap');
        if (!container) return;

        if (this.analyticsRiskMapInstance) {
            this.analyticsRiskMapInstance.invalidateSize();
            return;
        }

        if (typeof L === 'undefined') return;

        const map = L.map('analyticsRiskLeafletMap', { center: [20.5937, 78.9629], zoom: 5, zoomControl: true });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        this.analyticsRiskMapInstance = map;

        const riskRegions = [
            {
                name: 'Maharashtra',
                lat: 19.7515, lng: 75.7139,
                riskLevel: 'HIGH RISK', riskCls: 'red', color: '#DC2626',
                events: '14 Events', resolution: '7.4 hrs', inspections: '38 Conducted', compliance: '89.4%',
                commonRisk: 'Staff & Doctor Attendance Mismatch'
            },
            {
                name: 'Karnataka',
                lat: 15.3173, lng: 75.7139,
                riskLevel: 'LOW RISK', riskCls: 'green', color: '#10B981',
                events: '3 Events', resolution: '3.1 hrs', inspections: '45 Conducted', compliance: '96.2%',
                commonRisk: 'Minor Geo-tagging Calibration'
            },
            {
                name: 'Uttar Pradesh',
                lat: 26.8467, lng: 80.9462,
                riskLevel: 'CRITICAL', riskCls: 'red', color: '#7F1D1D',
                events: '22 Events', resolution: '12.8 hrs', inspections: '52 Conducted', compliance: '82.1%',
                commonRisk: 'CCTV Camera Disconnection'
            },
            {
                name: 'Delhi NCR',
                lat: 28.7041, lng: 77.1025,
                riskLevel: 'MODERATE', riskCls: 'amber', color: '#F59E0B',
                events: '8 Events', resolution: '5.2 hrs', inspections: '29 Conducted', compliance: '91.8%',
                commonRisk: 'Equipment Asset Label Mismatch'
            },
            {
                name: 'Gujarat',
                lat: 22.2587, lng: 71.1924,
                riskLevel: 'MODERATE', riskCls: 'amber', color: '#F59E0B',
                events: '9 Events', resolution: '6.0 hrs', inspections: '31 Conducted', compliance: '90.5%',
                commonRisk: 'Documentation Invoice Delay'
            },
            {
                name: 'Tamil Nadu',
                lat: 11.1271, lng: 78.6569,
                riskLevel: 'LOW RISK', riskCls: 'green', color: '#10B981',
                events: '2 Events', resolution: '2.8 hrs', inspections: '40 Conducted', compliance: '97.5%',
                commonRisk: 'Routine Checklist Discrepancy'
            }
        ];

        const selectState = (r) => {
            const stName = document.getElementById('geoStateName'); if (stName) stName.textContent = r.name;
            const stBadge = document.getElementById('geoRiskBadge');
            if (stBadge) {
                stBadge.className = `badge-status-pill ${r.riskCls}`;
                stBadge.textContent = r.riskLevel;
            }
            const stEv = document.getElementById('geoRiskEvents'); if (stEv) stEv.textContent = r.events;
            const stRes = document.getElementById('geoAvgResolution'); if (stRes) stRes.textContent = r.resolution;
            const stInsp = document.getElementById('geoInspections'); if (stInsp) stInsp.textContent = r.inspections;
            const stComp = document.getElementById('geoCompliance'); if (stComp) stComp.textContent = r.compliance;
            const stRisk = document.getElementById('geoCommonRisk');
            if (stRisk) stRisk.innerHTML = `<i data-lucide="alert-triangle" style="width: 14px; height: 14px; color: #D97706; vertical-align: middle;"></i> ${r.commonRisk}`;
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        };

        riskRegions.forEach(r => {
            const circle = L.circleMarker([r.lat, r.lng], {
                radius: 12,
                fillColor: r.color,
                color: '#FFFFFF',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.85
            }).addTo(map);

            circle.bindPopup(`<b>${r.name}</b><br>Status: ${r.riskLevel}<br>Events: ${r.events}`);
            circle.on('click', () => selectState(r));
        });
    }

    renderReportsRegistry() {
        const store = AppStore.get();

        const totalNgos = store.ngos.length;
        const activeProjects = store.projects.filter(p => p.status === 'Active').length;
        const verifiedNgos = store.ngos.filter(n => (n.status || '').toLowerCase() === 'verified').length;
        const totalReports = store.inspections.length + store.alerts.length + store.projects.length;

        const sumTot = document.getElementById('rptSummaryTotalNgos'); if (sumTot) sumTot.textContent = `${totalNgos} Registered`;
        const sumAct = document.getElementById('rptSummaryActiveProjects'); if (sumAct) sumAct.textContent = `${activeProjects} Active`;
        const sumVer = document.getElementById('rptSummaryVerifiedNgos'); if (sumVer) sumVer.textContent = `${verifiedNgos} Verified`;
        const sumRpt = document.getElementById('rptSummaryAvailableReports'); if (sumRpt) sumRpt.textContent = `${totalReports} Reports`;

        const query = (document.getElementById('rptSearchInput')?.value || '').toLowerCase().trim();
        const statusFilter = document.getElementById('rptStatusFilter')?.value || 'ALL';
        const projectStatusFilter = document.getElementById('rptProjectStatusFilter')?.value || 'ALL';
        const stateFilter = document.getElementById('rptStateFilter')?.value || 'ALL';
        const sortFilter = document.getElementById('rptSortFilter')?.value || 'name_asc';

        let filtered = store.ngos.filter(n => {
            const ngoProjects = store.projects.filter(p => p.ngoId === n.id);
            const matchesQuery = !query ||
                n.name.toLowerCase().includes(query) ||
                (n.regNo || '').toLowerCase().includes(query) ||
                n.city.toLowerCase().includes(query) ||
                n.state.toLowerCase().includes(query) ||
                (n.sector || '').toLowerCase().includes(query) ||
                ngoProjects.some(p => p.title.toLowerCase().includes(query));

            const matchesStatus = statusFilter === 'ALL' || (n.status || '').toLowerCase() === statusFilter.toLowerCase();

            const matchesProjectStatus = projectStatusFilter === 'ALL' || (
                projectStatusFilter === 'Active' ? ngoProjects.some(p => p.status === 'Active') :
                projectStatusFilter === 'Completed' ? ngoProjects.some(p => p.status === 'Completed') : true
            );

            const matchesState = stateFilter === 'ALL' || (n.state || '').toLowerCase() === stateFilter.toLowerCase();

            return matchesQuery && matchesStatus && matchesProjectStatus && matchesState;
        });

        filtered.sort((a, b) => {
            if (sortFilter === 'name_asc') return a.name.localeCompare(b.name);
            if (sortFilter === 'name_desc') return b.name.localeCompare(a.name);
            if (sortFilter === 'status') return (a.status || '').localeCompare(b.status || '');
            return 0;
        });

        const countText = document.getElementById('rptRegistryCountText');
        if (countText) countText.textContent = `Showing ${filtered.length} of ${totalNgos} Registered NGOs`;

        const tbody = document.getElementById('reportsRegistryTableBody');
        if (tbody) {
            if (filtered.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 40px; color: #64748B;">
                            <i data-lucide="file-search" style="width: 32px; height: 32px; color: #94A3B8; margin-bottom: 8px;"></i>
                            <div style="font-weight: 700;">No NGO reports match your search criteria.</div>
                            <div style="font-size: 0.8rem; margin-top: 4px;">Try resetting the search query or filters.</div>
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = filtered.map((n, idx) => {
                    const ngoProjects = store.projects.filter(p => p.ngoId === n.id);
                    const isVerified = (n.status || '').toLowerCase() === 'verified';
                    const isUnderReview = (n.status || '').toLowerCase() === 'under review' || (n.status || '').toLowerCase() === 'pending';
                    const badgeClass = isVerified ? 'status-verified-badge' : isUnderReview ? 'badge-status-pill amber' : 'badge-status-pill red';
                    const statusLabel = isVerified ? 'Verified' : isUnderReview ? 'Under Review' : n.status;
                    const regDate = n.regDate || `1${idx + 2} Feb 2026`;

                    return `
                        <tr>
                            <td>
                                <strong>${n.name}</strong>
                            </td>
                            <td><code class="bold-code">${n.regNo || 'KA-EDU-2011-0451'}</code></td>
                            <td>${n.sector || 'Education'}</td>
                            <td>${n.city}, ${n.state}</td>
                            <td>${regDate}</td>
                            <td><span class="badge-status-pill blue">${ngoProjects.length > 0 ? ngoProjects.length : 1} Project${ngoProjects.length > 1 ? 's' : ''}</span></td>
                            <td><span class="${badgeClass}"><i data-lucide="${isVerified ? 'check-circle-2' : 'clock'}"></i> ${statusLabel}</span></td>
                            <td>
                                <button class="btn-navy" style="font-size: 0.8rem; padding: 6px 14px;" onclick="app.openComprehensiveReport('${n.id}')">
                                    View Report →
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    resetReportFilters() {
        const q = document.getElementById('rptSearchInput'); if (q) q.value = '';
        const st = document.getElementById('rptStatusFilter'); if (st) st.value = 'ALL';
        const pst = document.getElementById('rptProjectStatusFilter'); if (pst) pst.value = 'ALL';
        const sf = document.getElementById('rptStateFilter'); if (sf) sf.value = 'ALL';
        const srf = document.getElementById('rptSortFilter'); if (srf) srf.value = 'name_asc';
        this.renderReportsRegistry();
    }

    openNgoReportDetails(ngoId) {
        this.openComprehensiveReport(ngoId);
    }

    openComprehensiveReport(ngoId, projectId) {
        const store = AppStore.get();
        const ngo = store.ngos.find(n => n.id === ngoId) || store.ngos[0];
        const projects = store.projects.filter(p => p.ngoId === (ngo ? ngo.id : ngoId));
        const targetProjectId = projectId || (projects.length > 0 ? projects[0].id : (store.projects[0] ? store.projects[0].id : null));

        this.selectedReportNgoId = ngo ? ngo.id : ngoId;
        this.selectedReportProjectId = targetProjectId;

        this.showView('comprehensive-report', { ngoId: this.selectedReportNgoId, projectId: this.selectedReportProjectId });
    }

    renderNgoReportDetails(ngoId) {
        const store = AppStore.get();
        const ngo = store.ngos.find(n => n.id === ngoId) || store.ngos[0];
        if (!ngo) return;

        this.selectedReportNgoId = ngo.id;

        const regNoEl = document.getElementById('rptNgoRegNo'); if (regNoEl) regNoEl.textContent = ngo.regNo || 'KA-EDU-2011-0451';
        const nameEl = document.getElementById('rptNgoName'); if (nameEl) nameEl.textContent = ngo.name;
        const metaEl = document.getElementById('rptNgoMeta');
        if (metaEl) metaEl.innerHTML = `<i data-lucide="map-pin" style="width: 14px; height: 14px; color: #1D64C8;"></i> ${ngo.city}, ${ngo.state} • ${ngo.sector || 'Healthcare'} Sector`;

        const isVerified = (ngo.status || '').toLowerCase() === 'verified';
        const isUnderReview = (ngo.status || '').toLowerCase() === 'under review' || (ngo.status || '').toLowerCase() === 'pending';
        const statusBadge = document.getElementById('rptNgoStatusBadge');
        if (statusBadge) {
            statusBadge.className = isVerified ? 'status-verified-badge' : isUnderReview ? 'badge-status-pill amber' : 'badge-status-pill red';
            statusBadge.innerHTML = `<i data-lucide="${isVerified ? 'check-circle-2' : 'clock'}"></i> ${isVerified ? 'Verified' : isUnderReview ? 'Under Review' : ngo.status}`;
        }

        const addrEl = document.getElementById('rptNgoAddress'); if (addrEl) addrEl.textContent = ngo.address || `${ngo.city}, ${ngo.state}`;
        const emailEl = document.getElementById('rptNgoEmail'); if (emailEl) emailEl.textContent = ngo.email || 'contact@ngo.org';
        const phoneEl = document.getElementById('rptNgoPhone'); if (phoneEl) phoneEl.textContent = ngo.phone || '+91 9876543210';
        const sancEl = document.getElementById('rptNgoSanctioned'); if (sancEl) sancEl.textContent = ngo.sanctioned || '₹20.50 L';

        let ngoProjects = store.projects.filter(p => p.ngoId === ngo.id);
        if (ngoProjects.length === 0) {
            ngoProjects = [{
                id: 'prj-101',
                ngoId: ngo.id,
                title: `${ngo.name} Field Initiative`,
                category: ngo.sector || 'Healthcare',
                status: 'Active',
                startDate: '02 Mar 2026',
                prjCode: 'PRJ-001',
                sanctioned: ngo.sanctioned || '₹15.00 L',
                released: ngo.released || '₹12.00 L',
                spent: '₹11.70 L',
                remaining: '₹30,500',
                progressPct: 78,
                beneficiariesCount: ngo.beneficiaries || 90
            }];
        }

        const prjCountText = document.getElementById('rptNgoProjectCountText');
        if (prjCountText) prjCountText.textContent = `${ngoProjects.length} Project${ngoProjects.length > 1 ? 's' : ''} Associated`;

        const tbody = document.getElementById('rptNgoProjectsTableBody');
        if (tbody) {
            tbody.innerHTML = ngoProjects.map(p => {
                const isActive = (p.status || '').toLowerCase() === 'active';
                const pStatusBadge = isActive ? 'badge-status-pill green' : 'badge-status-pill blue';
                const pInsp = store.inspections.find(i => i.projectId === p.id);
                const inspStatus = pInsp ? (pInsp.status === 'SUBMITTED' || pInsp.status === 'Submitted' ? 'Completed & Verified' : 'Under Field Verification') : 'Verified';
                const inspBadge = pInsp && (pInsp.status === 'SUBMITTED' || pInsp.status === 'Submitted') ? 'badge-status-pill green' : 'badge-status-pill blue';

                return `
                    <tr>
                        <td>
                            <strong>${p.title}</strong>
                            <div style="font-size: 0.75rem; color: #64748B;" class="bold-code">${p.prjCode || 'PRJ-001'}</div>
                        </td>
                        <td>${p.category || 'Education'}</td>
                        <td>${ngo.city}, ${ngo.state}</td>
                        <td><span class="${pStatusBadge}">${p.status}</span></td>
                        <td>${p.startDate || '02 Mar 2026'}</td>
                        <td class="bold-navy">${p.beneficiariesCount || ngo.beneficiaries || 76} Beneficiaries</td>
                        <td><strong>${p.sanctioned || '₹15.00 L'}</strong> <span style="font-size: 0.75rem; color: #059669;">(${p.released || '₹12.00 L'} Released)</span></td>
                        <td><span class="${inspBadge}">${inspStatus}</span></td>
                        <td>
                            <button class="btn-navy" style="font-size: 0.8rem; padding: 6px 14px;" onclick="app.openComprehensiveReport('${ngo.id}', '${p.id}')">
                                View Project Report →
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    navigateToProjectReport(projectId) {
        this.showView('project-details', { projectId: projectId, tabId: 'tab-documents' });
        this.showToast('📄 Opening Detailed Project Report & Verification Documents...');
    }

    renderComprehensiveReport(ngoId, projectId) {
        const store = AppStore.get();
        const ngo = store.ngos.find(n => n.id === ngoId) || store.ngos[0] || {
            id: 'ngo-1', name: 'ABC Education Foundation', regNo: 'KA-EDU-2011-0451', sector: 'Education',
            city: 'Bengaluru', state: 'Karnataka', address: 'MG Road, Indiranagar, Bengaluru, Karnataka 560038',
            status: 'Verified', email: 'contact@abc.org', phone: '+91 9786579303', sanctioned: '₹20.50 L', released: '₹16.70 L', beneficiaries: 76
        };

        let prj = store.projects.find(p => p.id === projectId);
        if (!prj) {
            prj = store.projects.find(p => p.ngoId === ngo.id) || store.projects[0] || {
                id: 'prj-101', ngoId: ngo.id, title: `${ngo.name} Project`, category: ngo.sector || 'Education',
                status: 'Active', startDate: '02 Mar 2026', prjCode: 'PRJ-001', sanctioned: '₹15.00 L',
                released: '₹12.00 L', spent: '₹11.70 L', remaining: '₹30,500', progressPct: 78, utilizationPct: 97
            };
        }

        this.selectedReportNgoId = ngo.id;
        this.selectedReportProjectId = prj.id;

        // Header updates
        const overallStatus = (ngo.status || 'Verified').toLowerCase() === 'verified' && (prj.status || 'Active').toLowerCase() !== 'rejected' ? 'VERIFIED' : (ngo.status || 'Pending');
        const statusBadgeEl = document.getElementById('crptOverallStatusBadge');
        if (statusBadgeEl) {
            const isVer = overallStatus === 'VERIFIED' || overallStatus === 'Verified';
            statusBadgeEl.className = isVer ? 'status-verified-badge' : 'badge-status-pill amber';
            statusBadgeEl.innerHTML = `<i data-lucide="${isVer ? 'check-circle-2' : 'clock'}"></i> ${overallStatus.toUpperCase()}`;
        }

        const genDateEl = document.getElementById('crptReportGenDate');
        if (genDateEl) {
            const now = new Date();
            genDateEl.textContent = `Generated: ${now.getDate()} Sept ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()}`;
        }

        const hdrNgo = document.getElementById('crptHdrNgoName'); if (hdrNgo) hdrNgo.textContent = ngo.name;
        const hdrNgoReg = document.getElementById('crptHdrNgoRegNo'); if (hdrNgoReg) hdrNgoReg.textContent = ngo.regNo || 'KA-EDU-2011-0451';
        const hdrPrj = document.getElementById('crptHdrPrjName'); if (hdrPrj) hdrPrj.textContent = prj.title;
        const hdrPrjCode = document.getElementById('crptHdrPrjCode'); if (hdrPrjCode) hdrPrjCode.textContent = prj.prjCode || 'PRJ-001';

        // SECTION 1: NGO INFORMATION
        const nName = document.getElementById('crptNgoName'); if (nName) nName.textContent = ngo.name;
        const nReg = document.getElementById('crptNgoRegNo'); if (nReg) nReg.textContent = ngo.regNo || 'KA-EDU-2011-0451';
        const nSec = document.getElementById('crptNgoSector'); if (nSec) nSec.textContent = ngo.sector || 'Education';
        const nRegD = document.getElementById('crptNgoRegDate'); if (nRegD) nRegD.textContent = ngo.regDate || '15 Feb 2011';
        const nStat = document.getElementById('crptNgoStatus');
        if (nStat) {
            const isV = (ngo.status || '').toLowerCase() === 'verified';
            nStat.innerHTML = `<span class="${isV ? 'status-verified-badge' : 'badge-status-pill amber'}">${ngo.status || 'Verified'}</span>`;
        }
        const nEmail = document.getElementById('crptNgoEmail'); if (nEmail) nEmail.textContent = ngo.email || 'contact@ngo.org';
        const nPhone = document.getElementById('crptNgoPhone'); if (nPhone) nPhone.textContent = ngo.phone || '+91 9876543210';
        const nCitySt = document.getElementById('crptNgoStateCity'); if (nCitySt) nCitySt.textContent = `${ngo.city}, ${ngo.state}`;
        const nAddr = document.getElementById('crptNgoFullAddress'); if (nAddr) nAddr.textContent = ngo.address || `${ngo.city}, ${ngo.state}`;

        // SECTION 2: PROJECT INFORMATION
        const pTitle = document.getElementById('crptPrjTitle'); if (pTitle) pTitle.textContent = prj.title;
        const pCodeVal = document.getElementById('crptPrjCodeVal'); if (pCodeVal) pCodeVal.textContent = prj.prjCode || 'PRJ-001';
        const pCat = document.getElementById('crptPrjCategory'); if (pCat) pCat.textContent = prj.category || ngo.sector || 'Education';
        const pLoc = document.getElementById('crptPrjLocation'); if (pLoc) pLoc.textContent = `${ngo.city}, ${ngo.state}`;
        const pStat = document.getElementById('crptPrjStatus');
        if (pStat) {
            const isAct = (prj.status || '').toLowerCase() === 'active';
            pStat.innerHTML = `<span class="badge-status-pill ${isAct ? 'green' : 'blue'}">${prj.status || 'Active'}</span>`;
        }
        const pStart = document.getElementById('crptPrjStartDate'); if (pStart) pStart.textContent = prj.startDate || '02 Mar 2026';
        const pEnd = document.getElementById('crptPrjEndDate'); if (pEnd) pEnd.textContent = prj.endDate || '31 Dec 2026';
        const pProg = document.getElementById('crptPrjProgress'); if (pProg) pProg.textContent = `${prj.progressPct || 78}% Completed`;
        const pBen = document.getElementById('crptPrjBeneficiaries'); if (pBen) pBen.textContent = `${prj.beneficiariesCount || ngo.beneficiaries || 145} Served`;
        const pInsp = document.getElementById('crptPrjInspector'); if (pInsp) pInsp.textContent = prj.inspector || 'Field Inspector - Tanmay Sawant';

        // SECTION 3: FINANCIAL SUMMARY
        const fSanc = document.getElementById('crptFinSanctioned'); if (fSanc) fSanc.textContent = prj.sanctioned || ngo.sanctioned || '₹15.00 L';
        const fRel = document.getElementById('crptFinReleased'); if (fRel) fRel.textContent = prj.released || ngo.released || '₹12.00 L';
        const fSpent = document.getElementById('crptFinSpent'); if (fSpent) fSpent.textContent = prj.spent || '₹11.70 L';
        const fRem = document.getElementById('crptFinRemaining'); if (fRem) fRem.textContent = prj.remaining || '₹30,500';
        const fUtil = document.getElementById('crptFinUtilization'); if (fUtil) fUtil.textContent = `${prj.utilizationPct || 97}%`;

        const prjFunding = (store.funding || []).filter(f => f.projectId === prj.id);
        const finTbody = document.getElementById('crptFinTableBody');
        if (finTbody) {
            const rows = prjFunding.length > 0 ? prjFunding : [
                { installment: '1st Installment (40%)', amount: '₹5.00 L', date: '02 Mar 2026', orderNo: 'SAN-DoSJE-2026-081', status: 'Released' },
                { installment: '2nd Installment (30%)', amount: '₹4.00 L', date: '15 May 2026', orderNo: 'SAN-DoSJE-2026-114', status: 'Released' },
                { installment: '3rd Installment (25%)', amount: '₹3.00 L', date: '10 Aug 2026', orderNo: 'SAN-DoSJE-2026-189', status: 'Released' },
                { installment: 'Final Tranche (5%)', amount: '₹30,500', date: 'Pending Audit', orderNo: 'SAN-DoSJE-2026-210', status: 'Pending Completion' }
            ];

            finTbody.innerHTML = rows.map(r => `
                <tr>
                    <td><strong>${r.installment}</strong></td>
                    <td class="bold-navy">${r.amount}</td>
                    <td>${r.date}</td>
                    <td><code class="bold-code">${r.orderNo}</code></td>
                    <td><span class="badge-status-pill ${r.status === 'Released' ? 'green' : 'amber'}">${r.status}</span></td>
                </tr>
            `).join('');
        }

        // SECTION 4: PROJECT PROGRESS
        const prgPctText = document.getElementById('crptProgPctText'); if (prgPctText) prgPctText.textContent = `${prj.progressPct || 78}% Completed`;
        const prgBarFill = document.getElementById('crptProgBarFill'); if (prgBarFill) prgBarFill.style.width = `${prj.progressPct || 78}%`;

        const stageCurr = document.getElementById('crptStageCurrent'); if (stageCurr) stageCurr.textContent = `Stage 3: Infrastructure Setup & Classroom Lab Audit`;
        const stageComp = document.getElementById('crptStageCompleted'); if (stageComp) stageComp.textContent = `2 / 3 Stages Completed`;
        const stageUpc = document.getElementById('crptStageUpcoming'); if (stageUpc) stageUpc.textContent = `Stage 4: Final Tranche Release & Impact Evaluation`;

        // SECTION 5: BENEFICIARY INFORMATION
        const benCount = prj.beneficiariesCount || ngo.beneficiaries || 145;
        const bTot = document.getElementById('crptBenTotal'); if (bTot) bTot.textContent = `${benCount}`;
        const bTgt = document.getElementById('crptBenTarget'); if (bTgt) bTgt.textContent = `${benCount} Target`;
        const bSrv = document.getElementById('crptBenServed'); if (bSrv) bSrv.textContent = `${benCount} Served`;
        const bCmp = document.getElementById('crptBenCompliance'); if (bCmp) bCmp.textContent = `100% Verified`;

        // SECTION 6: FIELD INSPECTION & VERIFICATION
        const prjInsps = (store.inspections || []).filter(i => i.projectId === prj.id || i.ngoId === ngo.id);
        const totalInsp = prjInsps.length > 0 ? prjInsps.length : 4;
        const assignedInsp = prjInsps.filter(i => i.status === 'ASSIGNED' || i.status === 'Assigned').length;
        const submittedInsp = prjInsps.filter(i => i.status === 'SUBMITTED' || i.status === 'Submitted').length;
        const verifiedInsp = prjInsps.filter(i => (i.result || '').toLowerCase() === 'verified' || (i.overallResult || '').toLowerCase() === 'verified').length || 2;

        const iTot = document.getElementById('crptInspTotal'); if (iTot) iTot.textContent = totalInsp;
        const iAsg = document.getElementById('crptInspAssigned'); if (iAsg) iAsg.textContent = assignedInsp || 1;
        const iCmp = document.getElementById('crptInspCompleted'); if (iCmp) iCmp.textContent = submittedInsp || 3;
        const iSub = document.getElementById('crptInspSubmitted'); if (iSub) iSub.textContent = submittedInsp || 1;
        const iRevCmp = document.getElementById('crptInspRevCompleted'); if (iRevCmp) iRevCmp.textContent = 2;
        const iRevPnd = document.getElementById('crptInspRevPending'); if (iRevPnd) iRevPnd.textContent = 1;
        const iVer = document.getElementById('crptInspVerified'); if (iVer) iVer.textContent = verifiedInsp;
        const iRej = document.getElementById('crptInspRejected'); if (iRej) iRej.textContent = 0;

        const latestInsp = prjInsps.find(i => i.status === 'SUBMITTED' || i.status === 'Submitted') || prjInsps[0] || {
            code: '#192', inspector: 'Field Inspector - Tanmay Sawant', submittedDate: '11 Sept 2026, 04:07 pm',
            status: 'SUBMITTED', result: 'Verified', govReview: 'Pending',
            finalRemarks: 'Physical verification completed successfully. Project activities were found operational and beneficiary records were verified during the field visit.'
        };

        const lCode = document.getElementById('crptLatInspCode'); if (lCode) lCode.textContent = latestInsp.code || '#192';
        const lName = document.getElementById('crptLatInspName'); if (lName) lName.textContent = latestInsp.inspector || 'Tanmay Sawant';
        const lDate = document.getElementById('crptLatInspDate'); if (lDate) lDate.textContent = latestInsp.submittedDate || '11 Sept 2026, 04:07 pm';
        const lStat = document.getElementById('crptLatInspStatus'); if (lStat) lStat.textContent = latestInsp.status || 'SUBMITTED';
        const lRes = document.getElementById('crptLatInspResult'); if (lRes) lRes.textContent = latestInsp.result || 'Verified';
        const lGov = document.getElementById('crptLatInspGovReview'); if (lGov) lGov.textContent = latestInsp.govReview || latestInsp.governmentReview || 'Pending';
        const lRem = document.getElementById('crptLatInspRemarks'); if (lRem) lRem.textContent = latestInsp.finalRemarks || 'Physical verification completed successfully. Project activities were found operational and beneficiary records were verified during the field visit.';

        // SECTION 7: RISK & ALERT SUMMARY
        const prjAlerts = (store.alerts || []).filter(a => a.projectId === prj.id || a.ngoId === ngo.id);
        const altTotal = prjAlerts.length > 0 ? prjAlerts.length : 3;
        const altCrit = prjAlerts.filter(a => a.severity === 'Critical').length || 1;
        const altHigh = prjAlerts.filter(a => a.severity === 'High').length || 1;
        const altMed = prjAlerts.filter(a => a.severity === 'Medium' || a.severity === 'Low').length || 1;
        const altRes = prjAlerts.filter(a => a.status === 'Resolved').length || 0;
        const altUnres = altTotal - altRes;

        const aTot = document.getElementById('crptAltTotal'); if (aTot) aTot.textContent = altTotal;
        const aCrit = document.getElementById('crptAltCritical'); if (aCrit) aCrit.textContent = altCrit;
        const aHigh = document.getElementById('crptAltHigh'); if (aHigh) aHigh.textContent = altHigh;
        const aMed = document.getElementById('crptAltMedium'); if (aMed) aMed.textContent = altMed;
        const aRes = document.getElementById('crptAltResolved'); if (aRes) aRes.textContent = altRes;
        const aUnres = document.getElementById('crptAltUnresolved'); if (aUnres) aUnres.textContent = altUnres;

        const altTbody = document.getElementById('crptAlertsTableBody');
        if (altTbody) {
            const alertList = prjAlerts.length > 0 ? prjAlerts : [
                { code: 'ALT-101', type: 'CCTV Anomaly', severity: 'Critical', datetime: '11 Sept 2026, 03:51 pm', status: 'New', reason: 'AI detected 2 monitors, while 20 were expected. Difference: 18.' },
                { code: 'ALT-102', type: 'Low Student Attendance', severity: 'Medium', datetime: '11 Sept 2026, 03:51 pm', status: 'Under Review', reason: 'AI detected 19 students / people, while 20 were expected.' },
                { code: 'ALT-103', type: 'Missing Monitors', severity: 'High', datetime: '11 Sept 2026, 03:45 pm', status: 'Under Review', reason: 'AI detected 11 monitors, while 20 were expected. Difference: 9.' }
            ];

            altTbody.innerHTML = alertList.map(a => `
                <tr>
                    <td><code class="bold-code">${a.code}</code></td>
                    <td><strong>${a.type}</strong></td>
                    <td><span class="badge-status-pill ${a.severity === 'Critical' || a.severity === 'High' ? 'red' : 'amber'}">${a.severity}</span></td>
                    <td>${a.datetime}</td>
                    <td><span class="badge-status-pill ${a.status === 'Resolved' ? 'green' : 'amber'}">${a.status}</span></td>
                    <td style="font-size: 0.78rem; color: #475569;">${a.reason || 'Surprise field audit flagged for review'}</td>
                </tr>
            `).join('');
        }

        // SECTION 8: CCTV & AI MONITORING
        const cTot = document.getElementById('crptCctvTotal'); if (cTot) cTot.textContent = '2 Cameras';
        const cAct = document.getElementById('crptCctvActive'); if (cAct) cAct.textContent = '2 Active';
        const cOff = document.getElementById('crptCctvOffline'); if (cOff) cOff.textContent = '0 Offline';
        const cUpt = document.getElementById('crptCctvUptime'); if (cUpt) cUpt.textContent = '99.2%';
        const cEvt = document.getElementById('crptCctvEvents'); if (cEvt) cEvt.textContent = '42 Events';
        const cAnom = document.getElementById('crptCctvAnomalies'); if (cAnom) cAnom.textContent = `${altTotal} Flagged`;

        const eqExp = document.getElementById('crptEqExpected'); if (eqExp) eqExp.textContent = '20';
        const eqDet = document.getElementById('crptEqDetected'); if (eqDet) eqDet.textContent = '11';
        const eqDiff = document.getElementById('crptEqDiff'); if (eqDiff) eqDiff.textContent = '-9 Monitors';

        // SECTION 9: DOCUMENT VERIFICATION SUMMARY
        const prjDocs = (store.documents || []).filter(d => d.projectId === prj.id);
        const docCount = prjDocs.length > 0 ? prjDocs.length : 5;
        const docSummaryEl = document.getElementById('crptDocVerifiedSummary');
        if (docSummaryEl) docSummaryEl.textContent = `Documents Verified: ${docCount} / ${docCount}`;

        // SECTION 10: FINAL REPORT SUMMARY
        const finalBadge = document.getElementById('crptFinalStatusBadge');
        if (finalBadge) {
            finalBadge.className = 'status-verified-badge';
            finalBadge.innerHTML = `<i data-lucide="check-circle-2"></i> VERIFIED`;
        }

        const finalSumText = document.getElementById('crptFinalSummaryText');
        if (finalSumText) {
            finalSumText.textContent = `The project "${prj.title}" (${prj.prjCode || 'PRJ-001'}) executed by ${ngo.name} in ${ngo.city}, ${ngo.state} has achieved ${prj.progressPct || 78}% physical implementation progress with ${prj.utilizationPct || 97}% financial grant utilization. Field inspections confirm physical asset presence and beneficiary enrollment. CCTV and AI risk monitoring indicates active surveillance with low compliance risk. The project complies with Ministry guidelines for continued grant release.`;
        }

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    downloadGovernmentReport() {
        this.showToast('📄 Preparing Official Government Report PDF for print/download...');
        setTimeout(() => {
            window.print();
        }, 300);
    }

    // Event Bindings
    bindEvents() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                if (page) this.showView(page);
            });
        });

        // Registry Search & Filters
        document.getElementById('ngoSearchInput')?.addEventListener('input', () => this.renderNgoRegistry());
        document.getElementById('ngoSectorFilter')?.addEventListener('change', () => this.renderNgoRegistry());
        document.getElementById('ngoStatusFilter')?.addEventListener('change', () => this.renderNgoRegistry());

        // Alert Search & Filters
        document.getElementById('alertSearchInput')?.addEventListener('input', () => this.renderAlertsDashboard());
        document.getElementById('alertSeverityFilter')?.addEventListener('change', () => this.renderAlertsDashboard());
        document.getElementById('alertTypeFilter')?.addEventListener('change', () => this.renderAlertsDashboard());
        document.getElementById('alertStatusFilter')?.addEventListener('change', () => this.renderAlertsDashboard());

        // Project 9 Tabs
        document.querySelectorAll('.tab-item').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.renderProjectDetails(this.selectedProjectId, tabId);
            });
        });

        // Open Modal Controls
        document.getElementById('openAddNgoModalBtn')?.addEventListener('click', () => this.openModal('addNgoModal'));
        document.getElementById('openAddProjectModalBtn')?.addEventListener('click', () => this.openModal('addProjectModal'));
        document.getElementById('openAddFundingModalBtn')?.addEventListener('click', () => this.openModal('addFundingModal'));
        document.getElementById('openAddExpenseModalBtn')?.addEventListener('click', () => this.openModal('addExpenseModal'));
        document.getElementById('openUploadDocumentModalBtn')?.addEventListener('click', () => this.openModal('uploadDocumentModal'));
        document.getElementById('openAddBeneficiaryModalBtn')?.addEventListener('click', () => this.openModal('addBeneficiaryModal'));
        document.getElementById('launchSurpriseInspectionBtn')?.addEventListener('click', () => this.openSurpriseInspectionModal());

        // Forms Submissions
        document.getElementById('addNgoForm')?.addEventListener('submit', (e) => this.handleAddNgo(e));
        document.getElementById('addProjectForm')?.addEventListener('submit', (e) => this.handleAddProject(e));
        document.getElementById('addExpenseForm')?.addEventListener('submit', (e) => this.handleAddExpense(e));
        document.getElementById('uploadDocumentForm')?.addEventListener('submit', (e) => this.handleUploadDocument(e));
        document.getElementById('addBeneficiaryForm')?.addEventListener('submit', (e) => this.handleAddBeneficiary(e));
        document.getElementById('launchSurpriseInspectionForm')?.addEventListener('submit', (e) => this.handleLaunchSurpriseInspection(e));

        // Mobile Menu
        document.getElementById('menuToggle')?.addEventListener('click', () => document.getElementById('sidebar')?.classList.toggle('open'));

        // CCTV Video inputs
        document.querySelectorAll('.cctv-file-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const roomNum = input.getAttribute('data-room');
                const file = e.target.files[0];
                if (file) {
                    document.getElementById(`room${roomNum}FileName`).textContent = file.name;
                    document.getElementById(`r${roomNum}People`).textContent = Math.floor(Math.random() * 15) + 5;
                    document.getElementById(`r${roomNum}Board`).textContent = 1;
                    document.getElementById(`r${roomNum}Monitor`).textContent = Math.floor(Math.random() * 10) + 10;
                    document.getElementById(`r${roomNum}Projector`).textContent = 1;
                    this.showToast(`AI Video Scan Completed for Room 0${roomNum}`);
                }
            });
        });

        // Location Autocomplete Search
        this.bindLocationSearch();
    }

    bindLocationSearch() {
        const searchInput = document.getElementById('ngoLocationSearchInput');
        const dropdown = document.getElementById('ngoLocationSuggestions');
        if (!searchInput) return;

        let debounceTimer = null;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (debounceTimer) clearTimeout(debounceTimer);

            if (query.length < 3) {
                if (dropdown) dropdown.style.display = 'none';
                return;
            }

            const spinner = document.getElementById('ngoSearchSpinner');
            if (spinner) spinner.style.display = 'flex';

            debounceTimer = setTimeout(() => {
                this.fetchLocationSuggestions(query);
            }, 450);
        });

        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && (!dropdown || !dropdown.contains(e.target))) {
                if (dropdown) dropdown.style.display = 'none';
            }
        });
    }

    async fetchLocationSuggestions(query) {
        const dropdown = document.getElementById('ngoLocationSuggestions');
        const spinner = document.getElementById('ngoSearchSpinner');
        if (!dropdown) return;

        dropdown.style.display = 'block';
        dropdown.innerHTML = `
            <div class="sug-empty-msg">
                <i data-lucide="loader-2" class="spin-icon"></i> Searching locations...
            </div>
        `;
        if (window.lucide) lucide.createIcons();

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=in&limit=6&q=${encodeURIComponent(query)}`);
            if (spinner) spinner.style.display = 'none';

            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    this.currentLocationSuggestions = data;
                    dropdown.innerHTML = data.map((item, index) => {
                        const addressObj = item.address || {};
                        const mainTitle = addressObj.suburb || addressObj.neighbourhood || addressObj.residential || addressObj.town || addressObj.city || addressObj.village || item.display_name.split(',')[0];
                        const subTitle = item.display_name;

                        return `
                            <div class="suggestion-item" onclick="app.selectLocationSuggestion(${index})">
                                <i data-lucide="map-pin" class="sug-icon"></i>
                                <div class="sug-text-wrap">
                                    <strong class="sug-title">${mainTitle}</strong>
                                    <span class="sug-subtitle">${subTitle}</span>
                                </div>
                            </div>
                        `;
                    }).join('');
                    if (window.lucide) lucide.createIcons();
                } else {
                    dropdown.innerHTML = `<div class="sug-empty-msg">No locations found. Try a different search.</div>`;
                }
            } else {
                dropdown.innerHTML = `<div class="sug-error-msg">Unable to search location. Please try again.</div>`;
            }
        } catch (err) {
            console.warn('[SEARCH LOCATION ERR]', err);
            if (spinner) spinner.style.display = 'none';
            dropdown.innerHTML = `<div class="sug-error-msg">Unable to search location. Please try again.</div>`;
        }
    }

    selectLocationSuggestion(index) {
        const dropdown = document.getElementById('ngoLocationSuggestions');
        if (dropdown) dropdown.style.display = 'none';

        const item = this.currentLocationSuggestions ? this.currentLocationSuggestions[index] : null;
        if (!item) return;

        const lat = parseFloat(parseFloat(item.lat).toFixed(5));
        const lng = parseFloat(parseFloat(item.lon).toFixed(5));
        const addrObj = item.address || {};

        const state = addrObj.state || addrObj.state_district || '';
        const city = addrObj.city || addrObj.town || addrObj.village || addrObj.suburb || addrObj.county || addrObj.city_district || '';
        const pincode = addrObj.postcode || '';
        const fullAddress = item.display_name;

        const searchInput = document.getElementById('ngoLocationSearchInput');
        if (searchInput) searchInput.value = fullAddress.split(',')[0] + (city ? `, ${city}` : '');

        const stateInput = document.getElementById('ngoStateInput');
        const cityInput = document.getElementById('ngoCityInput');
        const pincodeInput = document.getElementById('ngoPincodeInput');
        const addressInput = document.getElementById('ngoAddressInput');
        const latInput = document.getElementById('ngoLatInput');
        const lngInput = document.getElementById('ngoLngInput');

        if (stateInput) stateInput.value = state;
        if (cityInput) cityInput.value = city;
        if (pincodeInput) pincodeInput.value = pincode;
        if (addressInput) addressInput.value = fullAddress;
        if (latInput) latInput.value = lat;
        if (lngInput) lngInput.value = lng;

        this.showToast(`Location selected: ${city || state}`);

        // Update Map & Draggable Marker
        this.updateNgoPreviewMap(lat, lng, fullAddress);
    }

    updateNgoPreviewMap(lat, lng, addressText = '') {
        const previewBox = document.getElementById('addNgoMapPreview');
        const dragNote = document.getElementById('ngoMapDragNote');

        if (previewBox) previewBox.style.display = 'block';
        if (dragNote) dragNote.style.display = 'flex';

        if (typeof L === 'undefined') return;

        if (!this.ngoPreviewMap) {
            this.ngoPreviewMap = L.map('addNgoMapPreview').setView([lat, lng], 14);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(this.ngoPreviewMap);

            this.ngoPreviewMarker = L.marker([lat, lng], { draggable: true }).addTo(this.ngoPreviewMap);

            this.ngoPreviewMarker.on('dragend', (e) => {
                const newPos = e.target.getLatLng();
                this.handleMarkerDragEnd(newPos.lat, newPos.lng);
            });
        } else {
            this.ngoPreviewMap.setView([lat, lng], 14);
            if (this.ngoPreviewMarker) {
                this.ngoPreviewMarker.setLatLng([lat, lng]);
            } else {
                this.ngoPreviewMarker = L.marker([lat, lng], { draggable: true }).addTo(this.ngoPreviewMap);
                this.ngoPreviewMarker.on('dragend', (e) => {
                    const newPos = e.target.getLatLng();
                    this.handleMarkerDragEnd(newPos.lat, newPos.lng);
                });
            }
        }

        if (addressText && this.ngoPreviewMarker) {
            this.ngoPreviewMarker.bindPopup(`<strong>📍 Selected Location</strong><br>${addressText}`).openPopup();
        }

        setTimeout(() => {
            if (this.ngoPreviewMap) this.ngoPreviewMap.invalidateSize();
        }, 150);
    }

    async handleMarkerDragEnd(lat, lng) {
        const formattedLat = parseFloat(parseFloat(lat).toFixed(5));
        const formattedLng = parseFloat(parseFloat(lng).toFixed(5));

        const latInput = document.getElementById('ngoLatInput');
        const lngInput = document.getElementById('ngoLngInput');
        if (latInput) latInput.value = formattedLat;
        if (lngInput) lngInput.value = formattedLng;

        this.showToast(`Marker moved to ${formattedLat}, ${formattedLng}. Reverse geocoding...`);

        await this.reverseGeocode(formattedLat, formattedLng);
    }

    async reverseGeocode(lat, lng) {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.address) {
                    const addrObj = data.address;
                    const state = addrObj.state || addrObj.state_district || '';
                    const city = addrObj.city || addrObj.town || addrObj.village || addrObj.suburb || addrObj.county || '';
                    const pincode = addrObj.postcode || '';
                    const fullAddress = data.display_name || '';

                    const stateInput = document.getElementById('ngoStateInput');
                    const cityInput = document.getElementById('ngoCityInput');
                    const pincodeInput = document.getElementById('ngoPincodeInput');
                    const addressInput = document.getElementById('ngoAddressInput');

                    if (state && stateInput) stateInput.value = state;
                    if (city && cityInput) cityInput.value = city;
                    if (pincode && pincodeInput) pincodeInput.value = pincode;
                    if (fullAddress && addressInput) addressInput.value = fullAddress;

                    if (this.ngoPreviewMarker) {
                        this.ngoPreviewMarker.bindPopup(`<strong>📍 Pin Location</strong><br>${fullAddress}`).openPopup();
                    }
                    this.showToast(`Address updated: ${city || state}`);
                }
            }
        } catch (err) {
            console.warn('[REVERSE GEOCODE FAIL]', err);
        }
    }

    async locateOnMap() {
        const stateInput = document.getElementById('ngoStateInput');
        const cityInput = document.getElementById('ngoCityInput');
        const addressInput = document.getElementById('ngoAddressInput');
        const latInput = document.getElementById('ngoLatInput');
        const lngInput = document.getElementById('ngoLngInput');

        const city = cityInput ? cityInput.value.trim() : '';
        const state = stateInput ? stateInput.value.trim() : '';
        const address = addressInput ? addressInput.value.trim() : '';
        let lat = latInput ? parseFloat(latInput.value) : NaN;
        let lng = lngInput ? parseFloat(lngInput.value) : NaN;

        const btn = document.getElementById('locateOnMapBtn');

        if (isNaN(lat) || isNaN(lng)) {
            if (!city && !state && !address) {
                this.showToast('Please search a location or enter City/State first.');
                return;
            }

            if (btn) btn.innerHTML = '⏳ Locating on map...';

            const queryStr = [address, city, state, 'India'].filter(Boolean).join(', ');
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryStr)}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        lat = parseFloat(data[0].lat);
                        lng = parseFloat(data[0].lon);
                    }
                }
            } catch (err) {
                console.warn('[GEOCODE NETWORK FAIL]', err);
            }
        }

        if (isNaN(lat) || isNaN(lng)) {
            const searchKey = (city || state || '').toLowerCase();
            for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
                if (searchKey.includes(key)) {
                    lat = coords[0];
                    lng = coords[1];
                    break;
                }
            }
        }

        if (isNaN(lat) || isNaN(lng)) {
            lat = 20.5937;
            lng = 78.9629;
        }

        lat = parseFloat(lat.toFixed(5));
        lng = parseFloat(lng.toFixed(5));

        if (latInput) latInput.value = lat;
        if (lngInput) lngInput.value = lng;

        this.updateNgoPreviewMap(lat, lng, address || `${city}, ${state}`);
        if (btn) btn.innerHTML = '📍 Locate on Map & Drag Marker';
        this.showToast(`Map location active. Drag pin marker to refine.`);
    }

    handleAddNgo(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const store = AppStore.get();

        const city = formData.get('city') || '';
        const state = formData.get('state') || '';
        const pincode = formData.get('pincode') || '';
        const address = formData.get('address') || `${city}, ${state}`;

        let lat = parseFloat(formData.get('lat'));
        let lng = parseFloat(formData.get('lng'));

        if (isNaN(lat) || isNaN(lng)) {
            const searchKey = (city || state || '').toLowerCase();
            for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
                if (searchKey.includes(key)) {
                    lat = coords[0];
                    lng = coords[1];
                    break;
                }
            }
            if (isNaN(lat) || isNaN(lng)) {
                lat = parseFloat((20.5937 + (Math.random() - 0.5) * 5).toFixed(4));
                lng = parseFloat((78.9629 + (Math.random() - 0.5) * 5).toFixed(4));
            }
        }

        const newNgo = {
            id: `ngo-${Date.now()}`,
            name: formData.get('ngoName'),
            regNo: formData.get('regNo'),
            sector: formData.get('sector'),
            city: city,
            state: state,
            pincode: pincode,
            address: address,
            lat: lat,
            lng: lng,
            status: formData.get('status'),
            email: formData.get('email') || 'contact@ngo.org',
            phone: formData.get('phone') || '+91 9876543210',
            sanctioned: '₹15.00 L',
            released: '₹10.00 L',
            beneficiaries: 0
        };

        store.ngos.unshift(newNgo);
        this.logAudit('admin', 'government', 'NGO registered', `NGO ${newNgo.name} (${newNgo.regNo}) registered at ${newNgo.city}, ${newNgo.state}`);
        AppStore.set(store);

        this.closeModal('addNgoModal');
        e.target.reset();

        const searchInput = document.getElementById('ngoLocationSearchInput');
        const suggestions = document.getElementById('ngoLocationSuggestions');
        const previewBox = document.getElementById('addNgoMapPreview');
        const dragNote = document.getElementById('ngoMapDragNote');

        if (searchInput) searchInput.value = '';
        if (suggestions) suggestions.style.display = 'none';
        if (previewBox) previewBox.style.display = 'none';
        if (dragNote) dragNote.style.display = 'none';

        this.showToast(`NGO "${newNgo.name}" successfully registered!`);
        this.renderNgoRegistry();

        // Refresh dynamic map immediately on Overview page
        if (this.mapInstance) {
            this.renderMapMarkers();
        }
    }

    initMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement || typeof L === 'undefined') return;

        if (mapElement._leaflet_id) {
            mapElement._leaflet_id = null;
        }

        const map = L.map('map', { center: [22.5937, 78.9629], zoom: 5, zoomControl: true, scrollWheelZoom: false });
        this.mapInstance = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        this.markersLayerGroup = L.layerGroup().addTo(map);

        // Bind Search Input Listener
        const searchInput = document.getElementById('mapSearchInput');
        if (searchInput) {
            searchInput.oninput = () => {
                this.renderMapMarkers();
            };
        }

        this.currentMapStateFilter = 'all';
        this.renderMapMarkers();

        setTimeout(() => map.invalidateSize(), 300);
    }

    renderMapMarkers() {
        if (!this.mapInstance || !this.markersLayerGroup) return;

        this.markersLayerGroup.clearLayers();
        const store = AppStore.get();
        const allNgos = store.ngos || [];
        const allProjects = store.projects || [];

        const searchInput = document.getElementById('mapSearchInput');
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';

        // Extract unique states for state filter pills
        const uniqueStates = Array.from(new Set(allNgos.map(n => n.state).filter(Boolean))).sort();

        // Render State Filter Pills
        const filtersContainer = document.getElementById('mapStateFilters');
        if (filtersContainer) {
            let pillsHtml = `
                <button type="button" class="map-state-pill ${this.currentMapStateFilter === 'all' ? 'active' : ''}" 
                    onclick="app.setMapStateFilter('all')">All States</button>
            `;
            uniqueStates.forEach(st => {
                const escapedState = st.replace(/'/g, "\\'");
                pillsHtml += `
                    <button type="button" class="map-state-pill ${this.currentMapStateFilter === st ? 'active' : ''}" 
                        onclick="app.setMapStateFilter('${escapedState}')">${st}</button>
                `;
            });
            filtersContainer.innerHTML = pillsHtml;
        }

        // Filter NGOs
        const filteredNgos = allNgos.filter(ngo => {
            const matchesState = this.currentMapStateFilter === 'all' || ngo.state === this.currentMapStateFilter;
            const matchesSearch = !searchTerm || 
                (ngo.name && ngo.name.toLowerCase().includes(searchTerm)) ||
                (ngo.city && ngo.city.toLowerCase().includes(searchTerm)) ||
                (ngo.state && ngo.state.toLowerCase().includes(searchTerm)) ||
                (ngo.sector && ngo.sector.toLowerCase().includes(searchTerm));
            return matchesState && matchesSearch;
        });

        // Update counter badge
        const counterEl = document.getElementById('mapNgoCounter');
        if (counterEl) {
            counterEl.textContent = `● ${filteredNgos.length} Registered Organization${filteredNgos.length !== 1 ? 's' : ''}`;
        }

        const bounds = [];

        const createCustomPin = (isPending) => L.divIcon({
            className: 'custom-pin-icon',
            html: `
                <div class="pin-marker-container">
                    <div class="pin-pulse-ring" style="${isPending ? 'background-color: rgba(217, 119, 6, 0.35);' : ''}"></div>
                    <div class="pin-body-dot" style="${isPending ? 'background-color: #78350F; border-color: #D97706;' : ''}">
                        <div class="pin-center-white"></div>
                    </div>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -14]
        });

        filteredNgos.forEach(ngo => {
            const lat = parseFloat(ngo.lat);
            const lng = parseFloat(ngo.lng);

            if (isNaN(lat) || isNaN(lng)) return;

            bounds.push([lat, lng]);

            const isPending = (ngo.status || '').toLowerCase() === 'pending';
            const ngoProjectsCount = allProjects.filter(p => p.ngoId === ngo.id).length;
            const marker = L.marker([lat, lng], { icon: createCustomPin(isPending) });

            const popupContent = `
                <div class="map-popup-card">
                    <div class="popup-header">
                        <span class="popup-city">📍 ${ngo.city || 'City'}, ${ngo.state || 'State'}</span>
                        <span class="popup-badge ${isPending ? 'pending' : 'verified'}">
                            ${isPending ? '⏳ Pending' : '✓ Verified'}
                        </span>
                    </div>
                    <h4 class="popup-ngo-name">${ngo.name}</h4>
                    <div class="popup-category">${ngo.sector || 'General'} • Reg: ${ngo.regNo || 'N/A'}</div>
                    <div class="popup-stats">
                        <div class="stat-item"><span class="stat-lbl">Projects</span><span class="stat-val">${ngoProjectsCount}</span></div>
                        <div class="stat-item"><span class="stat-lbl">Funding</span><span class="stat-val">${ngo.sanctioned || '₹0'}</span></div>
                        <div class="stat-item"><span class="stat-lbl">Beneficiaries</span><span class="stat-val">${ngo.beneficiaries || 0}</span></div>
                    </div>
                    <button class="popup-btn" onclick="app.showView('ngo-profile', { ngoId: '${ngo.id}' })">
                        View Organization &rarr;
                    </button>
                </div>
            `;
            marker.bindPopup(popupContent);
            this.markersLayerGroup.addLayer(marker);
        });

        if (bounds.length > 0) {
            this.mapInstance.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        }
    }

    setMapStateFilter(stateName) {
        this.currentMapStateFilter = stateName;
        this.renderMapMarkers();
    }

    initProjectOverviewCharts(sanctionedVal, releasedVal, spentVal, utilizationPct) {
        if (typeof Chart === 'undefined') return;

        // 1. Funding Overview Bar Chart
        const barCanvas = document.getElementById('projectFundingBarChart');
        if (barCanvas) {
            if (this.projectFundingChart) this.projectFundingChart.destroy();
            this.projectFundingChart = new Chart(barCanvas.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Sanctioned', 'Released', 'Spent'],
                    datasets: [{
                        data: [sanctionedVal, releasedVal, spentVal],
                        backgroundColor: ['#0B2347', '#1D64C8', '#10B981'],
                        hoverBackgroundColor: ['#12315E', '#2563EB', '#059669'],
                        borderRadius: 6,
                        borderSkipped: false,
                        barThickness: 28
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0F172A',
                            padding: 10,
                            callbacks: {
                                label: (context) => ` ${context.label}: ₹${context.raw.toFixed(2)} L`
                            }
                        }
                    },
                    scales: {
                        x: { beginAtZero: true, grid: { color: '#F1F5F9' }, ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } } },
                        y: { ticks: { color: '#0F172A', font: { family: 'Inter', size: 12, weight: '600' } }, grid: { display: false } }
                    }
                }
            });
        }

        // 2. Funding Utilization Donut Chart
        const donutCanvas = document.getElementById('projectUtilDonutChart');
        if (donutCanvas) {
            if (this.projectUtilChart) this.projectUtilChart.destroy();
            const rem = Math.max(0, releasedVal - spentVal);
            this.projectUtilChart = new Chart(donutCanvas.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Spent', 'Remaining'],
                    datasets: [{
                        data: [spentVal, rem],
                        backgroundColor: ['#10B981', '#E2E8F0'],
                        hoverBackgroundColor: ['#059669', '#CBD5E1'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '76%',
                    plugins: {
                        legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', font: { family: 'Inter', size: 11, weight: '500' } } },
                        tooltip: {
                            backgroundColor: '#0F172A',
                            padding: 10,
                            callbacks: {
                                label: (context) => ` ${context.label}: ₹${context.raw.toFixed(2)} L`
                            }
                        }
                    }
                },
                plugins: [{
                    id: 'centerPct',
                    beforeDraw(chart) {
                        const { ctx } = chart;
                        ctx.save();
                        const meta = chart.getDatasetMeta(0);
                        if (!meta || !meta.data[0]) return;
                        const centerX = meta.data[0].x;
                        const centerY = meta.data[0].y;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.font = '700 22px Inter, sans-serif';
                        ctx.fillStyle = '#0F172A';
                        ctx.fillText(`${utilizationPct}%`, centerX, centerY - 6);
                        ctx.font = '500 11px Inter, sans-serif';
                        ctx.fillStyle = '#64748B';
                        ctx.fillText('Utilized', centerX, centerY + 14);
                        ctx.restore();
                    }
                }]
            });
        }
    }

    initCharts() {
        if (typeof Chart === 'undefined') return;

        const store = AppStore.get();
        const projects = (store && store.projects) ? store.projects : [];
        const inspections = (store && store.inspections) ? store.inspections : [];

        // 1. Funding Utilization Bar Chart
        const fCanvas = document.getElementById('fundingChart');
        if (fCanvas) {
            new Chart(fCanvas.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Sanctioned', 'Released', 'Spent'],
                    datasets: [{
                        data: [1.69, 1.28, 0.92],
                        backgroundColor: ['#0B2347', '#1D64C8', '#0EA5E9'],
                        hoverBackgroundColor: ['#12315E', '#2563EB', '#38BDF8'],
                        borderRadius: 8,
                        borderSkipped: false,
                        barThickness: 42
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0F172A',
                            titleFont: { family: 'Inter', size: 12, weight: '600' },
                            bodyFont: { family: 'Inter', size: 12 },
                            padding: 10,
                            displayColors: false,
                            callbacks: {
                                label: (context) => {
                                    const val = context.raw;
                                    return val >= 1.0 ? ` Sanctioned/Utilized: ₹${val.toFixed(2)} Cr` : ` Sanctioned/Utilized: ₹${Math.round(val * 100)}.00 L`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 1.80,
                            ticks: {
                                stepSize: 0.30,
                                callback: (val) => val === 0 ? '₹0' : (val < 1.0 ? `₹${Math.round(val * 100)} L` : `₹${val.toFixed(2)} Cr`),
                                color: '#64748B',
                                font: { family: 'Inter', size: 11 }
                            },
                            grid: { color: '#F1F5F9' },
                            border: { dash: [4, 4], display: false }
                        },
                        x: {
                            ticks: { color: '#1E293B', font: { family: 'Inter', size: 12, weight: '600' } },
                            grid: { display: false }
                        }
                    }
                }
            });
        }

        // 2. Project Status Doughnut Chart
        const pCanvas = document.getElementById('projectStatusChart');
        if (pCanvas) {
            const activeCount = projects.filter(p => p.status === 'Active').length || 85;
            const completedCount = projects.filter(p => p.status === 'Completed').length || 15;
            const totalCount = activeCount + completedCount;

            new Chart(pCanvas.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Active', 'Completed'],
                    datasets: [{
                        data: [activeCount, completedCount],
                        backgroundColor: ['#1D64C8', '#0B2347'],
                        hoverBackgroundColor: ['#2563EB', '#12315E'],
                        borderWidth: 3,
                        borderColor: '#FFFFFF',
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'circle',
                                padding: 18,
                                font: { family: 'Inter', size: 12, weight: '500' },
                                color: '#334155'
                            }
                        },
                        tooltip: {
                            backgroundColor: '#0F172A',
                            padding: 10,
                            callbacks: {
                                label: (context) => {
                                    const val = context.raw;
                                    const pct = Math.round((val / totalCount) * 100);
                                    return ` ${context.label}: ${val} Projects (${pct}%)`;
                                }
                            }
                        }
                    }
                },
                plugins: [{
                    id: 'centerText',
                    beforeDraw(chart) {
                        const { ctx } = chart;
                        ctx.save();
                        const meta = chart.getDatasetMeta(0);
                        if (!meta || !meta.data[0]) return;
                        const centerX = meta.data[0].x;
                        const centerY = meta.data[0].y;

                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        
                        ctx.font = '700 24px Inter, sans-serif';
                        ctx.fillStyle = '#0F172A';
                        ctx.fillText(totalCount, centerX, centerY - 8);

                        ctx.font = '500 11px Inter, sans-serif';
                        ctx.fillStyle = '#64748B';
                        ctx.fillText('Total Projects', centerX, centerY + 14);
                        ctx.restore();
                    }
                }]
            });
        }

        // 3. Inspection Status Horizontal Bar Chart
        const iCanvas = document.getElementById('inspectionStatusChart');
        if (iCanvas) {
            const assignedCount = inspections.filter(i => i.status === 'Assigned').length || 165;
            const reviewedCount = inspections.filter(i => i.status === 'Reviewed').length || 10;
            const submittedCount = inspections.filter(i => i.status === 'Submitted').length || 5;

            new Chart(iCanvas.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Assigned', 'Reviewed', 'Submitted'],
                    datasets: [{
                        data: [assignedCount, reviewedCount, submittedCount],
                        backgroundColor: ['#0B2347', '#1D64C8', '#10B981'],
                        hoverBackgroundColor: ['#12315E', '#2563EB', '#059669'],
                        borderRadius: 6,
                        borderSkipped: false,
                        barThickness: 20
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 5,
                            bottom: 5,
                            left: 0,
                            right: 30
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0F172A',
                            padding: 10,
                            callbacks: {
                                label: (context) => ` ${context.label}: ${context.raw} Inspections`
                            }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: Math.ceil((Math.max(assignedCount, reviewedCount, submittedCount) + 25) / 20) * 20,
                            ticks: { stepSize: 40, color: '#64748B', font: { family: 'Inter', size: 11 } },
                            grid: { color: '#F1F5F9' },
                            border: { dash: [4, 4], display: false }
                        },
                        y: {
                            ticks: { color: '#1E293B', font: { family: 'Inter', size: 12, weight: '600' } },
                            grid: { display: false }
                        }
                    }
                },
                plugins: [{
                    id: 'valueAtBarEnd',
                    afterDatasetsDraw(chart) {
                        const { ctx } = chart;
                        chart.data.datasets.forEach((dataset, i) => {
                            const meta = chart.getDatasetMeta(i);
                            meta.data.forEach((bar, index) => {
                                const val = dataset.data[index];
                                if (val !== undefined && val !== null) {
                                    ctx.save();
                                    ctx.font = '600 12px Inter, sans-serif';
                                    ctx.fillStyle = '#334155';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(val, bar.x + 8, bar.y);
                                    ctx.restore();
                                }
                            });
                        });
                    }
                }]
            });
        }

        // 4. Inspection Performance Line Chart (Replaces Quick Links)
        const ipCanvas = document.getElementById('inspectionPerformanceChart');
        if (ipCanvas) {
            new Chart(ipCanvas.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Inspections Conducted',
                        data: [32, 45, 54, 65],
                        borderColor: '#1D64C8',
                        borderWidth: 3,
                        backgroundColor: (context) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                            gradient.addColorStop(0, 'rgba(29, 100, 200, 0.22)');
                            gradient.addColorStop(1, 'rgba(29, 100, 200, 0.00)');
                            return gradient;
                        },
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#FFFFFF',
                        pointBorderColor: '#1D64C8',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#1D64C8',
                        pointHoverBorderColor: '#FFFFFF'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0F172A',
                            padding: 10,
                            callbacks: {
                                label: (context) => ` ${context.raw} Inspections completed`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 80,
                            ticks: { stepSize: 20, color: '#64748B', font: { family: 'Inter', size: 11 } },
                            grid: { color: '#F1F5F9' },
                            border: { dash: [4, 4], display: false }
                        },
                        x: {
                            ticks: { color: '#1E293B', font: { family: 'Inter', size: 12, weight: '600' } },
                            grid: { display: false }
                        }
                    }
                }
            });
        }
    }

    initCctvOccupancyChart() {
        const canvas = document.getElementById('cctvOccupancyChart');
        if (!canvas) return;

        if (this.cctvChartInstance) {
            this.cctvChartInstance.destroy();
        }

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 180);
        gradient.addColorStop(0, 'rgba(29, 100, 200, 0.35)');
        gradient.addColorStop(1, 'rgba(29, 100, 200, 0.01)');

        this.cctvChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM'],
                datasets: [{
                    label: 'Classroom Occupancy',
                    data: [12, 21, 33, 29, 17, 24, 31],
                    borderColor: '#1D64C8',
                    borderWidth: 2.5,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: '#0F2C59',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#0F172A',
                        titleFont: { size: 11, weight: 'bold' },
                        bodyFont: { size: 11 },
                        padding: 8,
                        cornerRadius: 6
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#64748B', font: { size: 10, weight: '600' } }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#F1F5F9' },
                        ticks: { color: '#64748B', font: { size: 10 } }
                    }
                }
            }
        });
    }

    /* ==========================================================================
       CCTV Monitoring Room Logic (Overview Preview + Dedicated Page)
       ========================================================================== */
    initCctvMonitoringRoom() {
        // Initialize clock ticker for HUD timestamps
        if (!this.cctvClockInterval) {
            this.startCctvClockTicker();
        }
    }

    startCctvClockTicker() {
        this.cctvClockInterval = setInterval(() => {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = months[now.getMonth()];
            const year = now.getFullYear();

            let hours = now.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            const formattedHours = String(hours).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            const timestampStr = `${day} ${month} ${year} • ${formattedHours}:${minutes}:${seconds} ${ampm}`;

            for (let i = 1; i <= 4; i++) {
                document.querySelectorAll(`.cctvTimeCam${i}`).forEach(el => {
                    el.textContent = timestampStr;
                });
            }
        }, 1000);
    }

    filterCctvStreams(val) {
        const term = (val || '').toLowerCase().trim();
        document.querySelectorAll('.cctvStreamsGrid .cctv-cam-card').forEach(card => {
            const ngo = (card.getAttribute('data-ngo') || '').toLowerCase();
            const project = (card.getAttribute('data-project') || '').toLowerCase();
            const camId = (card.getAttribute('data-cam-id') || '').toLowerCase();

            if (ngo.includes(term) || project.includes(term) || camId.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    setCctvFilter(filterType, btn) {
        document.querySelectorAll('.cctv-filter-btn').forEach(b => {
            if (b.getAttribute('data-filter') === filterType) b.classList.add('active');
            else b.classList.remove('active');
        });

        document.querySelectorAll('.cctvStreamsGrid .cctv-cam-card').forEach(card => {
            const status = card.getAttribute('data-status');
            const ai = card.getAttribute('data-ai');

            if (filterType === 'all') {
                card.style.display = 'block';
            } else if (filterType === 'active' && status === 'active') {
                card.style.display = 'block';
            } else if (filterType === 'offline' && status === 'offline') {
                card.style.display = 'block';
            } else if (filterType === 'ai' && ai === 'true') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    toggleCctvFullscreen(cardId) {
        const card = document.getElementById(cardId);
        if (!card) return;
        card.classList.toggle('is-fullscreen');
        if (window.lucide) lucide.createIcons();
    }

    showCctvNgoProjects(ngoId) {
        this.selectedCctvNgoId = ngoId;
        this.showView('cctv-ngo-projects', { ngoId: ngoId });
    }

    showCctvProjectSelect(ngoId, projectId) {
        this.selectedCctvNgoId = ngoId;
        this.selectedCctvProjectId = projectId;
        this.showView('cctv-project-select', { ngoId: ngoId, projectId: projectId });
    }

    renderCctvNgoTable() {
        const searchVal = (document.getElementById('cctvFlowSearchInput')?.value || '').toLowerCase().trim();
        const catVal = document.getElementById('cctvCategoryFilter')?.value || 'ALL';
        const stateVal = document.getElementById('cctvStateFilter')?.value || 'ALL';

        const store = AppStore.get();
        let ngos = store.ngos || [];

        if (searchVal) {
            ngos = ngos.filter(n => 
                (n.name || '').toLowerCase().includes(searchVal) ||
                (n.regNo || '').toLowerCase().includes(searchVal) ||
                (n.city || '').toLowerCase().includes(searchVal) ||
                (n.state || '').toLowerCase().includes(searchVal) ||
                (n.sector || '').toLowerCase().includes(searchVal)
            );
        }

        if (catVal !== 'ALL') {
            ngos = ngos.filter(n => n.sector === catVal);
        }

        if (stateVal !== 'ALL') {
            ngos = ngos.filter(n => n.state === stateVal);
        }

        const container = document.getElementById('cctvNgoTableContainer');
        if (!container) return;

        if (ngos.length === 0) {
            container.innerHTML = `<div style="padding: 40px; text-align: center; color: #64748B;">No matching registered NGOs found for the selected filters.</div>`;
            return;
        }

        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>NGO ID</th>
                        <th>ORGANIZATION NAME</th>
                        <th>CATEGORY</th>
                        <th>STATE / CITY</th>
                        <th>ACTIVE PROJECTS</th>
                        <th>CCTV ACCESS</th>
                        <th>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    ${ngos.map(n => {
                        const prjs = (store.projects || []).filter(p => p.ngoId === n.id);
                        const activeCount = prjs.length;
                        return `
                            <tr>
                                <td class="bold-code">${n.id.toUpperCase()}</td>
                                <td>
                                    <div>
                                        <strong style="color: #0F172A; font-size: 0.95rem;">${n.name}</strong>
                                        <div style="font-size: 0.78rem; color: #64748B;">Reg No: ${n.regNo}</div>
                                    </div>
                                </td>
                                <td><span class="status-badge status-pending" style="background:#F1F5F9; color:#334155; font-weight:700;">${n.sector}</span></td>
                                <td>${n.city}, ${n.state}</td>
                                <td><strong style="color:#1D64C8;">${activeCount} Project${activeCount !== 1 ? 's' : ''}</strong></td>
                                <td><span class="status-badge status-verified" style="background:#ECFDF5; color:#059669; font-weight:700;"><span class="status-dot green"></span> Active Camera Feed</span></td>
                                <td>
                                    <button class="btn-cctv-view-projects" onclick="app.showCctvNgoProjects('${n.id}')">
                                        View Projects <span class="forward-arrow">→</span>
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
        if (window.lucide) lucide.createIcons();
    }

    renderCctvNgoProjects(ngoId) {
        const store = AppStore.get();
        const ngo = (store.ngos || []).find(n => n.id === ngoId) || (store.ngos ? store.ngos[0] : null);
        if (!ngo) return;
        this.selectedCctvNgoId = ngo.id;

        const breadcrumbTitle = document.getElementById('cctvNgoProjectsBreadcrumbTitle');
        if (breadcrumbTitle) breadcrumbTitle.textContent = `${ngo.name} Projects`;

        const banner = document.getElementById('cctvSelectedNgoBanner');
        if (banner) {
            banner.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                            <span style="background: rgba(56, 189, 248, 0.2); color: #38BDF8; font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem;">${ngo.id.toUpperCase()}</span>
                            <h2 style="font-size: 1.3rem; font-weight: 800; color: white; margin: 0;">${ngo.name}</h2>
                        </div>
                        <div style="font-size: 0.88rem; color: #94A3B8; display: flex; gap: 18px; flex-wrap: wrap; margin-top: 6px;">
                            <span><i data-lucide="file-text" style="width:14px; height:14px;"></i> Reg: <strong>${ngo.regNo}</strong></span>
                            <span><i data-lucide="tag" style="width:14px; height:14px;"></i> Category: <strong>${ngo.sector}</strong></span>
                            <span><i data-lucide="map-pin" style="width:14px; height:14px;"></i> Location: <strong>${ngo.city}, ${ngo.state}</strong></span>
                        </div>
                    </div>
                    <span class="status-badge status-verified" style="background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); font-weight: 700; padding: 6px 14px;">
                        <span class="status-dot green"></span> Verified Organization
                    </span>
                </div>
            `;
        }

        const projects = (store.projects || []).filter(p => p.ngoId === ngo.id);
        const container = document.getElementById('cctvNgoProjectsTableContainer');
        if (!container) return;

        if (projects.length === 0) {
            container.innerHTML = `<div style="padding: 40px; text-align: center; color: #64748B;">No active projects currently registered under this NGO.</div>`;
            return;
        }

        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>PROJECT ID</th>
                        <th>PROJECT NAME</th>
                        <th>CATEGORY</th>
                        <th>LOCATION</th>
                        <th>STATUS</th>
                        <th>PROGRESS</th>
                        <th>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    ${projects.map(p => `
                        <tr>
                            <td class="bold-code">${p.prjCode || p.id.toUpperCase()}</td>
                            <td>
                                <strong style="color: #0F172A; font-size: 0.95rem;">${p.title}</strong>
                            </td>
                            <td><span class="status-badge status-pending" style="background:#F1F5F9; color:#334155; font-weight:700;">${p.category || ngo.sector}</span></td>
                            <td>${p.location || (ngo.city + ', ' + ngo.state)}</td>
                            <td><span class="status-badge status-verified">${p.status || 'Active'}</span></td>
                            <td>
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <div style="flex:1; width:80px; height:6px; background:#E2E8F0; border-radius:3px; overflow:hidden;">
                                        <div style="height:100%; width:${p.progressPct || 70}%; background:#1D64C8; border-radius:3px;"></div>
                                    </div>
                                    <span style="font-size:0.8rem; font-weight:700; color:#334155;">${p.progressPct || 70}%</span>
                                </div>
                            </td>
                            <td>
                                <button class="btn-cctv-view-projects" onclick="app.showCctvProjectSelect('${ngo.id}', '${p.id}')">
                                    View Project <span class="forward-arrow">→</span>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        if (window.lucide) lucide.createIcons();
    }

    renderCctvProjectSelect(ngoId, projectId) {
        const store = AppStore.get();
        const ngo = (store.ngos || []).find(n => n.id === ngoId) || (store.ngos ? store.ngos[0] : null);
        const project = (store.projects || []).find(p => p.id === projectId) || (store.projects ? store.projects[0] : null);
        if (!ngo || !project) return;

        this.selectedCctvNgoId = ngo.id;
        this.selectedCctvProjectId = project.id;

        const banner = document.getElementById('cctvSelectedProjectBanner');
        if (banner) {
            banner.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                            <span style="background: rgba(56, 189, 248, 0.2); color: #38BDF8; font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem;">${project.prjCode || project.id.toUpperCase()}</span>
                            <h2 style="font-size: 1.3rem; font-weight: 800; color: white; margin: 0;">${project.title}</h2>
                        </div>
                        <div style="font-size: 0.88rem; color: #94A3B8; display: flex; gap: 18px; flex-wrap: wrap; margin-top: 6px;">
                            <span><i data-lucide="building" style="width:14px; height:14px;"></i> Organization: <strong>${ngo.name}</strong></span>
                            <span><i data-lucide="tag" style="width:14px; height:14px;"></i> Category: <strong>${project.category || ngo.sector}</strong></span>
                            <span><i data-lucide="map-pin" style="width:14px; height:14px;"></i> Location: <strong>${ngo.city}, ${ngo.state}</strong></span>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <span class="status-badge status-verified" style="background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); font-weight: 700; padding: 6px 14px;">
                            <span class="status-dot green"></span> Project Active
                        </span>
                        <div style="font-size: 0.78rem; color: #94A3B8; margin-top: 6px;">Overall Progress: <strong>${project.progressPct || 75}%</strong></div>
                    </div>
                </div>
            `;
        }

        const cardsContainer = document.getElementById('cctvProjectActionCards');
        if (!cardsContainer) return;

        cardsContainer.innerHTML = `
            <!-- Card 1: Overview -->
            <div class="cctv-opt-card" style="background: #FFFFFF; border: 2px solid #E2E8F0; border-radius: 14px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 5px rgba(0,0,0,0.04);">
                <div>
                    <div style="width: 48px; height: 48px; border-radius: 12px; background: #F1F5F9; color: #1E293B; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                        <i data-lucide="layout-dashboard" style="width: 24px; height: 24px; color: #1E293B;"></i>
                    </div>
                    <h4 style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin: 0 0 8px 0;">Overview</h4>
                    <p style="font-size: 0.88rem; color: #64748B; line-height: 1.5; margin: 0 0 20px 0;">View high-level project summary, status indicators, financial allocations, and progress metrics.</p>
                </div>
                <button onclick="app.showView('project-details', { projectId: '${project.id}', tabId: 'tab-overview' })" style="width: 100%; padding: 12px 16px; background: #F1F5F9; color: #0F172A; border: 1px solid #CBD5E1; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i data-lucide="arrow-right" style="width:16px; height:16px;"></i> View Overview
                </button>
            </div>

            <!-- Card 2: CCTV Stream (FEATURED PRIMARY CARD) -->
            <div class="cctv-opt-card featured" style="background: linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%); border: 2px solid #2563EB; border-radius: 14px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.12);">
                <span style="position: absolute; top: 14px; right: 14px; background: #10B981; color: white; font-size: 0.72rem; font-weight: 800; padding: 4px 10px; border-radius: 12px; letter-spacing: 0.4px;">● LIVE CAMERA ACTIVE</span>
                <div>
                    <div style="width: 48px; height: 48px; border-radius: 12px; background: #2563EB; color: white; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                        <i data-lucide="video" style="width: 24px; height: 24px; color: white;"></i>
                    </div>
                    <h4 style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin: 0 0 8px 0;">CCTV Stream</h4>
                    <p style="font-size: 0.88rem; color: #475569; line-height: 1.5; margin: 0 0 20px 0;">Launch real-time CCTV snapshot surveillance feed, dark HUD telemetry, and AI automated detection metrics for this project site.</p>
                </div>
                <button onclick="app.showView('project-details', { projectId: '${project.id}', tabId: 'tab-cctv' })" style="width: 100%; padding: 12px 16px; background: #2563EB; color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 0.92rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);">
                    <i data-lucide="video" style="width:16px; height:16px;"></i> CCTV Stream →
                </button>
            </div>

            <!-- Card 3: Project Details -->
            <div class="cctv-opt-card" style="background: #FFFFFF; border: 2px solid #E2E8F0; border-radius: 14px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 5px rgba(0,0,0,0.04);">
                <div>
                    <div style="width: 48px; height: 48px; border-radius: 12px; background: #F1F5F9; color: #1E293B; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                        <i data-lucide="file-text" style="width: 24px; height: 24px; color: #1E293B;"></i>
                    </div>
                    <h4 style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin: 0 0 8px 0;">Project Details</h4>
                    <p style="font-size: 0.88rem; color: #64748B; line-height: 1.5; margin: 0 0 20px 0;">Inspect full sanction documents, itemized expenditure schedules, field inspection reports, and beneficiary records.</p>
                </div>
                <button onclick="app.showView('project-details', { projectId: '${project.id}', tabId: 'tab-documents' })" style="width: 100%; padding: 12px 16px; background: #F1F5F9; color: #0F172A; border: 1px solid #CBD5E1; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i data-lucide="arrow-right" style="width:16px; height:16px;"></i> View Details
                </button>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
    }
}

// Instantiate Global App
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new Drishti360App();
    app.init();
    window.app = app;
});
