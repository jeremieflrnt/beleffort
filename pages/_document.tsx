import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <div id="backdrop" />
        <div id="overlay" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
