/**
 * Every fact on the site lives here, with its source.
 *
 * [NST]   Balvin Kaur, "Hameediyah, Penang's oldest nasi kandar restaurant still going strong",
 *         New Straits Times, 20 August 2019.
 * [PTC]   "The History of Hameediyah, Penang Oldest Nasi Kandar", PenangToday Community (Facebook),
 *         27 February 2025  republishes the NST text with photographs.
 * [SIGN]  Restaurant signage visible in the reference photographs (address, "Est. 1907", telephone).
 * [BOARD] The historic Hameediyah menu board photographed in the PenangToday post.
 * [BRIEF] The project brief supplied by the client.
 *
 * Do not add dates, figures, prices or opening hours that cannot be traced to one of these.
 */

export const FOUNDED = 1907;

export const sources = {
  nst: {
    title: "Hameediyah, Penang's oldest nasi kandar restaurant still going strong",
    publication: "New Straits Times",
    author: "Balvin Kaur",
    date: "20 August 2019",
    url: "https://www.nst.com.my/news/nation/2019/08/514320/hameediyah-penangs-oldest-nasi-kandar-restaurant-still-going-strong",
  },
  ptc: {
    title: "The History of Hameediyah, Penang Oldest Nasi Kandar",
    publication: "PenangToday Community (Facebook group)",
    date: "27 February 2025",
    url: "https://www.facebook.com/groups/penangtoday/posts/3137769789707580/",
  },
} as const;

export const visit = {
  name: "Hameediyah Restaurant",
  street: "164A Lebuh Campbell",
  streetAlt: "Campbell Street",
  postcode: "10100",
  city: "George Town",
  state: "Penang",
  country: "Malaysia",
  phoneDisplay: "04-261 1095", // [SIGN] painted on the shutter and shown on the signage in [NST] photographs
  phoneHref: "tel:+6042611095",
  lat: 5.4175, // Lebuh Campbell, OpenStreetMap
  lng: 100.3347,
  hours: { days: "Monday  Sunday", time: "10am  11pm" }, // supplied by the client
  mapsQuery: "Hameediyah Restaurant, 164A Lebuh Campbell, George Town, Penang",
} as const;

