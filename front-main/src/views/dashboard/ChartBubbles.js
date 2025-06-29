/* eslint-disable no-underscore-dangle,no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useSelector } from 'react-redux';

const ChartBubble = () => {
    const { themeValues } = useSelector((state) => state.settings);
    const chartContainer = useRef(null);

    const LegendLabels = React.useMemo(() => {
        return {
            font: {
                size: 14,
                family: themeValues.font,
            },
            padding: 20,
            usePointStyle: true,
            boxWidth: 10,
        };
    }, [themeValues]);
    const ChartTooltip = React.useMemo(() => {
        return {
            enabled: true,
            position: 'nearest',
            backgroundColor: themeValues.foreground,
            titleColor: themeValues.primary,
            titleFont: themeValues.font,
            bodyColor: themeValues.body,
            bodyFont: themeValues.font,
            bodySpacing: 10,
            padding: 15,
            borderColor: themeValues.separator,
            borderWidth: .5,
            cornerRadius: parseInt(themeValues.borderRadiusMd, 10),
            displayColors: false,
            intersect: false,
            mode: 'point',
        };
    }, [themeValues]);

    const data = React.useMemo(() => {
        return {
            labels: '',
            datasets: [
                {
                    label: ['SMS'],
                    backgroundColor: `rgba(${themeValues.primaryrgb},0.1)`,
                    borderColor: themeValues.primary,
                    data: [
                        {
                            x: 50,
                            y: 15,
                            r: 15,
                        },
                    ],
                },
                {
                    label: ['Telefone (operador)'],
                    backgroundColor: `rgba(${themeValues.quaternaryrgb},0.1)`,
                    borderColor: themeValues.quaternary,
                    data: [
                        {
                            x: 54,
                            y: 70,
                            r: 35,
                        },
                    ],
                },
                {
                    label: ['WhatsApp'],
                    backgroundColor: `rgba(${themeValues.tertiaryrgb},0.1)`,
                    borderColor: themeValues.tertiary,
                    data: [
                        {
                            x: 30,
                            y: 68,
                            r: 20,
                        },
                    ],
                },
                {
                    label: ['Landing page'],
                    backgroundColor: `rgba(121, 29, 182, 0.1)`,
                    borderColor: `rgba(121, 29, 182, 0.5)`,
                    data: [
                        {
                            x: 38,
                            y: 20,
                            r: 15,
                        },
                    ],
                },
            ],
        };
    }, [themeValues]);
    const config = React.useMemo(() => {
        return {
            type: 'bubble',
            options: {
                elements: {
                    point: {
                        borderWidth: 2,
                    },
                },
                plugins: {
                    crosshair: false,
                    datalabels: false,
                    legend: {
                        position: 'bottom',
                        labels: LegendLabels,
                    },
                    tooltip: ChartTooltip,
                    streaming: false,
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        min: 18,
                        max: 120,
                        title: {
                            display: true,
                            text: 'Idade',
                        },
                        grid: { drawBorder: false },
                        ticks: { beginAtZero: true, stepSize: 20, padding: 8 },
                    },

                    x: {
                        min: 10,
                        max: 60,
                        title: {
                            display: true,
                            text: 'Renda',
                        },
                        grid: { drawBorder: false },
                        ticks: { stepSize: 20, padding: 8 },
                    },
                },
            },
            data,
        };
    }, [data, LegendLabels, ChartTooltip]);

    useEffect(() => {
        let myChart = null;
        if (chartContainer && chartContainer.current) {
            Chart.register(...registerables);
            myChart = new Chart(chartContainer.current, config);
        }
        return () => {
            if (myChart) {
                myChart.destroy();
            }
        };
    }, [config]);

    return <canvas ref={chartContainer} />;
};

export default React.memo(ChartBubble);
