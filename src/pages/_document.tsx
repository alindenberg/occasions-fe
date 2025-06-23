import { Html, Head, Main, NextScript } from "next/document";
import MetaPixel from "../components/MetaPixel";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Meta Pixel Code */}
        <MetaPixel />

        {/* Security headers are set via next.config.mjs */}

        {/* OpenGraph meta tags */}
        <meta property="og:title" content="Occasion Alerts | Never Miss an Important Occasion" />
        <meta property="og:description" content="Track all your important occasions and receive perfectly-timed, AI-generated messages ready to share. Never forget a special moment or struggle for the right words again." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://occasionalerts.com" />
        <meta property="og:site_name" content="Occasion Alerts" />

        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Occasion Alerts | Never Miss an Important Occasion" />
        <meta name="twitter:description" content="Track all your important occasions and receive perfectly-timed, AI-generated messages ready to share." />
        <meta name="twitter:image" content="/og-image.png" />

        {/* Additional meta tags */}
        <meta name="description" content="Track all your important occasions and receive perfectly-timed, AI-generated messages ready to share. Never forget a special moment or struggle for the right words again." />
        <link rel="canonical" href="https://occasionalerts.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
