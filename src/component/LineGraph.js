import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import axios from 'axios'
import numeral from 'numeral'

const options = {
    legend: {
        display: false,
        labels: {
            fontColor: 'black',
        }
    },
    elements: {
        point: {
            radius: 1,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: 'time',
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "l1",
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
}

const buildChartData = (data, casesType = "cases") => {
    let chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
        if (lastDataPoint) {
            const newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint,
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData;
}

function LineGraph({casesType = "cases"}) {

    const [data, setData] = useState({});

    useEffect(() => {
        const getData = async () => {
            await axios.get('https://disease.sh/v3/covid-19/historical/all?lastdays=30').then((res) => {
                let chartData = buildChartData(res.data, casesType);
                setData(chartData);
            });
        };

        getData();
    }, [casesType])

    return (
        <div>
            {data?.length > 0 && (
                <Line
                    options={options}
                    data={{
                    datasets: [
                        {
                            backgroundColor: "rgba(167, 255, 235, 0.5)",
                            borderColor: "#A7FFEB",
                            data: data
                        },
                    ],
                    }}
                />
            )}
        </div>
    )
}


export default LineGraph

