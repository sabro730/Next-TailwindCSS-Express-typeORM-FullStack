import { AppProps } from 'next/app'
import axios from 'axios'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'

import '../styles/tailwind.css'
import '../styles/icons.css'

import Navbar from '../components/Navbar'
import { AuthProvider } from '../context/auth'

axios.defaults.baseURL = 'http://localhost:5000/api'
axios.defaults.withCredentials = true

const fetcher = async (url: string) => {
  try {
    const responseObject = axios.get(url)
    return (await responseObject).data
  } catch (err) {
    throw err.response.data
  }
}

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  const authRoutes = ['/register', '/login']
  const authRoute = authRoutes.includes(pathname)
  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 10000,
      }}
    >
      <AuthProvider>
        {!authRoute && <Navbar />}
        <div className={authRoute ? '' : 'pt-12'}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  )
}

export default App
