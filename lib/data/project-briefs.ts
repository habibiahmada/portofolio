/**
 * Structured briefs for client / website projects that are not full case studies.
 * Rendered on /projects/[slug] using the portfolio detail structure:
 * Overview -> Context -> Solution -> Role -> Key Features -> Technical -> Result.
 *
 * Keep copy recruiter-facing: what the project is, why it exists, what I did,
 * and what shipped. No invented metrics.
 */
import { WEBEKSPRES_ROLE } from "./project-meta-seed";

export type ProjectBrief = {
  projectId: string;
  /** 1-2 sentences: what it is, who it is for, the goal. */
  overview: string;
  /** Why the project was needed (business or user need). */
  context: string;
  /** How the build addresses the need (approach, not a tech list). */
  solution: string;
  /** What I personally designed, developed, or integrated. */
  role: string;
  /** 3-6 key features. */
  features: string[];
  /** Technology plus how it was used / notable decisions. */
  techNotes: string;
  /** What was delivered and its status. */
  result: string;
};

const BRIEFS: ProjectBrief[] = [
  {
    projectId: "2ca2341f-449d-5b44-a919-f628586fed79", // Sumbawa TourismLand
    overview:
      "Sumbawa TourismLand is a land-investment website for a West Sumbawa operator that sells verified, tourism-zoned plots to foreign and domestic buyers under legal HGB titles.",
    context:
      "Land investment in Indonesia is high-trust and high-friction: foreign buyers worry about ownership legality, title verification, and who actually manages the asset. The client needed a site that answers those objections before an enquiry, not a generic property listing.",
    solution:
      "I built a credibility-first marketing site: a verified-plot catalog with detail pages, an ownership-and-due-diligence story (HGB via PT PMA), investment rationale, and a multilingual UI so international buyers read it in their own language before reaching out.",
    role: WEBEKSPRES_ROLE,
    features: [
      "Verified land-plot catalog with individual detail pages",
      "Ownership and legal-title explainer (HGB / PT PMA) to pre-answer buyer objections",
      "Investment-rationale sections (valuation, airport hub, foreign ownership)",
      "TranslatePress multilingual UI for international buyers",
      "Direct enquiry and WhatsApp consultation paths",
    ],
    techNotes:
      "WordPress with Elementor on the Astra theme for the page system, PHP under the hood, and TranslatePress for the multilingual layer so every plot and legal page is available in more than one language.",
    result:
      "Delivered and live at sumbawatourismland.com as the operator's primary channel for qualifying and converting land-investment enquiries.",
  },
  {
    projectId: "ebd04466-7e2e-55a3-9705-e41d013a359f", // Forklift Listrik
    overview:
      "forkliftlistrik.id is a catalog and consultation website for an electric-forklift seller, helping warehouses and factories pick the right unit for their load, lift height, and budget.",
    context:
      "Buyers rarely know which forklift spec fits their operation, so a plain product list does not convert. The business needed a site that both showcases units and guides the buyer toward a consultation.",
    solution:
      "I built a catalog site organised around real buying decisions: new and used units, batteries and chargers, an 'why electric' value section, and a unit-selection consultation path that routes undecided buyers straight to WhatsApp.",
    role: WEBEKSPRES_ROLE,
    features: [
      "Product catalog split into new units, used units, and batteries/chargers",
      "Company profile and operating-hours block",
      "'Why electric forklift' benefits section (cost, indoor use, quiet, low maintenance)",
      "Unit-selection consultation flow for buyers unsure of specs",
      "WhatsApp consultation as the primary conversion path",
    ],
    techNotes:
      "WordPress with Elementor on the Astra theme, using WooCommerce to structure the forklift catalog and product detail pages, with WhatsApp deep links for fast enquiry.",
    result:
      "Delivered and live at forkliftlistrik.com as the seller's catalog and lead-generation channel.",
  },
  {
    projectId: "4c336b3b-5898-5ad5-bed3-239f972f5814", // Razka
    overview:
      "PT Razka Karya Nusantara is a corporate profile site for a multi-service company spanning entertainment, travel, staffing, management consulting, and automotive parts.",
    context:
      "A company offering many unrelated services risks looking unfocused online. The client needed a single, credible profile that presents every service line as one integrated business.",
    solution:
      "I built a clear company profile that frames the services as one ecosystem: an about section, a structured services grid, reasons-to-choose block, and direct contact paths so each service line still has an obvious next step.",
    role: WEBEKSPRES_ROLE,
    features: [
      "Company profile with vision and integrated-services framing",
      "Structured services grid (entertainment, staffing, travel, consulting, auto parts)",
      "'Why choose us' credibility section",
      "Direct contact and enquiry paths per service",
      "Responsive company-profile layout",
    ],
    techNotes:
      "WordPress with Elementor on the Astra theme, structured so a broad, multi-service company reads as one coherent brand.",
    result:
      "Delivered and live at razka.id as the company's official profile across all of its service lines.",
  },
  {
    projectId: "e2c181c4-e4c2-5546-8303-a14f27aaa90a", // Giftara Souvenir
    overview:
      "Giftara Souvenir is a corporate-gifts and merchandise catalog site for businesses, communities, and schools looking to order branded souvenirs.",
    context:
      "Corporate-gift buyers shop by product type and want to picture their logo on the item before enquiring. The business needed a browsable catalog that doubles as a branding pitch.",
    solution:
      "I built a category-led catalog (mugs, tumblers, shirts, umbrellas, pens, agendas and more) where each category explains the product's promotional value, turning a product list into a branding argument that ends in an order enquiry.",
    role: WEBEKSPRES_ROLE,
    features: [
      "Product catalog organised by souvenir category",
      "Per-category copy framing each item as a promotional medium",
      "Social-proof block (trusted by companies, communities, schools)",
      "Product browsing and order-enquiry paths",
      "Responsive catalog layout",
    ],
    techNotes:
      "WordPress with Elementor on the Astra theme, with a category-driven catalog structure so buyers browse by product and reach an enquiry quickly.",
    result:
      "Delivered and live at giftarasouvenir.com as the brand's product catalog and enquiry channel.",
  },
  {
    projectId: "ea4a35c1-5f60-5c8d-94d7-f0877fb2bfd1", // Indatu
    overview:
      "Indatu is a corporate profile site for an Indonesian global trading and shipping company that connects local resources with international import/export demand.",
    context:
      "An international trading partner is chosen on reliability and reach. The company needed a professional English-language profile that signals logistical capability to overseas partners.",
    solution:
      "I built a corporate profile that leads with credibility: trade and shipping capabilities, an advantages section (network, delivery, pricing, support), headline capability figures, and clear contact paths for global partners.",
    role: WEBEKSPRES_ROLE,
    features: [
      "English-first corporate profile for international partners",
      "Trading and shipping capability sections",
      "Advantages block (global network, fast delivery, competitive price, 24/7 support)",
      "Capability highlights (export products, import partners, shipping routes)",
      "Partner contact and product-view paths",
    ],
    techNotes:
      "WordPress with Elementor on the Astra theme, structured as a professional B2B profile aimed at an international audience.",
    result:
      "Delivered and live at indatu.co.id as the company's gateway profile for global trade partners.",
  },
  {
    projectId: "69aeb916-9cfc-56b0-976b-88ee634f93b6", // Karya Yudita Baroqah
    overview:
      "CV Karya Yudita Baroqah is a corporate site for a metal-casting and fabrication workshop that makes ship and industrial-machine spare parts in brass, bronze, and alloys.",
    context:
      "Industrial buyers order custom, made-to-spec parts and need proof of precision and material quality before trusting a supplier. The workshop needed a site that establishes manufacturing credibility.",
    solution:
      "I built a manufacturer profile centred on capability: casting and fabrication services, materials handled, custom-to-drawing positioning, and trust markers (years of experience, nationwide delivery) leading to a direct enquiry.",
    role: WEBEKSPRES_ROLE,
    features: [
      "Manufacturer profile with capability and materials sections",
      "Core services (metal casting, fabrication) explained",
      "Custom-to-drawing / sample positioning",
      "Trust markers: experience, nationwide delivery, quality focus",
      "Direct enquiry path for quotes",
    ],
    techNotes:
      "WordPress with Elementor on the Astra theme, structured as an industrial-manufacturer profile that foregrounds precision and material quality.",
    result:
      "Delivered and live at karyayuditabarokah.web.id as the workshop's official profile and quote-enquiry channel.",
  },
  {
    projectId: "73038783-8389-5626-8ab0-473f0b5284ae", // Hatta Global Partner
    overview:
      "PT Hatta Global Partner is a landing page for a training and consulting firm that helps companies improve operations, people, and change management.",
    context:
      "Consulting is sold on outcomes and trust in the consultants. The firm needed a conversion-focused page that names client pain points and positions its senior consultants as the fix.",
    solution:
      "I built a benefit-led landing page: a problem framing (inefficient operations, competency gaps, hard transitions), an about/consultant-credibility section, service positioning tied to ROI, and clear contact CTAs.",
    role: WEBEKSPRES_ROLE,
    features: [
      "Conversion-focused hero with dual CTAs",
      "Business-challenge framing (operations, competency, change management)",
      "Senior-consultant credibility section",
      "Service and ROI-oriented positioning",
      "Contact and consultation CTAs",
    ],
    techNotes:
      "WordPress with Elementor on the Astra theme, built as a focused, conversion-oriented landing page rather than a generic brochure theme.",
    result:
      "Delivered and live at hatta.web.id as the firm's lead-generation landing page.",
  },
  {
    projectId: "243b5551-81aa-598a-991d-4b55dbbfc259", // Jatim Utama (jual beli besi tua)
    overview:
      "Jatim Utama is a corporate site for a scrap-metal and industrial-asset buyer that purchases old iron, machinery, and demolition material from companies.",
    context:
      "Companies clearing assets want a fair valuation and a safe, responsible removal process. The business needed a site that reads as trustworthy and safety-conscious, not an informal scrap dealer.",
    solution:
      "I built a service profile around transparent valuation and safe execution: a services grid (plant/building demolition, scrap purchase, used-machine buying, site clearing), accepted-materials list, and a free site-survey enquiry path.",
    role: WEBEKSPRES_ROLE,
    features: [
      "Vision/mission framing around fair appraisal and workplace safety",
      "Services grid: plant and building demolition, scrap and used-machine purchase, site clearing",
      "Accepted-materials list (iron, steel, stainless, and more)",
      "Free site-survey / valuation enquiry path",
      "Responsive corporate layout",
    ],
    techNotes:
      "WordPress with Elementor on the Astra theme, structured to make an industrial scrap-buying service read as transparent and safety-first.",
    result:
      "Delivered and live at jualbelibesitua.id as the company's service profile and survey-enquiry channel.",
  },
  {
    projectId: "9e5f8eb2-4964-5c5f-84d2-93c3b0a9bc1d", // Aisyn Craft
    overview:
      "Aisyn Craft is a catalog site for an artisanal brand selling upcycled floral arrangements, home decor, and handmade merchandise.",
    context:
      "A craft brand lives on visual identity and a consistent look across its products. The brand needed both a browsable catalog and a coherent UI design system to present its handmade work well.",
    solution:
      "I worked on the catalog site and its UI design system: product presentation for the upcycled floral and decor range, plus a consistent visual language so the storefront feels as considered as the products.",
    role: WEBEKSPRES_ROLE,
    features: [
      "Product catalog for upcycled floral arrangements and home decor",
      "Artisanal merchandise presentation",
      "Reusable UI design system for a consistent storefront",
      "Responsive, visual-first layout",
      "Enquiry / order path",
    ],
    techNotes:
      "WordPress with Elementor on the Astra theme, paired with a defined UI design system so the catalog stays visually consistent across pages.",
    result:
      "Delivered as the brand's catalog storefront with a reusable design system underpinning its look.",
  },
  {
    projectId: "20479cf8-542e-5223-8ff5-350d001e19a7", // Soraya Spa
    overview:
      "Soraya Spa Massage is a booking-oriented site for a premium home-service spa in Batam that brings professional massage therapy to homes, hotels, and offices.",
    context:
      "Home-service spa is sold on trust, privacy, and convenience. The business needed a site that reassures customers about professionalism and makes booking a treatment effortless.",
    solution:
      "I built a service site that leads with trust signals (professional therapists, privacy, on-location service) and a clear treatment menu (Balinese, aromatherapy, reflexology) where every option routes to a WhatsApp booking.",
    role: WEBEKSPRES_ROLE,
    features: [
      "Home/hotel/office on-location service positioning",
      "Trust-and-privacy reassurance blocks",
      "Treatment menu with per-treatment descriptions",
      "WhatsApp booking as the primary CTA",
      "Responsive, calming service layout",
    ],
    techNotes:
      "WordPress with Elementor on the Astra theme, structured around trust signals and a frictionless WhatsApp booking flow.",
    result:
      "Delivered and live at sorayaspamassag.com as the spa's booking and enquiry channel.",
  },
  {
    projectId: "c21994a4-0ab1-55e0-bab9-1d1d200f0a6f", // Ittihadiyah Tanreassona
    overview:
      "Pondok Pesantren Ittihadiyah Tanreassona Pinrang is an education site for an Islamic boarding school covering its programs, values, and admissions.",
    context:
      "Parents choosing a boarding school weigh values, curriculum, and how to enrol. The school needed a site that communicates its identity and makes registration approachable.",
    solution:
      "I built an admissions-oriented school site: program overviews (boarding, Madrasah Aliyah/Tsanawiyah, tahfidz), an about-and-values narrative, and prominent register/contact paths for prospective families.",
    role: WEBEKSPRES_ROLE,
    features: [
      "Program overview (boarding, secondary levels, tahfidz Qur'an)",
      "About and educational-values narrative",
      "Admissions-focused register and contact CTAs",
      "News/announcement-ready structure",
      "Responsive education layout",
    ],
    techNotes:
      "WordPress with Elementor on the Astra theme, structured for a school audience with admissions as the primary goal.",
    result:
      "Delivered and live at ittihadiyahtanreassona.ponpes.id as the pesantren's public profile and admissions entry point.",
  },
  {
    projectId: "00f837eb-3fa1-5848-bce3-b2d35d4dc9f2", // Edu Global
    overview:
      "Edu Global is an education-consultancy site that guides Indonesian students toward international universities, from course selection to visas and scholarships.",
    context:
      "Studying abroad is overwhelming, and families need to trust a consultant to guide the whole journey. The business needed a site that explains its value and captures leads at the decision point.",
    solution:
      "I built a consultancy site that maps the full journey (choosing a university, application-to-visa support, scholarship guidance) and backs it with advantage blocks and a services overview leading to consultation enquiries.",
    role: WEBEKSPRES_ROLE,
    features: [
      "Explainer on why a consultant matters (major/university fit)",
      "End-to-end support framing: application to student visa",
      "Scholarship information and preparation guidance",
      "Advantages block (global network, personal approach, experienced team)",
      "Consultation enquiry paths",
    ],
    techNotes:
      "WordPress with Elementor on the Astra theme, structured around the study-abroad decision journey to convert visitors into consultation leads.",
    result:
      "Delivered and live at eduglobal.co.id as the consultancy's lead-generation site.",
  },
  {
    projectId: "25d41ace-dab0-5ddf-8e3b-3b8024ee4e27", // Anugrah Tour
    overview:
      "PT Anugrah Tour and Travel is a corporate site for a Sampit-based travel agency offering domestic and international tours plus umrah packages for individuals and groups.",
    context:
      "Travel buyers compare packages and want reassurance that an agency is legitimate and service-focused. The agency needed a site that presents packages clearly and signals professionalism.",
    solution:
      "I built a travel-agency site with a package-led layout: domestic/international tours and umrah, an about section establishing legitimacy (established 2023, registered), and WhatsApp consultation for both personal and group trips.",
    role: WEBEKSPRES_ROLE,
    features: [
      "Package-led layout (domestic, international, umrah)",
      "Personal and group/company/school trip positioning",
      "Legitimacy and about section (registered, established 2023)",
      "WhatsApp consultation CTA",
      "Responsive travel layout",
    ],
    techNotes:
      "WordPress with Elementor on the Astra theme, structured around browsable travel packages and quick WhatsApp enquiry.",
    result:
      "Delivered and live at ptanugrahtourandtravel.com as the agency's package showcase and enquiry channel.",
  },
  {
    projectId: "0178ba6c-a506-5401-819e-1bb3d2a1c397", // Aspalindo Hotmix
    overview:
      "Aspal Hotmix is a corporate site for an asphalt-paving contractor in Ciawi, Bogor, serving road, factory, and residential paving projects.",
    context:
      "Contractors win work on proven capability and trust. The business needed a site that presents its services and quality standards and makes requesting a free survey easy.",
    solution:
      "I built a contractor profile around services and credibility: new paving, overlay, and repair services, a company profile emphasising certified materials and experienced crews, and a free-survey enquiry path.",
    role: WEBEKSPRES_ROLE,
    features: [
      "Service breakdown (new paving, overlay, road repair)",
      "Company profile emphasising certified materials and equipment",
      "Trust markers (field experience, expert crew, free survey)",
      "Free site-survey enquiry path",
      "Responsive contractor layout",
    ],
    techNotes:
      "WordPress with Elementor on the Astra theme, structured to present a paving contractor's capability and route project owners to a survey request.",
    result:
      "Delivered and live at aspalidohotmix.com as the contractor's service profile and survey-enquiry channel.",
  },
  {
    projectId: "67978780-65a3-4a1a-94e6-60a0bd354b72", // Triply
    overview:
      "Triply is a website for a Bandung travel-experience company offering open trips across Indonesia, private itineraries, campus and corporate/MICE programs, and escorted trips to Hong Kong and Japan.",
    context:
      "Trips go wrong in the details nobody writes down, and organizations buy accountability. Triply needed a site that sells clarity, not just destinations, and works for both individual travellers and institutions.",
    solution:
      "I built a package-catalog site where clarity is the product: written include/exclude, transparent pricing, minimum-departure honesty, and a separate track for campus and corporate buyers who need proposals they can defend in a meeting.",
    role: WEBEKSPRES_ROLE,
    features: [
      "Tour-package catalog with detail pages (domestic and international)",
      "Written include/exclude and transparent per-person pricing",
      "Campus and corporate/MICE program track",
      "Trust framing (written confirmation, one planner per trip)",
      "WhatsApp enquiry as the conversion path",
    ],
    techNotes:
      "WordPress with Elementor on the Astra theme, structured so each package reads with the same written clarity the brand promises.",
    result:
      "Delivered and live at triply.co.id as the company's package catalog and enquiry channel for travellers and organizations.",
  },
  {
    projectId: "1636bd61-2b93-4fb0-b6ea-d6456dbf77ea", // Subulussalam Insan Global
    overview:
      "Subulussalam Insan Global is a bus-charter website for South Sumatra groups travelling for tourism, pilgrimage, study tours, and official events.",
    context:
      "Groups renting a bus want to see the actual fleet and get a clear, fast quote. The business needed a site that shows real units and turns enquiries into confirmed rentals without back-and-forth.",
    solution:
      "I built a charter site around trust and speed: big and medium fleet listings, a genuine on-location gallery, a three-step booking flow (send trip details, confirm unit, lock the date), and WhatsApp consultation.",
    role: WEBEKSPRES_ROLE,
    features: [
      "Big and medium bus fleet listings",
      "On-location fleet gallery (real units, not stock photos)",
      "Three-step booking flow (details, unit confirmation, date lock)",
      "Use-case framing (tourism, pilgrimage, study tour, official events)",
      "WhatsApp consultation CTA",
    ],
    techNotes:
      "WordPress with Elementor on the Astra theme, structured around a clear booking flow and a real fleet gallery.",
    result:
      "Delivered and live at subulussalaminsanglobal.com as the operator's fleet showcase and booking-enquiry channel.",
  },
  {
    projectId: "08ad34a3-c3f9-4630-817e-e08140f6b0ad", // Louise Pilates
    overview:
      "Louise Pilates is a Pilates-studio website in Bekasi with an integrated booking system that lets customers book and manage sessions without creating a traditional user account.",
    context:
      "Boutique studios lose bookings when customers are forced to register and remember a password. The studio needed a public site and a booking flow that stays effortless for first-timers and returning clients alike.",
    solution:
      "I developed an authentication-free booking flow built on email verification: after verifying their email, a customer completes a booking and can look up their existing bookings straight from the booking page, with verified details kept locally for a smoother return visit.",
    role: WEBEKSPRES_ROLE,
    features: [
      "Authentication-free booking flow using email verification",
      "Email-based customer booking lookup (view bookings without an account)",
      "Booking and transaction status flows",
      "Transactional email notifications for booking and transaction updates",
      "Verified customer data cached locally for a smoother returning-user experience",
      "Responsive public site: schedules, pricing, classes, and studio info",
    ],
    techNotes:
      "A responsive public studio website paired with a custom booking system. Instead of accounts, the flow uses email verification to identify customers, transactional email for booking and status updates, and local storage to remember verified users between visits.",
    result:
      "Delivered and live at louisepilates.com, letting the studio take and manage bookings while keeping the customer experience account-free.",
  },
];

const BRIEF_BY_ID: Record<string, ProjectBrief> = Object.fromEntries(
  BRIEFS.map((b) => [b.projectId, b]),
);

export function getProjectBrief(projectId: string): ProjectBrief | undefined {
  return BRIEF_BY_ID[projectId];
}

export const PROJECT_BRIEFS = BRIEFS;
