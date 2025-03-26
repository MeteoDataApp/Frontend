/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
Chart.register(...registerables, zoomPlugin);
import { useTranslation } from 'react-i18next';

const AdvancedLineChart = ({ data, xAxisKey, stations, currentStartDate, currentEndDate }) => {
    console.log(data, xAxisKey, stations, currentStartDate, currentEndDate);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const { t } = useTranslation();

    const getFontSize = (chartWidth) => {
        return chartWidth < 600 ? 12 : 14; 
    };

    const getTitleFontSize = (chartWidth) => {
        return chartWidth < 600 ? 16 : 20;
    };

    const stationList = [
        { code: 58349, name: t("Suzhou"), image: "Suzhou.jpg" },
        { code: 58238, name: t("Nanjing"), image: "Nanjing.jpg" },
        { code: 58354, name: t("Wuxi"), image: "Wuxi.jpg" },
        { code: 58343, name: t("Changzhou"), image: "Changzhou.jpg" },
        { code: 58252, name: t("Zhenjiang"), image: "Zhenjiang.jpg" },
        { code: 58259, name: t("Nantong"), image: "Nantong.jpg" },
        { code: 58246, name: t("Taizhou"), image: "Taizhou.jpg" },
        { code: 58245, name: t("Yangzhou"), image: "Yangzhou.jpg" },
        { code: 58027, name: t("Xuzhou"), image: "Xuzhou.jpg" },
        { code: 58044, name: t("Lianyungang"), image: "Lianyungang.jpg" },
        { code: 58141, name: t("Huaian"), image: "Huaian.jpg" },
        { code: 58154, name: t("Yancheng"), image: "Yancheng.jpg" },
        { code: 58131, name: t("Suqian"), image: "Suqian.jpg" },
    ];
    
    useEffect(() => {
        if (!data || data.length === 0 || !stations || stations.length === 0) return;

        const ctx = chartRef.current.getContext("2d");

        // Destroy previous chart instance
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Define colors for different stations
        const colors = [ "#6366f1",  "#ec4899", "#f59e0b",  "#10b981",  "#3b82f6", "#ef4444", "#8b5cf6",  "#22c55e", "#f97316", "#14b8a6", "#eab308", "#a855f7",  "#db2777"];
          
        // Generate datasets for each station
        const datasets = stations.flatMap((stationCode, index) => {
            const stationData = stationList.find(s => s.code === stationCode);
            return stationData ? [{
                label: stationData.name, 
                data: data.map(item => {
                    const stationEntry = item[stationCode];
                    return stationEntry?.averageTemperature ?? null;
                }),
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + "99",
                borderWidth: 3,
                fill: false,
                pointRadius: 5,
                pointHoverRadius: 8,
                tension: 0.4,
            }] : [];
        });

        // Create new chart instance
        chartInstance.current = new Chart(ctx, {
            type: "line",
            data: {
                labels: data.map((item) => item[xAxisKey]),
                datasets: datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: "easeInOutQuart",
                },
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "day",
                            tooltipFormat: t("linechartTooltipFormat"),
                        },
                        min: currentStartDate,
                        max: currentEndDate,
                        title: {
                            display: true,
                            text: t("date"),
                            color: "#6b7280",
                            font: {
                                family: "Inter, sans-serif",
                                size: (context) => getTitleFontSize(context.chart.width),
                                weight: "600",
                            },
                            padding: { top: 10, bottom: 10 },
                        },
                        grid: {
                            color: "rgba(229, 231, 235, 0.2)",
                            drawTicks: false,
                        },
                        ticks: {
                            color: "#6b7280",
                            font: {
                                family: "Inter, sans-serif",
                                size: (context) => getFontSize(context.chart.width),
                                weight: "500",
                            },
                            padding: 10,
                            maxRotation: 0,
                            autoSkip: true,
                            callback: (value) => {
                                const date = new Date(value);
                                const monthKey = date.toLocaleString("en-US", { month: "short" }); 
                                const formattedDate = `${date.getDate()} ${t(`${monthKey}`)} ${date.getFullYear()}`;
                
                                return formattedDate;
                            },
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: `${t("avgTemp")} (°C)`,
                            color: "#6b7280",
                            font: {
                                family: "Inter, sans-serif",
                                size: (context) => getTitleFontSize(context.chart.width),
                                weight: "600",
                            },
                            padding: { top: 10, bottom: 10 },
                        },
                        grid: {
                            color: "rgba(229, 231, 235, 0.2)",
                            drawTicks: false,
                        },
                        ticks: {
                            color: "#6b7280",
                            font: {
                                family: "Inter, sans-serif",
                                size: (context) => getFontSize(context.chart.width),
                                weight: "500",
                            },
                            padding: 10,
                        },
                    }
                },
                plugins: {
                    zoom: {
                        zoom: { wheel: { enabled: true }, mode: "x" },
                        pan: { enabled: true, mode: "x" }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.dataset.label || "";
                                const value = context.raw ?? "N/A";
                                return ` ${label}: ${value} °C`;
                            },
                        },
                    },
                    legend: {
                        display: true,
                        position: "top",
                    },
                },
            },
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [data, xAxisKey, stations, currentStartDate, currentEndDate]);

    return <canvas ref={chartRef} />;
};

export default AdvancedLineChart;
