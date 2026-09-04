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
} from "./index.ts"


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

const phoneImages2: [string, string, string] = [
  `${IMAGE_BASE}photo-1580910051074-3eb694886505?w=600`,
  `${IMAGE_BASE}photo-1591337676887-a217a6970a8a?w=600`,
  `${IMAGE_BASE}photo-1527443224154-c4a3942d3acf?w=600`,
]

const phoneImages3: [string, string] = [
  `${IMAGE_BASE}photo-1587829741301-dc798b83add3?w=600`,
  `${IMAGE_BASE}photo-1588872657578-7efd1f1555ed?w=600`,
]

const laptopImages: [string, string] = [
  `${IMAGE_BASE}photo-1496181133206-80ce9b88a853?w=600`,
  `${IMAGE_BASE}photo-1525547719571-a2d4ac8945e2?w=600`,
]

const laptopImages2: [string, string] = [
  `${IMAGE_BASE}photo-1517336714731-489689fd1ca8?w=600`,
  `${IMAGE_BASE}photo-1498050108023-c5249f4df085?w=600`,
]

const tabletImages: [string, string] = [
  `${IMAGE_BASE}photo-1544244015-0df4b3ffc6b0?w=600`,
  `${IMAGE_BASE}photo-1585790050230-5dd28404ccb9?w=600`,
]

const audioImages: [string, string] = [
  `${IMAGE_BASE}photo-1505740420928-5e560c06d30e?w=600`,
  `${IMAGE_BASE}photo-1583394838336-acd977736f90?w=600`,
]

const earphoneImages: [string, string] = [
  `${IMAGE_BASE}photo-1504639725590-34d0984388bd?w=600`,
  `${IMAGE_BASE}photo-1484704849700-f032a568e944?w=600`,
]

const wearableImages: [string, string] = [
  `${IMAGE_BASE}photo-1523275335684-37898b6baf30?w=600`,
  `${IMAGE_BASE}photo-1579586337278-3befd40fd17a?w=600`,
]

const smartwatchImages: [string, string] = [
  `${IMAGE_BASE}photo-1600003014755-ba31aa59c4b6?w=600`,
  `${IMAGE_BASE}photo-1611532736597-de2d4265fba3?w=600`,
]

const cameraImages: [string, string] = [
  `${IMAGE_BASE}photo-1516035069371-29a1b244cc32?w=600`,
  `${IMAGE_BASE}photo-1526170375885-4d8ecf77b99f?w=600`,
]

const gamingImages: [string, string] = [
  `${IMAGE_BASE}photo-1606144042614-b2417e99c4e3?w=600`,
  `${IMAGE_BASE}photo-1593642632559-0c6d3fc62b89?w=600`,
]


