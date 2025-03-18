import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
Chart.register(...registerables, zoomPlugin);

const ByStationLineChart = ({ data, xAxisKey, yAxisKeys, currentStartDate, currentEndDate }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null); // Store the chart instance

    useEffect(() => {
        if (!data || data.length === 0) return;

        const ctx = chartRef.current.getContext("2d");

        // Destroy previous chart instance
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Create new chart instance
        chartInstance.current = new Chart(ctx, {
            type: "line",
            data: {
                labels: data.map((item) => item[xAxisKey]),
                datasets: yAxisKeys.map((key) => ({
                    label: key === "Avg" ? "Avg Temp (°C)" : "5-day Avg Temp (°C)",
                    data: data.map((item) => item[key]),
                    borderColor: key === "Avg" ? "#6366f1" : "#ec4899",
                    backgroundColor: key === "Avg" ? "#6366f199" : "#ec489999",
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.4,
                })),
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000, // Smooth transition
                    easing: "easeInOutQuart",
                },
                scales: {
                    x: {
                        type: "time",
                        time: {
                            tooltipFormat: "MMM dd, yyyy",
                            displayFormats: {
                                day: "MMM dd yyyy",
                                month: "MMM yyyy",
                                year: "yyyy",
                            },
                        },
                        min: currentStartDate, // Initial zoom to current page
                        max: currentEndDate,
                        title: { display: true, text: "Date" },
                        grid: { color: "rgba(229, 231, 235, 0.5)" },
                    },
                    y: {
                        title: { display: true, text: "Temperature (°C)" },
                        grid: { color: "rgba(229, 231, 235, 0.5)" },
                    },
                },
                plugins: {
                    zoom: {
                        zoom: {
                            wheel: { enabled: true },
                            pinch: { enabled: true },
                            mode: "x",
                        },
                        pan: {
                            enabled: true,
                            mode: "x",
                        },
                    },
                },
            },
        });

        // Cleanup
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [data, xAxisKey, yAxisKeys]); // Rebuild chart when data changes

    // Update zoom when current page changes
    useEffect(() => {
        if (chartInstance.current && currentStartDate && currentEndDate) {
            // Reset zoom to current page's date range
            chartInstance.current.options.scales.x.min = currentStartDate;
            chartInstance.current.options.scales.x.max = currentEndDate;
            chartInstance.current.update();
        }
    }, [currentStartDate, currentEndDate]);

    return <canvas ref={chartRef} />;
};

export default ByStationLineChart;