// Meta Pixel + CAPI helpers
export const META_PIXEL_ID = "839542085373899";

export function getFbCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined") return {};
  const read = (name: string) => {
    const m = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]+)"));
    return m ? decodeURIComponent(m[2]) : undefined;
  };
  return { fbp: read("_fbp"), fbc: read("_fbc") };
}

export function trackPageView() {
  if (typeof window === "undefined" || !(window as any).fbq) return;
  (window as any).fbq("track", "PageView");
}

export type PurchaseOrderData = {
  value: number;
  currency?: string;
  contentIds: (string | number)[];
  email?: string;
  phone?: string;
};

export async function sendPurchaseToCAPI(
  orderData: PurchaseOrderData,
  eventId: string
) {
  const { fbp, fbc } = getFbCookies();
  const payload = {
    eventName: "Purchase",
    eventId,
    eventTime: Math.floor(Date.now() / 1000),
    userData: {
      email: orderData.email,
      phone: orderData.phone,
      fbp,
      fbc,
      clientUserAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    },
    customData: {
      value: orderData.value,
      currency: orderData.currency ?? "PHP",
      contentIds: orderData.contentIds,
    },
    eventSourceUrl:
      typeof window !== "undefined" ? window.location.href : undefined,
  };

  try {
    await fetch("/api/public/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (err) {
    console.error("CAPI send failed", err);
  }
}

export function trackPurchase(orderData: PurchaseOrderData): string {
  const eventId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq(
      "track",
      "Purchase",
      {
        value: orderData.value,
        currency: orderData.currency ?? "PHP",
        content_ids: orderData.contentIds,
      },
      { eventID: eventId }
    );
  }

  void sendPurchaseToCAPI(orderData, eventId);
  return eventId;
}
