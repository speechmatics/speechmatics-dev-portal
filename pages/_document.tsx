// /pages/_document.js
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { GA_TRACKING_ID } from '../utils/analytics';

const gascript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_TRACKING_ID}');`;

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <script src='https://js.chargify.com/latest/chargify.js'></script>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}></script>
          <script dangerouslySetInnerHTML={{ __html: gascript }}></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default MyDocument;
