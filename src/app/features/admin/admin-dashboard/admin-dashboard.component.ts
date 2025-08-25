// src/app/admin/admin-dashboard/admin-dashboard.component.ts
import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';

// register Chart.js components once
Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('donutCanvas', { static: false }) donutCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineCanvas', { static: false }) lineCanvas!: ElementRef<HTMLCanvasElement>;

  private donutChart?: Chart;
  private lineChart?: Chart;

  // sample data (you can replace these with data from your service)
  totalProducts = 24;
  totalOrders = 128;
  totalUsers = 46;
  lowStock = 3;

  // donut data (categories)
  categories = ['Sneakers', 'Running', 'Casual', 'Other'];
  categoryCounts = [12, 6, 4, 2];

  // line data (monthly sales)
  months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  monthlySales = [42000, 52000, 48000, 61000, 70000, 64000]; // numbers in paise/INR units assumed

  constructor() {}

  ngAfterViewInit(): void {
    this.createDonutChart();
    this.createLineChart();
  }

  ngOnDestroy(): void {
    this.donutChart?.destroy();
    this.lineChart?.destroy();
  }

  private createDonutChart() {
    const ctx = this.donutCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.categories,
        datasets: [
          {
            data: this.categoryCounts,
            borderWidth: 0,
            backgroundColor: [
              'rgba(202,164,76,0.95)', // gold
              'rgba(46,196,182,0.95)', // teal
              'rgba(255,170,0,0.95)',  // amber
              'rgba(255,255,255,0.12)' // light
            ],
            hoverOffset: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#bfc6cc',
              boxWidth: 12,
              padding: 12,
            }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.label ?? '';
                const value = context.raw ?? 0;
                return `${label}: ${value}`;
              }
            }
          }
        }
      }
    });
  }

  private createLineChart() {
    const ctx = this.lineCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, 'rgba(202,164,76,0.28)');
    gradient.addColorStop(1, 'rgba(202,164,76,0.02)');

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.months,
        datasets: [
          {
            label: 'Revenue (₹)',
            data: this.monthlySales,
            tension: 0.28,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderColor: 'rgba(202,164,76,0.98)',
            backgroundColor: gradient,
            fill: true,
            pointBackgroundColor: '#0b0c0d'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          x: {
            ticks: { color: '#bfc6cc' },
            grid: { color: 'transparent' }
          },
          y: {
            ticks: {
              color: '#bfc6cc',
              callback: (value: any) => {
                // format to rupees with thousands separator
                const num = Number(value);
                return '₹ ' + num.toLocaleString('en-IN');
              }
            },
            grid: {
              color: 'rgba(255,255,255,0.02)'
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const val = context.raw ?? 0;
                return `₹ ${Number(val).toLocaleString('en-IN')}`;
              }
            }
          }
        }
      }
    });
  }

  // helper methods to update charts (call after changing data)
  updateCategoryCounts(counts: number[]) {
    this.categoryCounts = counts;
    if (this.donutChart) {
      this.donutChart.data.datasets![0].data = counts as any;
      this.donutChart.update();
    }
  }

  updateMonthlySales(sales: number[], labels?: string[]) {
    this.monthlySales = sales;
    if (labels) this.months = labels;
    if (this.lineChart) {
      this.lineChart.data.labels = this.months as any;
      this.lineChart.data.datasets![0].data = sales as any;
      this.lineChart.update();
    }
  }
}
