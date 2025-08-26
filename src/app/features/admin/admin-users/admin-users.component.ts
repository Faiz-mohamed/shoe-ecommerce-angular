import { Component, OnInit } from '@angular/core';

interface Order {
  id: string;
  date: string; // ISO or YYYY-MM-DD
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  sku?: string;
}

interface User {
  id: string;
  email: string;
  active: boolean;
  online: boolean;
  createdAt: string;
  orders: Order[];
  // extendable fields: name, role, phone, address...
}

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  // modal state
  ordersModalOpen = false;
  userModalOpen = false;
  selectedUserForOrders: User | null = null;
  selectedUserForDetails: User | null = null;

  // action menu state (shows menu for a particular user id)
  actionMenuOpenFor: string | null = null;

  constructor() {}

  ngOnInit(): void {
    // sample data — replace with real API data
    this.users = [
      {
        id: 'U-1001',
        email: 'john.doe@example.com',
        active: true,
        online: true,
        createdAt: '2024-10-10',
        orders: [
          { id: '#1001', date: '2025-08-20', total: 120.0, status: 'pending', sku: 'RUNSHOE-BLK-42' },
          { id: '#1005', date: '2025-07-12', total: 89.99, status: 'delivered', sku: 'SOCKS-WHT-01' }
        ]
      },
      {
        id: 'U-1002',
        email: 'jane.smith@example.com',
        active: false,
        online: false,
        createdAt: '2025-01-15',
        orders: [
          { id: '#1002', date: '2025-08-21', total: 75.5, status: 'shipped', sku: 'SNEAK-WHT-40' }
        ]
      },
      {
        id: 'U-1003',
        email: 'david.lee@example.com',
        active: true,
        online: false,
        createdAt: '2023-11-03',
        orders: [
          { id: '#1003', date: '2025-08-22', total: 220.99, status: 'delivered', sku: 'BOOT-BRN-44' },
          { id: '#1010', date: '2024-12-01', total: 55.0, status: 'cancelled', sku: 'INSOLE-XL' }
        ]
      }
    ];
  }

  // derived stats
  get totalUsers(): number {
    return this.users.length;
  }
  get onlineUsers(): number {
    return this.users.filter(u => u.online).length;
  }
  get offlineUsers(): number {
    return this.totalUsers - this.onlineUsers;
  }

  // actions
  openOrdersModal(user: User): void {
    this.selectedUserForOrders = user;
    this.ordersModalOpen = true;
  }

  openUserModal(user: User): void {
    this.selectedUserForDetails = user;
    this.userModalOpen = true;
  }

  closeModals(): void {
    this.ordersModalOpen = false;
    this.userModalOpen = false;
    this.selectedUserForOrders = null;
    this.selectedUserForDetails = null;
  }

  toggleSuspend(user: User): void {
    user.active = !user.active;
    // TODO: call backend to persist change
    this.actionMenuOpenFor = null;
  }

  // action menu toggles
  toggleActionMenu(userId: string): void {
    this.actionMenuOpenFor = this.actionMenuOpenFor === userId ? null : userId;
  }

  trackByUserId(_: number, user: User): string {
    return user.id;
  }

  // convenience formatting
  formatCurrency(amount: number): string {
    return '$' + amount.toFixed(2);
  }
}
