export interface ParcelData {
  ulpin: string; // 14-digit Unique Land Parcel Identification Number
  state: string;
  district: string;
  taluk: string;
  village: string;
  surveyNumber: string;
  subDivision: string;
  ownerName: string;
  ownerCategory: "Individual" | "Joint Family" | "Government / Municipal" | "Trust / Waqf / Community";
  areaHectares: number;
  landClassification: "Dry Crop (Jirayat)" | "Irrigated (Bagayat)" | "Commercial / NA" | "Wetland / Buffer" | "Forest Fringe";
  circleRatePerHectareINR: number;
  marketRatePerHectareINR: number;
  mutationStatus: "Certified & Clean" | "Contested Mutation" | "Pending Enquiry" | "Partition in Dispute";
  encumbranceStatus: "Clear (No Encumbrance)" | "Bank Mortgage (SBI Agro)" | "Court Injunction (Stay)" | "Revenue Recovery Notice";
  disputeRiskScore: number; // 0 - 100
  riskFactors: string[];
  centroid: [number, number];
  polygon: [number, number][];
  lastSurveyDate: string;
  bhuNakshaMatch: number; // percentage match with legacy maps
  satelliteNDVI: number; // 0.0 - 1.0 vegetation index
}

export interface DistrictIndicator {
  state: string;
  district: string;
  coordinates: [number, number];
  landUseRiskIndex: number;
  disputeHotspotScore: number;
  climateExposureIndex: number;
  watershedDegradationIndex: number;
  totalParcelsDigitized: number;
  ulpinCoveragePercent: number;
  activeLitigations: number;
  averageAcquisitionDelayMonths: number;
  highRiskTaluks: string[];
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: "Statutory Act" | "DILRMP Guideline" | "Research Paper" | "Geospatial Dataset" | "Judicial Precedent" | "Policy Brief";
  statutoryFramework?: string;
  schemeTag?: "DILRMP" | "RFCTLARR 2013" | "Bhu-Aadhaar (ULPIN)" | "SRISHTI-DRISHTI" | "SVAMITVA" | "Forest Rights Act";
  authorOrMinistry: string;
  year: number;
  stateScope: string;
  summary: string;
  keyClausesCited?: string[];
  accessLevel: "Open Public" | "Inter-Departmental" | "Restricted Official";
  downloadSizeMB: number;
  citationCount: number;
}

export interface LegalFAQResponse {
  query: string;
  category: string;
  statute: string;
  section: string;
  officialTextSummary: string;
  governanceImplication: string;
  recommendedWorkflow: string[];
  applicablePrecedents: string[];
}

export interface ForensicCase {
  id: string;
  title: string;
  state: string;
  district: string;
  ulpin: string;
  disputeType: "Boundary Overlap" | "Contested Mutation" | "RFCTLARR Compensation Challenge" | "Forest Fringe Encroachment" | "Unregistered Sub-division";
  riskScore: number;
  timelineYears: number;
  partiesInvolved: string;
  rootCause: string;
  evidenceTrail: {
    stage: string;
    description: string;
    source: string;
  }[];
  aiMitigationSuggestion: string;
}

