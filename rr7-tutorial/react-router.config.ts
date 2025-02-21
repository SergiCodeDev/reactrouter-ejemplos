import { type Config } from "@react-router/dev/config";

export default {
  // ssr: false, //SPA...
  ssr: true,
  prerender: ["/about"], // HTML
} satisfies Config;
