import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
Chart.register(...registerables, zoomPlugin);
import { useTranslation } from "react-i18next";

const ByStationLineChart = ({ data, stationList, currentStartDate, currentEndDate, selectedStationName }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const ctx = chartRef.current.getContext("2d");

        const getFontSize = (chartWidth) => (chartWidth < 600 ? 12 : 14);
        const getTitleFontSize = (chartWidth) => (chartWidth < 600 ? 16 : 20);

        // Destroy previous chart instance if exists
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Extracting station codes from the first data entry
        const stationCodes = Object.keys(data[0]).filter((key) => key !== "date");

        // Preparing datasets dynamically for each station
        const datasets = stationCodes.flatMap((code, index) => {
            const stationInfo = stationList.find((s) => s.code === code);
            const stationName = stationInfo ? stationInfo.name : `Station ${code}`;

            return [
                {
                    label: `${stationName} - ${t("avgTemp")} (°C)`,
                    data: data.map((entry) => entry[code]?.averageTemperature || null),
                    borderColor: index % 2 === 0 ? "#6366f1" : "#ec4899",
                    backgroundColor: index % 2 === 0 ? "#6366f199" : "#ec489999",
                    borderWidth: 3,
                    fill: false,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    tension: 0.4,
                },
                {
                    label: `${stationName} - ${t("5-dayAvgTemp")} (°C)`,
                    data: data.map((entry) => entry[code]?.fiveDayAverageTemperature || null),
                    borderColor: index % 2 === 0 ? "#22c55e" : "#f59e0b",
                    backgroundColor: index % 2 === 0 ? "#22c55e99" : "#f59e0b99",
                    borderWidth: 3,
                    fill: false,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    tension: 0.4,
                }
            ];
        });

        // Create chart instance
        chartInstance.current = new Chart(ctx, {
            type: "line",
            data: {
                labels: data.map((entry) => entry.date),
                datasets: datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1000, easing: "easeInOutQuart" },
                scales: {
                    x: {
                        type: "time",
                        time: { unit: "day", tooltipFormat: t("linechartTooltipFormat") },
                        min: currentStartDate,
                        max: currentEndDate,
                        title: {
                            display: true,
                            text: t("date"),
                            color: "#6b7280",
                            font: { family: "Inter, sans-serif", size: getTitleFontSize, weight: "600" },
                            padding: { top: 10, bottom: 10 },
                        },
                        grid: { color: "rgba(229, 231, 235, 0.2)", drawTicks: false },
                        ticks: {
                            color: "#6b7280",
                            font: { family: "Inter, sans-serif", size: getFontSize, weight: "500" },
                            padding: 10,
                            callback: (value) => {
                                const date = new Date(value);
                                return `${date.getDate()} ${t(date.toLocaleString("en-US", { month: "short" }))} ${date.getFullYear()}`;
                            },
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: `${t("avgTemp")} (°C)`,
                            color: "#6b7280",
                            font: { family: "Inter, sans-serif", size: getTitleFontSize, weight: "600" },
                            padding: { top: 10, bottom: 10 },
                        },
                        grid: { color: "rgba(229, 231, 235, 0.2)", drawTicks: false },
                        ticks: {
                            color: "#6b7280",
                            font: { family: "Inter, sans-serif", size: getFontSize, weight: "500" },
                            padding: 10,
                        },
                    },
                },
                plugins: {
                    zoom: {
                        zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "x" },
                        pan: { enabled: true, mode: "x" },
                    },
                    tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        titleColor: "#fff",
                        bodyColor: "#fff",
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => {
                                const label = context.dataset.label || "";
                                const value = context.raw || 0;
                                return ` ${selectedStationName} ${label}: ${value} °C`;
                            },
                        },
                        titleFont: { family: "Inter, sans-serif", size: getFontSize + 2, weight: "600" },
                        bodyFont: { family: "Inter, sans-serif", size: getFontSize, weight: "500" },
                    },
                    legend: {
                        display: true,
                        position: "top",
                        align: "center",
                        labels: {
                            color: "#6b7280",
                            font: { family: "Inter, sans-serif", size: getFontSize, weight: "600" },
                            padding: 10,
                            boxWidth: 20,
                            boxHeight: 20,
                            usePointStyle: true,
                            pointStyle: "circle",
                        },
                    },
                },
                layout: { padding: { top: 10, right: 20, bottom: 20, left: 20 } },
                elements: {
                    line: { borderWidth: 3 },
                    point: {
                        hoverRadius: (context) => (context.chart.width < 600 ? 5 : 8),
                        radius: (context) => (context.chart.width < 600 ? 3 : 5),
                        backgroundColor: "#fff",
                        borderWidth: 2,
                    },
                },
            },
        });

        // Cleanup function
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [data, stationList, currentStartDate, currentEndDate]);

    // Update zoom when page changes
    useEffect(() => {
        if (chartInstance.current && currentStartDate && currentEndDate) {
            chartInstance.current.options.scales.x.min = currentStartDate;
            chartInstance.current.options.scales.x.max = currentEndDate;
            chartInstance.current.update();
        }
    }, [currentStartDate, currentEndDate]);

    return <canvas ref={chartRef} />;
};

export default ByStationLineChart;
