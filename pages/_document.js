// /pages/_document.js
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ChakraProvider } from "@chakra-ui/react"

class MyDocument extends Document {
  render() {
    return (
      <ChakraProvider resetCSS={false}>
        <Html lang="en">
          <Head>
            <link
              href="https://fonts.googleapis.com/css?family=PT+Sans:300,400,700,800"
              rel="stylesheet"
            />
            <script src="https://js.chargify.com/latest/chargify.js"></script>
          </Head>
          <body>
            <Main className="main_container" />
            <NextScript />
            <style jsx>{`
            #__next {
              height: 100%;
            }
          `}
            </style>
          </body>
        </Html>
      </ChakraProvider>

    );
  }
}
export default MyDocument;