export const CADASTRAL_PARCELS: ParcelData[] = [
  {
    ulpin: "14-MH-PUN-0842-9912-A1",
    state: "Maharashtra",
    district: "Pune",
    taluk: "Mulshi",
    village: "Hinjawadi",
    surveyNumber: "84/2",
    subDivision: "A-1",
    ownerName: "Rameshwar B. Deshmukh & 3 Others",
    ownerCategory: "Joint Family",
    areaHectares: 4.85,
    landClassification: "Dry Crop (Jirayat)",
    circleRatePerHectareINR: 18500000,
    marketRatePerHectareINR: 32000000,
    mutationStatus: "Contested Mutation",
    encumbranceStatus: "Court Injunction (Stay)",
    disputeRiskScore: 84,
    riskFactors: [
      "Inheritance partition pending under Section 85 MLRC 1966",
      "Notice under Section 11 RFCTLARR 2013 issued for Ring Road corridor",
      "Discrepancy of 0.42 Ha between legacy village map and DGPS drone vector"
    ],
    centroid: [18.5912, 73.7389],
    polygon: [
      [18.5895, 73.7365],
      [18.5935, 73.7375],
      [18.5928, 73.7415],
      [18.5888, 73.7402],
    ],
    lastSurveyDate: "14 Jan 2025 (DGPS Drone)",
    bhuNakshaMatch: 78.4,
    satelliteNDVI: 0.38,
  },
  {
    ulpin: "14-KA-BLR-0231-8841-B4",
    state: "Karnataka",
    district: "Bengaluru Urban",
    taluk: "Anekal",
    village: "Sarjapura Fringe",
    surveyNumber: "142/3",
    subDivision: "B-4",
    ownerName: "Sri Vigneshwara Realty Agro Trust",
    ownerCategory: "Trust / Waqf / Community",
    areaHectares: 7.20,
    landClassification: "Commercial / NA",
    circleRatePerHectareINR: 42000000,
    marketRatePerHectareINR: 65000000,
    mutationStatus: "Pending Enquiry",
    encumbranceStatus: "Clear (No Encumbrance)",
    disputeRiskScore: 68,
    riskFactors: [
      "Buffer zone encroachment within 75m of Rajakaluve (Stormwater Drain)",
      "Conversion clearance under Karnataka Land Revenue Act Section 95 unverified"
    ],
    centroid: [12.8624, 77.7812],
    polygon: [
      [12.8605, 77.7795],
      [12.8645, 77.7802],
      [12.8638, 77.7842],
      [12.8598, 77.7831],
    ],
    lastSurveyDate: "28 Feb 2025",
    bhuNakshaMatch: 86.2,
    satelliteNDVI: 0.22,
  },
  {
    ulpin: "14-UP-GBA-0914-3321-C2",
    state: "Uttar Pradesh",
    district: "Gautam Buddha Nagar",
    taluk: "Jewar",
    village: "Ranhera",
    surveyNumber: "512",
    subDivision: "C-2",
    ownerName: "Surender Pal Singh",
    ownerCategory: "Individual",
    areaHectares: 3.10,
    landClassification: "Irrigated (Bagayat)",
    circleRatePerHectareINR: 14000000,
    marketRatePerHectareINR: 28000000,
    mutationStatus: "Certified & Clean",
    encumbranceStatus: "Bank Mortgage (SBI Agro)",
    disputeRiskScore: 32,
    riskFactors: [
      "Phase 3 Jewar Aerotropolis acquisition boundary adjacent; Section 15 objections cleared"
    ],
    centroid: [28.1425, 77.5642],
    polygon: [
      [28.1408, 77.5620],
      [28.1448, 77.5630],
      [28.1440, 77.5668],
      [28.1399, 77.5655],
    ],
    lastSurveyDate: "03 Nov 2024",
    bhuNakshaMatch: 95.8,
    satelliteNDVI: 0.72,
  },
  {
    ulpin: "14-OR-KHD-0412-7719-D9",
    state: "Odisha",
    district: "Khordha",
    taluk: "Bhubaneswar Sadar",
    village: "Chandaka Buffer",
    surveyNumber: "219/1",
    subDivision: "D-9",
    ownerName: "Binod Bihari Mohapatra",
    ownerCategory: "Individual",
    areaHectares: 5.40,
    landClassification: "Forest Fringe",
    circleRatePerHectareINR: 9500000,
    marketRatePerHectareINR: 16000000,
    mutationStatus: "Partition in Dispute",
    encumbranceStatus: "Court Injunction (Stay)",
    disputeRiskScore: 91,
    riskFactors: [
      "Conflict between Forest Rights Act (FRA 2006) community claim and revenue record",
      "SRISHTI-DRISHTI 30m watershed monitoring indicates severe soil erosion zone",
      "Stay order in Odisha High Court WP(C) 14210/2023"
    ],
    centroid: [20.3412, 85.7621],
    polygon: [
      [20.3392, 85.7600],
      [20.3435, 85.7608],
      [20.3428, 85.7650],
      [20.3385, 85.7640],
    ],
    lastSurveyDate: "18 Aug 2024",
    bhuNakshaMatch: 64.1,
    satelliteNDVI: 0.81,
  },
  {
    ulpin: "14-AS-KAM-0129-5541-E3",
    state: "Assam",
    district: "Kamrup Metropolitan",
    taluk: "Sonapur",
    village: "Khetri Char",
    surveyNumber: "89/4",
    subDivision: "E-3",
    ownerName: "Assam Agro-Livelihood Cooperative",
    ownerCategory: "Trust / Waqf / Community",
    areaHectares: 8.60,
    landClassification: "Wetland / Buffer",
    circleRatePerHectareINR: 6200000,
    marketRatePerHectareINR: 9800000,
    mutationStatus: "Pending Enquiry",
    encumbranceStatus: "Revenue Recovery Notice",
    disputeRiskScore: 88,
    riskFactors: [
      "Brahmaputra annual flood siltation has shifted parcel physical coordinates by 48 meters",
      "Cadastral vector alignment requires Person-Parcel-Pixel dynamic realignment"
    ],
    centroid: [26.1189, 91.9845],
    polygon: [
      [26.1165, 91.9820],
      [26.1210, 91.9830],
      [26.1200, 91.9875],
      [26.1155, 91.9860],
    ],
    lastSurveyDate: "05 Dec 2024",
    bhuNakshaMatch: 69.5,
    satelliteNDVI: 0.64,
  },
  {
    ulpin: "14-RJ-JAI-0711-2290-F7",
    state: "Rajasthan",
    district: "Jaipur",
    taluk: "Sanganer",
    village: "Watika",
    surveyNumber: "304/2",
    subDivision: "F-7",
    ownerName: "Kanwar Lal Meena",
    ownerCategory: "Individual",
    areaHectares: 6.25,
    landClassification: "Dry Crop (Jirayat)",
    circleRatePerHectareINR: 8800000,
    marketRatePerHectareINR: 15500000,
    mutationStatus: "Certified & Clean",
    encumbranceStatus: "Clear (No Encumbrance)",
    disputeRiskScore: 28,
    riskFactors: [
      "Traditional Johad / water catchment boundary clearly demarcated on BhuNaksha"
    ],
    centroid: [26.7821, 75.8112],
    polygon: [
      [26.7801, 75.8090],
      [26.7845, 75.8100],
      [26.7838, 75.8140],
      [26.7795, 75.8128],
    ],
    lastSurveyDate: "12 May 2025",
    bhuNakshaMatch: 94.2,
    satelliteNDVI: 0.31,
  }
];

