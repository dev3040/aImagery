import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AImagery',
  description: 'Based on Image generate you caption',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AImagery</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css" />
      </Head>
      <body id="body-pd" className={inter.className}>{children}
        <Script async src="https://unpkg.com/feather-icons"></Script>
        <Script async type="text/javascript" src="/js/main.js"></Script>
      </body>
    </html>
  )
}
