/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import useLanguage from "../hooks/useLanguage";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
Chart.register(...registerables, zoomPlugin);

const ByStationLineChart = ({ data, xAxisKey, yAxisKeys, currentStartDate, currentEndDate, selectedStationName }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const { isChinese } = useLanguage();

    const monthsInChinese = [
        "一月", "二月", "三月", "四月", "五月", "六月", 
        "七月", "八月", "九月", "十月", "十一月", "十二月"
    ];

    useEffect(() => {
        if (!data || data.length === 0) return;

        const ctx = chartRef.current.getContext("2d");

        const getFontSize = (chartWidth) => {
            return chartWidth < 600 ? 12 : 14; 
        };

        const getTitleFontSize = (chartWidth) => {
            return chartWidth < 600 ? 16 : 20;
        };

        // Destroy previous chart instance
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Create new chart instance
        chartInstance.current = new Chart(ctx, {
            type: "line",
            data: {
                labels: data.map((item) => item[xAxisKey]),
                datasets: yAxisKeys.map((key, index) => ({
                    label: key === "Avg" ? (isChinese ? "平均温度 (°C)" : "Avg Temp (°C)") : (isChinese ? "5天平均温度 (°C)" : "5-day Avg Temp (°C)"),
                    data: data.map((item) => item[key]),
                    borderColor: index === 0 ? "#6366f1" : "#ec4899",
                    backgroundColor: index === 0 ? "#6366f199" : "#ec489999",
                    borderWidth: 3,
                    fill: false,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    tension: 0.4,
                })),
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
                            tooltipFormat: isChinese ? "M月d日yyyy年" : "dd MMM yyyy",
                        },
                        min: currentStartDate,
                        max: currentEndDate,
                        title: {
                            display: true,
                            text: isChinese ? "日期" : "Date",
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
                                const formattedDate = isChinese
                                    ? `${date.getDate()} ${monthsInChinese[date.getMonth()]} ${date.getFullYear()}`
                                    : `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" })} ${date.getFullYear()}`;
                
                                return formattedDate;
                            },
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: isChinese ? "温度 (°C)" : "Temperature (°C)",
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
                    tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        titleColor: "#fff",
                        bodyColor: "#fff",
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: true,
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                        callbacks: {
                            label: (context) => {
                                const label = context.dataset.label || "";
                                const value = context.raw || 0;
                                return ` ${selectedStationName} ${label}: ${value} °C`;
                            },
                        },
                        titleFont: {
                            family: "Inter, sans-serif",
                            size: (context) => getFontSize(context.chart.width) + 2,
                            weight: "600",
                        },
                        bodyFont: {
                            family: "Inter, sans-serif",
                            size: (context) => getFontSize(context.chart.width),
                            weight: "500",
                        },
                    },
                    legend: {
                        display: true,
                        position: "top",
                        align: "center",
                        labels: {
                            color: "#6b7280",
                            font: {
                                family: "Inter, sans-serif",
                                size: (context) => getFontSize(context.chart.width),
                                weight: "600",
                            },
                            padding: 10,
                            boxWidth: 20,
                            boxHeight: 20,
                            usePointStyle: true,
                            pointStyle: "circle",
                        }
                    },
                },
                layout: {
                    padding: {
                        top: 10,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    },
                },
                elements: {
                    line: {
                        borderWidth: 3,
                    },
                    point: {
                        hoverRadius: (context) => context.chart.width < 600 ? 5 : 8,
                        radius: (context) => context.chart.width < 600 ? 3 : 5,
                        backgroundColor: "#fff",
                        borderWidth: 2,
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
    }, [data, xAxisKey, yAxisKeys]);

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