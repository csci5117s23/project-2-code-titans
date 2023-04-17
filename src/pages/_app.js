import { ClerkProvider } from '@clerk/nextjs';
import '@/styles/main.css'
import { Cabin } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const cabin = Cabin({ subsets: ['latin'], style: ['normal'] })


export default function App({ Component, pageProps }) {
  return(
    <ClerkProvider {...pageProps}>
      <main className={cabin.className}> 
        <Component {...pageProps} /> 
      </main>
    </ClerkProvider>
  )
}
