// /pages/_document.js
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=PT+Sans:300,400,700,800"
            rel="stylesheet"
          />
          <script src="https://js.chargify.com/latest/chargify.js"></script>
          <style jsx global>{`
            #__next {
              height: 100%;
            }
          `}</style>
        </Head>
        <body>

          <Main className="main_container" />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default MyDocument;
