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
  id: string;
  fullName?: string;
  email: string;
  phone?: string;
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
  //this.auth.getAllUsers()
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

  /**
   * Load users from the injected Auth/User service if available.
   * - Supports synchronous arrays and Observables (subscribe).
   * - Maps incoming raw user objects to the `User` shape used by this component.
   * - Safely derives fullName from firstName + optional lastName.
   */
  private loadUsers(): void {
    // Defensive: try common method names on the service
    const maybeFn = (this.auth as any).getAllUsers ?? (this.auth as any).getUsers ?? null;

    if (!maybeFn) {
      // service doesn't expose a users getter — use fallback sample list
      return;
    }

    try {
      const maybe = maybeFn.call(this.auth);

      // If it's an Observable (has subscribe), subscribe
      if (maybe && typeof maybe.subscribe === 'function') {
        (maybe as any).subscribe({
          next: (list: any[]) => {
            this.users = (list || []).map((u, idx) => this.mapToComponentUser(u, idx));
          },
          error: (err: any) => {
            console.error('Failed to load users from service (observable):', err);
          }
        });
      } else {
        // Synchronous array expected
        const list = (maybe as any[]) || [];
        this.users = list.map((u, idx) => this.mapToComponentUser(u, idx));
      }
    } catch (err) {
      console.error('Failed to load users from service:', err);
    }
  }

  /**
   * Map any raw user object (from AuthService/UserService) into this component's User interface.
   * Handles variations in property names and optional lastName.
   */
  private mapToComponentUser(raw: any, index: number): User {
    // Raw fields that services often use:
    //  - firstName / lastName  OR name / fullName
    //  - email
    //  - phoneNumber or phone
    //  - createdAt or created
    //  - orders (optional)
    //  - active / online may be missing; default sensible values

    const firstName = raw?.firstName ?? raw?.name ?? null;
    const lastName = raw?.lastName ?? raw?.surname ?? raw?.familyName ?? null;

    const fullNameFromRaw = raw?.fullName ?? raw?.name ?? null;
    // prefer explicit fullName if present, otherwise construct from firstName + optional lastName
    const fullName =
      typeof fullNameFromRaw === 'string' && fullNameFromRaw.trim().length > 0
        ? fullNameFromRaw
        : (firstName ? (firstName + (lastName ? ' ' + lastName : '')) : (raw?.email ?? `User ${index + 1}`));

    // id preference: raw.id, raw.email, or generated stable id using index
    const id = raw?.id ?? (raw?.email ? String(raw.email) : `U-${1000 + index}`);

    const email = raw?.email ?? raw?.username ?? 'no-reply@example.com';
    const phone = raw?.phone ?? raw?.phoneNumber ?? raw?.contact ?? '';

    const createdAt = raw?.createdAt ?? raw?.created ?? new Date().toISOString().slice(0, 10);

    const orders: Order[] = Array.isArray(raw?.orders)
      ? raw.orders.map((o: any) => ({
          id: o?.id ?? o?.orderId ?? '#0',
          date: o?.date ?? o?.createdAt ?? new Date().toISOString().slice(0,10),
          total: Number(o?.total ?? o?.amount ?? 0),
          status: o?.status ?? 'pending',
          sku: o?.sku
        }))
      : [];

    const active = typeof raw?.active === 'boolean' ? raw.active : true;
    const online = typeof raw?.online === 'boolean' ? raw.online : false;

    return {
      id: String(id),
      fullName: fullName,
      email: String(email),
      phone: phone || undefined,
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
    // TODO: call backend or service to persist this change if needed
  }

  trackByUserId(_: number, user: User): string {
    return user.id;
  }

  // convenience formatting
  formatCurrency(amount: number): string {
    return '$' + amount.toFixed(2);
  }

  /**
   * Optional helper if your template prefers a method instead of reading user.fullName
   * Usage in template: {{ getFullName(user) }}
   */
  getFullName(u: any): string {
    if (!u) return '';
    if (typeof u.fullName === 'string' && u.fullName.trim().length) return u.fullName;
    const first = u.firstName ?? u.name ?? '';
    const last = u.lastName ?? '';
    return (first + (last ? ' ' + last : '')).trim() || u.email || '';
  }
}