export const DISTRICT_INDICATORS: DistrictIndicator[] = [
  {
    state: "Maharashtra",
    district: "Pune",
    coordinates: [18.5204, 73.8567],
    landUseRiskIndex: 64,
    disputeHotspotScore: 78,
    climateExposureIndex: 58,
    watershedDegradationIndex: 52,
    totalParcelsDigitized: 842100,
    ulpinCoveragePercent: 94.2,
    activeLitigations: 3412,
    averageAcquisitionDelayMonths: 19.4,
    highRiskTaluks: ["Mulshi", "Haveli", "Maval", "Shirur"],
  },
  {
    state: "Karnataka",
    district: "Bengaluru Urban",
    coordinates: [12.9716, 77.5946],
    landUseRiskIndex: 82,
    disputeHotspotScore: 89,
    climateExposureIndex: 44,
    watershedDegradationIndex: 71,
    totalParcelsDigitized: 692400,
    ulpinCoveragePercent: 91.8,
    activeLitigations: 4890,
    averageAcquisitionDelayMonths: 24.6,
    highRiskTaluks: ["Anekal", "Bengaluru South", "Bengaluru East"],
  },
  {
    state: "Uttar Pradesh",
    district: "Gautam Buddha Nagar",
    coordinates: [28.3470, 77.5450],
    landUseRiskIndex: 71,
    disputeHotspotScore: 74,
    climateExposureIndex: 55,
    watershedDegradationIndex: 48,
    totalParcelsDigitized: 412000,
    ulpinCoveragePercent: 88.5,
    activeLitigations: 2650,
    averageAcquisitionDelayMonths: 15.2,
    highRiskTaluks: ["Jewar", "Dadri"],
  },
  {
    state: "Odisha",
    district: "Khordha",
    coordinates: [20.1800, 85.6200],
    landUseRiskIndex: 79,
    disputeHotspotScore: 82,
    climateExposureIndex: 86,
    watershedDegradationIndex: 74,
    totalParcelsDigitized: 398500,
    ulpinCoveragePercent: 84.6,
    activeLitigations: 2190,
    averageAcquisitionDelayMonths: 21.8,
    highRiskTaluks: ["Bhubaneswar Sadar", "Jatni", "Begunia"],
  },
  {
    state: "Assam",
    district: "Kamrup Metropolitan",
    coordinates: [26.1445, 91.7362],
    landUseRiskIndex: 88,
    disputeHotspotScore: 85,
    climateExposureIndex: 89,
    watershedDegradationIndex: 83,
    totalParcelsDigitized: 284300,
    ulpinCoveragePercent: 76.2,
    activeLitigations: 1840,
    averageAcquisitionDelayMonths: 27.5,
    highRiskTaluks: ["Sonapur", "Chandrapur", "Dispur"],
  },
  {
    state: "Rajasthan",
    district: "Jaipur",
    coordinates: [26.9124, 75.7873],
    landUseRiskIndex: 58,
    disputeHotspotScore: 62,
    climateExposureIndex: 72,
    watershedDegradationIndex: 79,
    totalParcelsDigitized: 720000,
    ulpinCoveragePercent: 92.4,
    activeLitigations: 2980,
    averageAcquisitionDelayMonths: 16.8,
    highRiskTaluks: ["Sanganer", "Amer", "Chaksu"],
  },
  {
    state: "Gujarat",
    district: "Ahmedabad",
    coordinates: [23.0225, 72.5714],
    landUseRiskIndex: 52,
    disputeHotspotScore: 56,
    climateExposureIndex: 61,
    watershedDegradationIndex: 55,
    totalParcelsDigitized: 890000,
    ulpinCoveragePercent: 96.1,
    activeLitigations: 2410,
    averageAcquisitionDelayMonths: 12.4,
    highRiskTaluks: ["Daskroi", "Sanand", "Dholka"],
  },
  {
    state: "Tamil Nadu",
    district: "Chennai & Kancheepuram",
    coordinates: [13.0827, 80.2707],
    landUseRiskIndex: 67,
    disputeHotspotScore: 69,
    climateExposureIndex: 78,
    watershedDegradationIndex: 66,
    totalParcelsDigitized: 640000,
    ulpinCoveragePercent: 93.5,
    activeLitigations: 3120,
    averageAcquisitionDelayMonths: 18.2,
    highRiskTaluks: ["Sriperumbudur", "Tambaram", "Chengalpattu"],
  }
];

