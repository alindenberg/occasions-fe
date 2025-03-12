import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Security headers are set via next.config.mjs */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
