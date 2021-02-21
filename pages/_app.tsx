import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import "../src/api/interceptor";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
