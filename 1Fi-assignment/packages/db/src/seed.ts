import "dotenv/config"
import { eq } from "drizzle-orm"
import {
  db,
  categories,
  sellers,
  products,
  productVariants,
  productSpecs,
  productTrustBadges,
  productBreadcrumbs,
  productOptions,
  reviews,
  reviewAttachments,
  emiTenureOptions,
  footerCategoryGroups,
  companyInfo,
  quickLinks,
  supportLinks,
  socialLinks,
} from "./index.js"

// ── Site config data (previously in apps/web/src/data/site.ts) ───────────────

const siteCategories = [
  "Mobiles",
  "Laptops",
  "Tablets",
  "Audio",
  "Wearables",
  "Accessories",
  "Cameras",
  "Gaming",
]

const siteFooterGroups = [
  {
    heading: "Shop",
    links: [
      "Mobiles",
      "Laptops",
      "Tablets",
      "Audio",
      "Wearables",
      "Accessories",
    ],
  },
  {
    heading: "Support",
    links: ["Help Center", "Return Policy", "Warranty", "Contact Us"],
  },
  {
    heading: "Company",
    links: ["About Us", "Careers", "Blog", "Press"],
  },
]

const siteCompanyInfo = {
  legalName: "1Fi Technologies Private Limited",
  address:
    "1Fi Technologies Private Limited, 3rd Floor, Tower B, Cyber City, Gurugram, Haryana 122002, India",
  phone: "+91-124-4567890",
  hours: "Mon - Sat: 9:00 AM - 8:00 PM IST",
}

const siteQuickLinks = [
  "About Us",
  "Careers",
  "Blog",
  "Press",
  "Affiliate Program",
]

const siteSupportLinks = [
  "Help Center",
  "Return Policy",
  "Warranty",
  "Contact Us",
  "Privacy Policy",
  "Terms of Service",
]

const siteSocialLinks: Record<string, string> = {
  Twitter: "https://twitter.com/1fi",
  Instagram: "https://instagram.com/1fi",
  Facebook: "https://facebook.com/1fi",
  LinkedIn: "https://linkedin.com/company/1fi",
}

// ── Catalog product data (previously in apps/web/src/data/catalog.ts) ────────

type CatalogProduct = {
  id: string
  slug: string
  name: string
  category: string
  breadcrumb: Array<{ label: string; href: string | null }>
  images: string[]
  selectedColor: string
  colorOptions: string[]
  selectedVariant: Record<string, string | null>
  variantOptions: Array<Record<string, string | null>>
  optionPricing: Array<{
    color: string | null
    variantLabel: string | null
    variantValue: string | null
    price: number
    mrp: number
    images: string[]
  }>
  price: number
  mrp: number
  rating: number
  overallRating: number
  soldCount: number
  appLinks: { appStore: string; playStore: string }
  tenureOptions: Array<{
    months: number
    monthlyAmount: number
    badge: string
    interestRate: string
    cashbackAmount: number
  }>
  defaultTenureIndex: number
  downPayment: number
  emiStartLabel: string
  seller: { name: string; url: string }
  shipping: { text: string }
  trustBadges: Array<{ icon: string; label: string }>
  specs: Array<{ label: string; value: string }>
  reviewMedia: Array<{ type: "image" | "video"; thumbnail: string }>
  reviews: Array<{
    stars: number
    variantDescription: string
    text: string
    attachments: Array<{ type: "image" | "video"; thumbnail: string }>
    reviewerName: string
    city: string
    verified: boolean
    timeAgo: string
  }>
}

function generateEmiOptions(price: number): CatalogProduct["tenureOptions"] {
  const tenures = [3, 6, 9, 12, 18, 24]
  return tenures.map((months) => {
    const monthlyAmount = Math.round(price / months)
    const interestRate = months <= 6 ? "0%" : months <= 12 ? "2.5%" : "5%"
    const cashbackAmount = Math.round(price * 0.01 * (months <= 6 ? 1 : months <= 12 ? 2 : 3))
    const badge = months <= 6 ? "No Cost EMI" : months <= 12 ? "Low Interest" : "Extended Plan"
    return { months, monthlyAmount, badge, interestRate, cashbackAmount }
  })
}

const TRUST_BADGES: CatalogProduct["trustBadges"] = [
  { icon: "lock", label: "Secure Payment" },
  { icon: "delivery", label: "Free Delivery" },
  { icon: "replacement", label: "7 Day Replacement" },
  { icon: "crown", label: "Top Brand" },
]

const IMAGE_BASE = "https://images.unsplash.com/"

const mobileImages: [string, string, string] = [
  `${IMAGE_BASE}photo-1592750475338-74b7b21085ab?w=600`,
  `${IMAGE_BASE}photo-1511707171634-5f897ff02aa9?w=600`,
  `${IMAGE_BASE}photo-1565849904461-04a58ad377e0?w=600`,
]

const laptopImages: [string, string] = [
  `${IMAGE_BASE}photo-1496181133206-80ce9b88a853?w=600`,
  `${IMAGE_BASE}photo-1525547719571-a2d4ac8945e2?w=600`,
]

const tabletImages: [string, string] = [
  `${IMAGE_BASE}photo-1544244015-0df4b3ffc6b0?w=600`,
  `${IMAGE_BASE}photo-1585790050230-5dd28404ccb9?w=600`,
]

const audioImages: [string, string] = [
  `${IMAGE_BASE}photo-1505740420928-5e560c06d30e?w=600`,
  `${IMAGE_BASE}photo-1583394838336-acd977736f90?w=600`,
]

const wearableImages: [string, string] = [
  `${IMAGE_BASE}photo-1523275335684-37898b6baf30?w=600`,
  `${IMAGE_BASE}photo-1579586337278-3befd40fd17a?w=600`,
]