export const FORENSIC_CASES: ForensicCase[] = [
  {
    id: "DF-2026-0814",
    title: "Peri-Urban Cadastral Distortion & Section 85 Partition Delay",
    state: "Maharashtra",
    district: "Pune",
    ulpin: "14-MH-PUN-0842-9912-A1",
    disputeType: "Contested Mutation",
    riskScore: 84,
    timelineYears: 4.2,
    partiesInvolved: "3 Co-sharers vs. Infrastructure Development Corporation",
    rootCause: "Legacy 1978 Tipan map not reconciled during 2021 DILRMP digital survey; unrecorded oral partition led to conflicting mutation entries (Ferfar).",
    evidenceTrail: [
      { stage: "2019 DILRMP Vectorization", description: "Plot boundary snapped to road margin without co-sharer joint signature.", source: "BhuNaksha Audit Trail" },
      { stage: "2022 Section 11 RFCTLARR", description: "Preliminary acquisition notification gazetted; multiple ownership claims lodged.", source: "Collectorate Gazette" },
      { stage: "2024 SDO Court Injunction", description: "Stay order granted on mutation ferfar #10492 pending partition suit #412/2023.", source: "Sub-Divisional Officer Revenue Court" }
    ],
    aiMitigationSuggestion: "Initiate Drone DGPS geo-referenced resurvey with digital sign-off from all 4 co-sharers; apply automated solatium escrow under Section 77(2) RFCTLARR to unblock road execution without prejudicing family civil suit."
  },
  {
    id: "DF-2026-1042",
    title: "Rajakaluve Stormwater Drain Encroachment & Wetland Classification Mismatch",
    state: "Karnataka",
    district: "Bengaluru Urban",
    ulpin: "14-KA-BLR-0231-8841-B4",
    disputeType: "Boundary Overlap",
    riskScore: 68,
    timelineYears: 3.1,
    partiesInvolved: "Realty Developer vs. Bruhat Bengaluru Mahanagara Palike (BBMP) & Revenue Dept",
    rootCause: "BhuNaksha primary village map marks a 12m stream buffer; conversion order Section 95 erroneously superseded secondary stormwater buffer.",
    evidenceTrail: [
      { stage: "2016 Cadastral Scan", description: "Survey map shows seasonal watercourse traversing northeast quadrant of parcel.", source: "Karnataka Survey Settlement & Land Records" },
      { stage: "2021 Satellite Change", description: "Sentinel-2 and Cartosat-3 imagery reveals earthen leveling of catchment area.", source: "ISRO Bhuvan Spatial Archive" },
      { stage: "2025 Revenue Enquiry", description: "Tahsildar issues show-cause notice for encroachment on 'Kaluve' buffer under KLR Act Section 192A.", source: "Tahsildar Court Record" }
    ],
    aiMitigationSuggestion: "Deploy AI Polygon Subtraction: carve out statutory 50m green buffer zone as public non-alienable easement, recalibrate FAR on remaining net plot to prevent complete project abandonment."
  },
  {
    id: "DF-2026-1299",
    title: "Forest Rights Act (FRA 2006) Title Intersect vs. Eco-Sensitive Buffer Zone",
    state: "Odisha",
    district: "Khordha",
    ulpin: "14-OR-KHD-0412-7719-D9",
    disputeType: "Forest Fringe Encroachment",
    riskScore: 91,
    timelineYears: 5.8,
    partiesInvolved: "Gram Sabha & Community Forest Resource Rights Committee vs. State Forest Dept",
    rootCause: "Overlap between DILRMP revenue cadastral map and Protected Forest notification boundary under Indian Forest Act 1927.",
    evidenceTrail: [
      { stage: "2012 Gram Sabha Resolution", description: "Community rights recognized over 3.2 hectares under Section 3(1)(i) FRA 2006.", source: "Sub-Divisional Level Committee (SDLC) Minutes" },
      { stage: "2018 Revenue Digitization", description: "Revenue department classified parcel as 'Abad Jogya Anabadi' (cultivable waste).", source: "Bhulekh Odisha Portal" },
      { stage: "2023 High Court Stay", description: "Writ petition filed challenging eco-tourism land allotment on FRA claimed parcel.", source: "High Court of Orissa" }
    ],
    aiMitigationSuggestion: "Overlay Joint Boundary Commission shapefile onto PostGIS spatial layer; register Gram Sabha CFR rights with distinct thematic sub-parcel ID (ULPIN-FRA extension)."
  }
];