export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(visit.mapsQuery)}`;
export const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(visit.mapsQuery)}`;
export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(visit.mapsQuery)}&z=17&output=embed`;

export const family = {
  founder: "M. Mohamed Thamby Rawther",
  origin: "Chittarkottai",
  district: "Ramanathapuram",
  region: "Tamil Nadu, India",
  sons: ["Seeni Packeer", "Packeer Mohamed", "Abdul Ghaney"],
  sixthGeneration: { name: "Ahmed Seeni Pakir", note: "sixth generation of the Rawther family (aged 65 in 2019)" },
  seventhGeneration: { name: "Abdul Sukkor Syed Ibrahim", note: "seventh-generation Hameediyah (aged 23 in 2019)" },
} as const;

/** [NST] "We use the same masala, which includes fennel, cumin, white pepper, almond and cashew nuts" */
export const masala = [
  { id: "fennel", name: "Fennel", tamil: "சோம்பு", note: "Sweet, anise-bright seed" },
  { id: "cumin", name: "Cumin", tamil: "சீரகம்", note: "Earthy, warm, toasted" },
  { id: "white-pepper", name: "White pepper", tamil: "வெள்ளை மிளகு", note: "Clean, lingering heat" },
  { id: "almond", name: "Almond", tamil: "பாதாம்", note: "Body and richness" },
  { id: "cashew", name: "Cashew", tamil: "முந்திரி", note: "Creamy depth" },
] as const;

/** [NST] "We still buy whole spices, mix, roast and grind them ourselves." */
export const masalaProcess = ["Buy whole", "Mix", "Roast", "Grind"] as const;

export const quotes = {
  notAChef: {
    text: "Mohamed Thamby was not a chef. But he was good at observing the cooking skills of his grandfather, who was a well-known wedding cook in his village, and that of the female members of the family.",
    by: "Ahmed Seeni Pakir, sixth generation",
  },
  masala: {
    text: "With his knowledge of spices and tips from family members, Mohamed Thamby and his sons came up with their own masala recipe, which is still used as the base of all our curries until today.",
    by: "Ahmed Seeni Pakir, sixth generation",
  },
  share: {
    text: "They wanted to show how customers could use spices in their cooking and share with them their culinary skills.",
    by: "Ahmed Seeni Pakir, sixth generation",
  },
  kandar: {
    text: "They would cook the curries at the back of their spice shop, and transport two basketfuls of nasi kandar balanced on a pole to the field. It was this method of carrying the food that gave nasi kandar its name.",
    by: "Ahmed Seeni Pakir, sixth generation",
  },
  ambitious: {
    text: "They were ambitious, smart, and knew where to sell their wares.",
    by: "Ahmed Seeni Pakir, sixth generation",
  },
  upheavals: {
    text: "Whatever the upheavals in and around Penang, the Hameediyahs were still a hot commodity.",
    by: "New Straits Times, 2019",
  },
  wholeSpices: {
    text: "We still buy whole spices, mix, roast and grind them ourselves.",
    by: "Abdul Sukkor Syed Ibrahim, seventh generation",
  },
  quality: {
    text: "We make sure that our spices are of good quality, and that our meat and seafood are fresh.",
    by: "Abdul Sukkor Syed Ibrahim, seventh generation",
  },
} as const;

/** Streets the family walked to sell nasi kandar [NST] */
export const sellingRoutes = [
  { name: "The docks at the nearby jetty" },
  { name: "Jalan Pitt", now: "now Jalan Kapitan Keling" },
  { name: "Jalan Datuk Koyah" },
  { name: "Jalan Perangin", now: "now Jalan Prangin" },
  { name: "Tanjung Tokong" },
  { name: "Jalan Penang", now: "where there was once a river  on market days" },
] as const;

export type Era = "origin" | "street" | "war" | "shop" | "growth" | "today";

export type Milestone = {
  id: string;
  year: string;
  era: Era;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  caption: string;
};

export const milestones: Milestone[] = [
  {
    id: "arrival",
    year: "1900s",
    era: "origin",
    title: "A spice trader arrives",
    body: "M. Mohamed Thamby Rawther, a spice trader from Chittarkottai in Ramanathapuram, Tamil Nadu, arrives in Penang with his three sons  Seeni Packeer, Packeer Mohamed and Abdul Ghaney.",
    image: "/images/harbour-ships.jpg",
    imageAlt: "Sailing ships and steamers anchored in Penang harbour, photographed before 1909",
    caption: "Ships in Penang harbour. Photograph by August Kaulfuss, before 1909.",
  },
  {
    id: "spice-shop",
    year: "Lebuh Campbell",
    era: "origin",
    title: "A house, and a spice shop",
    body: "The family rents a house on Lebuh Campbell from a Chinese landowner and sets up a shop selling spices from India. It is not long before they begin dabbling in the culinary business.",
    image: "/images/beach-street-1910.jpg",
    imageAlt: "Shophouses and rickshaws along Beach Street, George Town, around 1910",
    caption: "Beach Street, George Town, c. 1910  the city the family arrived into. C.J. Kleingrothe.",
  },
  {
    id: "angsana",
    year: "1907",
    era: "street",
    title: "Under the Angsana tree",
    body: "Mohamed Thamby begins selling nasi kandar under a large, shady Angsana tree on the field in front of the shop. Food may not yet be sold in shops, so curries are cooked at the back and carried out on a pole.",
    image: "/images/angsana-canopy.jpg",
    imageAlt: "The broad canopy of a mature Angsana tree",
    caption: "An Angsana tree (Pterocarpus indicus).",
  },
  {
    id: "queues",
    year: "Early years",
    era: "street",
    title: "From strangers to queues",
    body: "Business does not start well  people are not yet familiar with nasi kandar. Eventually it gains momentum, and the men walk for miles to sell: the docks, Jalan Pitt, Jalan Datuk Koyah, Jalan Perangin, right up to Tanjung Tokong.",
    image: "/images/weld-quay-1910.jpg",
    imageAlt: "Weld Quay waterfront in Penang around 1910",
    caption: "Weld Quay, Penang, c. 1910. C.J. Kleingrothe.",
  },
  {
    id: "occupation",
    year: "1940s",
    era: "war",
    title: "Through the occupation",
    body: "Demand never slows, even during the Japanese occupation. The men prepare more beef curry, noticing the Japanese soldiers and generals like the dish.",
    image: "/images/pier-1910.jpg",
    imageAlt: "The new pier at Penang, early twentieth century",
    caption: "The pier at Penang, c. 1910. C.J. Kleingrothe.",
  },
  {
    id: "banana-money",
    year: "1945",
    era: "war",
    title: "Spending the banana money",
    body: "When the British regain their hold on Malaya, sales spike  people hurry to spend their Japanese “banana money” before it becomes worthless.",
    image: "/images/quay-1910.jpg",
    imageAlt: "Boats moored along the quay in Penang",
    caption: "The quay at Penang, c. 1910. C.J. Kleingrothe.",
  },
  {
    id: "no-164",
    year: "After WWII",
    era: "shop",
    title: "No. 164, Lebuh Campbell",
    body: "After the Second World War, food is allowed to be sold in shops. The first Hameediyah restaurant opens at No. 164, Lebuh Campbell  famous for its curries, kurmas, kapitan, murtabak, nasi briyani, rendang and mee goreng.",
    image: "/images/ref-golden-moments.jpg",
    imageAlt: "A wall display titled The Golden Moments of Hameediyah, showing archive photographs of cooks and staff",
    caption: "“The Golden Moments of Hameediyah”  archive photographs on display. Via PenangToday Community.",
  },
  {
    id: "vietnam",
    year: "1960s70s",
    era: "shop",
    title: "Five thousand portions",
    body: "The Hameediyahs regularly supply immense quantities of food  including 5,000 portions of beef curry for American soldiers fighting in the Vietnam War.",
    image: "/images/ref-counter-archive.jpg",
    imageAlt: "Three Hameediyah elders in white caps behind the restaurant counter, from a family photograph",
    caption: "Behind the counter  a family photograph. Via PenangToday Community.",
  },
  {
    id: "free-port",
    year: "1969",
    era: "shop",
    title: "Loyal through the slump",
    body: "Penang's free port status is revoked and the economy falls into a slump, taking a toll on businesses. Loyal customers still come to Hameediyah.",
    image: "/images/ref-menu-board.jpg",
    imageAlt: "Hameediyah's old printed menu board listing briyani, curries, kurmah, martabak and mee goreng",
    caption: "Hameediyah's old menu board. Via PenangToday Community.",
  },
  {
    id: "growth",
    year: "1970s →",
    era: "growth",
    title: "As the city grew, so did Hameediyah",
    body: "The field where adults gathered and children ran is replaced by shoplots. No. 164 still stands. Outstation and overseas customers head to Penang just to taste the nasi kandar.",
    image: "/images/ref-counter-archive-b.jpg",
    imageAlt: "A Hameediyah cook in a yellow apron packing food at the counter",
    caption: "Packing nasi kandar at the counter. Via PenangToday Community.",
  },
  {
    id: "today",
    year: "Today",
    era: "today",
    title: "Seven generations on",
    body: "The green and yellow tiles and façade are retained, the heritage nasi kandar carrier is proudly displayed, and the elders' recipes are kept precisely  with Hameediyah Tandoori House just two doors away.",
    image: "/images/hameediyah-facade.jpg",
    imageAlt: "The yellow and green façade of Hameediyah Restaurant at No. 164A Campbell Street with a queue outside",
    caption: "Hameediyah Restaurant, No. 164A Campbell Street.",
  },
];

export type Dish = {
  id: string;
  name: string;
  board?: string;
  image: string;
  imageAlt: string;
  note: string;
  detail: string;
  illustrative: boolean;
};

/**
 * Signature dishes. Every name is verified by [NST] ("famous for its signature curries, kurmas, kapitan,
 * murtabak, nasi briyani, rendang, mee goreng") and/or the historic menu board [BOARD].
 * Ayam Bawang and Crab Curry from the brief are not mentioned in the references, so they are not shown.
 */
export const signatureDishes: Dish[] = [
  {
    id: "murtabak",
    name: "Murtabak",
    board: "Martabak  Chicken · Beef · Mutton · Vegetable",
    image: "/images/dish-murtabak.jpg",
    imageAlt: "Golden, griddled squares of murtabak with a wedge of lemon",
    note: "Named among Hameediyah's signatures.",
    detail: "On the old menu board it appears as Martabak, offered with chicken, beef, mutton or vegetable  and the word “MURTABAK” hangs over the counter in the archive photographs.",
    illustrative: true,
  },
  {
    id: "kurmah",
    name: "Mutton Kurmah",
    board: "Mutton Kurmah (Mild) · Chicken Kurmah (Mild)",
    image: "/images/dish-kurmah.jpg",
    imageAlt: "A plate of kurma curry in a rich red-gold gravy",
    note: "The kurmas are part of what made the name.",
    detail: "Listed as “mild” on the historic board. Like every Hameediyah curry, it begins with the family's own masala  fennel, cumin, white pepper, almond and cashew.",
    illustrative: true,
  },
  {
    id: "beef-curry",
    name: "Beef Curry",
    board: "Beef Curry  Large · Regular · A Piece",
    image: "/images/dish-rendang.jpg",
    imageAlt: "Dark, slow-cooked beef in a spiced gravy",
    note: "The dish history kept asking for.",
    detail: "Made in greater quantity during the Japanese occupation, and supplied by the 5,000 portion to American soldiers in the 1960s and 70s.",
    illustrative: true,
  },
  {
    id: "briyani",
    name: "Nasi Briyani",
    board: "Chicken Briyani  Saffron Rice · Mutton Briyani · Plain Briyani",
    image: "/images/dish-briyani.jpg",
    imageAlt: "Saffron-tinted briyani rice with spiced meat and pickles",
    note: "Saffron rice, by the full or half plate.",
    detail: "The old board offers chicken, mutton and plain briyani, each by the full or half plate.",
    illustrative: true,
  },
  {
    id: "kapitan",
    name: "Chicken Kapitan",
    board: "Chicken Kapitan (Roast)",
    image: "/images/dish-nasi-kandar.jpg",
    imageAlt: "A nasi kandar plate of rice with chicken and dark curry gravies",
    note: "A Penang classic, marked “roast” on the board.",
    detail: "Kapitan is one of the dishes the restaurant became famous for once it moved into No. 164 after the war.",
    illustrative: true,
  },
];

export type MenuItem = { name: string; note?: string };
export type MenuCategory = { id: string; label: string; tamil: string; image: string; imageAlt: string; items: MenuItem[] };

/** Transcribed from the historic menu board [BOARD]. Prices are deliberately omitted. */
export const menu: MenuCategory[] = [
  {
    id: "rice",
    label: "Briyani & Rice",
    tamil: "சோறு",
    image: "/images/dish-briyani.jpg",
    imageAlt: "Briyani rice with spiced meat",
    items: [
      { name: "Chicken Briyani", note: "Saffron rice · full or half plate" },
      { name: "Mutton Briyani", note: "Full or half plate" },
      { name: "Plain Briyani", note: "Full or half plate" },
      { name: "Plain Rice" },
      { name: "Nasi Goreng", note: "Fried rice" },
    ],
  },
  {
    id: "chicken",
    label: "Chicken",
    tamil: "கோழி",
    image: "/images/dish-kurmah.jpg",
    imageAlt: "Chicken in a red-gold kurma gravy",
    items: [
      { name: "Chicken Curry" },
      { name: "Chicken Kurmah", note: "Mild" },
      { name: "Chicken Kapitan", note: "Roast" },
      { name: "Chicken Fried" },
      { name: "Chicken Liver" },
    ],
  },
  {
    id: "mutton-beef",
    label: "Mutton & Beef",
    tamil: "இறைச்சி",
    image: "/images/dish-rendang.jpg",
    imageAlt: "Slow-cooked spiced beef",
    items: [
      { name: "Mutton Curry" },
      { name: "Mutton Mysore", note: "Large or regular" },
      { name: "Mutton Kurmah", note: "Mild" },
      { name: "Goat's Tripe Curry", note: "Large or regular" },
      { name: "Beef Curry", note: "Large, regular or by the piece" },
      { name: "Spiced Beef" },
      { name: "Ox Liver" },
    ],
  },
  {
    id: "seafood",
    label: "From the Sea",
    tamil: "கடல் உணவு",
    image: "/images/dish-nasi-kandar-b.jpg",
    imageAlt: "A nasi kandar plate with egg, vegetables and curries",
    items: [
      { name: "Fish Curry" },
      { name: "Fish Fried" },
      { name: "Cuttle Fish", note: "According to size" },
      { name: "Prawns", note: "According to size" },
    ],
  },
  {
    id: "griddle",
    label: "Griddle & Noodles",
    tamil: "தவா",
    image: "/images/dish-mee-goreng.jpg",
    imageAlt: "Fried yellow noodles with lime",
    items: [
      { name: "Martabak", note: "Chicken · beef · mutton · vegetable" },
      { name: "Roti Telur", note: "Egg and onions" },
      { name: "Mee Goreng", note: "Fried noodle" },
      { name: "Mee Rebus", note: "Boiled noodle" },
      { name: "Pasumbor" },
      { name: "Rojak" },
    ],
  },
];

export type HeritageNumber = { value: number; prefix?: string; suffix?: string; label: string; source: string };

export const heritageNumbers: HeritageNumber[] = [
  { value: 1907, label: "The year it began, under a tree on Lebuh Campbell", source: "NST; restaurant signage" },
  { value: 3, label: "Sons who came with Mohamed Thamby from Tamil Nadu", source: "NST" },
  { value: 7, suffix: "th", label: "Generation of the family carrying the recipes forward", source: "NST, 2019" },
  { value: 5000, label: "Portions of beef curry supplied to American soldiers, 1960s70s", source: "NST" },
  { value: 164, prefix: "No.", label: "Lebuh Campbell  the first restaurant, which still stands", source: "NST" },
  { value: 5, label: "Named ingredients in the original masala, still used today", source: "NST" },
];

export const journey = [
  { id: "tamil-nadu", label: "Tamil Nadu" },
  { id: "spices", label: "Spices & knowledge" },
  { id: "voyage", label: "Voyage to Penang" },
  { id: "waterfront", label: "The waterfront" },
  { id: "kandar", label: "The kandar" },
  { id: "campbell", label: "Campbell Street" },
  { id: "1907", label: "1907" },
  { id: "generations", label: "Generations" },
  { id: "today", label: "Today" },
] as const;

export const nav = [
  { href: "#story", label: "Our Story" },
  { href: "#journey", label: "The Journey" },
  { href: "#legacy", label: "Legacy" },
  { href: "#food", label: "Our Food" },
  { href: "#visit", label: "Visit" },
] as const;