const catalogProducts: CatalogProduct[] = [
  {
    id: "MOB-001",
    slug: "galaxy-ultra-256gb",
    name: "Samsung Galaxy S24 Ultra (12GB/256GB)",
    category: "Mobiles",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Mobiles", href: "/c/mobiles" },
      { label: "Samsung Galaxy S24 Ultra (12GB/256GB)", href: null },
    ],
    images: mobileImages,
    selectedColor: "Titanium Black",
    colorOptions: ["Titanium Black", "Titanium Gray", "Titanium Violet"],
    selectedVariant: { Storage: "256GB" },
    variantOptions: [{ Storage: "256GB" }, { Storage: "512GB" }],
    optionPricing: [
      { color: "Titanium Black", variantLabel: "Storage", variantValue: "256GB", price: 129999, mrp: 149999, images: mobileImages },
      { color: "Titanium Black", variantLabel: "Storage", variantValue: "512GB", price: 149999, mrp: 169999, images: mobileImages },
      { color: "Titanium Gray", variantLabel: "Storage", variantValue: "256GB", price: 129999, mrp: 149999, images: mobileImages },
      { color: "Titanium Gray", variantLabel: "Storage", variantValue: "512GB", price: 149999, mrp: 169999, images: mobileImages },
      { color: "Titanium Violet", variantLabel: "Storage", variantValue: "256GB", price: 134999, mrp: 154999, images: mobileImages },
      { color: "Titanium Violet", variantLabel: "Storage", variantValue: "512GB", price: 154999, mrp: 174999, images: mobileImages },
    ],
    price: 129999,
    mrp: 149999,
    rating: 4.6,
    overallRating: 4.5,
    soldCount: 2340,
    appLinks: {
      appStore: "https://apps.apple.com/app/samsung-shop",
      playStore: "https://play.google.com/store/apps/details?id=com.samsung.shop",
    },
    tenureOptions: generateEmiOptions(129999),
    defaultTenureIndex: 3,
    downPayment: 9999,
    emiStartLabel: "EMI starts at ₹10,833/month",
    seller: { name: "Samsung India", url: "/seller/samsung-india" },
    shipping: { text: "Free delivery by tomorrow. Order within 2h 30m." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Display", value: '6.8" Dynamic AMOLED 2X, 120Hz' },
      { label: "Processor", value: "Snapdragon 8 Gen 3" },
      { label: "RAM", value: "12 GB" },
      { label: "Storage", value: "256 GB / 512 GB" },
      { label: "Battery", value: "5000 mAh" },
      { label: "Camera", value: "200 MP + 50 MP + 12 MP + 10 MP" },
      { label: "OS", value: "Android 14, One UI 6.1" },
      { label: "Weight", value: "232 g" },
    ],
    reviewMedia: [
      { type: "image", thumbnail: mobileImages[0] },
      { type: "image", thumbnail: mobileImages[1] },
    ],
    reviews: [
      { stars: 5, variantDescription: "Titanium Black, 256GB", text: "Best phone I have ever used. The camera is insane!", attachments: [], reviewerName: "Rahul S.", city: "Mumbai", verified: true, timeAgo: "2 days ago" },
      { stars: 4, variantDescription: "Titanium Gray, 512GB", text: "Great phone but a bit heavy. Battery life is excellent.", attachments: [], reviewerName: "Priya M.", city: "Delhi", verified: true, timeAgo: "5 days ago" },
      { stars: 5, variantDescription: "Titanium Violet, 256GB", text: "The violet color is stunning. Performance is top-notch.", attachments: [], reviewerName: "Amit K.", city: "Bangalore", verified: true, timeAgo: "1 week ago" },
    ],
  },
  {
    id: "MOB-002",
    slug: "iphone-15-pro-128gb",
    name: "Apple iPhone 15 Pro (128GB)",
    category: "Mobiles",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Mobiles", href: "/c/mobiles" },
      { label: "Apple iPhone 15 Pro (128GB)", href: null },
    ],
    images: mobileImages,
    selectedColor: "Natural Titanium",
    colorOptions: ["Natural Titanium", "Blue Titanium", "White Titanium"],
    selectedVariant: { Storage: "128GB" },
    variantOptions: [{ Storage: "128GB" }, { Storage: "256GB" }],
    optionPricing: [
      { color: "Natural Titanium", variantLabel: "Storage", variantValue: "128GB", price: 134900, mrp: 149900, images: mobileImages },
      { color: "Natural Titanium", variantLabel: "Storage", variantValue: "256GB", price: 149900, mrp: 164900, images: mobileImages },
      { color: "Blue Titanium", variantLabel: "Storage", variantValue: "128GB", price: 134900, mrp: 149900, images: mobileImages },
      { color: "Blue Titanium", variantLabel: "Storage", variantValue: "256GB", price: 149900, mrp: 164900, images: mobileImages },
      { color: "White Titanium", variantLabel: "Storage", variantValue: "128GB", price: 134900, mrp: 149900, images: mobileImages },
      { color: "White Titanium", variantLabel: "Storage", variantValue: "256GB", price: 149900, mrp: 164900, images: mobileImages },
    ],
    price: 134900,
    mrp: 149900,
    rating: 4.7,
    overallRating: 4.7,
    soldCount: 1856,
    appLinks: {
      appStore: "https://apps.apple.com/app/apple-store",
      playStore: "",
    },
    tenureOptions: generateEmiOptions(134900),
    defaultTenureIndex: 3,
    downPayment: 14900,
    emiStartLabel: "EMI starts at ₹11,242/month",
    seller: { name: "Apple India", url: "/seller/apple-india" },
    shipping: { text: "Free delivery by tomorrow. Order within 1h 45m." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Display", value: '6.1" Super Retina XDR, ProMotion' },
      { label: "Processor", value: "A17 Pro Bionic" },
      { label: "RAM", value: "8 GB" },
      { label: "Storage", value: "128 GB / 256 GB" },
      { label: "Battery", value: "3274 mAh" },
      { label: "Camera", value: "48 MP + 12 MP + 12 MP" },
      { label: "OS", value: "iOS 17" },
      { label: "Weight", value: "187 g" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Natural Titanium, 128GB", text: "Apple quality at its finest. The titanium build feels premium.", attachments: [], reviewerName: "Neha R.", city: "Pune", verified: true, timeAgo: "3 days ago" },
      { stars: 5, variantDescription: "Blue Titanium, 256GB", text: "Switched from Android, no regrets. Camera is amazing.", attachments: [], reviewerName: "Vikram P.", city: "Hyderabad", verified: true, timeAgo: "1 week ago" },
    ],
  },
  {
    id: "MOB-003",
    slug: "oneplus-12-256gb",
    name: "OnePlus 12 (16GB/256GB)",
    category: "Mobiles",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Mobiles", href: "/c/mobiles" },
      { label: "OnePlus 12 (16GB/256GB)", href: null },
    ],
    images: mobileImages,
    selectedColor: "Silky Black",
    colorOptions: ["Silky Black", "Flowy Emerald"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Silky Black", variantLabel: null, variantValue: null, price: 64999, mrp: 69999, images: mobileImages },
      { color: "Flowy Emerald", variantLabel: null, variantValue: null, price: 67999, mrp: 72999, images: mobileImages },
    ],
    price: 64999,
    mrp: 69999,
    rating: 4.4,
    overallRating: 4.3,
    soldCount: 1520,
    appLinks: {
      appStore: "https://apps.apple.com/app/oneplus-store",
      playStore: "https://play.google.com/store/apps/details?id=com.oneplus.store",
    },
    tenureOptions: generateEmiOptions(64999),
    defaultTenureIndex: 2,
    downPayment: 5000,
    emiStartLabel: "EMI starts at ₹5,417/month",
    seller: { name: "OnePlus India", url: "/seller/oneplus-india" },
    shipping: { text: "Free delivery in 2-3 days." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Display", value: '6.82" LTPO AMOLED, 120Hz' },
      { label: "Processor", value: "Snapdragon 8 Gen 3" },
      { label: "RAM", value: "16 GB" },
      { label: "Storage", value: "256 GB" },
      { label: "Battery", value: "5400 mAh" },
      { label: "Camera", value: "50 MP + 48 MP + 64 MP" },
      { label: "OS", value: "Android 14, OxygenOS 14" },
      { label: "Weight", value: "220 g" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Silky Black", text: "Flagship killer is back! Amazing performance for the price.", attachments: [], reviewerName: "Karan J.", city: "Chennai", verified: true, timeAgo: "4 days ago" },
      { stars: 4, variantDescription: "Flowy Emerald", text: "Great phone, fast charging is a game changer.", attachments: [], reviewerName: "Sneha T.", city: "Kolkata", verified: true, timeAgo: "6 days ago" },
    ],
  },
  {
    id: "LAP-001",
    slug: "macbook-air-m3-256gb",
    name: "Apple MacBook Air M3 (8GB/256GB)",
    category: "Laptops",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Laptops", href: "/c/laptops" },
      { label: "Apple MacBook Air M3 (8GB/256GB)", href: null },
    ],
    images: laptopImages,
    selectedColor: "Midnight",
    colorOptions: ["Midnight", "Starlight", "Space Gray"],
    selectedVariant: { RAM: "8GB" },
    variantOptions: [{ RAM: "8GB" }, { RAM: "16GB" }],
    optionPricing: [
      { color: "Midnight", variantLabel: "RAM", variantValue: "8GB", price: 114900, mrp: 129900, images: laptopImages },
      { color: "Midnight", variantLabel: "RAM", variantValue: "16GB", price: 134900, mrp: 149900, images: laptopImages },
      { color: "Starlight", variantLabel: "RAM", variantValue: "8GB", price: 114900, mrp: 129900, images: laptopImages },
      { color: "Starlight", variantLabel: "RAM", variantValue: "16GB", price: 134900, mrp: 149900, images: laptopImages },
      { color: "Space Gray", variantLabel: "RAM", variantValue: "8GB", price: 114900, mrp: 129900, images: laptopImages },
      { color: "Space Gray", variantLabel: "RAM", variantValue: "16GB", price: 134900, mrp: 149900, images: laptopImages },
    ],
    price: 114900,
    mrp: 129900,
    rating: 4.8,
    overallRating: 4.8,
    soldCount: 980,
    appLinks: {
      appStore: "https://apps.apple.com/app/apple-store",
      playStore: "",
    },
    tenureOptions: generateEmiOptions(114900),
    defaultTenureIndex: 3,
    downPayment: 10000,
    emiStartLabel: "EMI starts at ₹9,575/month",
    seller: { name: "Apple India", url: "/seller/apple-india" },
    shipping: { text: "Free delivery by tomorrow. Express delivery available." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Display", value: '13.6" Liquid Retina' },
      { label: "Processor", value: "Apple M3" },
      { label: "RAM", value: "8 GB / 16 GB" },
      { label: "Storage", value: "256 GB SSD" },
      { label: "Battery", value: "Up to 18 hours" },
      { label: "Weight", value: "1.24 kg" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Midnight, 8GB", text: "Best laptop for students and professionals. Silent and fast.", attachments: [], reviewerName: "Ananya D.", city: "Bangalore", verified: true, timeAgo: "1 day ago" },
      { stars: 5, variantDescription: "Starlight, 16GB", text: "Upgraded from M1, the difference is noticeable. Amazing battery.", attachments: [], reviewerName: "Rohit G.", city: "Mumbai", verified: true, timeAgo: "3 days ago" },
    ],
  },
  {
    id: "LAP-002",
    slug: "dell-xps-15-i7",
    name: "Dell XPS 15 (i7/16GB/512GB)",
    category: "Laptops",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Laptops", href: "/c/laptops" },
      { label: "Dell XPS 15 (i7/16GB/512GB)", href: null },
    ],
    images: laptopImages,
    selectedColor: "Platinum Silver",
    colorOptions: ["Platinum Silver", "Graphite"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Platinum Silver", variantLabel: null, variantValue: null, price: 149999, mrp: 174999, images: laptopImages },
      { color: "Graphite", variantLabel: null, variantValue: null, price: 149999, mrp: 174999, images: laptopImages },
    ],
    price: 149999,
    mrp: 174999,
    rating: 4.5,
    overallRating: 4.4,
    soldCount: 650,
    appLinks: {
      appStore: "",
      playStore: "https://play.google.com/store/apps/details?id=com.dell.shop",
    },
    tenureOptions: generateEmiOptions(149999),
    defaultTenureIndex: 3,
    downPayment: 15000,
    emiStartLabel: "EMI starts at ₹12,500/month",
    seller: { name: "Dell India", url: "/seller/dell-india" },
    shipping: { text: "Free delivery in 3-5 days." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Display", value: '15.6" OLED, 3.5K' },
      { label: "Processor", value: "Intel Core i7-13700H" },
      { label: "RAM", value: "16 GB DDR5" },
      { label: "Storage", value: "512 GB SSD" },
      { label: "Battery", value: "86 Whr" },
      { label: "Weight", value: "1.86 kg" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Platinum Silver", text: "Build quality is premium. The OLED display is gorgeous.", attachments: [], reviewerName: "Sanjay M.", city: "Delhi", verified: true, timeAgo: "5 days ago" },
    ],
  },
  {
    id: "TAB-001",
    slug: "ipad-pro-m4-256gb",
    name: "Apple iPad Pro M4 (256GB, Wi-Fi)",
    category: "Tablets",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Tablets", href: "/c/tablets" },
      { label: "Apple iPad Pro M4 (256GB, Wi-Fi)", href: null },
    ],
    images: tabletImages,
    selectedColor: "Space Black",
    colorOptions: ["Space Black", "Silver"],
    selectedVariant: { Size: "11-inch" },
    variantOptions: [{ Size: "11-inch" }, { Size: "13-inch" }],
    optionPricing: [
      { color: "Space Black", variantLabel: "Size", variantValue: "11-inch", price: 99900, mrp: 109900, images: tabletImages },
      { color: "Space Black", variantLabel: "Size", variantValue: "13-inch", price: 129900, mrp: 139900, images: tabletImages },
      { color: "Silver", variantLabel: "Size", variantValue: "11-inch", price: 99900, mrp: 109900, images: tabletImages },
      { color: "Silver", variantLabel: "Size", variantValue: "13-inch", price: 129900, mrp: 139900, images: tabletImages },
    ],
    price: 99900,
    mrp: 109900,
    rating: 4.7,
    overallRating: 4.6,
    soldCount: 420,
    appLinks: {
      appStore: "https://apps.apple.com/app/apple-store",
      playStore: "",
    },
    tenureOptions: generateEmiOptions(99900),
    defaultTenureIndex: 2,
    downPayment: 9900,
    emiStartLabel: "EMI starts at ₹8,325/month",
    seller: { name: "Apple India", url: "/seller/apple-india" },
    shipping: { text: "Free delivery by tomorrow." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Display", value: '11" / 13" Ultra Retina XDR' },
      { label: "Processor", value: "Apple M4" },
      { label: "RAM", value: "8 GB" },
      { label: "Storage", value: "256 GB" },
      { label: "Battery", value: "Up to 10 hours" },
      { label: "Weight", value: "444 g (11-inch)" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Space Black, 11-inch", text: "The M4 chip makes this the fastest tablet ever. Perfect for creators.", attachments: [], reviewerName: "Meera V.", city: "Chennai", verified: true, timeAgo: "2 days ago" },
    ],
  },
  {
    id: "AUD-001",
    slug: "sony-wh1000xm5",
    name: "Sony WH-1000XM5 Wireless Headphones",
    category: "Audio",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Audio", href: "/c/audio" },
      { label: "Sony WH-1000XM5 Wireless Headphones", href: null },
    ],
    images: audioImages,
    selectedColor: "Black",
    colorOptions: ["Black", "Silver", "Midnight Blue"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Black", variantLabel: null, variantValue: null, price: 29990, mrp: 34990, images: audioImages },
      { color: "Silver", variantLabel: null, variantValue: null, price: 29990, mrp: 34990, images: audioImages },
      { color: "Midnight Blue", variantLabel: null, variantValue: null, price: 31990, mrp: 36990, images: audioImages },
    ],
    price: 29990,
    mrp: 34990,
    rating: 4.6,
    overallRating: 4.5,
    soldCount: 3200,
    appLinks: {
      appStore: "https://apps.apple.com/app/sony-headphones-connect",
      playStore: "https://play.google.com/store/apps/details?id=com.sony.headphonesconnect",
    },
    tenureOptions: generateEmiOptions(29990),
    defaultTenureIndex: 1,
    downPayment: 2990,
    emiStartLabel: "EMI starts at ₹2,499/month",
    seller: { name: "Sony India", url: "/seller/sony-india" },
    shipping: { text: "Free delivery by tomorrow. Express delivery available." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Driver", value: "30mm" },
      { label: "Frequency", value: "4 Hz - 40,000 Hz" },
      { label: "Battery", value: "30 hours" },
      { label: "ANC", value: "Yes, Industry-leading" },
      { label: "Weight", value: "250 g" },
      { label: "Connectivity", value: "Bluetooth 5.3, 3.5mm" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Black", text: "Best noise cancelling headphones on the market. Period.", attachments: [], reviewerName: "Arjun P.", city: "Bangalore", verified: true, timeAgo: "1 day ago" },
      { stars: 4, variantDescription: "Silver", text: "Excellent sound quality. Comfortable for long sessions.", attachments: [], reviewerName: "Deepa N.", city: "Mumbai", verified: true, timeAgo: "4 days ago" },
    ],
  },
  {
    id: "AUD-002",
    slug: "jbl-charge-5",
    name: "JBL Charge 5 Portable Speaker",
    category: "Audio",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Audio", href: "/c/audio" },
      { label: "JBL Charge 5 Portable Speaker", href: null },
    ],
    images: audioImages,
    selectedColor: "Black",
    colorOptions: ["Black", "Blue", "Red", "Green"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Black", variantLabel: null, variantValue: null, price: 17999, mrp: 19999, images: audioImages },
      { color: "Blue", variantLabel: null, variantValue: null, price: 17999, mrp: 19999, images: audioImages },
      { color: "Red", variantLabel: null, variantValue: null, price: 17999, mrp: 19999, images: audioImages },
      { color: "Green", variantLabel: null, variantValue: null, price: 17999, mrp: 19999, images: audioImages },
    ],
    price: 17999,
    mrp: 19999,
    rating: 4.5,
    overallRating: 4.4,
    soldCount: 5600,
    appLinks: {
      appStore: "https://apps.apple.com/app/jbl-connect",
      playStore: "https://play.google.com/store/apps/details?id=com.harmankardon.jblconnect",
    },
    tenureOptions: generateEmiOptions(17999),
    defaultTenureIndex: 1,
    downPayment: 1999,
    emiStartLabel: "EMI starts at ₹1,500/month",
    seller: { name: "Harman India", url: "/seller/harman-india" },
    shipping: { text: "Free delivery in 2-3 days." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Output", value: "30W" },
      { label: "Battery", value: "20 hours" },
      { label: "Waterproof", value: "IP67" },
      { label: "Weight", value: "960 g" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Black", text: "Incredible bass for its size. waterproof is a huge plus.", attachments: [], reviewerName: "Ravi K.", city: "Goa", verified: true, timeAgo: "3 days ago" },
    ],
  },
  {
    id: "WEAR-001",
    slug: "apple-watch-series-9",
    name: "Apple Watch Series 9 (GPS, 45mm)",
    category: "Wearables",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Wearables", href: "/c/wearables" },
      { label: "Apple Watch Series 9 (GPS, 45mm)", href: null },
    ],
    images: wearableImages,
    selectedColor: "Midnight",
    colorOptions: ["Midnight", "Starlight", "Silver", "Product RED"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Midnight", variantLabel: null, variantValue: null, price: 44900, mrp: 49900, images: wearableImages },
      { color: "Starlight", variantLabel: null, variantValue: null, price: 44900, mrp: 49900, images: wearableImages },
      { color: "Silver", variantLabel: null, variantValue: null, price: 44900, mrp: 49900, images: wearableImages },
      { color: "Product RED", variantLabel: null, variantValue: null, price: 44900, mrp: 49900, images: wearableImages },
    ],
    price: 44900,
    mrp: 49900,
    rating: 4.6,
    overallRating: 4.5,
    soldCount: 1200,
    appLinks: {
      appStore: "https://apps.apple.com/app/apple-watch",
      playStore: "",
    },
    tenureOptions: generateEmiOptions(44900),
    defaultTenureIndex: 2,
    downPayment: 4900,
    emiStartLabel: "EMI starts at ₹3,742/month",
    seller: { name: "Apple India", url: "/seller/apple-india" },
    shipping: { text: "Free delivery by tomorrow." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Display", value: '1.9" Always-On Retina LTPO' },
      { label: "Chip", value: "Apple S9 SiP" },
      { label: "Battery", value: "18 hours" },
      { label: "Water Resistance", value: "WR50" },
      { label: "Weight", value: "38.7 g" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Midnight", text: "The double-tap gesture is magical. Best smartwatch period.", attachments: [], reviewerName: "Pooja S.", city: "Delhi", verified: true, timeAgo: "2 days ago" },
    ],
  },
  {
    id: "WEAR-002",
    slug: "samsung-galaxy-watch-6",
    name: "Samsung Galaxy Watch 6 Classic (47mm)",
    category: "Wearables",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Wearables", href: "/c/wearables" },
      { label: "Samsung Galaxy Watch 6 Classic (47mm)", href: null },
    ],
    images: wearableImages,
    selectedColor: "Black",
    colorOptions: ["Black", "Silver"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Black", variantLabel: null, variantValue: null, price: 37999, mrp: 42999, images: wearableImages },
      { color: "Silver", variantLabel: null, variantValue: null, price: 37999, mrp: 42999, images: wearableImages },
    ],
    price: 37999,
    mrp: 42999,
    rating: 4.4,
    overallRating: 4.3,
    soldCount: 890,
    appLinks: {
      appStore: "https://apps.apple.com/app/samsung-galaxy-wear",
      playStore: "https://play.google.com/store/apps/details?id=com.samsung.android.app.watchmanager",
    },
    tenureOptions: generateEmiOptions(37999),
    defaultTenureIndex: 2,
    downPayment: 3999,
    emiStartLabel: "EMI starts at ₹3,167/month",
    seller: { name: "Samsung India", url: "/seller/samsung-india" },
    shipping: { text: "Free delivery in 2-3 days." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Display", value: '1.47" Super AMOLED' },
      { label: "Processor", value: "Exynos W930" },
      { label: "Battery", value: "425 mAh" },
      { label: "Water Resistance", value: "IP68 + 5ATM" },
      { label: "Weight", value: "59 g" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 4, variantDescription: "Black", text: "The rotating bezel is back! Great build quality.", attachments: [], reviewerName: "Vikash R.", city: "Lucknow", verified: true, timeAgo: "5 days ago" },
    ],
  },
  {
    id: "ACC-001",
    slug: "apple-airpods-pro-2",
    name: "Apple AirPods Pro (2nd Gen, USB-C)",
    category: "Accessories",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Accessories", href: "/c/accessories" },
      { label: "Apple AirPods Pro (2nd Gen, USB-C)", href: null },
    ],
    images: audioImages,
    selectedColor: "White",
    colorOptions: ["White"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "White", variantLabel: null, variantValue: null, price: 24900, mrp: 27900, images: audioImages },
    ],
    price: 24900,
    mrp: 27900,
    rating: 4.7,
    overallRating: 4.6,
    soldCount: 8900,
    appLinks: {
      appStore: "https://apps.apple.com/app/apple-store",
      playStore: "",
    },
    tenureOptions: generateEmiOptions(24900),
    defaultTenureIndex: 0,
    downPayment: 2900,
    emiStartLabel: "EMI starts at ₹2,075/month",
    seller: { name: "Apple India", url: "/seller/apple-india" },
    shipping: { text: "Free delivery by tomorrow. Order within 3h 15m." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Driver", value: "Custom Apple Driver" },
      { label: "ANC", value: "Active Noise Cancellation" },
      { label: "Battery", value: "6 hours (30h with case)" },
      { label: "Connectivity", value: "Bluetooth 5.3" },
      { label: "Charging", value: "USB-C, MagSafe, Qi" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "White", text: "Best TWS earbuds for iPhone users. The ANC is incredible.", attachments: [], reviewerName: "Kavita M.", city: "Pune", verified: true, timeAgo: "1 day ago" },
      { stars: 4, variantDescription: "White", text: "Great sound but the fit could be better for small ears.", attachments: [], reviewerName: "Suresh T.", city: "Chennai", verified: true, timeAgo: "4 days ago" },
    ],
  },
  {
    id: "ACC-002",
    slug: "samsung-t7-1tb-ssd",
    name: "Samsung T7 Portable SSD (1TB)",
    category: "Accessories",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Accessories", href: "/c/accessories" },
      { label: "Samsung T7 Portable SSD (1TB)", href: null },
    ],
    images: [`${IMAGE_BASE}photo-1597872200969-2b65d56bd16b?w=600`],
    selectedColor: "Indigo",
    colorOptions: ["Indigo", "Titanium Gray", "Beige"],
    selectedVariant: { Capacity: "1TB" },
    variantOptions: [{ Capacity: "500GB" }, { Capacity: "1TB" }, { Capacity: "2TB" }],
    optionPricing: [
      { color: "Indigo", variantLabel: "Capacity", variantValue: "500GB", price: 6999, mrp: 8999, images: [`${IMAGE_BASE}photo-1597872200969-2b65d56bd16b?w=600`] },
      { color: "Indigo", variantLabel: "Capacity", variantValue: "1TB", price: 10999, mrp: 13999, images: [`${IMAGE_BASE}photo-1597872200969-2b65d56bd16b?w=600`] },
      { color: "Indigo", variantLabel: "Capacity", variantValue: "2TB", price: 19999, mrp: 24999, images: [`${IMAGE_BASE}photo-1597872200969-2b65d56bd16b?w=600`] },
      { color: "Titanium Gray", variantLabel: "Capacity", variantValue: "500GB", price: 6999, mrp: 8999, images: [`${IMAGE_BASE}photo-1597872200969-2b65d56bd16b?w=600`] },
      { color: "Titanium Gray", variantLabel: "Capacity", variantValue: "1TB", price: 10999, mrp: 13999, images: [`${IMAGE_BASE}photo-1597872200969-2b65d56bd16b?w=600`] },
      { color: "Titanium Gray", variantLabel: "Capacity", variantValue: "2TB", price: 19999, mrp: 24999, images: [`${IMAGE_BASE}photo-1597872200969-2b65d56bd16b?w=600`] },
      { color: "Beige", variantLabel: "Capacity", variantValue: "500GB", price: 6999, mrp: 8999, images: [`${IMAGE_BASE}photo-1597872200969-2b65d56bd16b?w=600`] },
      { color: "Beige", variantLabel: "Capacity", variantValue: "1TB", price: 10999, mrp: 13999, images: [`${IMAGE_BASE}photo-1597872200969-2b65d56bd16b?w=600`] },
      { color: "Beige", variantLabel: "Capacity", variantValue: "2TB", price: 19999, mrp: 24999, images: [`${IMAGE_BASE}photo-1597872200969-2b65d56bd16b?w=600`] },
    ],
    price: 10999,
    mrp: 13999,
    rating: 4.5,
    overallRating: 4.4,
    soldCount: 4300,
    appLinks: {
      appStore: "",
      playStore: "https://play.google.com/store/apps/details?id=com.samsung.samsungportablessd",
    },
    tenureOptions: generateEmiOptions(10999),
    defaultTenureIndex: 0,
    downPayment: 999,
    emiStartLabel: "EMI starts at ₹917/month",
    seller: { name: "Samsung India", url: "/seller/samsung-india" },
    shipping: { text: "Free delivery in 2-3 days." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Capacity", value: "500 GB / 1 TB / 2 TB" },
      { label: "Interface", value: "USB 3.2 Gen 2" },
      { label: "Speed", value: "Up to 1,050 MB/s" },
      { label: "Weight", value: "58 g" },
      { label: "Encryption", value: "AES 256-bit" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Titanium Gray, 1TB", text: "Blazing fast transfer speeds. Very compact and portable.", attachments: [], reviewerName: "Deepak L.", city: "Hyderabad", verified: true, timeAgo: "3 days ago" },
    ],
  },
  {
    id: "CAM-001",
    slug: "sony-a7iv-body",
    name: "Sony Alpha A7 IV Mirrorless Camera (Body)",
    category: "Cameras",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Cameras", href: "/c/cameras" },
      { label: "Sony Alpha A7 IV Mirrorless Camera (Body)", href: null },
    ],
    images: [`${IMAGE_BASE}photo-1516035069371-29a1b244cc32?w=600`],
    selectedColor: "Black",
    colorOptions: ["Black"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Black", variantLabel: null, variantValue: null, price: 199990, mrp: 219990, images: [`${IMAGE_BASE}photo-1516035069371-29a1b244cc32?w=600`] },
    ],
    price: 199990,
    mrp: 219990,
    rating: 4.8,
    overallRating: 4.7,
    soldCount: 310,
    appLinks: {
      appStore: "https://apps.apple.com/app/sony-creators-app",
      playStore: "https://play.google.com/store/apps/details?id=com.sony.creatorsapp",
    },
    tenureOptions: generateEmiOptions(199990),
    defaultTenureIndex: 3,
    downPayment: 19990,
    emiStartLabel: "EMI starts at ₹16,666/month",
    seller: { name: "Sony India", url: "/seller/sony-india" },
    shipping: { text: "Free delivery in 3-5 days." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Sensor", value: "33 MP Full-Frame CMOS" },
      { label: "ISO", value: "100 - 51200" },
      { label: "Video", value: "4K 60fps, 10-bit" },
      { label: "AF Points", value: "759 phase-detect" },
      { label: "Weight", value: "658 g (body only)" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Black", text: "The best hybrid camera for photo and video. Autofocus is insane.", attachments: [], reviewerName: "Arun C.", city: "Kochi", verified: true, timeAgo: "1 week ago" },
    ],
  },
  {
    id: "GAM-001",
    slug: "ps5-digital-edition",
    name: "Sony PlayStation 5 Digital Edition",
    category: "Gaming",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Gaming", href: "/c/gaming" },
      { label: "Sony PlayStation 5 Digital Edition", href: null },
    ],
    images: [`${IMAGE_BASE}photo-1606144042614-b2417e99c4e3?w=600`],
    selectedColor: "White",
    colorOptions: ["White"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "White", variantLabel: null, variantValue: null, price: 44990, mrp: 49990, images: [`${IMAGE_BASE}photo-1606144042614-b2417e99c4e3?w=600`] },
    ],
    price: 44990,
    mrp: 49990,
    rating: 4.7,
    overallRating: 4.6,
    soldCount: 2100,
    appLinks: {
      appStore: "https://apps.apple.com/app/playstation-app",
      playStore: "https://play.google.com/store/apps/details?id=com.playstation.playstationapp",
    },
    tenureOptions: generateEmiOptions(44990),
    defaultTenureIndex: 2,
    downPayment: 4990,
    emiStartLabel: "EMI starts at ₹3,749/month",
    seller: { name: "Sony India", url: "/seller/sony-india" },
    shipping: { text: "Free delivery by tomorrow." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "CPU", value: "AMD Zen 2, 8-core" },
      { label: "GPU", value: "10.28 TFLOPS, RDNA 2" },
      { label: "Storage", value: "825 GB Custom SSD" },
      { label: "RAM", value: "16 GB GDDR6" },
      { label: "Output", value: "4K 120fps, 8K" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "White", text: "Lightning fast loading. The DualSense controller is incredible.", attachments: [], reviewerName: "Manish A.", city: "Jaipur", verified: true, timeAgo: "2 days ago" },
    ],
  },
  {
    id: "MOB-004",
    slug: "pixel-8-pro-128gb",
    name: "Google Pixel 8 Pro (128GB)",
    category: "Mobiles",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Mobiles", href: "/c/mobiles" },
      { label: "Google Pixel 8 Pro (128GB)", href: null },
    ],
    images: mobileImages,
    selectedColor: "Obsidian",
    colorOptions: ["Obsidian", "Porcelain", "Bay Blue"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Obsidian", variantLabel: null, variantValue: null, price: 106999, mrp: 113999, images: mobileImages },
      { color: "Porcelain", variantLabel: null, variantValue: null, price: 106999, mrp: 113999, images: mobileImages },
      { color: "Bay Blue", variantLabel: null, variantValue: null, price: 106999, mrp: 113999, images: mobileImages },
    ],
    price: 106999,
    mrp: 113999,
    rating: 4.5,
    overallRating: 4.4,
    soldCount: 720,
    appLinks: {
      appStore: "https://apps.apple.com/app/google-store",
      playStore: "https://play.google.com/store/apps/details?id=com.google.android.apps.pixel.offerwall",
    },
    tenureOptions: generateEmiOptions(106999),
    defaultTenureIndex: 3,
    downPayment: 10999,
    emiStartLabel: "EMI starts at ₹8,917/month",
    seller: { name: "Google India", url: "/seller/google-india" },
    shipping: { text: "Free delivery by tomorrow. Order within 4h 10m." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Display", value: '6.7" LTPO OLED, 120Hz' },
      { label: "Processor", value: "Google Tensor G3" },
      { label: "RAM", value: "12 GB" },
      { label: "Storage", value: "128 GB" },
      { label: "Battery", value: "5050 mAh" },
      { label: "Camera", value: "50 MP + 48 MP + 48 MP" },
      { label: "OS", value: "Android 14" },
      { label: "Weight", value: "213 g" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Obsidian", text: "The camera on this phone is unreal. Best in class computational photography.", attachments: [], reviewerName: "Shruti B.", city: "Delhi", verified: true, timeAgo: "3 days ago" },
      { stars: 4, variantDescription: "Bay Blue", text: "Clean Android experience. The AI features are genuinely useful.", attachments: [], reviewerName: "Tarun W.", city: "Bangalore", verified: true, timeAgo: "1 week ago" },
    ],
  },
]

