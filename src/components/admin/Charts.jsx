import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const months = ['January', 'February', 'March', 'April', 'May', 'June'];

export const BarCharts = ({horizontal,data1,data2,title1,title2,bgColor1,bgColor2,labels=months}) => {
    const options = {
        responsive: true,
        indexAxis : horizontal ? "y" : "x",
        plugins: {
          legend: {
            display : true
          },
          title: {
            display: false
          },
        },
        scales : {
            y : {
               beginAtZero : true,
               grid : {
                display : true,
               }
            },
            x : {
                beginAtZero : true,
                grid : {
                    display : true,
                }
             }
        }
      };
      
      const data = {
        labels,
        datasets: [
          {
            label: title1,
            data: data1,
            backgroundColor: bgColor1,
          },
          {
            label: title2,
            data: data2,
            backgroundColor: bgColor2,
          },
        ],
      };

  return <Bar options={options} data={data} />;

}

export const DoughnutChart=({labels,data,bgColor,offset,legends=true,cutout})=>{
  const nutData = {
    labels,
    datasets : [{
      data,
      backgroundColor : bgColor,
      borderWidth : 0,
      offset
    }]
  };
  const options = {
    responsive : true,
    plugins : {
      legend : {
        display : legends,
        position : "bottom",
        labels : {
          padding : 30
        }
      }
    },
    cutout
  };
  return <Doughnut data={nutData} options={options} />
}

export const PieCharts=({labels,data,bgColor,offset})=>{
  const pieData = {
    labels,
    datasets : [{
      data,
      backgroundColor : bgColor,
      borderWidth : 1,
      offset
    }]
  };
  const options = {
    responsive : true,
    plugins : {
      legend : {
        display : false
      }
    }
  };
  return <Pie data={pieData} options={options} />
}


export const LineCharts = ({data,label,bgColor,borderColor,labels=months}) => {
  const options = {
      responsive: true,
      plugins: {
        legend: {
          display : false
        },
        title: {
          display: false
        },
      },
      scales : {
          y : {
             beginAtZero : true,
             grid : {
              display : false,
             }
          },
          x : {
              beginAtZero : true,
              grid : {
                  display : false,
              }
           }
      }
    };
    
    const lineData = {
      labels,
      datasets: [
        {
          label,
          fill : true,
          data,
          backgroundColor: bgColor,
          borderColor
        }
      ],
    };

return <Line options={options} data={lineData} />;

}