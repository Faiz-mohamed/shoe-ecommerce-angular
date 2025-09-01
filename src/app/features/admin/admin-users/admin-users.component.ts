import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

interface Order {
  id: string;
  date: string; // ISO or YYYY-MM-DD
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  sku?: string;
}

interface User {
  id?: string;
  firstName: string;
  lastName?: string;
  fullName?: string;     // derived field for template convenience
  email: string;
  phone?: string;        // mapped from phoneNumber if present
  phoneNumber?: string;  // keep original field if present on raw object
  active: boolean;
  online: boolean;
  createdAt: string;
  orders: Order[];
  // extendable fields: role, address, etc.
}

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  auth: AuthService = inject(AuthService);
  users: User[] = [];
  // modal state
  ordersModalOpen = false;
  userModalOpen = false;
  selectedUserForOrders: User | null = null;
  selectedUserForDetails: User | null = null;

  constructor() {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    const svc = this.auth as any;

    let source: any = this.auth.getAllUsers();

      const arr = Array.isArray(source) ? source : [];
      this.users = arr.map((u, i) => this.mapToComponentUser(u, i));
  }


  private mapToComponentUser(raw: any, index: number): User {
    const firstName = raw?.firstName ?? (typeof raw?.name === 'string' ? raw.name.split(' ')[0] : '');
    const lastNameRaw = raw?.lastName ?? (typeof raw?.name === 'string' ? raw.name.split(' ').slice(1).join(' ') : undefined);
    const explicitFull = raw?.fullName ?? raw?.displayName ?? raw?.name ?? undefined;

    const fullName =
      typeof explicitFull === 'string' && explicitFull.trim().length
        ? explicitFull.trim()
        : (firstName ? (firstName + (lastNameRaw ? ' ' + lastNameRaw : '')) : undefined);

    // Prefer provided id; otherwise generate a stable-looking id based on index.
    const id = raw?.id ?? `U-${1000 + index}`;

    const email = raw?.email ?? '';
    const phone = raw?.phoneNumber ?? raw?.phone ?? undefined;
    const createdAt = raw?.createdAt ?? raw?.created ?? '';

    const orders: Order[] = Array.isArray(raw?.orders)
      ? raw.orders.map((o: any) => ({
          id: o?.id ?? o?.orderId ?? '#0',
          date: o?.date ?? o?.createdAt ?? '',
          total: Number(o?.total ?? o?.amount ?? 0),
          status: o?.status ?? 'pending',
          sku: o?.sku
        }))
      : []; // per your instruction, orders default to empty array when missing

    const active = typeof raw?.active === 'boolean' ? raw.active : true;
    const online = typeof raw?.online === 'boolean' ? raw.online : false;

    return {
      id: String(id),
      firstName: String(firstName ?? ''),
      lastName: lastNameRaw ?? undefined,
      fullName: fullName ?? undefined,
      email: String(email),
      phone: phone ?? undefined,
      phoneNumber: raw?.phoneNumber ?? undefined,
      active,
      online,
      createdAt,
      orders
    };
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
    // If user details modal is open, close it to ensure orders modal is visible on top.
    this.userModalOpen = false;
    this.selectedUserForDetails = null;

    this.selectedUserForOrders = user;
    this.ordersModalOpen = true;
  }

  // helper that opens orders from inside the details modal
  openOrdersModalFromDetails(): void {
    if (!this.selectedUserForDetails) return;
    this.openOrdersModal(this.selectedUserForDetails);
  }

  openUserModal(user: User): void {
    // If orders modal is open, close it so details modal appears correctly.
    this.ordersModalOpen = false;
    this.selectedUserForOrders = null;

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
    // TODO: call backend or AuthService to persist this change if needed
  }

  trackByUserId(index: number, user: User): string {
    // ensure unique stable id for ngFor even if user.id is missing
    return user.id ?? `U-${1000 + index}`;
  }

  // convenience formatting
  formatCurrency(amount: number): string {
    return '$' + amount.toFixed(2);
  }

  /**
   * Optional helper if your template prefers a method instead of reading user.fullName
   * Usage in template: {{ getFullName(user) }}
  //  */
  // getFullName(u: any): string {
  //   if (!u) return '';
  //   if (typeof u.fullName === 'string' && u.fullName.trim().length) return u.fullName;
  //   const first = u.firstName ?? u.name ?? '';
  //   const last = u.lastName ?? '';
  //   return (first + (last ? ' ' + last : '')).trim() || u.email || '';
  // }
}