const existingCatalogProducts: CatalogProduct[] = [
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
      { stars: 5, variantDescription: "Graphite", text: "The OLED display is absolutely stunning. Best laptop screen I've seen.", attachments: [], reviewerName: "Rohit G.", city: "Bangalore", verified: true, timeAgo: "2 days ago" },
      { stars: 4, variantDescription: "Platinum Silver", text: "Great performance for video editing. Gets a bit warm under heavy load.", attachments: [], reviewerName: "Ananya K.", city: "Mumbai", verified: true, timeAgo: "1 week ago" },
      { stars: 5, variantDescription: "Graphite", text: "Build quality is top-notch. Keyboard is comfortable for long typing sessions.", attachments: [], reviewerName: "Vikram P.", city: "Delhi", verified: true, timeAgo: "3 days ago" },
      { stars: 4, variantDescription: "Platinum Silver", text: "Excellent display and performance. Battery could be better for the price.", attachments: [], reviewerName: "Sneha T.", city: "Chennai", verified: true, timeAgo: "5 days ago" },
      { stars: 5, variantDescription: "Graphite", text: "Perfect for software development. Multiple Docker containers run smoothly.", attachments: [], reviewerName: "Deepak S.", city: "Hyderabad", verified: true, timeAgo: "1 week ago" },
      { stars: 4, variantDescription: "Platinum Silver", text: "Premium laptop with great display. Fan noise is noticeable during gaming.", attachments: [], reviewerName: "Meena J.", city: "Pune", verified: true, timeAgo: "4 days ago" },
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
      { stars: 5, variantDescription: "Silver, 13-inch", text: "The 13-inch display is incredible for drawing. ProMotion makes it so smooth.", attachments: [], reviewerName: "Ananya K.", city: "Mumbai", verified: true, timeAgo: "3 days ago" },
      { stars: 5, variantDescription: "Space Black, 11-inch", text: "So thin and light. The M4 chip handles everything I throw at it.", attachments: [], reviewerName: "Rohit G.", city: "Bangalore", verified: true, timeAgo: "1 week ago" },
      { stars: 4, variantDescription: "Silver, 11-inch", text: "Best tablet for professional work. The display quality is unmatched.", attachments: [], reviewerName: "Vikram P.", city: "Delhi", verified: true, timeAgo: "5 days ago" },
      { stars: 5, variantDescription: "Space Black, 13-inch", text: "Replaced my MacBook with this. Stage Manager makes multitasking easy.", attachments: [], reviewerName: "Sneha T.", city: "Chennai", verified: true, timeAgo: "4 days ago" },
      { stars: 5, variantDescription: "Silver, 11-inch", text: "The tandem OLED display is the best I've ever seen on any device.", attachments: [], reviewerName: "Deepak S.", city: "Hyderabad", verified: true, timeAgo: "2 days ago" },
      { stars: 4, variantDescription: "Space Black, 13-inch", text: "Incredible performance and display. The pencil hover feature is very useful.", attachments: [], reviewerName: "Neha R.", city: "Pune", verified: true, timeAgo: "1 week ago" },
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
      { stars: 5, variantDescription: "Red", text: "Used it at a beach party. Sound carried well even with wind and waves.", attachments: [], reviewerName: "Sonia R.", city: "Goa", verified: true, timeAgo: "3 days ago" },
      { stars: 5, variantDescription: "Blue", text: "Charges my phone and plays music. Two devices in one!", attachments: [], reviewerName: "Amit S.", city: "Jaipur", verified: true, timeAgo: "1 week ago" },
      { stars: 4, variantDescription: "Green", text: "Great sound for the size. Battery lasts the entire day at the pool.", attachments: [], reviewerName: "Rahul G.", city: "Mumbai", verified: true, timeAgo: "5 days ago" },
      { stars: 5, variantDescription: "Black", text: "My third JBL speaker. The quality is consistently excellent.", attachments: [], reviewerName: "Meera V.", city: "Delhi", verified: true, timeAgo: "4 days ago" },
      { stars: 4, variantDescription: "Red", text: "Solid speaker. IP67 means I never worry about taking it outdoors.", attachments: [], reviewerName: "Karan J.", city: "Hyderabad", verified: true, timeAgo: "2 days ago" },
      { stars: 5, variantDescription: "Blue", text: "Bass is surprisingly deep for a portable speaker. PartyBoost feature is fun.", attachments: [], reviewerName: "Gaurav S.", city: "Pune", verified: true, timeAgo: "1 week ago" },
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
      { stars: 5, variantDescription: "Starlight", text: "The always-on display is so useful. Love checking time without raising my wrist.", attachments: [], reviewerName: "Neha R.", city: "Delhi", verified: true, timeAgo: "3 days ago" },
      { stars: 4, variantDescription: "Silver", text: "Great fitness tracking. The heart rate monitor is very accurate.", attachments: [], reviewerName: "Rahul V.", city: "Mumbai", verified: true, timeAgo: "1 week ago" },
      { stars: 5, variantDescription: "Midnight", text: "Perfect for health tracking. Sleep tracking has improved my routine.", attachments: [], reviewerName: "Kavita L.", city: "Chennai", verified: true, timeAgo: "5 days ago" },
      { stars: 5, variantDescription: "Starlight", text: "Best smartwatch for iPhone users. Seamless integration with my phone.", attachments: [], reviewerName: "Arjun P.", city: "Bangalore", verified: true, timeAgo: "2 days ago" },
      { stars: 4, variantDescription: "Product RED", text: "Love the red color! Battery easily lasts a full day with heavy use.", attachments: [], reviewerName: "Shruti B.", city: "Pune", verified: true, timeAgo: "4 days ago" },
      { stars: 5, variantDescription: "Silver", text: "The workout detection is incredible. Automatically tracks my runs and gym sessions.", attachments: [], reviewerName: "Manish A.", city: "Jaipur", verified: true, timeAgo: "1 week ago" },
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
      { stars: 5, variantDescription: "Silver", text: "The rotating bezel is so satisfying to use. Way better than a touchscreen.", attachments: [], reviewerName: "Gaurav S.", city: "Jaipur", verified: true, timeAgo: "3 days ago" },
      { stars: 4, variantDescription: "Black", text: "Great build quality. Wear OS runs smoothly with Samsung's optimizations.", attachments: [], reviewerName: "Pooja S.", city: "Delhi", verified: true, timeAgo: "1 week ago" },
      { stars: 5, variantDescription: "Silver", text: "Best Android smartwatch. The health sensors are very accurate.", attachments: [], reviewerName: "Suresh K.", city: "Chennai", verified: true, timeAgo: "5 days ago" },
      { stars: 4, variantDescription: "Black", text: "Love the classic design. Battery lasts about 2 days with moderate use.", attachments: [], reviewerName: "Deepak L.", city: "Hyderabad", verified: true, timeAgo: "4 days ago" },
      { stars: 5, variantDescription: "Silver", text: "The sapphire crystal display is scratch-proof. Looks brand new after 3 months.", attachments: [], reviewerName: "Karan J.", city: "Mumbai", verified: true, timeAgo: "2 days ago" },
      { stars: 4, variantDescription: "Black", text: "Excellent watch for fitness and notifications. The bezel is addictive.", attachments: [], reviewerName: "Isha T.", city: "Pune", verified: true, timeAgo: "1 week ago" },
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
      { stars: 5, variantDescription: "Indigo, 1TB", text: "Transfer speeds are as advertised. Very compact and light.", attachments: [], reviewerName: "Rohan D.", city: "Delhi", verified: true, timeAgo: "1 week ago" },
      { stars: 4, variantDescription: "Titanium Gray, 1TB", text: "Solid portable drive. Works flawlessly with my MacBook.", attachments: [], reviewerName: "Kavita M.", city: "Mumbai", verified: true, timeAgo: "2 weeks ago" },
      { stars: 5, variantDescription: "Beige, 1TB", text: "Perfect for backing up photos from my camera. Very fast.", attachments: [], reviewerName: "Arun C.", city: "Kochi", verified: true, timeAgo: "3 days ago" },
      { stars: 4, variantDescription: "Indigo, 500GB", text: "Great build quality. The included USB-C cable is convenient.", attachments: [], reviewerName: "Priya G.", city: "Chandigarh", verified: true, timeAgo: "5 days ago" },
      { stars: 5, variantDescription: "Titanium Gray, 2TB", text: "Upgraded to 2TB. Enough space for all my video projects.", attachments: [], reviewerName: "Tarun W.", city: "Hyderabad", verified: true, timeAgo: "1 week ago" },
      { stars: 4, variantDescription: "Indigo, 1TB", text: "Reliable and fast. Been using it for 6 months with no issues.", attachments: [], reviewerName: "Neha S.", city: "Pune", verified: true, timeAgo: "4 days ago" },
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
      { stars: 5, variantDescription: "Black", text: "The eye AF is incredible. Never misses focus on moving subjects.", attachments: [], reviewerName: "Shruti B.", city: "Delhi", verified: true, timeAgo: "3 days ago" },
      { stars: 5, variantDescription: "Black", text: "33MP full-frame sensor produces stunning images. Dynamic range is excellent.", attachments: [], reviewerName: "Aditya H.", city: "Mumbai", verified: true, timeAgo: "1 week ago" },
      { stars: 4, variantDescription: "Black", text: "Great hybrid camera. 4K 60fps video quality is impressive.", attachments: [], reviewerName: "Manish A.", city: "Jaipur", verified: true, timeAgo: "5 days ago" },
      { stars: 5, variantDescription: "Black", text: "Upgraded from A7 III. The improvement in autofocus is night and day.", attachments: [], reviewerName: "Nivedita P.", city: "Chennai", verified: true, timeAgo: "4 days ago" },
      { stars: 5, variantDescription: "Black", text: "Best camera for wedding photography. The color science is beautiful.", attachments: [], reviewerName: "Pallavi S.", city: "Kolkata", verified: true, timeAgo: "2 days ago" },
      { stars: 4, variantDescription: "Black", text: "Excellent image quality. The menu system has improved from older Sony cameras.", attachments: [], reviewerName: "Suresh T.", city: "Bangalore", verified: true, timeAgo: "1 week ago" },
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
      { stars: 5, variantDescription: "White", text: "Games load instantly. The SSD is a game changer compared to PS4.", attachments: [], reviewerName: "Amit K.", city: "Jaipur", verified: true, timeAgo: "2 days ago" },
      { stars: 5, variantDescription: "White", text: "The DualSense controller haptics are mind-blowing. Returnal feels incredible.", attachments: [], reviewerName: "Rohan D.", city: "Delhi", verified: true, timeAgo: "1 week ago" },
      { stars: 4, variantDescription: "White", text: "Great console. Only wish it had a disc drive option at this price.", attachments: [], reviewerName: "Karthik R.", city: "Bangalore", verified: true, timeAgo: "5 days ago" },
      { stars: 5, variantDescription: "White", text: "Ray tracing looks stunning on my 4K TV. Best gaming experience ever.", attachments: [], reviewerName: "Pallavi S.", city: "Mumbai", verified: true, timeAgo: "3 days ago" },
      { stars: 5, variantDescription: "White", text: "Spider-Man 2 on this console is a visual masterpiece. Worth every penny.", attachments: [], reviewerName: "Nivedita P.", city: "Chennai", verified: true, timeAgo: "4 days ago" },
      { stars: 4, variantDescription: "White", text: "Amazing console. PS Plus Extra gives incredible value with the game library.", attachments: [], reviewerName: "Sneha A.", city: "Pune", verified: true, timeAgo: "1 week ago" },
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
  {
    id: "MOB-005",
    slug: "samsung-z-flip5-256gb",
    name: "Samsung Galaxy Z Flip5 (256GB)",
    category: "Mobiles",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Mobiles", href: "/c/mobiles" },
      { label: "Samsung Galaxy Z Flip5 (256GB)", href: null },
    ],
    images: phoneImages2,
    selectedColor: "Mint",
    colorOptions: ["Mint", "Lavender", "Graphite"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Mint", variantLabel: null, variantValue: null, price: 89999, mrp: 99999, images: phoneImages2 },
      { color: "Lavender", variantLabel: null, variantValue: null, price: 89999, mrp: 99999, images: phoneImages2 },
      { color: "Graphite", variantLabel: null, variantValue: null, price: 89999, mrp: 99999, images: phoneImages2 },
    ],
    price: 89999,
    mrp: 99999,
    rating: 4.3,
    overallRating: 4.2,
    soldCount: 680,
    appLinks: {
      appStore: "https://apps.apple.com/app/samsung-shop",
      playStore: "https://play.google.com/store/apps/details?id=com.samsung.shop",
    },
    tenureOptions: generateEmiOptions(89999),
    defaultTenureIndex: 2,
    downPayment: 8999,
    emiStartLabel: "EMI starts at ₹7,500/month",
    seller: { name: "Samsung India", url: "/seller/samsung-india" },
    shipping: { text: "Free delivery by tomorrow." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Display", value: '6.7" Dynamic AMOLED 2X, 120Hz' },
      { label: "Processor", value: "Snapdragon 8 Gen 2" },
      { label: "RAM", value: "8 GB" },
      { label: "Storage", value: "256 GB" },
      { label: "Battery", value: "3700 mAh" },
      { label: "Camera", value: "12 MP + 12 MP" },
      { label: "OS", value: "Android 13, One UI 5.1.1" },
      { label: "Weight", value: "187 g" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Mint", text: "The flip form factor is so fun and practical. Pocketable flagship!", attachments: [], reviewerName: "Ananya K.", city: "Mumbai", verified: true, timeAgo: "4 days ago" },
      { stars: 4, variantDescription: "Lavender", text: "Love the FlexCam feature. Battery could be better though.", attachments: [], reviewerName: "Rohan D.", city: "Delhi", verified: true, timeAgo: "1 week ago" },
    ],
  },
  {
    id: "MOB-006",
    slug: "redmi-note-13-pro-256gb",
    name: "Xiaomi Redmi Note 13 Pro+ (256GB)",
    category: "Mobiles",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Mobiles", href: "/c/mobiles" },
      { label: "Xiaomi Redmi Note 13 Pro+ (256GB)", href: null },
    ],
    images: phoneImages3,
    selectedColor: "Midnight Black",
    colorOptions: ["Midnight Black", "Ice Blue", "Aurora Green"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Midnight Black", variantLabel: null, variantValue: null, price: 29999, mrp: 34999, images: phoneImages3 },
      { color: "Ice Blue", variantLabel: null, variantValue: null, price: 29999, mrp: 34999, images: phoneImages3 },
      { color: "Aurora Green", variantLabel: null, variantValue: null, price: 29999, mrp: 34999, images: phoneImages3 },
    ],
    price: 29999,
    mrp: 34999,
    rating: 4.2,
    overallRating: 4.1,
    soldCount: 4200,
    appLinks: {
      appStore: "https://apps.apple.com/app/xiaomi-shop",
      playStore: "https://play.google.com/store/apps/details?id=com.mi.global.shop",
    },
    tenureOptions: generateEmiOptions(29999),
    defaultTenureIndex: 1,
    downPayment: 2999,
    emiStartLabel: "EMI starts at ₹2,500/month",
    seller: { name: "Xiaomi India", url: "/seller/xiaomi-india" },
    shipping: { text: "Free delivery in 2-3 days." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Display", value: '6.67" AMOLED, 120Hz' },
      { label: "Processor", value: "Dimensity 7200 Ultra" },
      { label: "RAM", value: "8 GB" },
      { label: "Storage", value: "256 GB" },
      { label: "Battery", value: "5000 mAh" },
      { label: "Camera", value: "200 MP + 8 MP + 2 MP" },
      { label: "OS", value: "Android 13, MIUI 14" },
      { label: "Weight", value: "204 g" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Midnight Black", text: "Best value for money flagship killer. 200MP camera is stunning.", attachments: [], reviewerName: "Amit S.", city: "Jaipur", verified: true, timeAgo: "2 days ago" },
      { stars: 4, variantDescription: "Ice Blue", text: "Great display and charging speed. MIUI takes some getting used to.", attachments: [], reviewerName: "Priya G.", city: "Chandigarh", verified: true, timeAgo: "5 days ago" },
    ],
  },
  {
    id: "LAP-003",
    slug: "asus-rog-strix-g16",
    name: "ASUS ROG Strix G16 Gaming Laptop (i9/RTX 4070)",
    category: "Laptops",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Laptops", href: "/c/laptops" },
      { label: "ASUS ROG Strix G16 Gaming Laptop (i9/RTX 4070)", href: null },
    ],
    images: laptopImages2,
    selectedColor: "Eclipse Gray",
    colorOptions: ["Eclipse Gray", "Ultimate Black"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Eclipse Gray", variantLabel: null, variantValue: null, price: 164990, mrp: 189990, images: laptopImages2 },
      { color: "Ultimate Black", variantLabel: null, variantValue: null, price: 164990, mrp: 189990, images: laptopImages2 },
    ],
    price: 164990,
    mrp: 189990,
    rating: 4.6,
    overallRating: 4.5,
    soldCount: 340,
    appLinks: {
      appStore: "",
      playStore: "https://play.google.com/store/apps/details?id=com.asus.gamecenter",
    },
    tenureOptions: generateEmiOptions(164990),
    defaultTenureIndex: 3,
    downPayment: 16499,
    emiStartLabel: "EMI starts at ₹13,749/month",
    seller: { name: "ASUS India", url: "/seller/asus-india" },
    shipping: { text: "Free delivery in 3-5 days." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Display", value: '16" QHD+, 240Hz, IPS' },
      { label: "Processor", value: "Intel Core i9-13980HX" },
      { label: "GPU", value: "NVIDIA RTX 4070 8GB" },
      { label: "RAM", value: "16 GB DDR5" },
      { label: "Storage", value: "1 TB SSD" },
      { label: "Battery", value: "90 Whr" },
      { label: "Weight", value: "2.5 kg" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Eclipse Gray", text: "Runs every game at max settings. The 240Hz display is buttery smooth.", attachments: [], reviewerName: "Karthik R.", city: "Bangalore", verified: true, timeAgo: "3 days ago" },
      { stars: 4, variantDescription: "Ultimate Black", text: "Incredible performance but gets warm under load. Fan noise is noticeable.", attachments: [], reviewerName: "Nisha M.", city: "Hyderabad", verified: true, timeAgo: "1 week ago" },
    ],
  },
  {
    id: "LAP-004",
    slug: "hp-elitebook-i5",
    name: "HP EliteBook 840 G10 (i5/16GB/512GB)",
    category: "Laptops",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Laptops", href: "/c/laptops" },
      { label: "HP EliteBook 840 G10 (i5/16GB/512GB)", href: null },
    ],
    images: laptopImages,
    selectedColor: "Silver",
    colorOptions: ["Silver"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Silver", variantLabel: null, variantValue: null, price: 89999, mrp: 104999, images: laptopImages },
    ],
    price: 89999,
    mrp: 104999,
    rating: 4.3,
    overallRating: 4.2,
    soldCount: 520,
    appLinks: {
      appStore: "",
      playStore: "https://play.google.com/store/apps/details?id=com.hp.printercontrol",
    },
    tenureOptions: generateEmiOptions(89999),
    defaultTenureIndex: 2,
    downPayment: 8999,
    emiStartLabel: "EMI starts at ₹7,500/month",
    seller: { name: "HP India", url: "/seller/hp-india" },
    shipping: { text: "Free delivery in 2-3 days." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Display", value: '14" FHD+, Anti-glare' },
      { label: "Processor", value: "Intel Core i5-1345U" },
      { label: "RAM", value: "16 GB DDR4" },
      { label: "Storage", value: "512 GB SSD" },
      { label: "Battery", value: "48 Whr" },
      { label: "Weight", value: "1.36 kg" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 4, variantDescription: "Silver", text: "Solid business laptop. Great keyboard and build quality.", attachments: [], reviewerName: "Suresh K.", city: "Chennai", verified: true, timeAgo: "6 days ago" },
      { stars: 5, variantDescription: "Silver", text: "Perfect business laptop. Light, fast, and the keyboard is amazing.", attachments: [], reviewerName: "Sanjay M.", city: "Delhi", verified: true, timeAgo: "3 days ago" },
      { stars: 4, variantDescription: "Silver", text: "Reliable and well-built. The security features are great for enterprise use.", attachments: [], reviewerName: "Nisha M.", city: "Kolkata", verified: true, timeAgo: "1 week ago" },
      { stars: 5, variantDescription: "Silver", text: "Excellent for daily office work. Battery lasts through a full work day.", attachments: [], reviewerName: "Aditya H.", city: "Mumbai", verified: true, timeAgo: "5 days ago" },
      { stars: 4, variantDescription: "Silver", text: "Good build quality. The webcam is decent for video calls.", attachments: [], reviewerName: "Rahul S.", city: "Bangalore", verified: true, timeAgo: "4 days ago" },
      { stars: 5, variantDescription: "Silver", text: "IT department approved this model. Very pleased with the performance.", attachments: [], reviewerName: "Vikram D.", city: "Hyderabad", verified: true, timeAgo: "2 days ago" },
      { stars: 4, variantDescription: "Silver", text: "Solid enterprise laptop. The trackpoint is a nice touch for power users.", attachments: [], reviewerName: "Ananya D.", city: "Chennai", verified: true, timeAgo: "1 week ago" },
    ],
  },
  {
    id: "TAB-002",
    slug: "samsung-tab-s9-fe",
    name: "Samsung Galaxy Tab S9 FE+ (124GB, Wi-Fi)",
    category: "Tablets",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Tablets", href: "/c/tablets" },
      { label: "Samsung Galaxy Tab S9 FE+ (124GB, Wi-Fi)", href: null },
    ],
    images: tabletImages,
    selectedColor: "Gray",
    colorOptions: ["Gray", "Mint", "Lavender"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Gray", variantLabel: null, variantValue: null, price: 44999, mrp: 52999, images: tabletImages },
      { color: "Mint", variantLabel: null, variantValue: null, price: 44999, mrp: 52999, images: tabletImages },
      { color: "Lavender", variantLabel: null, variantValue: null, price: 44999, mrp: 52999, images: tabletImages },
    ],
    price: 44999,
    mrp: 52999,
    rating: 4.4,
    overallRating: 4.3,
    soldCount: 780,
    appLinks: {
      appStore: "",
      playStore: "https://play.google.com/store/apps/details?id=com.samsung.android.app.notes",
    },
    tenureOptions: generateEmiOptions(44999),
    defaultTenureIndex: 1,
    downPayment: 4499,
    emiStartLabel: "EMI starts at ₹3,750/month",
    seller: { name: "Samsung India", url: "/seller/samsung-india" },
    shipping: { text: "Free delivery by tomorrow." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Display", value: '12.4" TFT LCD, 90Hz' },
      { label: "Processor", value: "Exynos 1380" },
      { label: "RAM", value: "8 GB" },
      { label: "Storage", value: "128 GB" },
      { label: "Battery", value: "10090 mAh" },
      { label: "Stylus", value: "S Pen included" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Gray", text: "Perfect for digital note-taking. S Pen feels natural and responsive.", attachments: [], reviewerName: "Isha T.", city: "Pune", verified: true, timeAgo: "2 days ago" },
      { stars: 4, variantDescription: "Mint", text: "Great media consumption tablet. Battery life is exceptional.", attachments: [], reviewerName: "Deepak S.", city: "Lucknow", verified: true, timeAgo: "1 week ago" },
    ],
  },
  {
    id: "AUD-003",
    slug: "bose-qc-ultra",
    name: "Bose QuietComfort Ultra Headphones",
    category: "Audio",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Audio", href: "/c/audio" },
      { label: "Bose QuietComfort Ultra Headphones", href: null },
    ],
    images: audioImages,
    selectedColor: "Black",
    colorOptions: ["Black", "White Smoke", "Earth Yellow"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Black", variantLabel: null, variantValue: null, price: 37999, mrp: 42999, images: audioImages },
      { color: "White Smoke", variantLabel: null, variantValue: null, price: 37999, mrp: 42999, images: audioImages },
      { color: "Earth Yellow", variantLabel: null, variantValue: null, price: 39999, mrp: 44999, images: audioImages },
    ],
    price: 37999,
    mrp: 42999,
    rating: 4.7,
    overallRating: 4.6,
    soldCount: 1450,
    appLinks: {
      appStore: "https://apps.apple.com/app/bose-music",
      playStore: "https://play.google.com/store/apps/details?id=com.bose.music",
    },
    tenureOptions: generateEmiOptions(37999),
    defaultTenureIndex: 2,
    downPayment: 3999,
    emiStartLabel: "EMI starts at ₹3,167/month",
    seller: { name: "Bose India", url: "/seller/bose-india" },
    shipping: { text: "Free delivery by tomorrow." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Driver", value: "Custom-tuned" },
      { label: "Battery", value: "24 hours" },
      { label: "ANC", value: "Yes, World-class" },
      { label: "Spatial Audio", value: "Immersive Audio" },
      { label: "Weight", value: "250 g" },
      { label: "Connectivity", value: "Bluetooth 5.3" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Black", text: "The best ANC I've ever experienced. Premium sound and comfort.", attachments: [], reviewerName: "Meena J.", city: "Delhi", verified: true, timeAgo: "1 day ago" },
      { stars: 5, variantDescription: "White Smoke", text: "Spatial audio is a game-changer for movies. Worth every rupee.", attachments: [], reviewerName: "Rahul V.", city: "Bangalore", verified: true, timeAgo: "4 days ago" },
    ],
  },
  {
    id: "AUD-004",
    slug: "boAtwood-float-wireless",
    name: "boAt Rockerz 450 Wireless Headphones",
    category: "Audio",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Audio", href: "/c/audio" },
      { label: "boAt Rockerz 450 Wireless Headphones", href: null },
    ],
    images: audioImages,
    selectedColor: "Black",
    colorOptions: ["Black", "Blue", "Rose Gold"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Black", variantLabel: null, variantValue: null, price: 1299, mrp: 3990, images: audioImages },
      { color: "Blue", variantLabel: null, variantValue: null, price: 1299, mrp: 3990, images: audioImages },
      { color: "Rose Gold", variantLabel: null, variantValue: null, price: 1399, mrp: 3990, images: audioImages },
    ],
    price: 1299,
    mrp: 3990,
    rating: 4.1,
    overallRating: 4.0,
    soldCount: 25000,
    appLinks: {
      appStore: "https://apps.apple.com/app/boat",
      playStore: "https://play.google.com/store/apps/details?id=com.boat.lifestyles",
    },
    tenureOptions: generateEmiOptions(1299),
    defaultTenureIndex: 0,
    downPayment: 199,
    emiStartLabel: "EMI starts at ₹108/month",
    seller: { name: "boAt India", url: "/seller/boat-india" },
    shipping: { text: "Free delivery in 2-3 days." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Driver", value: "40mm" },
      { label: "Battery", value: "20 hours" },
      { label: "Weight", value: "240 g" },
      { label: "Connectivity", value: "Bluetooth 5.1" },
      { label: "Charging", value: "USB-C" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 4, variantDescription: "Black", text: "Unbeatable value. Sound quality is decent for the price point.", attachments: [], reviewerName: "Vikash P.", city: "Patna", verified: true, timeAgo: "2 days ago" },
      { stars: 4, variantDescription: "Blue", text: "Comfortable for long wear. Good bass response.", attachments: [], reviewerName: "Sonia R.", city: "Ahmedabad", verified: true, timeAgo: "5 days ago" },
    ],
  },
  {
    id: "ACC-003",
    slug: "soundpeats-aircandy",
    name: "SoundPEATS AirCandy Wireless Earbuds",
    category: "Accessories",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Accessories", href: "/c/accessories" },
      { label: "SoundPEATS AirCandy Wireless Earbuds", href: null },
    ],
    images: earphoneImages,
    selectedColor: "White",
    colorOptions: ["White", "Black"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "White", variantLabel: null, variantValue: null, price: 1499, mrp: 2999, images: earphoneImages },
      { color: "Black", variantLabel: null, variantValue: null, price: 1499, mrp: 2999, images: earphoneImages },
    ],
    price: 1499,
    mrp: 2999,
    rating: 4.0,
    overallRating: 3.9,
    soldCount: 12000,
    appLinks: {
      appStore: "",
      playStore: "",
    },
    tenureOptions: generateEmiOptions(1499),
    defaultTenureIndex: 0,
    downPayment: 199,
    emiStartLabel: "EMI starts at ₹125/month",
    seller: { name: "SoundPEATS India", url: "/seller/soundpeats-india" },
    shipping: { text: "Free delivery in 3-4 days." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Driver", value: "13mm Dynamic" },
      { label: "Battery", value: "30 hours (with case)" },
      { label: "ANC", value: "Hybrid ANC" },
      { label: "Waterproof", value: "IPX5" },
      { label: "Connectivity", value: "Bluetooth 5.3" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 4, variantDescription: "White", text: "Excellent budget earbuds. ANC works well for the price.", attachments: [], reviewerName: "Akash M.", city: "Indore", verified: true, timeAgo: "3 days ago" },
      { stars: 4, variantDescription: "Black", text: "Good call quality and comfortable fit. Battery lasts all day.", attachments: [], reviewerName: "Jaya N.", city: "Kochi", verified: true, timeAgo: "1 week ago" },
    ],
  },
  {
    id: "WEAR-003",
    slug: "garmin-venu-3",
    name: "Garmin Venu 3 GPS Smartwatch (45mm)",
    category: "Wearables",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Wearables", href: "/c/wearables" },
      { label: "Garmin Venu 3 GPS Smartwatch (45mm)", href: null },
    ],
    images: smartwatchImages,
    selectedColor: "Sage Green",
    colorOptions: ["Sage Green", "Silver Rose", "Black"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Sage Green", variantLabel: null, variantValue: null, price: 42990, mrp: 47990, images: smartwatchImages },
      { color: "Silver Rose", variantLabel: null, variantValue: null, price: 42990, mrp: 47990, images: smartwatchImages },
      { color: "Black", variantLabel: null, variantValue: null, price: 42990, mrp: 47990, images: smartwatchImages },
    ],
    price: 42990,
    mrp: 47990,
    rating: 4.6,
    overallRating: 4.5,
    soldCount: 560,
    appLinks: {
      appStore: "https://apps.apple.com/app/garmin-connect",
      playStore: "https://play.google.com/store/apps/details?id=com.garmin.android.apps.connectmobile",
    },
    tenureOptions: generateEmiOptions(42990),
    defaultTenureIndex: 2,
    downPayment: 4999,
    emiStartLabel: "EMI starts at ₹3,583/month",
    seller: { name: "Garmin India", url: "/seller/garmin-india" },
    shipping: { text: "Free delivery in 2-3 days." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Display", value: '1.4" AMOLED, Always-On' },
      { label: "Battery", value: "Up to 14 days" },
      { label: "GPS", value: "Multi-band GPS" },
      { label: "Health", value: "Heart Rate, SpO2, Stress" },
      { label: "Water Resistance", value: "5 ATM" },
      { label: "Weight", value: "47 g" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Sage Green", text: "Best fitness tracker I've owned. Sleep tracking is incredibly detailed.", attachments: [], reviewerName: "Nivedita P.", city: "Bangalore", verified: true, timeAgo: "3 days ago" },
      { stars: 4, variantDescription: "Black", text: "Outstanding battery life. Screen is bright and crisp even in sunlight.", attachments: [], reviewerName: "Rajesh K.", city: "Chennai", verified: true, timeAgo: "1 week ago" },
    ],
  },
  {
    id: "CAM-002",
    slug: "canon-r50-kit",
    name: "Canon EOS R50 Mirrorless Camera (18-45mm Kit)",
    category: "Cameras",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Cameras", href: "/c/cameras" },
      { label: "Canon EOS R50 Mirrorless Camera (18-45mm Kit)", href: null },
    ],
    images: cameraImages,
    selectedColor: "Black",
    colorOptions: ["Black", "White"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Black", variantLabel: null, variantValue: null, price: 64990, mrp: 74990, images: cameraImages },
      { color: "White", variantLabel: null, variantValue: null, price: 66990, mrp: 76990, images: cameraImages },
    ],
    price: 64990,
    mrp: 74990,
    rating: 4.6,
    overallRating: 4.5,
    soldCount: 280,
    appLinks: {
      appStore: "",
      playStore: "",
    },
    tenureOptions: generateEmiOptions(64990),
    defaultTenureIndex: 2,
    downPayment: 6999,
    emiStartLabel: "EMI starts at ₹5,417/month",
    seller: { name: "Canon India", url: "/seller/canon-india" },
    shipping: { text: "Free delivery in 3-5 days." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Sensor", value: "24.2 MP APS-C CMOS" },
      { label: "Video", value: "4K 30fps, FHD 120fps" },
      { label: "AF Points", value: "651 selectable AF points" },
      { label: "ISO", value: "100 - 51200" },
      { label: "Weight", value: "375 g (body only)" },
      { label: "Lens Mount", value: "Canon RF" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Black", text: "Perfect entry-level camera for enthusiasts. Autofocus is lightning fast.", attachments: [], reviewerName: "Sanjay D.", city: "Mumbai", verified: true, timeAgo: "4 days ago" },
      { stars: 4, variantDescription: "White", text: "Lightweight and compact. Great for travel photography.", attachments: [], reviewerName: "Pallavi S.", city: "Kolkata", verified: true, timeAgo: "1 week ago" },
    ],
  },
  {
    id: "GAM-002",
    slug: "xbox-series-x",
    name: "Microsoft Xbox Series X (1TB)",
    category: "Gaming",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Gaming", href: "/c/gaming" },
      { label: "Microsoft Xbox Series X (1TB)", href: null },
    ],
    images: gamingImages,
    selectedColor: "Black",
    colorOptions: ["Black"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "Black", variantLabel: null, variantValue: null, price: 49990, mrp: 54990, images: gamingImages },
    ],
    price: 49990,
    mrp: 54990,
    rating: 4.6,
    overallRating: 4.5,
    soldCount: 1560,
    appLinks: {
      appStore: "https://apps.apple.com/app/xbox-app/id1419716965",
      playStore: "https://play.google.com/store/apps/details?id=com.microsoft.xbox.app",
    },
    tenureOptions: generateEmiOptions(49990),
    defaultTenureIndex: 2,
    downPayment: 4999,
    emiStartLabel: "EMI starts at ₹4,167/month",
    seller: { name: "Microsoft India", url: "/seller/microsoft-india" },
    shipping: { text: "Free delivery by tomorrow." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "CPU", value: "AMD Zen 2, 8-core" },
      { label: "GPU", value: "12 TFLOPS, RDNA 2" },
      { label: "Storage", value: "1 TB Custom SSD" },
      { label: "RAM", value: "16 GB GDDR6" },
      { label: "Output", value: "4K 120fps, 8K HDR" },
      { label: "Backward Compatible", value: "4 generations of Xbox" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "Black", text: "Most powerful console available. Game Pass makes it an absolute steal.", attachments: [], reviewerName: "Aditya H.", city: "Delhi", verified: true, timeAgo: "2 days ago" },
      { stars: 5, variantDescription: "Black", text: "Load times are instant. Xbox ecosystem is unmatched.", attachments: [], reviewerName: "Manoj T.", city: "Hyderabad", verified: true, timeAgo: "5 days ago" },
    ],
  },
  {
    id: "GAM-003",
    slug: "nintendo-switch-oled",
    name: "Nintendo Switch OLED Model",
    category: "Gaming",
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: "Gaming", href: "/c/gaming" },
      { label: "Nintendo Switch OLED Model", href: null },
    ],
    images: gamingImages,
    selectedColor: "White",
    colorOptions: ["White", "Neon Red/Blue"],
    selectedVariant: {},
    variantOptions: [],
    optionPricing: [
      { color: "White", variantLabel: null, variantValue: null, price: 32990, mrp: 36990, images: gamingImages },
      { color: "Neon Red/Blue", variantLabel: null, variantValue: null, price: 33990, mrp: 37990, images: gamingImages },
    ],
    price: 32990,
    mrp: 36990,
    rating: 4.7,
    overallRating: 4.6,
    soldCount: 3200,
    appLinks: {
      appStore: "https://apps.apple.com/app/nintendo-app/id1256458085",
      playStore: "https://play.google.com/store/apps/details?id=com.nintendo.zasa",
    },
    tenureOptions: generateEmiOptions(32990),
    defaultTenureIndex: 1,
    downPayment: 3299,
    emiStartLabel: "EMI starts at ₹2,750/month",
    seller: { name: "Nintendo India", url: "/seller/nintendo-india" },
    shipping: { text: "Free delivery in 2-3 days." },
    trustBadges: TRUST_BADGES,
    specs: [
      { label: "Display", value: '7" OLED, 1280x720' },
      { label: "Storage", value: "64 GB" },
      { label: "Battery", value: "4.5 - 9 hours" },
      { label: "Modes", value: "TV / Tabletop / Handheld" },
      { label: "Weight", value: "420 g (console)" },
    ],
    reviewMedia: [],
    reviews: [
      { stars: 5, variantDescription: "White", text: "The OLED screen is gorgeous. Portable gaming at its finest.", attachments: [], reviewerName: "Snehal A.", city: "Pune", verified: true, timeAgo: "1 day ago" },
      { stars: 5, variantDescription: "Neon Red/Blue", text: "Perfect for family gaming. Mario Odyssey on this screen is magical.", attachments: [], reviewerName: "Gaurav S.", city: "Jaipur", verified: true, timeAgo: "3 days ago" },
    ],
  },
]


