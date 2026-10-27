export type BlockValue = { alt?: string; html?: string; url?: string; text?: string };

export interface ContentBlock {
  type: "image" | "text" | "link" | "richtext";
  value: BlockValue;
  section_key: string;
  id: string;
  updated_at: string;
  page: string;
}

export interface Post {
  body: string | null;
  status: "scheduled" | "published" | "draft";
  author: string | null;
  id: string;
  excerpt: string | null;
  hero_image: string | null;
  published_at: string | null;
  hero_alt: string | null;
  category_id: string | null;
  slug: string;
  title: string;
}

export interface Category { id: string; sort_order: number; slug: string; name: string; description: string | null }

export interface Person {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo: string | null;
  type: "advisor" | "team";
  sort_order: number;
  visible: boolean;
  unconfirmed: boolean;
  /** 0008. Production phases (1 to 5) this person is placed in. */
  phases?: number[];
  /** 0008. Alt text for `photo`. */
  photo_alt?: string | null;
  /** 0008. A bundled portrait (an AssetKey in src/lib/brand.ts) used while `photo` is empty. */
  asset_key?: string | null;
}

export interface MediaItem {
  id: string;
  title: string;
  outlet: string | null;
  published_on: string | null;
  description: string | null;
  thumbnail: string | null;
  link: string | null;
  embed_url: string | null;
  sort_order: number;
  /** 0008. */
  kind?: "video" | "podcast" | "press" | "interview";
  /** 0008. Alt text for `thumbnail`. */
  thumbnail_alt?: string | null;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price_cents: number;
  currency: string;
  thumbnail: string | null;
  file_path: string;
  active: boolean;
  /** 0008. Running order on the shelf, lowest first. */
  sort_order?: number;
  /** 0008. Alt text for `thumbnail`. */
  thumbnail_alt?: string | null;
  created_at?: string;
  updated_at?: string;
}

/** Admin read only. Written by the Stripe webhook through the service role. */
export interface Order {
  download_count: number;
  amount_cents: number | null;
  product_id: string;
  payer_email: string | null;
  max_downloads: number;
  withdrawal_consent_at: string | null;
  expires_at: string;
  download_token: string;
  id: string;
  currency: string | null;
  stripe_session_id: string;
  created_at: string;
}

export type EnquiryRoute = "press" | "educator" | "partnership" | "notify" | "general";

/** Admin read and update (handled) only. Inserted by api/contact.ts. */
export interface Enquiry {
  message: string | null;
  email: string | null;
  handled: boolean;
  organisation: string | null;
  name: string | null;
  created_at: string;
  id: string;
  route: EnquiryRoute;
}

/** `settings` row `app`. */
export interface AppSetting {
  target_window?: string | null;
  app_store_url?: string | null;
  play_store_url?: string | null;
  launched: boolean;
}

export type SocialNetwork = "instagram" | "facebook" | "tiktok" | "linkedin" | "youtube";

/** `settings` row `links`. */
export interface LinksSetting {
  social: Partial<Record<SocialNetwork, string>>;
  show_site: string;
}

/** Every settings key the site reads, and the shape of its value. */
export interface SettingsMap {
  links: LinksSetting;
  app: AppSetting;
}

export interface Settings {
  key: string;
  value: Record<string, unknown>;
}
