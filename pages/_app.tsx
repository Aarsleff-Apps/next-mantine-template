import "@mantine/core/styles.layer.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { theme } from "../theme";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: any) {
  return (
    <SessionProvider>
      <MantineProvider defaultColorScheme="auto" theme={theme}>
        <ModalsProvider>
          <Notifications position="top-right" />
          <Head>
            <title>Mantine Template</title>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <link
              rel="mask-icon"
              href="/safari-pinned-tab.svg"
              color="#005fae"
            />
            <meta name="msapplication-TileColor" content="#005fae" />
            <meta name="theme-color" content="#005fae" />
          </Head>
          <Component {...pageProps} />
        </ModalsProvider>
      </MantineProvider>
    </SessionProvider>
  );
}
