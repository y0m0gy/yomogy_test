import "@/styles/globals.css";
import "prismjs/themes/prism-tomorrow.css";
import type { AppProps } from "next/app";
import RootLayout from "../components/layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}
