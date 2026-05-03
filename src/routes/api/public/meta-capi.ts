import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";
import { z } from "zod";

const PIXEL_ID = "839542085373899";

const Schema = z.object({
  eventName: z.string().min(1).max(64),
  eventId: z.string().min(1).max(128),
  eventTime: z.number().int(),
  userData: z.object({
    email: z.string().email().optional(),
    phone: z.string().max(32).optional(),
    fbp: z.string().max(256).optional(),
    fbc: z.string().max(256).optional(),
    clientUserAgent: z.string().max(1024).optional(),
  }),
  customData: z.object({
    value: z.number(),
    currency: z.string().min(3).max(3),
    contentIds: z.array(z.union([z.string(), z.number()])).max(50),
  }),
  eventSourceUrl: z.string().url().optional(),
});

const sha256 = (v?: string) =>
  v ? createHash("sha256").update(v.trim().toLowerCase()).digest("hex") : undefined;

export const Route = createFileRoute("/api/public/meta-capi")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = process.env.META_CAPI_ACCESS_TOKEN;
        if (!token) return new Response("Missing token", { status: 500 });

        let parsed;
        try {
          parsed = Schema.parse(await request.json());
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

        const event = {
          event_name: parsed.eventName,
          event_time: parsed.eventTime,
          event_id: parsed.eventId,
          event_source_url: parsed.eventSourceUrl,
          action_source: "website",
          user_data: {
            em: parsed.userData.email ? [sha256(parsed.userData.email)] : undefined,
            ph: parsed.userData.phone
              ? [sha256(parsed.userData.phone.replace(/\D/g, ""))]
              : undefined,
            fbp: parsed.userData.fbp,
            fbc: parsed.userData.fbc,
            client_user_agent: parsed.userData.clientUserAgent,
            client_ip_address: ip,
          },
          custom_data: {
            value: parsed.customData.value,
            currency: parsed.customData.currency,
            content_ids: parsed.customData.contentIds,
            content_type: "product",
          },
        };

        const res = await fetch(
          `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: [event] }),
          }
        );
        const body = await res.text();
        return new Response(body, {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