// ── Seed logic ───────────────────────────────────────────────────────────────

const TENURE_MONTHS = [3, 6, 9, 12, 18, 24]

function generateEmiDbOptions(price: number) {
  return TENURE_MONTHS.map((months) => {
    const monthlyAmount = Math.round(price / months)
    const interestRate = months <= 6 ? "0%" : months <= 12 ? "2.5%" : "5%"
    const cashbackAmount = Math.round(
      price * 0.01 * (months <= 6 ? 1 : months <= 12 ? 2 : 3),
    )
    const badge =
      months <= 6
        ? "No Cost EMI"
        : months <= 12
          ? "Low Interest"
          : "Extended Plan"
    return { months, monthlyAmount, badge, interestRate, cashbackAmount }
  })
}

const slugForCategory = (category: string) =>
  category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

async function seed() {
  // Clean all tables first to remove stale data from previous seeds
  console.log("Cleaning existing data...")
  await db.execute(`TRUNCATE review_attachments, reviews, emi_tenure_options, product_trust_badges, product_breadcrumbs, product_specs, product_variants, product_options, products, sellers, categories, footer_category_groups, company_info, quick_links, support_links, social_links RESTART IDENTITY CASCADE`)
  console.log("Existing data cleared.")

  console.log("Seeding categories...")
  const categoryRows = await Promise.all(
    siteCategories.map(async (name: string) => {
      const [row] = await db
        .insert(categories)
        .values({ name, slug: slugForCategory(name) })
        .onConflictDoNothing()
        .returning()
      if (row) return { name, id: row.id }
      const existing = await db
        .select()
        .from(categories)
        .where(eq(categories.name, name))
        .limit(1)
      return { name, id: existing[0]!.id }
    }),
  )
  const categoryMap = new Map(categoryRows.map((c) => [c.name, c.id]))

  console.log("Seeding site config...")
  await db
    .insert(footerCategoryGroups)
    .values(
      siteFooterGroups.map((g: { heading: string; links: string[] }, i: number) => ({
        heading: g.heading,
        links: g.links,
        sortOrder: i,
      })),
    )
    .onConflictDoNothing()
  await db.insert(companyInfo).values(siteCompanyInfo).onConflictDoNothing()
  await db
    .insert(quickLinks)
    .values(siteQuickLinks.map((l: string, i: number) => ({ label: l, sortOrder: i })))
    .onConflictDoNothing()
  await db
    .insert(supportLinks)
    .values(siteSupportLinks.map((l: string, i: number) => ({ label: l, sortOrder: i })))
    .onConflictDoNothing()
  await db
    .insert(socialLinks)
    .values(
      Object.entries(siteSocialLinks).map(([platform, url]: [string, string]) => ({
        platform,
        url,
      })),
    )
    .onConflictDoNothing()

  const sellerMap = new Map<string, string>()

  async function getOrCreateSeller(
    name: string,
    slug: string,
    url: string,
  ): Promise<string> {
    const existing = sellerMap.get(name)
    if (existing) return existing

    const [row] = await db
      .insert(sellers)
      .values({ name, slug, url })
      .onConflictDoNothing()
      .returning()
    if (row) {
      sellerMap.set(name, row.id)
      return row.id
    }

    const found = await db
      .select()
      .from(sellers)
      .where(eq(sellers.slug, slug))
      .limit(1)
    if (found[0]) {
      sellerMap.set(name, found[0].id)
      return found[0].id
    }

    const uniqueSlug = `${slug}-${Date.now()}`
    const [inserted] = await db
      .insert(sellers)
      .values({ name, slug: uniqueSlug, url })
      .returning()
    sellerMap.set(name, inserted!.id)
    return inserted!.id
  }

  console.log(`Seeding ${catalogProducts.length} products...`)
  let count = 0
  for (const p of catalogProducts) {
    const categoryId = categoryMap.get(p.category)
    if (!categoryId) {
      console.warn(
        `Category "${p.category}" not found, skipping product "${p.name}"`,
      )
      continue
    }

    const slugifiedSeller = p.seller.url.replace("/seller/", "")
    const sellerId = await getOrCreateSeller(
      p.seller.name,
      slugifiedSeller,
      p.seller.url,
    )

    const brand = p.breadcrumb.find(
      (b: { label: string; href: string | null }) =>
        b.label !== "Shop on EMI" && b.label !== p.category && b.label !== p.name,
    )?.label

    const [productRow] = await db
      .insert(products)
      .values({
        sku: p.id,
        sellerId,
        slug: p.slug,
        name: p.name,
        categoryId,
        brand: brand ?? null,
        topBrand: p.soldCount > 100,
        price: p.price,
        mrp: p.mrp,
        rating: p.rating,
        overallRating: p.overallRating,
        soldCount: p.soldCount,
        images: p.images,
        colorOptions: p.colorOptions,
        selectedColor: p.selectedColor,
        appStoreLink: p.appLinks.appStore,
        playStoreLink: p.appLinks.playStore,
        defaultTenureIndex: p.defaultTenureIndex,
        downPayment: p.downPayment,
        emiStartLabel: p.emiStartLabel,
        shippingText: p.shipping.text,
        reviewMedia: p.reviewMedia,
      })
      .onConflictDoNothing()
      .returning()

    if (!productRow) {
      count++
      continue
    }

    const productId = productRow.id

    if (Object.keys(p.selectedVariant).length > 0) {
      for (const variant of p.variantOptions) {
        for (const [label, value] of Object.entries(variant)) {
          if (value) {
            await db.insert(productVariants).values({
              productId,
              variantLabel: label,
              variantValue: value,
            })
          }
        }
      }
    }

    if (p.optionPricing && p.optionPricing.length > 0) {
      for (const opt of p.optionPricing) {
        await db.insert(productOptions).values({
          productId,
          color: opt.color,
          variantLabel: opt.variantLabel,
          variantValue: opt.variantValue,
          price: opt.price,
          mrp: opt.mrp,
          images: opt.images,
        })
      }
    }

    for (let i = 0; i < p.specs.length; i++) {
      const spec = p.specs[i]!
      await db.insert(productSpecs).values({
        productId,
        label: spec.label,
        value: spec.value,
        sortOrder: i,
      })
    }

    for (const badge of p.trustBadges) {
      await db.insert(productTrustBadges).values({
        productId,
        icon: badge.icon,
        label: badge.label,
      })
    }

    for (let i = 0; i < p.breadcrumb.length; i++) {
      const bc = p.breadcrumb[i]!
      await db.insert(productBreadcrumbs).values({
        productId,
        label: bc.label,
        href: bc.href,
        sortOrder: i,
      })
    }

    const emiOptions =
      p.tenureOptions.length >= 5
        ? p.tenureOptions
        : generateEmiDbOptions(p.price)

    for (const tenure of emiOptions) {
      await db.insert(emiTenureOptions).values({
        productId,
        months: tenure.months,
        monthlyAmount: tenure.monthlyAmount,
        badge: tenure.badge,
        interestRate: tenure.interestRate,
        cashbackAmount: tenure.cashbackAmount,
      })
    }

    for (const review of p.reviews) {
      const [reviewRow] = await db
        .insert(reviews)
        .values({
          productId,
          stars: review.stars,
          variantDescription: review.variantDescription,
          text: review.text,
          reviewerName: review.reviewerName,
          city: review.city,
          verified: review.verified,
          timeAgo: review.timeAgo,
        })
        .returning()

      for (const attachment of review.attachments) {
        await db.insert(reviewAttachments).values({
          reviewId: reviewRow!.id,
          type: attachment.type,
          thumbnail: attachment.thumbnail,
        })
      }
    }

    count++
    if (count % 50 === 0)
      console.log(`  Progress: ${count}/${catalogProducts.length}`)
  }

  console.log(`Seed complete! Seeded ${count} products.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