const imgPools: Record<string, string[][]> = {
  Mobiles: [
    [`${IMAGE_BASE}photo-1592750475338-74b7b21085ab?w=600`, `${IMAGE_BASE}photo-1511707171634-5f897ff02aa9?w=600`, `${IMAGE_BASE}photo-1565849904461-04a58ad377e0?w=600`],
    [`${IMAGE_BASE}photo-1580910051074-3eb694886505?w=600`, `${IMAGE_BASE}photo-1591337676887-a217a6970a8a?w=600`, `${IMAGE_BASE}photo-1527443224154-c4a3942d3acf?w=600`],
    [`${IMAGE_BASE}photo-1587829741301-dc798b83add3?w=600`, `${IMAGE_BASE}photo-1588872657578-7efd1f1555ed?w=600`, `${IMAGE_BASE}photo-1592899677977-9c10ca588bbd?w=600`],
    [`${IMAGE_BASE}photo-1567532939604-b6b5b0db2604?w=600`, `${IMAGE_BASE}photo-1598327105666-5b89351aff97?w=600`, `${IMAGE_BASE}photo-1585060544812-6b45742d762f?w=600`],
    [`${IMAGE_BASE}photo-1610945265064-0e34e5519bbf?w=600`, `${IMAGE_BASE}photo-1512941937669-90a1b58e7e9c?w=600`, `${IMAGE_BASE}photo-1544866092-1935c5ef2a8f?w=600`],
    [`${IMAGE_BASE}photo-1560518883-ce09059eeffa?w=600`, `${IMAGE_BASE}photo-1591696205602-2f950c417cb9?w=600`, `${IMAGE_BASE}photo-1556656793-08538906a9f8?w=600`],
    [`${IMAGE_BASE}photo-1601784551446-20c9e07cdbdb?w=600`, `${IMAGE_BASE}photo-1629131726692-1accd0c53ce0?w=600`, `${IMAGE_BASE}photo-1580894894513-541e068a3e2b?w=600`],
    [`${IMAGE_BASE}photo-1565106430482-8f6e74349ca1?w=600`, `${IMAGE_BASE}photo-1584438784894-089d6a62b8fa?w=600`, `${IMAGE_BASE}photo-1576091160550-2173dba999ef?w=600`],
    [`${IMAGE_BASE}photo-1628744876497-eb30460be9f6?w=600`, `${IMAGE_BASE}photo-1541807084-5c52b6b3adef?w=600`, `${IMAGE_BASE}photo-1586953208448-b95a79798f07?w=600`],
    [`${IMAGE_BASE}photo-1592899677977-9c10ca588bbd?w=600`, `${IMAGE_BASE}photo-1567532939604-b6b5b0db2604?w=600`, `${IMAGE_BASE}photo-1598327105666-5b89351aff97?w=600`],
  ],
  Laptops: [
    [`${IMAGE_BASE}photo-1496181133206-80ce9b88a853?w=600`, `${IMAGE_BASE}photo-1525547719571-a2d4ac8945e2?w=600`],
    [`${IMAGE_BASE}photo-1517336714731-489689fd1ca8?w=600`, `${IMAGE_BASE}photo-1498050108023-c5249f4df085?w=600`],
    [`${IMAGE_BASE}photo-1553877522-43269d4ea984?w=600`, `${IMAGE_BASE}photo-1531297484001-80022131f5a1?w=600`],
    [`${IMAGE_BASE}photo-1517694712202-14dd9538aa97?w=600`, `${IMAGE_BASE}photo-1542393545-10f5cde2c810?w=600`],
    [`${IMAGE_BASE}photo-1537498425277-c283d32ef9db?w=600`, `${IMAGE_BASE}photo-1625842268584-8f3296236761?w=600`],
    [`${IMAGE_BASE}photo-1593642702821-c8da6771f0c6?w=600`, `${IMAGE_BASE}photo-1593640408182-31c70c8268f5?w=600`],
    [`${IMAGE_BASE}photo-1603302576837-37561b2e2302?w=600`, `${IMAGE_BASE}photo-1612287230202-1ff1d85d1bdf?w=600`],
    [`${IMAGE_BASE}photo-1596558450268-9c27524ba856?w=600`, `${IMAGE_BASE}photo-1574944985070-8f3ebc6b79d2?w=600`],
  ],
  Tablets: [
    [`${IMAGE_BASE}photo-1544244015-0df4b3ffc6b0?w=600`, `${IMAGE_BASE}photo-1585790050230-5dd28404ccb9?w=600`],
    [`${IMAGE_BASE}photo-1610945265064-0e34e5519bbf?w=600`, `${IMAGE_BASE}photo-1512941937669-90a1b58e7e9c?w=600`],
    [`${IMAGE_BASE}photo-1580910051074-3eb694886505?w=600`, `${IMAGE_BASE}photo-1587829741301-dc798b83add3?w=600`],
    [`${IMAGE_BASE}photo-1588872657578-7efd1f1555ed?w=600`, `${IMAGE_BASE}photo-1598327105666-5b89351aff97?w=600`],
  ],
  Audio: [
    [`${IMAGE_BASE}photo-1505740420928-5e560c06d30e?w=600`, `${IMAGE_BASE}photo-1583394838336-acd977736f90?w=600`],
    [`${IMAGE_BASE}photo-1504639725590-34d0984388bd?w=600`, `${IMAGE_BASE}photo-1484704849700-f032a568e944?w=600`],
    [`${IMAGE_BASE}photo-1596558450268-9c27524ba856?w=600`, `${IMAGE_BASE}photo-1592899677977-9c10ca588bbd?w=600`],
    [`${IMAGE_BASE}photo-1567532939604-b6b5b0db2604?w=600`, `${IMAGE_BASE}photo-1585060544812-6b45742d762f?w=600`],
    [`${IMAGE_BASE}photo-1610945265064-0e34e5519bbf?w=600`, `${IMAGE_BASE}photo-1512941937669-90a1b58e7e9c?w=600`],
  ],
  Wearables: [
    [`${IMAGE_BASE}photo-1523275335684-37898b6baf30?w=600`, `${IMAGE_BASE}photo-1579586337278-3befd40fd17a?w=600`],
    [`${IMAGE_BASE}photo-1600003014755-ba31aa59c4b6?w=600`, `${IMAGE_BASE}photo-1611532736597-de2d4265fba3?w=600`],
    [`${IMAGE_BASE}photo-1560518883-ce09059eeffa?w=600`, `${IMAGE_BASE}photo-1591696205602-2f950c417cb9?w=600`],
    [`${IMAGE_BASE}photo-1592899677977-9c10ca588bbd?w=600`, `${IMAGE_BASE}photo-1567532939604-b6b5b0db2604?w=600`],
  ],
  Cameras: [
    [`${IMAGE_BASE}photo-1516035069371-29a1b244cc32?w=600`, `${IMAGE_BASE}photo-1526170375885-4d8ecf77b99f?w=600`],
    [`${IMAGE_BASE}photo-1551698618-1dfe5d97d256?w=600`, `${IMAGE_BASE}photo-1588872657578-7efd1f1555ed?w=600`],
    [`${IMAGE_BASE}photo-1598327105666-5b89351aff97?w=600`, `${IMAGE_BASE}photo-1585060544812-6b45742d762f?w=600`],
  ],
  Gaming: [
    [`${IMAGE_BASE}photo-1606144042614-b2417e99c4e3?w=600`, `${IMAGE_BASE}photo-1593642632559-0c6d3fc62b89?w=600`],
    [`${IMAGE_BASE}photo-1617396900799-f4ec2b43c7ae?w=600`, `${IMAGE_BASE}photo-1628744876497-eb30460be9f6?w=600`],
    [`${IMAGE_BASE}photo-1576091160550-2173dba999ef?w=600`, `${IMAGE_BASE}photo-1553877522-43269d4ea984?w=600`],
  ],
  Accessories: [
    [`${IMAGE_BASE}photo-1597872200969-2b65d56bd16b?w=600`, `${IMAGE_BASE}photo-1562408590-e32931084e23?w=600`],
    [`${IMAGE_BASE}photo-1598327105666-5b89351aff97?w=600`, `${IMAGE_BASE}photo-1541807084-5c52b6b3adef?w=600`],
    [`${IMAGE_BASE}photo-1586953208448-b95a79798f07?w=600`, `${IMAGE_BASE}photo-1565106430482-8f6e74349ca1?w=600`],
  ],
}


