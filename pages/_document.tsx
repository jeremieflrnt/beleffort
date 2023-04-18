import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <div id="backdrop" />
        <div id="overlay" />
        {/* <input type="checkbox" id="my-modal-6" className="modal-toggle" /> */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
