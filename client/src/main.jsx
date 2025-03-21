import ReactDOM from 'react-dom/client'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import HomePage from './pages/Homepage'
import AboutUs from './pages/AboutUs'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import './i18n.js'

ReactDOM.createRoot(document.getElementById('root')).render(
	<ChakraProvider>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<HomePage />} />
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="about" element={<AboutUs />} />
				</Route>

				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	</ChakraProvider>
)
