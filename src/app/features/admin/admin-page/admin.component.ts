// admin-dashboard.component.ts
import { Component } from '@angular/core';
// import { Chart, registerables } from 'chart.js';

// Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminPageComponent {}

// export class AdminPageComponent implements AfterViewInit {

//   ngAfterViewInit(): void {
//     this.createDonutChart();
//     this.createLineChart();
//     this.createBarChart();
//   }

//   private createDonutChart(): void {
//     const ctx = document.getElementById('donutChart') as HTMLCanvasElement;
//     new Chart(ctx, {
//       type: 'doughnut',
//       data: {
//         labels: ['Men', 'Women', 'Kids', 'Sports'],
//         datasets: [{
//           data: [300, 150, 100, 50],
//           backgroundColor: ['#f39c12', '#FFFFFF', '#C0C0C0', '#808080'],
//           borderWidth: 1,
//           borderColor: '#000000'
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             position: 'right',
//             labels: {
//               color: '#FFFFFF'
//             }
//           },
//           title: {
//             display: true,
//             text: 'Product Categories Distribution',
//             color: '#FFFFFF',
//             font: {
//               size: 16
//             }
//           }
//         }
//       }
//     });
//   }

//   private createLineChart(): void {
//     const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
//     new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec'],
//         datasets: [{
//           label: 'Sales Over Time',
//           data: [65, 59, 80, 81, 56, 64 , 65, 70, 80, 81, 61, 59],
//           borderColor: '#f39c12',
//           backgroundColor: 'rgba(255, 215, 0, 0.2)',
//           fill: true,
//           tension: 0.4
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//           x: {
//             ticks: { color: '#FFFFFF' },
//             grid: { color: '#333333' }
//           },
//           y: {
//             ticks: { color: '#FFFFFF' },
//             grid: { color: '#333333' }
//           }
//         },
//         plugins: {
//           legend: {
//             labels: { color: '#FFFFFF' }
//           },
//           title: {
//             display: true,
//             text: 'Monthly Sales Trend',
//             color: '#FFFFFF',
//             font: { size: 16 }
//           }
//         }
//       }
//     });
//   }

//   private createBarChart(): void {
//     const ctx = document.getElementById('barChart') as HTMLCanvasElement;
//     new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: ['Q1', 'Q2', 'Q3', 'Q4'],
//         datasets: [{
//           label: 'Orders by Quarter',
//           data: [120, 190, 150, 200],
//           backgroundColor: '#f39c12',
//           borderColor: '#FFFFFF',
//           borderWidth: 1,
//           barPercentage: 0.4,
//           categoryPercentage: 0.7
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//           x: {
//             ticks: { color: '#FFFFFF' },
//             grid: { color: '#333333' }
//           },
//           y: {
//             ticks: { color: '#FFFFFF' },
//             grid: { color: '#333333' }
//           }
//         },
//         plugins: {
//           legend: {
//             labels: { color: '#FFFFFF' }
//           },
//           title: {
//             display: true,
//             text: 'Quarterly Orders',
//             color: '#FFFFFF',
//             font: { size: 16 }
//           }
//         }
//       }
//     });
//   }
// }