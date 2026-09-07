export type QuoteItem = {
  description: string;
  qty: number;
  unit_price: number;
  discount_pct: number;
  tax_pct: number;
};

export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected";

export type Quotation = {
  id: string;
  quote_number: string;
  status: QuoteStatus;
  issue_date: string;
  valid_until: string | null;
  client_name: string;
  client_company: string | null;
  client_email: string | null;
  client_phone: string | null;
  client_address: string | null;
  items: QuoteItem[];
  notes: string | null;
  terms: string | null;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  grand_total: number;
  created_at: string;
  updated_at: string;
};

export function emptyItem(): QuoteItem {
  return { description: "", qty: 1, unit_price: 0, discount_pct: 0, tax_pct: 0 };
}

export function itemLineTotal(item: QuoteItem) {
  const gross = item.qty * item.unit_price;
  const discount = gross * (item.discount_pct / 100);
  const taxed = (gross - discount) * (item.tax_pct / 100);
  return { gross, discount, taxed, net: gross - discount + taxed };
}

export function computeTotals(items: QuoteItem[]) {
  let subtotal = 0;
  let discount_total = 0;
  let tax_total = 0;
  for (const item of items) {
    const { gross, discount, taxed } = itemLineTotal(item);
    subtotal += gross;
    discount_total += discount;
    tax_total += taxed;
  }
  const grand_total = subtotal - discount_total + tax_total;
  return {
    subtotal: round2(subtotal),
    discount_total: round2(discount_total),
    tax_total: round2(tax_total),
    grand_total: round2(grand_total),
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export type QuotationInput = Omit<
  Quotation,
  "id" | "quote_number" | "created_at" | "updated_at" | "subtotal" | "discount_total" | "tax_total" | "grand_total"
>;