export const KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: "DOC-RFCTLARR-2013",
    title: "Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013",
    category: "Statutory Act",
    statutoryFramework: "Central Legislation (Act 30 of 2013)",
    schemeTag: "RFCTLARR 2013",
    authorOrMinistry: "Ministry of Rural Development (DoLR) / Parliament of India",
    year: 2013,
    stateScope: "All India",
    summary: "Statutory benchmark governing land acquisition in India. Establishes mandatory Social Impact Assessment (SIA), statutory multipliers for rural land (1.0x to 2.0x), 100% Solatium, 12% additional interest per annum, and structured Rehabilitation & Resettlement schedules.",
    keyClausesCited: ["Section 26: Determination of Market Value", "Section 30: Solatium & Additional Amount", "Section 31: Rehabilitation and Resettlement Award", "Second Schedule: Mandatory R&R Entitlements"],
    accessLevel: "Open Public",
    downloadSizeMB: 4.8,
    citationCount: 4210,
  },
  {
    id: "DOC-DILRMP-2024",
    title: "Digital India Land Records Modernization Programme (DILRMP) Operational Guidelines & Technical Standards",
    category: "DILRMP Guideline",
    statutoryFramework: "Centrally Sponsored Scheme (DoLR)",
    schemeTag: "DILRMP",
    authorOrMinistry: "Department of Land Resources (DoLR), MoRD",
    year: 2024,
    stateScope: "All India",
    summary: "Technical blueprint for computerization of Records of Rights (RoRs), cadastral vectorization, integration between registration and revenue offices, and migration towards Person-Parcel-Pixel unified land database.",
    keyClausesCited: ["Rule 4.2: DGPS & Drone Cadastral Resurvey Standards", "Rule 7.1: Real-time Mutation & Automatic RoR Updation", "Rule 9.3: Cadastral Boundary Topology & Tolerances"],
    accessLevel: "Open Public",
    downloadSizeMB: 8.2,
    citationCount: 1845,
  },
  {
    id: "DOC-ULPIN-BHUAADHAAR-2023",
    title: "Bhu-Aadhaar (ULPIN): 14-Digit Alphanumeric Cadastral Geo-Identifier System Specification",
    category: "Policy Brief",
    statutoryFramework: "Standard Operating Procedure (DoLR & NIC)",
    schemeTag: "Bhu-Aadhaar (ULPIN)",
    authorOrMinistry: "National Informatics Centre (NIC) & Department of Land Resources",
    year: 2023,
    stateScope: "All India",
    summary: "Standard for generating a 14-digit alphanumeric code for every land parcel based on longitude-latitude centroid, international WGS84 standards, and Luhn checksum validation. Eliminates ambiguity in land parcel identity across departments.",
    keyClausesCited: ["Section 3: Centroid Encoding Algorithm", "Section 5: Sub-division & Amalgamation Keying", "Section 8: Inter-agency Interoperability (Banks, Courts, Tax)"],
    accessLevel: "Open Public",
    downloadSizeMB: 3.1,
    citationCount: 960,
  },
  {
    id: "DOC-SRISHTI-DRISHTI-2024",
    title: "SRISHTI-DRISHTI: Geospatial Watershed Monitoring & Land Degradation Assessment (30m Resolution)",
    category: "Geospatial Dataset",
    statutoryFramework: "Integrated Watershed Management Programme (IWMP)",
    schemeTag: "SRISHTI-DRISHTI",
    authorOrMinistry: "National Remote Sensing Centre (NRSC) / ISRO & DoLR",
    year: 2024,
    stateScope: "28 States & UTs",
    summary: "Multi-temporal satellite imagery analytics pipeline using ISRO Bhuvan & Sentinel-2 30m multispectral sensors. Monitors soil moisture, vegetation canopy, check-dam assets, and land degradation dynamics.",
    keyClausesCited: ["Protocol 2.1: NDVI/NDWI Spectral Index Formulation", "Protocol 5.4: Geo-tagged Asset Verification via Drishti Mobile Tool"],
    accessLevel: "Inter-Departmental",
    downloadSizeMB: 18.5,
    citationCount: 620,
  },
  {
    id: "DOC-SVAMITVA-SCHEME-2024",
    title: "SVAMITVA Scheme: Survey of Villages and Mapping with Improvised Technology in Village Areas",
    category: "DILRMP Guideline",
    statutoryFramework: "Ministry of Panchayati Raj Central Scheme",
    schemeTag: "SVAMITVA",
    authorOrMinistry: "Ministry of Panchayati Raj & Survey of India (SoI)",
    year: 2024,
    stateScope: "Rural Abadi Areas across India",
    summary: "Establishment of clear ownership of property in rural inhabited (Abadi) areas using drone survey technology. Generates Property Cards ('Sampatti Patrak') to enable rural credit monetization and municipal tax mapping.",
    keyClausesCited: ["Section 4: Drone Survey & 1:500 Large Scale Mapping", "Section 7: Dispute Resolution in Village Panchayats", "Section 10: Property Card Legal Evidentiary Value"],
    accessLevel: "Open Public",
    downloadSizeMB: 6.4,
    citationCount: 1120,
  },
  {
    id: "DOC-FRA-2006",
    title: "Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006",
    category: "Statutory Act",
    statutoryFramework: "Central Legislation (Act 2 of 2007)",
    schemeTag: "Forest Rights Act",
    authorOrMinistry: "Ministry of Tribal Affairs / Parliament of India",
    year: 2006,
    stateScope: "All India (Schedule V & VI Areas)",
    summary: "Crucial statute protecting tenurial security, individual forest rights (IFR) and community forest resource (CFR) rights of forest dwelling communities. Precludes eviction until claims are duly recognized by Gram Sabha and verification committees.",
    keyClausesCited: ["Section 3(1)(a): Right to Hold and Live in Forest Land", "Section 4(5): Protection against Eviction prior to Recognition Process", "Section 6: Three-Tier Verification Authorities"],
    accessLevel: "Open Public",
    downloadSizeMB: 3.9,
    citationCount: 3105,
  }
];

