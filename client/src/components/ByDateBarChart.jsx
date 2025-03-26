/* eslint-disable react/prop-types */
// components/TemperatureComparisonChart.jsx
import { motion } from 'framer-motion';
import { useColorModeValue } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const ByDateBarChart = ({ data, date }) => {
	const { t } = useTranslation();

	const chartData = {
		labels: data.map(entry => entry.name),
		datasets: [{
			label: `${t("avgTemp")} (°C) - ${date}`,
			data: data.map(entry => entry.Avg),
			backgroundColor: [
				'rgba(99, 102, 241, 0.8)',
				'rgba(236, 72, 153, 0.8)',
				'rgba(16, 185, 129, 0.8)'
			],
			borderColor: [
				'rgba(99, 102, 241, 1)',
				'rgba(236, 72, 153, 1)',
				'rgba(16, 185, 129, 1)'
			],
			borderWidth: 2,
			borderRadius: 8,
			hoverBorderWidth: 3
		}]
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: false
			},
			title: {
				display: true,
				text: `${t("avgTemp")} (°C) - ${date}`,
				color: useColorModeValue('#1A202C', '#FFFFFF'),
				font: { size: 18 }
			}
		},
		scales: {
			x: {
				grid: { display: false },
				ticks: {
					color: useColorModeValue('#1A202C', '#FFFFFF'),
					font: { weight: 'bold' }
				}
			},
			y: {
				grid: { color: useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)') },
				ticks: {
					color: useColorModeValue('#1A202C', '#FFFFFF'),
					stepSize: 5
				}
			}
		},
		animation: {
			duration: 1500,
			easing: 'easeInOutQuart'
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			style={{
				background: useColorModeValue('white', 'gray.700'),
				padding: '24px',
				borderRadius: '1rem',
				boxShadow: 'xl'
			}}
		>
			<Bar data={chartData} options={options} />
		</motion.div>
	);
};

export default ByDateBarChart;