type ReviewDef = { s: number; v: string; t: string; n: string; c: string; ve: boolean; ta: string }

function p(
  id: string, slug: string, name: string, category: string,
  imgSet: number, color: string, colors: string[],
  price: number, mrp: number, rating: number, overall: number, sold: number,
  seller: string, sellerUrl: string,
  specs: [string, string][],
  reviews: ReviewDef[],
): CatalogProduct {
  const pool = imgPools[category]!
  const images = pool[imgSet % pool.length]!
  const catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  return {
    id, slug, name, category,
    breadcrumb: [
      { label: "Shop on EMI", href: "/" },
      { label: category, href: `/c/${catSlug}` },
      { label: name, href: null },
    ],
    images,
    selectedColor: color,
    colorOptions: colors,
    selectedVariant: {},
    variantOptions: [],
    optionPricing: colors.map((c) => ({
      color: c, variantLabel: null, variantValue: null, price, mrp, images,
    })),
    price, mrp, rating, overallRating: overall, soldCount: sold,
    appLinks: { appStore: "", playStore: "" },
    tenureOptions: generateEmiOptions(price),
    defaultTenureIndex: Math.min(3, Math.max(0, Math.floor(price / 30000))),
    downPayment: Math.round(price * 0.1),
    emiStartLabel: `EMI starts at ₹${Math.round(price / 12).toLocaleString("en-IN")}/month`,
    seller: { name: seller, url: sellerUrl },
    shipping: { text: "Free delivery in 2-3 days." },
    trustBadges: TRUST_BADGES,
    specs: specs.map(([label, value]) => ({ label, value })),
    reviewMedia: [],
    reviews: reviews.map((r) => ({
      stars: r.s, variantDescription: r.v, text: r.t, attachments: [],
      reviewerName: r.n, city: r.c, verified: r.ve, timeAgo: r.ta,
    })),
  }
}