export const LEGAL_COPILOT_KNOWLEDGE: LegalFAQResponse[] = [
  {
    query: "How is land acquisition compensation calculated under RFCTLARR Act 2013?",
    category: "Land Acquisition & Valuation",
    statute: "RFCTLARR Act, 2013",
    section: "Section 26 to Section 30 & First Schedule",
    officialTextSummary: "The statutory compensation consists of 4 components: (1) Market Value determined under Section 26 (higher of circle rate, average of top 50% sales, or agreed value), (2) Multiplied by Factor 'F' (1.00 for urban areas, 1.00 to 2.00 for rural areas based on distance), (3) Additional 12% per annum interest from date of Section 4 SIA notification to Collector's award under Section 30(3), and (4) 100% Solatium on the total market value under Section 30(1).",
    governanceImplication: "Any acquisition that omits the rural multiplication factor or solatium is legally ultra vires and creates immediate high-risk litigation in High Courts, leading to average project delays of 18-24 months.",
    recommendedWorkflow: [
      "Verify distance of parcel centroid from municipal boundary to fix multiplier factor (1.0x - 2.0x).",
      "Extract registered sale deeds within 3km radius over the preceding 3 years via state e-Registration database.",
      "Calculate 100% solatium and statutory interest in the Section 23 Award Draft.",
      "Prepare separate Rehabilitation & Resettlement (R&R) schedule under Section 31."
    ],
    applicablePrecedents: [
      "Indore Development Authority v. Manoharlal (2020) 8 SCC 129 (Constitution Bench on Section 24 lapse)",
      "Haryana State Industrial Development Corp v. Pran Sukh (2012) 2 SCC 727 (Principles of market value estimation)"
    ]
  },
  {
    query: "What is Bhu-Aadhaar (ULPIN) and how does it prevent duplicate land transactions?",
    category: "Cadastral Technology & Identity",
    statute: "DILRMP Technical Standards / DoLR Guidelines",
    section: "ULPIN Technical Standard 2021-2024",
    officialTextSummary: "Bhu-Aadhaar is a 14-digit alphanumeric Unique Land Parcel Identification Number (ULPIN) generated using the latitude and longitude of the parcel's polygon centroid (WGS-84 reference system). It acts as the single source of truth across Revenue, Registration, Banking, and Survey departments.",
    governanceImplication: "When linked to the sub-registrar office, the system blocks registration of any sale deed where the ULPIN is already flagged with an active mortgage, court injunction, or forest reserve overlap.",
    recommendedWorkflow: [
      "Query cadastral vector shapefile in PostGIS to compute parcel centroid.",
      "Run the standard 14-digit base-32 geohash encoding with Luhn mod-36 checksum.",
      "Bind ULPIN to 7/12 (RoR), Khata, and Encumbrance Certificate databases.",
      "Publish ULPIN QR code on all certified revenue extracts."
    ],
    applicablePrecedents: [
      "DoLR Bhu-Aadhaar National Rollout Advisory 2023",
      "DILRMP Apex Committee Resolution on Cadastral Interoperability"
    ]
  },
  {
    query: "What are the legal grounds for challenging a contested mutation in agricultural land?",
    category: "Revenue Jurisprudence & Mutations",
    statute: "State Land Revenue Codes (e.g. MLRC 1966 Section 149-150 / UP Revenue Code 2006)",
    section: "Section 149 & 150 MLRC / Section 33 UP Revenue Code",
    officialTextSummary: "Mutation (Namantaran/Ferfar) is a fiscal entry for revenue collection and does not confer absolute proprietary title. Valid grounds for objection include: lack of statutory notice to recorded co-heirs, pending partition suit in civil court, unregistered agreement of sale, fraud or impersonation, or violation of fragmentation prevention laws (Tukadebandi).",
    governanceImplication: "Revenue officers (Talathi / Naib Tahsildar) who sanction mutations without serving mandatory 15-day notices to registered co-sharers expose the administration to writ petitions and criminal complaints.",
    recommendedWorkflow: [
      "Issue automated SMS and public notice on Bhoomi / Mahabhulekh portal upon mutation application.",
      "Check pending litigation register in e-Courts database matching parcel survey number.",
      "If disputed, refer matter to disputed cases register (Form IX) for formal hearing by Circle Officer."
    ],
    applicablePrecedents: [
      "Suraj Bhan & Ors v. Financial Commissioner (2007) 6 SCC 186 (Mutation does not create title)",
      "Bhimabai Mahadeo Kambekar v. Arthur Import & Export Co. (2019) 3 SCC 191"
    ]
  },
  {
    query: "How does the Forest Rights Act (FRA 2006) interact with infrastructure land acquisition?",
    category: "Tribal Rights & Forest Conservation",
    statute: "Forest Rights Act 2006 & RFCTLARR Act 2013",
    section: "Section 4(5) FRA 2006 / Section 41 RFCTLARR 2013",
    officialTextSummary: "Section 4(5) of FRA 2006 expressly mandates that no member of a forest dwelling Scheduled Tribe or other traditional forest dweller shall be evicted or removed from forest land until the verification and recognition of rights is complete. Furthermore, Section 41 of RFCTLARR Act requires prior informed consent of the Gram Sabha in Schedule V areas.",
    governanceImplication: "Attempting to divert forest fringe land without Gram Sabha resolution or settlement of Community Forest Rights (CFR) causes immediate project injunctions by the National Green Tribunal (NGT) or High Courts.",
    recommendedWorkflow: [
      "Overlay Forest Department Cadastral Boundary with Gram Sabha CFR boundary in GIS.",
      "Verify completion of Form A/B claims at Sub-Divisional Level Committee (SDLC).",
      "Obtain mandatory Gram Sabha resolution under Section 4(5) prior to Section 11 gazette.",
      "Provide 1/3rd additional compensation package for ST families under Section 41 RFCTLARR."
    ],
    applicablePrecedents: [
      "Orissa Mining Corporation v. MoEF & Others (Niyamgiri Case - 2013) 6 SCC 476",
      "Pradeep Kumar v. Union of India (2021) SCC Online SC 522"
    ]
  }
];

