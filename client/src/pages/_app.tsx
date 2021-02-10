import { AppProps } from 'next/app'
import axios from 'axios'
import { Fragment } from 'react'
import { useRouter } from 'next/router'

import '../styles/tailwind.css'
import Navbar from '../components/Navbar'

axios.defaults.baseURL = 'http://localhost:5000/api'
axios.defaults.withCredentials = true
function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  const authRoutes = ['/register', '/login']
  const authRoute = authRoutes.includes(pathname)
  return (
    <Fragment>
      {!authRoute && <Navbar />}
      <Component {...pageProps} />
    </Fragment>
  )
}

export default App