const generatedProducts: CatalogProduct[] = [
  p("MOB-007","samsung-galaxy-a55-128gb","Samsung Galaxy A55 (128GB)","Mobiles",0,"Awesome Blue",["Awesome Blue","Awesome Violet","Ice Blue"],26999,31999,4.2,4.1,3800,"Samsung India","/seller/samsung-india",[["Display",'6.6" AMOLED, 120Hz'],["Processor","Exynos 1480"],["RAM","8 GB"],["Storage","128 GB"],["Battery","5000 mAh"],["Camera","50 MP + 12 MP + 5 MP"]],[{s:5,v:"Awesome Blue",t:"Great mid-range phone with premium feel.",n:"Amit K.",c:"Delhi",ve:true,ta:"3d ago"},{s:4,v:"Awesome Violet",t:"Good camera and battery. Display is vibrant.",n:"Priya R.",c:"Mumbai",ve:true,ta:"1w ago"}]),
  p("MOB-008","iphone-15-128gb","Apple iPhone 15 (128GB)","Mobiles",1,"Black",["Black","Blue","Green","Pink","Yellow"],79900,89900,4.6,4.5,2100,"Apple India","/seller/apple-india",[["Display",'6.1" Super Retina XDR'],["Processor","A16 Bionic"],["RAM","6 GB"],["Storage","128 GB"],["Battery","3349 mAh"],["Camera","48 MP + 12 MP"]],[{s:5,v:"Black",t:"Dynamic Island is a game changer. Love the USB-C.",n:"Neha S.",c:"Pune",ve:true,ta:"2d ago"},{s:4,v:"Blue",t:"Excellent camera quality. Battery lasts all day.",n:"Vikram D.",c:"Hyderabad",ve:true,ta:"5d ago"},{s:5,v:"Green",t:"Perfect size for one-hand use. iOS is buttery smooth.",n:"Rohit M.",c:"Chennai",ve:true,ta:"1w ago"}]),
  p("MOB-009","oneplus-nord-ce4-lite-128gb","OnePlus Nord CE4 Lite (128GB)","Mobiles",2,"Supersonic Blue",["Supersonic Blue","Pure Black"],19999,24999,4.3,4.2,5200,"OnePlus India","/seller/oneplus-india",[["Display",'6.67" AMOLED, 120Hz'],["Processor","Snapdragon 695"],["RAM","8 GB"],["Storage","128 GB"],["Battery","5500 mAh"],["Camera","50 MP + 2 MP"]],[{s:5,v:"Supersonic Blue",t:"Best budget phone with 5500mAh battery. Charges fast!",n:"Arjun P.",c:"Jaipur",ve:true,ta:"4d ago"},{s:4,v:"Pure Black",t:"Solid performer for daily use. Display is excellent.",n:"Kavita L.",c:"Kolkata",ve:true,ta:"6d ago"}]),
  p("MOB-010","xiaomi-14-512gb","Xiaomi 14 (12GB/512GB)","Mobiles",3,"Black",["Black","White","Jade Green"],69999,79999,4.5,4.4,980,"Xiaomi India","/seller/xiaomi-india",[["Display",'6.36" LTPO AMOLED, 120Hz'],["Processor","Snapdragon 8 Gen 3"],["RAM","12 GB"],["Storage","512 GB"],["Battery","4610 mAh"],["Camera","50 MP + 50 MP + 50 MP"],["Leica Optics","Yes"]],[{s:5,v:"Black",t:"Leica cameras are phenomenal. Compact flagship design.",n:"Suresh T.",c:"Bangalore",ve:true,ta:"2d ago"},{s:4,v:"Jade Green",t:"Premium build and stunning display. MIUI needs polish.",n:"Meena K.",c:"Delhi",ve:true,ta:"1w ago"}]),
  p("MOB-011","motorola-edge-50-pro-256gb","Motorola Edge 50 Pro (256GB)","Mobiles",4,"Luxe Lavender",["Luxe Lavender","Black Beauty","Moonlight Pearl"],35999,44999,4.3,4.2,1600,"Motorola India","/seller/motorola-india",[["Display",'6.7" pOLED, 144Hz'],["Processor","Snapdragon 7 Gen 3"],["RAM","12 GB"],["Storage","256 GB"],["Battery","4500 mAh"],["Camera","50 MP + 13 MP + 10 MP"],["TurboPower","125W"]],[{s:5,v:"Luxe Lavender",t:"125W charging is insane. Full charge in 18 minutes!",n:"Rahul V.",c:"Mumbai",ve:true,ta:"3d ago"},{s:4,v:"Black Beauty",t:"Beautiful curved display. Camera is impressive for the price.",n:"Sneha G.",c:"Pune",ve:true,ta:"5d ago"}]),
  p("MOB-012","samsung-galaxy-s23-fe-128gb","Samsung Galaxy S23 FE (128GB)","Mobiles",5,"Cream",["Cream","Graphite","Lavender","Mint"],29999,39999,4.2,4.1,4500,"Samsung India","/seller/samsung-india",[["Display",'6.4" Dynamic AMOLED 2X, 120Hz'],["Processor","Snapdragon 8 Gen 1"],["RAM","8 GB"],["Storage","128 GB"],["Battery","4500 mAh"],["Camera","50 MP + 12 MP + 8 MP"]],[{s:4,v:"Cream",t:"Fan Edition delivers flagship experience at a lower price.",n:"Ananya B.",c:"Chennai",ve:true,ta:"2d ago"},{s:4,v:"Graphite",t:"Good all-rounder. Display and camera are top-notch.",n:"Deepak R.",c:"Bangalore",ve:true,ta:"4d ago"},{s:5,v:"Lavender",t:"Love the design. Samsung's camera processing is excellent.",n:"Pooja S.",c:"Delhi",ve:true,ta:"1w ago"}]),

  p("LAP-005","lenovo-thinkpad-x1-carbon-g11","Lenovo ThinkPad X1 Carbon Gen 11 (i7/16GB/512GB)","Laptops",0,"Black",["Black"],144999,169999,4.6,4.5,380,"Lenovo India","/seller/lenovo-india",[["Display",'14" 2.8K OLED, 120Hz'],["Processor","Intel Core i7-1365U"],["RAM","16 GB LPDDR5"],["Storage","512 GB SSD"],["Battery","57 Whr"],["Weight","1.12 kg"],["Keyboard","Spill-resistant, TrackPoint"]],[{s:5,v:"Black",t:"Best business laptop. Keyboard is unmatched. Incredibly lightweight.",n:"Suresh K.",c:"Delhi",ve:true,ta:"2d ago"},{s:4,v:"Black",t:"Premium build quality. OLED display is gorgeous.",n:"Ananya D.",c:"Bangalore",ve:true,ta:"1w ago"}]),
  p("LAP-006","hp-spectre-x360-14","HP Spectre x360 14 (i7/16GB/1TB)","Laptops",1,"Nightfall Black",["Nightfall Black","Nocturne Blue"],139999,164999,4.5,4.4,320,"HP India","/seller/hp-india",[["Display",'13.5" 3K2K OLED, Touch'],["Processor","Intel Core i7-1355U"],["RAM","16 GB LPDDR5"],["Storage","1 TB SSD"],["Battery","68 Whr"],["Weight","1.36 kg"],["2-in-1","360° hinge"]],[{s:5,v:"Nightfall Black",t:"Stunning OLED display. 2-in-1 versatility is perfect for meetings.",n:"Rahul G.",c:"Mumbai",ve:true,ta:"3d ago"},{s:4,v:"Nocturne Blue",t:"Beautiful design and excellent build quality. Pen support is great.",n:"Pooja S.",c:"Chennai",ve:true,ta:"1w ago"}]),
  p("LAP-007","asus-zenbook-14-oled","ASUS ZenBook 14 OLED (i7/16GB/512GB)","Laptops",2,"Ponder Blue",["Ponder Blue","Jasper Gray"],89999,109999,4.5,4.4,520,"ASUS India","/seller/asus-india",[["Display",'14" 2.8K OLED, 120Hz'],["Processor","Intel Core i7-13700H"],["RAM","16 GB LPDDR5"],["Storage","512 GB SSD"],["Battery","75 Whr"],["Weight","1.39 kg"]],[{s:5,v:"Ponder Blue",t:"OLED display at this price is incredible. Very portable and fast.",n:"Neha R.",c:"Delhi",ve:true,ta:"2d ago"},{s:4,v:"Jasper Gray",t:"Great laptop for creators. Color accuracy is superb.",n:"Vikram D.",c:"Hyderabad",ve:true,ta:"5d ago"}]),
  p("LAP-008","acer-nitro-v-15","Acer Nitro V 15 (i5/RTX 4050/16GB)","Laptops",3,"Obsidian Black",["Obsidian Black"],74999,89999,4.3,4.2,680,"Acer India","/seller/acer-india",[["Display",'15.6" FHD IPS, 144Hz'],["Processor","Intel Core i5-13420H"],["GPU","NVIDIA RTX 4050 6GB"],["RAM","16 GB DDR5"],["Storage","512 GB SSD"],["Battery","57 Whr"],["Weight","2.1 kg"]],[{s:5,v:"Obsidian Black",t:"RTX 4050 at this price is a steal. Runs AAA games well.",n:"Karthik R.",c:"Bangalore",ve:true,ta:"3d ago"},{s:4,v:"Obsidian Black",t:"Good gaming performance. Fan noise is manageable.",n:"Manish A.",c:"Jaipur",ve:true,ta:"1w ago"}]),
  p("LAP-009","msi-katana-15","MSI Katana 15 (i7/RTX 4060/16GB)","Laptops",4,"Black",["Black"],89999,109999,4.4,4.3,420,"MSI India","/seller/msi-india",[["Display",'15.6" FHD IPS, 144Hz'],["Processor","Intel Core i7-13620H"],["GPU","NVIDIA RTX 4060 8GB"],["RAM","16 GB DDR5"],["Storage","1 TB SSD"],["Battery","53.5 Whr"],["Weight","2.25 kg"]],[{s:5,v:"Black",t:"RTX 4060 at 90K is amazing. Gaming and productivity both shine.",n:"Arun C.",c:"Chennai",ve:true,ta:"4d ago"},{s:4,v:"Black",t:"Solid build and good keyboard. Display could be brighter.",n:"Nisha M.",c:"Kolkata",ve:true,ta:"1w ago"}]),
  p("LAP-010","dell-inspiron-16-5630","Dell Inspiron 16 5630 (i7/16GB/512GB)","Laptops",5,"Platinum Silver",["Platinum Silver"],72999,84999,4.2,4.1,780,"Dell India","/seller/dell-india",[["Display",'16" QHD+ IPS, 120Hz'],["Processor","Intel Core i7-1360P"],["RAM","16 GB DDR5"],["Storage","512 GB SSD"],["Battery","64 Whr"],["Weight","1.9 kg"]],[{s:4,v:"Platinum Silver",t:"Big screen with good performance. Great for multitasking.",n:"Sanjay M.",c:"Delhi",ve:true,ta:"3d ago"},{s:4,v:"Platinum Silver",t:"Comfortable keyboard. Battery life is decent for a 16-inch.",n:"Kavita L.",c:"Mumbai",ve:true,ta:"1w ago"}]),
  p("LAP-011","macbook-pro-m3-pro","MacBook Pro M3 Pro (18GB/512GB)","Laptops",6,"Space Black",["Space Black","Silver"],199900,229900,4.8,4.7,450,"Apple India","/seller/apple-india",[["Display",'14.2" Liquid Retina XDR'],["Processor","Apple M3 Pro"],["RAM","18 GB"],["Storage","512 GB SSD"],["Battery","Up to 17 hours"],["Weight","1.55 kg"]],[{s:5,v:"Space Black",t:"M3 Pro is a monster. Compiles code in seconds. Battery is insane.",n:"Rohit G.",c:"Bangalore",ve:true,ta:"1d ago"},{s:5,v:"Silver",t:"Best laptop for software developers. Silent under load.",n:"Tarun W.",c:"Delhi",ve:true,ta:"4d ago"},{s:4,v:"Space Black",t:"Incredible performance and build quality. Price is the only downside.",n:"Isha T.",c:"Pune",ve:true,ta:"1w ago"}]),
  p("LAP-012","lenovo-legion-pro-5","Lenovo Legion Pro 5 (i9/RTX 4070/16GB)","Laptops",7,"Storm Grey",["Storm Grey","Onyx Grey"],159999,189999,4.6,4.5,280,"Lenovo India","/seller/lenovo-india",[["Display",'16" WQXGA IPS, 240Hz'],["Processor","Intel Core i9-14900HX"],["GPU","NVIDIA RTX 4070 8GB"],["RAM","16 GB DDR5"],["Storage","1 TB SSD"],["Battery","99.99 Whr"],["Weight","2.5 kg"]],[{s:5,v:"Storm Grey",t:"The 240Hz display and RTX 4070 make this a gaming powerhouse.",n:"Aditya H.",c:"Mumbai",ve:true,ta:"2d ago"},{s:4,v:"Onyx Grey",t:"Excellent thermal management. Keyboard is great for gaming.",n:"Gaurav S.",c:"Jaipur",ve:true,ta:"1w ago"}]),

  p("TAB-003","ipad-air-m2-128gb","Apple iPad Air M2 (128GB, Wi-Fi)","Tablets",0,"Space Gray",["Space Gray","Starlight","Blue","Purple","Pink"],59900,64900,4.7,4.6,620,"Apple India","/seller/apple-india",[["Display",'10.9" Liquid Retina'],["Processor","Apple M2"],["RAM","8 GB"],["Storage","128 GB"],["Battery","Up to 10 hours"],["Weight","462 g"]],[{s:5,v:"Space Gray",t:"M2 chip is blazing fast. Perfect tablet for everything.",n:"Neha R.",c:"Pune",ve:true,ta:"2d ago"},{s:4,v:"Starlight",t:"Great upgrade from iPad 9th Gen. Display is gorgeous.",n:"Rahul V.",c:"Delhi",ve:true,ta:"1w ago"}]),
  p("TAB-004","samsung-tab-s9-ultra-256gb","Samsung Galaxy Tab S9 Ultra (256GB, Wi-Fi)","Tablets",1,"Graphite",["Graphite","Beige"],86999,99999,4.6,4.5,280,"Samsung India","/seller/samsung-india",[["Display",'14.6" Dynamic AMOLED 2X, 120Hz'],["Processor","Snapdragon 8 Gen 2"],["RAM","12 GB"],["Storage","256 GB"],["Battery","11200 mAh"],["S Pen","Included"]],[{s:5,v:"Graphite",t:"Massive AMOLED display is incredible. S Pen latency is near zero.",n:"Vikram D.",c:"Hyderabad",ve:true,ta:"3d ago"},{s:4,v:"Beige",t:"Best Android tablet for productivity. DEX mode is useful.",n:"Ananya K.",c:"Mumbai",ve:true,ta:"1w ago"}]),
  p("TAB-005","lenovo-tab-p12-pro","Lenovo Tab P12 Pro (256GB)","Tablets",2,"Storm Grey",["Storm Grey"],49999,59999,4.3,4.2,340,"Lenovo India","/seller/lenovo-india",[["Display",'12.6" AMOLED, 120Hz'],["Processor","Snapdragon 870"],["RAM","8 GB"],["Storage","256 GB"],["Battery","10200 mAh"],["S Pen","Included"]],[{s:4,v:"Storm Grey",t:"Great AMOLED tablet for media consumption. S Pen is included.",n:"Kavita L.",c:"Chennai",ve:true,ta:"4d ago"},{s:4,v:"Storm Grey",t:"Good performance and display. Dolby Vision is impressive.",n:"Tarun W.",c:"Bangalore",ve:true,ta:"1w ago"}]),
  p("TAB-006","xiaomi-pad-6-128gb","Xiaomi Pad 6 (128GB)","Tablets",3,"Gravity Grey",["Gravity Grey","Blue","Gold"],26999,32999,4.4,4.3,4200,"Xiaomi India","/seller/xiaomi-india",[["Display",'11" IPS LCD, 144Hz'],["Processor","Snapdragon 870"],["RAM","6 GB"],["Storage","128 GB"],["Battery","8840 mAh"]],[{s:5,v:"Gravity Grey",t:"144Hz display at this price is insane. Best value tablet!",n:"Amit S.",c:"Jaipur",ve:true,ta:"2d ago"},{s:4,v:"Blue",t:"Great for media consumption. Keyboard accessory is decent.",n:"Priya G.",c:"Chandigarh",ve:true,ta:"5d ago"},{s:5,v:"Gold",t:"Xiaomi delivers again. Display and battery are outstanding.",n:"Sneha A.",c:"Pune",ve:true,ta:"1w ago"}]),
  p("TAB-007","ipad-10th-gen-64gb","Apple iPad 10th Gen (64GB, Wi-Fi)","Tablets",0,"Silver",["Silver","Blue","Pink","Yellow"],44900,49900,4.5,4.4,1800,"Apple India","/seller/apple-india",[["Display",'10.9" Liquid Retina'],["Processor","A14 Bionic"],["RAM","4 GB"],["Storage","64 GB"],["Battery","Up to 10 hours"]],[{s:5,v:"Silver",t:"Perfect entry iPad. Fast, reliable, and great ecosystem.",n:"Rahul S.",c:"Mumbai",ve:true,ta:"3d ago"},{s:4,v:"Blue",t:"Good tablet for students. Apple Pencil support is great.",n:"Isha T.",c:"Delhi",ve:true,ta:"1w ago"}]),
  p("TAB-008","samsung-tab-a9-plus-64gb","Samsung Galaxy Tab A9+ (64GB, Wi-Fi)","Tablets",1,"Graphite",["Graphite","Silver","Navy"],22999,27999,4.2,4.1,5200,"Samsung India","/seller/samsung-india",[["Display",'11" TFT LCD, 90Hz'],["Processor","Snapdragon 695"],["RAM","4 GB"],["Storage","64 GB"],["Battery","7040 mAh"]],[{s:4,v:"Graphite",t:"Good budget tablet for kids and basic use. Display is decent.",n:"Sonia R.",c:"Ahmedabad",ve:true,ta:"4d ago"},{s:4,v:"Navy",t:"Reliable Samsung tablet. Battery lasts long.",n:"Deepak L.",c:"Hyderabad",ve:true,ta:"1w ago"}]),
  p("TAB-009","oneplus-pad-128gb","OnePlus Pad (128GB)","Tablets",2,"Halo Green",["Halo Green"],37999,44999,4.4,4.3,1200,"OnePlus India","/seller/oneplus-india",[["Display",'11.61" IPS LCD, 144Hz'],["Processor","Dimensity 9000"],["RAM","8 GB"],["Storage","128 GB"],["Battery","9510 mAh"],["Charging","67W SUPERVOOC"]],[{s:5,v:"Halo Green",t:"144Hz display and 67W charging are standouts. Great build quality.",n:"Arjun P.",c:"Bangalore",ve:true,ta:"3d ago"},{s:4,v:"Halo Green",t:"Excellent tablet for the price. OnePlus ecosystem integration is nice.",n:"Karan J.",c:"Chennai",ve:true,ta:"1w ago"}]),
  p("TAB-010","realme-pad-2-128gb","Realme Pad 2 (128GB)","Tablets",3,"Inspiration Green",["Inspiration Green","Imperial Gray"],19999,24999,4.1,4.0,3800,"Realme India","/seller/realme-india",[["Display",'11" IPS LCD, 120Hz'],["Processor","Helio G99"],["RAM","8 GB"],["Storage","128 GB"],["Battery","8360 mAh"]],[{s:4,v:"Inspiration Green",t:"Good budget tablet with 120Hz display. Battery is solid.",n:"Vikash P.",c:"Patna",ve:true,ta:"4d ago"},{s:4,v:"Imperial Gray",t:"Decent tablet for the price. Good for streaming and browsing.",n:"Jaya N.",c:"Kochi",ve:true,ta:"1w ago"}]),
  p("TAB-011","ipad-mini-6-64gb","Apple iPad Mini 6 (64GB, Wi-Fi)","Tablets",4,"Space Gray",["Space Gray","Pink","Purple","Starlight"],49900,54900,4.6,4.5,820,"Apple India","/seller/apple-india",[["Display",'8.3" Liquid Retina'],["Processor","A15 Bionic"],["RAM","4 GB"],["Storage","64 GB"],["Battery","Up to 10 hours"]],[{s:5,v:"Space Gray",t:"Perfect size for reading and one-handed use. A15 is powerful.",n:"Meera V.",c:"Delhi",ve:true,ta:"2d ago"},{s:4,v:"Starlight",t:"Great portable tablet. Apple ecosystem is unbeatable.",n:"Rohit G.",c:"Mumbai",ve:true,ta:"1w ago"}]),
  p("TAB-012","samsung-tab-s8-128gb","Samsung Galaxy Tab S8 (128GB, Wi-Fi)","Tablets",5,"Graphite",["Graphite","Silver","Pink Gold"],42999,54999,4.3,4.2,1600,"Samsung India","/seller/samsung-india",[["Display",'11" TFT LCD, 120Hz'],["Processor","Snapdragon 8 Gen 1"],["RAM","8 GB"],["Storage","128 GB"],["Battery","8000 mAh"],["S Pen","Included"]],[{s:4,v:"Graphite",t:"Good tablet with S Pen included. Snapdragon 8 Gen 1 is fast.",n:"Amit K.",c:"Jaipur",ve:true,ta:"3d ago"},{s:4,v:"Silver",t:"Reliable Samsung tablet. Good for note-taking.",n:"Sneha T.",c:"Kolkata",ve:true,ta:"1w ago"}]),

  p("AUD-005","apple-airpods-max","Apple AirPods Max","Audio",0,"Space Gray",["Space Gray","Silver","Sky Blue","Green","Pink"],59900,69900,4.7,4.6,850,"Apple India","/seller/apple-india",[["Driver","40mm custom"],["ANC","Yes, Active"],["Battery","20 hours"],["Connectivity","Bluetooth 5.0, Lightning"],["Weight","384.8 g"]],[{s:5,v:"Space Gray",t:"Build quality is insane. Sound quality is phenomenal.",n:"Vikram D.",c:"Hyderabad",ve:true,ta:"2d ago"},{s:4,v:"Silver",t:"Premium headphones but heavy for long sessions.",n:"Neha R.",c:"Delhi",ve:true,ta:"1w ago"}]),
  p("AUD-006","sennheiser-momentum-4","Sennheiser Momentum 4 Wireless","Audio",1,"Black",["Black","White"],34990,39990,4.6,4.5,620,"Sennheiser India","/seller/sennheiser-india",[["Driver","42mm"],["ANC","Yes, Adaptive"],["Battery","60 hours"],["Connectivity","Bluetooth 5.2"],["Weight","293 g"]],[{s:5,v:"Black",t:"60-hour battery is unbelievable. Sound quality is exquisite.",n:"Rahul S.",c:"Mumbai",ve:true,ta:"3d ago"},{s:4,v:"White",t:"Best sound quality in wireless headphones. ANC is very good.",n:"Arjun P.",c:"Bangalore",ve:true,ta:"1w ago"}]),
  p("AUD-007","jbl-flip-6","JBL Flip 6","Audio",2,"Blue",["Blue","Red","Pink","Grey","Teal","Black","White","Squad"],12999,14999,4.5,4.4,8200,"Harman India","/seller/harman-india",[["Output","20W"],["Battery","12 hours"],["Waterproof","IP67"],["Weight","550 g"],["PartyBoost","Yes"]],[{s:5,v:"Blue",t:"JBL quality at an amazing price. Bass is punchy!",n:"Karan J.",c:"Chennai",ve:true,ta:"2d ago"},{s:4,v:"Black",t:"Great portable speaker. Waterproof is a huge plus.",n:"Sneha T.",c:"Kolkata",ve:true,ta:"5d ago"},{s:5,v:"Red",t:"Perfect for outdoor parties. Battery lasts forever.",n:"Amit K.",c:"Jaipur",ve:true,ta:"1w ago"}]),
  p("AUD-008","sony-wf-1000xm5","Sony WF-1000XM5","Audio",3,"Black",["Black","Silver"],24990,29990,4.7,4.6,1200,"Sony India","/seller/sony-india",[["Driver","8.4mm Dynamic Driver"],["ANC","Yes, Industry-leading"],["Battery","8 hours (24h with case)"],["Connectivity","Bluetooth 5.3, LDAC"],["Weight","5.9 g per earbud"]],[{s:5,v:"Black",t:"Best TWS earbuds ever. ANC and sound quality are unmatched.",n:"Aditya H.",c:"Delhi",ve:true,ta:"2d ago"},{s:5,v:"Silver",t:"Incredibly comfortable and the noise cancelling is superb.",n:"Meena J.",c:"Mumbai",ve:true,ta:"5d ago"},{s:4,v:"Black",t:"Amazing sound but the touch controls take getting used to.",n:"Gaurav S.",c:"Pune",ve:true,ta:"1w ago"}]),
  p("AUD-009","bose-qc-earbuds-ii","Bose QuietComfort Earbuds II","Audio",4,"White",["White","Black"],27900,32900,4.6,4.5,1400,"Bose India","/seller/bose-india",[["Driver","Custom proprietary"],["ANC","Yes, World-class"],["Battery","6 hours (24h with case)"],["Connectivity","Bluetooth 5.3"],["Weight","6.24 g per earbud"]],[{s:5,v:"White",t:"ANC is the best I've heard in earbuds. Incredible isolation.",n:"Deepak S.",c:"Chennai",ve:true,ta:"3d ago"},{s:4,v:"Black",t:"Great sound and comfort. Case is compact.",n:"Isha T.",c:"Lucknow",ve:true,ta:"1w ago"}]),
  p("AUD-010","marshall-stanmore-iii","Marshall Stanmore III","Audio",0,"Black",["Black","Cream"],37999,42999,4.6,4.5,380,"Marshall India","/seller/marshall-india",[["Output","2x 15W + 1 subwoofer"],["Connectivity","Bluetooth 5.2, 3.5mm, RCA"],["Battery","N/A (Wired)"],["Multi-room","Yes, Marshall speakers"]],[{s:5,v:"Black",t:"Iconic Marshall sound. Looks gorgeous on any shelf.",n:"Rahul V.",c:"Bangalore",ve:true,ta:"4d ago"},{s:4,v:"Cream",t:"Fantastic sound quality. The retro design is perfect.",n:"Kavita L.",c:"Mumbai",ve:true,ta:"1w ago"}]),
  p("AUD-011","sony-srs-xb100","Sony SRS-XB100","Audio",1,"Blue",["Blue","Black","Orange","Grey","Light Blue"],4990,5990,4.3,4.2,6800,"Sony India","/seller/sony-india",[["Output","5W"],["Battery","16 hours"],["Waterproof","IPX7"],["Weight","274 g"],["Mount","Strap mount"]],[{s:4,v:"Blue",t:"Tiny speaker with big sound. Waterproof and portable.",n:"Sanjay D.",c:"Kolkata",ve:true,ta:"3d ago"},{s:4,v:"Black",t:"Great little speaker for travel. Battery lasts very long.",n:"Pooja S.",c:"Pune",ve:true,ta:"1w ago"}]),
  p("AUD-012","jbl-tune-770nc","JBL Tune 770NC","Audio",2,"Black",["Black","Blue","White"],7999,9999,4.4,4.3,4200,"Harman India","/seller/harman-india",[["Driver","40mm"],["ANC","Yes, Adaptive"],["Battery","44 hours"],["Connectivity","Bluetooth 5.3"],["Weight","252 g"]],[{s:5,v:"Black",t:"44-hour battery and ANC at this price is incredible value.",n:"Manish A.",c:"Jaipur",ve:true,ta:"2d ago"},{s:4,v:"Blue",t:"Good noise cancelling for the price. Comfortable for long wear.",n:"Sonia R.",c:"Ahmedabad",ve:true,ta:"1w ago"}]),

  p("WEAR-004","apple-watch-ultra-2","Apple Watch Ultra 2 (GPS + Cellular)","Wearables",0,"Titanium Natural",["Titanium Natural","Titanium Black"],89900,99900,4.8,4.7,380,"Apple India","/seller/apple-india",[["Display",'49mm Always-On Retina LTPO2 OLED'],["Chip","Apple S9 SiP"],["Battery","36 hours (72h low power)"],["Water Resistance","WR100 + EN13319"],["Weight","61.4 g"]],[{s:5,v:"Titanium Natural",t:"The best smartwatch ever made. Rugged and feature-packed.",n:"Rahul S.",c:"Delhi",ve:true,ta:"2d ago"},{s:5,v:"Titanium Black",t:"Perfect for outdoor adventures. Battery lasts 2+ days easily.",n:"Karthik R.",c:"Bangalore",ve:true,ta:"5d ago"}]),
  p("WEAR-005","samsung-galaxy-watch-fe","Samsung Galaxy Watch FE (40mm)","Wearables",1,"Black",["Black","Pink Gold","Silver"],19999,24999,4.2,4.1,3200,"Samsung India","/seller/samsung-india",[["Display",'1.2" Super AMOLED'],["Processor","Exynos W920"],["Battery","247 mAh"],["Water Resistance","5ATM + IP68"],["Weight","25 g"]],[{s:4,v:"Black",t:"Great entry-level Samsung watch. Health tracking is accurate.",n:"Priya G.",c:"Chandigarh",ve:true,ta:"3d ago"},{s:4,v:"Silver",t:"Good value Galaxy Watch. Wear OS experience is smooth.",n:"Deepak S.",c:"Lucknow",ve:true,ta:"1w ago"}]),
  p("WEAR-006","fitbit-sense-2","Fitbit Sense 2","Wearables",2,"Shadow Grey",["Shadow Grey","Lunar White","Copper Rose"],24999,29999,4.3,4.2,1800,"Fitbit India","/seller/fitbit-india",[["Display",'1.58" AMOLED'],["Battery","6+ days"],["Sensors","EDA, SpO2, Skin Temp"],["Water Resistance","5ATM"],["Weight","38.1 g"]],[{s:5,v:"Shadow Grey",t:"Best health-focused smartwatch. EDA and stress management are unique.",n:"Nivedita P.",c:"Chennai",ve:true,ta:"4d ago"},{s:4,v:"Lunar White",t:"Excellent health tracking. Battery lasts almost a week.",n:"Sneha A.",c:"Pune",ve:true,ta:"1w ago"}]),
  p("WEAR-007","amazfit-gtr-4","Amazfit GTR 4","Wearables",3,"Superspeed Black",["Superspeed Black","Wild Explorer"],18999,22999,4.3,4.2,2600,"Amazfit India","/seller/amazfit-india",[["Display",'1.43" AMOLED, Always-On'],["Battery","Up to 14 days"],["GPS","Dual-band, 5 systems"],["Water Resistance","5ATM"],["Weight","52 g"]],[{s:4,v:"Superspeed Black",t:"14-day battery life is incredible. GPS accuracy is impressive.",n:"Amit K.",c:"Jaipur",ve:true,ta:"3d ago"},{s:4,v:"Wild Explorer",t:"Great fitness tracker with excellent battery. Good value.",n:"Manish A.",c:"Hyderabad",ve:true,ta:"1w ago"}]),
  p("WEAR-008","apple-watch-se-2-40mm","Apple Watch SE 2 (GPS, 40mm)","Wearables",0,"Midnight",["Midnight","Starlight","Silver"],29900,34900,4.5,4.4,4200,"Apple India","/seller/apple-india",[["Display",'1.57" OLED Retina'],["Chip","Apple S8 SiP"],["Battery","18 hours"],["Water Resistance","WR50"],["Weight","26.8 g"]],[{s:5,v:"Midnight",t:"Best value Apple Watch. Does everything you need.",n:"Ananya D.",c:"Bangalore",ve:true,ta:"2d ago"},{s:4,v:"Starlight",t:"Great for first-time smartwatch owners. Apple ecosystem is seamless.",n:"Rohit G.",c:"Mumbai",ve:true,ta:"1w ago"}]),
  p("WEAR-009","samsung-galaxy-watch-5-pro","Samsung Galaxy Watch 5 Pro (45mm)","Wearables",1,"Black Titanium",["Black Titanium","Gray Titanium"],34999,42999,4.4,4.3,1200,"Samsung India","/seller/samsung-india",[["Display",'1.4" Super AMOLED'],["Processor","Exynos W920"],["Battery","590 mAh"],["Water Resistance","5ATM + IP68"],["Weight","28.5 g"],["Sapphire Crystal","Yes"]],[{s:5,v:"Black Titanium",t:"Sapphire crystal is incredibly scratch-resistant. Great for outdoor use.",n:"Vikram P.",c:"Delhi",ve:true,ta:"3d ago"},{s:4,v:"Gray Titanium",t:"Premium build quality. GPS accuracy is excellent.",n:"Aditya H.",c:"Chennai",ve:true,ta:"1w ago"}]),
  p("WEAR-010","garmin-fenix-7","Garmin Fenix 7 (47mm)","Wearables",2,"Black",["Black","Silver","White Gold"],74990,84990,4.7,4.6,280,"Garmin India","/seller/garmin-india",[["Display",'1.3" MIP, Solar option'],["Battery","18 days (57 days solar)"],["GPS","Multi-band"],["Water Resistance","10ATM"],["Weight","73 g"],["Maps","Preloaded topo maps"]],[{s:5,v:"Black",t:"The ultimate adventure watch. Battery and GPS are unmatched.",n:"Deepak R.",c:"Hyderabad",ve:true,ta:"2d ago"},{s:5,v:"Silver",t:"Preloaded maps are incredibly useful for hiking.",n:"Gaurav S.",c:"Jaipur",ve:true,ta:"1w ago"}]),
  p("WEAR-011","fitbit-versa-4","Fitbit Versa 4","Wearables",3,"Waterfall Blue",["Waterfall Blue","Black Ink"],22999,27999,4.3,4.2,1600,"Fitbit India","/seller/fitbit-india",[["Display",'1.58" AMOLED'],["Battery","6+ days"],["Sensors","Heart Rate, SpO2, EDA"],["Water Resistance","5ATM"],["Built-in GPS","Yes"]],[{s:4,v:"Waterfall Blue",t:"Great fitness smartwatch. GPS and heart rate are accurate.",n:"Shruti B.",c:"Pune",ve:true,ta:"4d ago"},{s:4,v:"Black Ink",t:"Good for workout tracking. Battery lasts a week easily.",n:"Isha T.",c:"Kolkata",ve:true,ta:"1w ago"}]),
  p("WEAR-012","amazfit-t-rex-3","Amazfit T-Rex 3","Wearables",0,"Lunar Rock",["Lunar Rock","Military Green","Ember Orange"],17999,21999,4.4,4.3,2200,"Amazfit India","/seller/amazfit-india",[["Display",'1.5" AMOLED'],["Battery","Up to 27 days"],["GPS","Dual-band, 5 systems"],["Water Resistance","10ATM"],["MIL-STD","810G certified"]],[{s:5,v:"Lunar Rock",t:"Built like a tank. Battery lasts almost a month!",n:"Suresh K.",c:"Chennai",ve:true,ta:"3d ago"},{s:4,v:"Military Green",t:"Great outdoor watch. Rugged and reliable.",n:"Arjun P.",c:"Bangalore",ve:true,ta:"1w ago"}]),

  p("ACC-004","apple-magic-keyboard-11","Apple Magic Keyboard (11-inch, USB-C)","Accessories",0,"Black",["Black","White"],29900,34900,4.7,4.6,1200,"Apple India","/seller/apple-india",[["Type","Keyboard Case"],["Compatibility","iPad Pro 11-inch, iPad Air"],["Connectivity","Smart Connector"],["Backlit","Yes"],["Trackpad","Yes, multi-touch"]],[{s:5,v:"Black",t:"Transforms iPad into a laptop. Trackpad experience is excellent.",n:"Rahul G.",c:"Mumbai",ve:true,ta:"3d ago"},{s:4,v:"White",t:"Premium build quality. The floating design is elegant.",n:"Neha R.",c:"Delhi",ve:true,ta:"1w ago"}]),
  p("ACC-005","logitech-mx-master-3s","Logitech MX Master 3S","Accessories",1,"Graphite",["Graphite","Pale Gray"],9999,12995,4.7,4.6,3400,"Logitech India","/seller/logitech-india",[["Type","Wireless Mouse"],["Sensor","8000 DPI Darkfield"],["Connectivity","USB-C, Bluetooth, Logi Bolt"],["Battery","70 days"],["Scroll","MagSpeed electromagnetic"]],[{s:5,v:"Graphite",t:"Best productivity mouse ever. MagSpeed scroll is addictive.",n:"Tarun W.",c:"Bangalore",ve:true,ta:"2d ago"},{s:5,v:"Pale Gray",t:"Ergonomic and precise. Multi-device switching is seamless.",n:"Vikram P.",c:"Chennai",ve:true,ta:"1w ago"}]),
  p("ACC-006","samsung-t9-2tb-ssd","Samsung T9 Portable SSD (2TB)","Accessories",2,"Black",["Black"],17999,22999,4.6,4.5,1800,"Samsung India","/seller/samsung-india",[["Capacity","2 TB"],["Interface","USB 3.2 Gen 2x2"],["Speed","Up to 2,000 MB/s"],["Weight","122 g"],["Encryption","AES 256-bit"]],[{s:5,v:"Black",t:"2000MB/s transfer speed is insane. Perfect for video editors.",n:"Shruti B.",c:"Delhi",ve:true,ta:"3d ago"},{s:4,v:"Black",t:"Very fast and compact. Great for backing up large files.",n:"Arun C.",c:"Kochi",ve:true,ta:"1w ago"}]),
  p("ACC-007","anker-737-power-bank","Anker 737 Power Bank (24,000mAh)","Accessories",3,"Black",["Black"],12999,15999,4.5,4.4,2200,"Anker India","/seller/anker-india",[["Capacity","24,000 mAh / 140Wh"],["Output","140W max (USB-C)"],["Display","Smart digital display"],["Weight","630 g"]],[{s:5,v:"Black",t:"140W output can charge a MacBook! Digital display is useful.",n:"Aditya H.",c:"Mumbai",ve:true,ta:"4d ago"},{s:4,v:"Black",t:"Powerful and portable. Perfect for travel.",n:"Kavita L.",c:"Chennai",ve:true,ta:"1w ago"}]),
  p("ACC-008","belkin-3-in-1-wireless-charger","Belkin 3-in-1 Wireless Charger","Accessories",4,"White",["White","Black"],12999,14999,4.4,4.3,1600,"Belkin India","/seller/belkin-india",[["Type","Wireless Charging Pad"],["Devices","iPhone + Apple Watch + AirPods"],["Charging","15W MagSafe"],["Material","Weighted base"]],[{s:5,v:"White",t:"Charges all three Apple devices at once. Desk looks clean now.",n:"Pooja S.",c:"Delhi",ve:true,ta:"3d ago"},{s:4,v:"Black",t:"Convenient charging solution. Build quality is solid.",n:"Rohit G.",c:"Pune",ve:true,ta:"1w ago"}]),
  p("ACC-009","logitech-mx-keys-mini","Logitech MX Keys Mini","Accessories",5,"Pale Gray",["Pale Gray","Graphite","Rose"],9495,11995,4.6,4.5,2800,"Logitech India","/seller/logitech-india",[["Type","Wireless Keyboard"],["Connectivity","Bluetooth, Logi Bolt"],["Backlit","Yes, smart illumination"],["Battery","10 days (USB-C charging)"],["Multi-device","3 devices"]],[{s:5,v:"Graphite",t:"Smart backlight and perfect key feel. Best compact keyboard.",n:"Deepak S.",c:"Bangalore",ve:true,ta:"2d ago"},{s:4,v:"Pale Gray",t:"Great for minimalist setups. Multi-device switching works well.",n:"Meera V.",c:"Mumbai",ve:true,ta:"1w ago"}]),
  p("ACC-010","sandisk-extreme-pro-ssd-1tb","SanDisk Extreme Pro SSD (1TB)","Accessories",6,"Black",["Black"],11999,15999,4.6,4.5,2600,"SanDisk India","/seller/sandisk-india",[["Capacity","1 TB"],["Interface","USB 3.2 Gen 2"],["Speed","Up to 1,050 MB/s"],["Weight","77.5 g"],["Durability","IP55 water/dust resistant"]],[{s:5,v:"Black",t:"Blazing fast and very durable. IP55 rating is reassuring.",n:"Karthik R.",c:"Chennai",ve:true,ta:"3d ago"},{s:4,v:"Black",t:"Reliable portable SSD. Great for photographers.",n:"Nivedita P.",c:"Kolkata",ve:true,ta:"1w ago"}]),
  p("ACC-011","apple-pencil-2nd-gen","Apple Pencil (2nd Generation)","Accessories",7,"White",["White"],12900,14900,4.7,4.6,4200,"Apple India","/seller/apple-india",[["Type","Stylus"],["Compatibility","iPad Pro, iPad Air, iPad Mini"],["Charging","Magnetic attach + charge"],["Latency","9ms"],["Tilt & Pressure","Yes"]],[{s:5,v:"White",t:"Writing and drawing feels natural. Latency is imperceptible.",n:"Ananya D.",c:"Bangalore",ve:true,ta:"2d ago"},{s:5,v:"White",t:"Essential for iPad artists. Magnetic charging is convenient.",n:"Pallavi S.",c:"Mumbai",ve:true,ta:"1w ago"}]),
  p("ACC-012","logitech-ergo-k860","Logitech Ergo K860","Accessories",0,"Black",["Black"],12995,15995,4.5,4.4,1800,"Logitech India","/seller/logitech-india",[["Type","Split Ergonomic Keyboard"],["Connectivity","Bluetooth, USB"],["Battery","2 years (2xAAA)"],["Palm Rest","Integrated, cushioned"],["Split Design","5° curvature"]],[{s:5,v:"Black",t:"My wrist pain disappeared after switching to this. Game changer.",n:"Suresh T.",c:"Delhi",ve:true,ta:"4d ago"},{s:4,v:"Black",t:"Great ergonomic keyboard. Takes a week to adjust.",n:"Deepak R.",c:"Lucknow",ve:true,ta:"1w ago"}]),

  p("CAM-003","canon-r6-mark-ii","Canon EOS R6 Mark II (Body)","Cameras",0,"Black",["Black"],249995,279995,4.8,4.7,180,"Canon India","/seller/canon-india",[["Sensor","24.2 MP Full-Frame CMOS"],["Video","4K 60fps, 10-bit"],["AF Points","1053 zones"],["ISO","100 - 102400"],["Weight","670 g"],["IBIS","Yes, 8 stops"]],[{s:5,v:"Black",t:"Incredible autofocus and low-light performance. Best hybrid camera.",n:"Arun C.",c:"Kochi",ve:true,ta:"3d ago"},{s:4,v:"Black",t:"Excellent video features. IBIS is very effective.",n:"Sanjay D.",c:"Mumbai",ve:true,ta:"1w ago"}]),
  p("CAM-004","nikon-z6-iii","Nikon Z6 III (Body)","Cameras",1,"Black",["Black"],219995,249995,4.7,4.6,140,"Nikon India","/seller/nikon-india",[["Sensor","24.5 MP Stacked CMOS"],["Video","6K 30fps, 4K 120fps"],["AF Points","299 points"],["ISO","100 - 64000"],["Weight","760 g"],["IBIS","Yes, 8 stops"]],[{s:5,v:"Black",t:"Stacked sensor is a game changer. Autofocus is blazing fast.",n:"Deepak L.",c:"Hyderabad",ve:true,ta:"4d ago"},{s:4,v:"Black",t:"Great upgrade from Z6 II. Video features are impressive.",n:"Pallavi S.",c:"Kolkata",ve:true,ta:"1w ago"}]),
  p("CAM-005","sony-a6700","Sony A6700 (Body)","Cameras",2,"Black",["Black"],139990,159990,4.6,4.5,320,"Sony India","/seller/sony-india",[["Sensor","26 MP APS-C Exmor R"],["Video","4K 120fps, 10-bit 4:2:2"],["AF Points","759 points"],["ISO","100 - 32000"],["Weight","493 g"],["AI","Real-time Recognition AF"]],[{s:5,v:"Black",t:"AI-based autofocus is incredible. Best APS-C camera available.",n:"Neha R.",c:"Delhi",ve:true,ta:"2d ago"},{s:4,v:"Black",t:"Compact and powerful. Great for content creators.",n:"Karan J.",c:"Chennai",ve:true,ta:"1w ago"}]),
  p("CAM-006","fujifilm-x-t5","Fujifilm X-T5 (Body)","Cameras",3,"Black",["Black","Silver"],169999,189999,4.7,4.6,220,"Fujifilm India","/seller/fujifilm-india",[["Sensor","40.2 MP APS-C X-Trans CMOS 5 HR"],["Video","6.2K 30fps, 4K 60fps"],["AF Points","425 points"],["ISO","125 - 12800"],["Weight","557 g"],["Film Simulations","19 modes"]],[{s:5,v:"Black",t:"40MP sensor and film simulations produce stunning images.",n:"Shruti B.",c:"Bangalore",ve:true,ta:"3d ago"},{s:5,v:"Silver",t:"Retro design meets modern tech. Best APS-C for stills.",n:"Meera V.",c:"Mumbai",ve:true,ta:"1w ago"}]),
  p("CAM-007","gopro-hero-12-black","GoPro Hero 12 Black","Cameras",4,"Black",["Black"],41500,49500,4.5,4.4,4800,"GoPro India","/seller/gopro-india",[["Video","5.3K 60fps, 4K 120fps"],["Photo","27 MP"],["Waterproof","10m"],["Stabilization","HyperSmooth 6.0"],["Weight","154 g"]],[{s:5,v:"Black",t:"5.3K video is insane. HyperSmooth 6.0 is the best yet.",n:"Aditya H.",c:"Goa",ve:true,ta:"2d ago"},{s:4,v:"Black",t:"Amazing action camera. Battery life is improved.",n:"Gaurav S.",c:"Manali",ve:true,ta:"1w ago"}]),
  p("CAM-008","dji-osmo-action-4","DJI Osmo Action 4","Cameras",5,"Black",["Black"],37999,44999,4.5,4.4,3200,"DJI India","/seller/dji-india",[["Video","4K 120fps"],["Photo","12 MP"],["Waterproof","18m"],["Stabilization","RockSteady 3.0+"],["Sensor","1/1.3 inch"]],[{s:5,v:"Black",t:"1/1.3 inch sensor is incredible for an action camera. Low-light is amazing.",n:"Arjun P.",c:"Delhi",ve:true,ta:"3d ago"},{s:4,v:"Black",t:"Great stabilization and image quality. DJI's best action cam.",n:"Manish A.",c:"Jaipur",ve:true,ta:"1w ago"}]),
  p("CAM-009","sony-zv-e10-ii","Sony ZV-E10 II (Body)","Cameras",6,"Black",["Black","White"],74990,84990,4.5,4.4,680,"Sony India","/seller/sony-india",[["Sensor","26 MP APS-C Exmor R"],["Video","4K 60fps, 10-bit"],["AF Points","759 points"],["Weight","377 g"],["Product Showcase","Yes"],["Background Defocus","One-touch"]],[{s:5,v:"Black",t:"Perfect vlogging camera. Product Showcase mode is genius.",n:"Sneha T.",c:"Mumbai",ve:true,ta:"4d ago"},{s:4,v:"White",t:"Great for YouTube creators. Compact and feature-packed.",n:"Isha T.",c:"Pune",ve:true,ta:"1w ago"}]),
  p("CAM-010","dji-air-3","DJI Air 3","Cameras",3,"Grey",["Grey"],115999,129999,4.5,4.4,1800,"DJI India","/seller/dji-india",[["Camera","Dual: Wide + 3x Medium Tele"],["Video","4K 60fps, 4K HDR"],["Photo","48 MP"],["Weight","720 g"],["Flight Time","46 minutes"],["Omnidirectional Sensing","Yes"]],[{s:5,v:"Grey",t:"Dual cameras on a drone! 46-minute flight time is incredible.",n:"Deepak S.",c:"Goa",ve:true,ta:"3d ago"},{s:4,v:"Grey",t:"Excellent drone for aerial photography. Obstacle avoidance works well.",n:"Arjun P.",c:"Jaipur",ve:true,ta:"1w ago"}]),
  p("CAM-011","sony-rx100-vii","Sony RX100 VII","Cameras",4,"Black",["Black"],99990,119990,4.5,4.4,2200,"Sony India","/seller/sony-india",[["Sensor","20.1 MP 1-inch Exmor RS"],["Lens","24-200mm f/2.8-4.5"],["Video","4K 30fps, 1080p 120fps"],["AF Points","357 points"],["Weight","302 g"]],[{s:5,v:"Black",t:"Best point-and-shoot camera. 24-200mm zoom in pocket size.",n:"Neha R.",c:"Delhi",ve:true,ta:"2d ago"},{s:4,v:"Black",t:"Perfect travel camera. Image quality is excellent.",n:"Sonia R.",c:"Ahmedabad",ve:true,ta:"1w ago"}]),
  p("CAM-012","canon-r50-white-kit","Canon EOS R50 White (18-45mm Kit)","Cameras",5,"White",["White","Black"],66990,76990,4.5,4.4,980,"Canon India","/seller/canon-india",[["Sensor","24.2 MP APS-C CMOS"],["Video","4K 30fps, FHD 120fps"],["AF Points","651 selectable"],["Weight","375 g"],["Eye Detection","Yes"]],[{s:5,v:"White",t:"Beautiful white color! Perfect beginner mirrorless camera.",n:"Isha T.",c:"Pune",ve:true,ta:"3d ago"},{s:4,v:"White",t:"Lightweight and easy to use. Great for stepping up from phone.",n:"Priya R.",c:"Chennai",ve:true,ta:"1w ago"}]),

  p("GAM-004","steam-deck-oled-512gb","Steam Deck OLED (512GB)","Gaming",0,"Black",["Black"],54999,62999,4.7,4.6,2800,"Valve India","/seller/valve-india",[["Display",'7.4" OLED, 1280x800, 90Hz'],["Processor","AMD APU (Zen 2 + RDNA 2)"],["RAM","16 GB LPDDR5"],["Storage","512 GB NVMe SSD"],["Battery","50 Whr, 3-12 hours"]],[{s:5,v:"Black",t:"The OLED screen is gorgeous. Best portable gaming device ever.",n:"Karthik R.",c:"Bangalore",ve:true,ta:"2d ago"},{s:5,v:"Black",t:"Steam library finally portable. OLED makes games look incredible.",n:"Manish A.",c:"Mumbai",ve:true,ta:"5d ago"},{s:4,v:"Black",t:"Amazing device but battery life varies by game.",n:"Aditya H.",c:"Delhi",ve:true,ta:"1w ago"}]),
  p("GAM-005","ps5-dualsense-edge","PS5 DualSense Edge Wireless Controller","Gaming",1,"Black",["Black"],18999,22999,4.5,4.4,1800,"Sony India","/seller/sony-india",[["Type","Pro Controller"],["Haptic Feedback","Yes"],["Adaptive Triggers","Yes, adjustable"],["Battery","12 hours"],["Swappable","Back buttons, thumbsticks"]],[{s:5,v:"Black",t:"Best controller ever made. Swappable components are incredible.",n:"Gaurav S.",c:"Jaipur",ve:true,ta:"3d ago"},{s:4,v:"Black",t:"Premium feel and build. Customization options are excellent.",n:"Rohit M.",c:"Pune",ve:true,ta:"1w ago"}]),
  p("GAM-006","xbox-elite-controller-2","Xbox Elite Wireless Controller Series 2","Gaming",2,"Black",["Black"],17999,22999,4.6,4.5,2200,"Microsoft India","/seller/microsoft-india",[["Type","Pro Controller"],["Adjustable","Tension, trigger locks, paddles"],["Battery","40 hours"],["Connectivity","Bluetooth, USB-C"],["Weight","345 g"]],[{s:5,v:"Black",t:"40-hour battery and complete customization. Worth the premium.",n:"Sneha T.",c:"Chennai",ve:true,ta:"4d ago"},{s:4,v:"Black",t:"Best Xbox controller. Build quality is top-notch.",n:"Arjun P.",c:"Delhi",ve:true,ta:"1w ago"}]),
  p("GAM-007","nintendo-switch-lite","Nintendo Switch Lite","Gaming",3,"Yellow",["Yellow","Turquoise","Coral","Gray"],19999,24999,4.4,4.3,6800,"Nintendo India","/seller/nintendo-india",[["Display",'5.5" LCD, 1280x720'],["Battery","3-7 hours"],["Weight","277 g"],["Modes","Handheld only"],["WiFi","802.11ac"]],[{s:5,v:"Yellow",t:"Perfect for portable gaming. Light and comfortable.",n:"Neha S.",c:"Mumbai",ve:true,ta:"3d ago"},{s:4,v:"Turquoise",t:"Great for kids and travel. Nintendo games are the best.",n:"Priya G.",c:"Chandigarh",ve:true,ta:"1w ago"}]),
  p("GAM-008","asus-rog-ally","ASUS ROG Ally (Z1 Extreme)","Gaming",4,"White",["White","Black"],59999,69999,4.4,4.3,1200,"ASUS India","/seller/asus-india",[["Display",'7" FHD, 120Hz, IPS'],["Processor","AMD Z1 Extreme"],["RAM","16 GB LPDDR5x"],["Storage","512 GB NVMe SSD"],["Battery","40 Whr"],["OS","Windows 11"]],[{s:5,v:"White",t:"Windows gaming in handheld form. Z1 Extreme is powerful.",n:"Karan J.",c:"Hyderabad",ve:true,ta:"2d ago"},{s:4,v:"Black",t:"Great for PC gaming on the go. Battery is the main limitation.",n:"Vikram P.",c:"Bangalore",ve:true,ta:"1w ago"}]),
  p("GAM-009","meta-quest-3-128gb","Meta Quest 3 (128GB)","Gaming",5,"White",["White"],49999,59999,4.5,4.4,1800,"Meta India","/seller/meta-india",[["Display",'2064x2208 per eye, LCD'],["Processor","Snapdragon XR2 Gen 2"],["RAM","8 GB"],["Storage","128 GB"],["Mixed Reality","Yes, full-color passthrough"]],[{s:5,v:"White",t:"Mixed reality is mind-blowing. Passthrough quality is excellent.",n:"Shruti B.",c:"Delhi",ve:true,ta:"3d ago"},{s:4,v:"White",t:"Best standalone VR headset. Game library is growing fast.",n:"Deepak S.",c:"Chennai",ve:true,ta:"1w ago"}]),
  p("GAM-010","razer-kishi-v2","Razer Kishi V2","Gaming",6,"Black",["Black"],8999,10999,4.3,4.2,2600,"Razer India","/seller/razer-india",[["Type","Mobile Controller"],["Compatibility","Android & iOS"],["Buttons","Mechanical microswitches"],["Pass-through","USB-C charging"],["Razer Nexus","App support"]],[{s:4,v:"Black",t:"Transforms phone into a gaming handheld. Buttons feel great.",n:"Vikash P.",c:"Patna",ve:true,ta:"4d ago"},{s:4,v:"Black",t:"Good mobile controller. Mechanical switches are responsive.",n:"Sanjay K.",c:"Lucknow",ve:true,ta:"1w ago"}]),
  p("GAM-011","ps5-slim-digital","PS5 Slim Digital Edition","Gaming",7,"White",["White"],44999,49999,4.6,4.5,3200,"Sony India","/seller/sony-india",[["CPU","AMD Zen 2, 8-core"],["GPU","10.28 TFLOPS"],["Storage","1 TB SSD"],["RAM","16 GB GDDR6"],["Output","4K 120fps, 8K"]],[{s:5,v:"White",t:"Smaller and lighter PS5. Same great performance.",n:"Gaurav S.",c:"Jaipur",ve:true,ta:"2d ago"},{s:4,v:"White",t:"Good revision. 1TB storage is welcome.",n:"Manish A.",c:"Mumbai",ve:true,ta:"1w ago"}]),
  p("GAM-012","xbox-series-s-1tb","Xbox Series S 1TB","Gaming",0,"Carbon Black",["Carbon Black","Robot White"],34999,39999,4.4,4.3,4800,"Microsoft India","/seller/microsoft-india",[["GPU","4 TFLOPS, RDNA 2"],["Storage","1 TB SSD"],["RAM","10 GB GDDR6"],["Output","1440p 120fps"],["Game Pass","Yes, included trials"]],[{s:5,v:"Carbon Black",t:"1TB storage is a huge upgrade. Game Pass makes this incredible value.",n:"Aditya H.",c:"Delhi",ve:true,ta:"3d ago"},{s:4,v:"Robot White",t:"Great entry to Xbox ecosystem. Compact and quiet.",n:"Isha T.",c:"Pune",ve:true,ta:"1w ago"}]),
]

const catalogProducts: CatalogProduct[] = [...existingCatalogProducts, ...generatedProducts]

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