export const RESEARCH_THEMES = [
  {
    id: "26019",
    code: "PME-DoLR",
    title: "Evidence-Based Land Governance Platform (PME Division)",
    leadAgency: "Department of Land Resources (DoLR), MoRD",
    status: "Active Innovation Pillar",
    description: "Unified digital layer integrating research corpora, policy simulation digital twins, legal knowledge retrieval, and spatial evidence across 28 states.",
    metrics: "30,008 resources · 742 districts modeled · 94% metadata completeness"
  },
  {
    id: "25017",
    code: "AI-DELAYS",
    title: "Predictive Analytics for Early Detection of Acquisition Delays",
    leadAgency: "National Highway Authority of India & DoLR",
    status: "Active Research Sandbox",
    description: "Machine learning forecasting of land acquisition bottlenecks using historical court stay data, circle-to-market rate divergence, and heirship fragmentation.",
    metrics: "Trained on 18,300 acquisition awards · 84.2% precision on 12-month delay prediction"
  },
  {
    id: "26015",
    code: "SRISHTI-WATERSHED",
    title: "Geospatial Image Analysis via SRISHTI-DRISHTI (30m Data)",
    leadAgency: "NRSC / ISRO & Watershed Development Division",
    status: "Operational Layer",
    description: "Multi-temporal satellite monitoring of watershed structures, vegetative index (NDVI), and soil moisture restoration across drought-prone districts.",
    metrics: "Over 2.4 million geo-tagged water harvesting structures monitored nationwide"
  },
  {
    id: "26016",
    code: "NAT-LMS",
    title: "Real-Time National Land Acquisition & GIS Cadastral Tracking",
    leadAgency: "Central Ministries Taskforce & NIC",
    status: "Field Pilot",
    description: "End-to-end tracking of Person-Parcel-Pixel spatial records from Section 4 SIA to final possession and award disbursement.",
    metrics: "8 national expressway corridors · 42,000 hectares tracked live"
  },
  {
    id: "26018",
    code: "AI-DIGITIZE",
    title: "AI Multilingual Land Record Digitization & DILRMP Validation",
    leadAgency: "IIT Madras, CDAC & DoLR",
    status: "Testing & Validation",
    description: "Multilingual OCR and handwriting recognition for Modi-script (Maharashtra), Persian/Urdu records (Northern India), and Halegannada (Karnataka).",
    metrics: "Over 1.2 million legacy colonial and princely state revenue folios transcribed"
  }
];
