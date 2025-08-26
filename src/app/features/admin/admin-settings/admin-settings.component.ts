import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

type PaymentMethod = { id: string; label: string; enabled: boolean };

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit, OnDestroy {
  settingsForm!: FormGroup;

  // previews for uploaded images
  logoPreview: string | null = null;
  faviconPreview: string | null = null;

  // sample integrations & payment methods
  paymentMethods: PaymentMethod[] = [
    { id: 'cod', label: 'Cash on Delivery (COD)', enabled: true },
    { id: 'card', label: 'Card Payments', enabled: true },
    { id: 'upi', label: 'UPI', enabled: false },
    { id: 'paypal', label: 'PayPal', enabled: false }
  ];

  private objectUrls: string[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // initial form values — replace with values from API
    this.settingsForm = this.fb.group({
      // Store
      storeName: ['Shoe Studio', Validators.required],
      contactEmail: ['support@shoestudio.example', [Validators.required, Validators.email]],
      contactPhone: ['+91 99999 99999'],

      // Appearance
      darkMode: [true],
      accentColor: ['#f39c12'],

      // Orders & Payments
      defaultCurrency: ['USD', Validators.required],
      autoCancelHours: [48, [Validators.min(0)]],
      paymentMethods: this.fb.control(this.paymentMethods.map(p => p.enabled)),

      // Security
      allowSignups: [true],
      sessionTimeoutMins: [60, [Validators.min(1)]],
      maintenanceMode: [false],

      // Notifications
      notifyNewOrder: [true],
      notifyNewUser: [false],

      // Integrations (simple toggles)
      analyticsId: [''],
      shippingProvider: [''],

      // Backup / misc
      backupScheduleDays: [7, [Validators.min(1)]]
    });
  }

  // handle image files
  onFileChange(ev: Event, target: 'logo' | 'favicon'): void {
    const input = ev.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;
    const file = input.files[0];

    // create preview url
    const url = URL.createObjectURL(file);
    this.objectUrls.push(url);

    if (target === 'logo') {
      this.logoPreview = url;
      // TODO: attach file to FormData for uploading
    } else {
      this.faviconPreview = url;
    }
  }

  // toggle individual payment method
  togglePaymentMethod(index: number): void {
    const arr: boolean[] = this.settingsForm.get('paymentMethods')?.value || [];
    arr[index] = !arr[index];
    this.settingsForm.get('paymentMethods')?.setValue([...arr]);
  }

  // Save action (replace with actual API call)
  saveSettings(): void {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    // Prepare payload
    const payload = {
      ...this.settingsForm.value,
      paymentMethods: this.paymentMethods.map((p, i) => ({ ...p, enabled: this.settingsForm.value.paymentMethods[i] }))
      // include any uploaded files via FormData in a real app
    };

    console.log('Saving settings payload:', payload);
    // TODO: call service to persist settings
    // show toast / snackbar on success
    alert('Settings saved (demo). Check console for payload.');
  }

  resetToDefaults(): void {
    if (!confirm('Reset settings to default values?')) return;

    // simple default reset (you can replace with server defaults)
    this.settingsForm.reset({
      storeName: 'Shoe Studio',
      contactEmail: 'support@shoestudio.example',
      contactPhone: '+91 99999 99999',
      darkMode: true,
      accentColor: '#f39c12',
      defaultCurrency: 'USD',
      autoCancelHours: 48,
      paymentMethods: this.paymentMethods.map(p => p.enabled),
      allowSignups: true,
      sessionTimeoutMins: 60,
      maintenanceMode: false,
      notifyNewOrder: true,
      notifyNewUser: false,
      analyticsId: '',
      shippingProvider: '',
      backupScheduleDays: 7
    });

    // reset previews
    this.logoPreview = null;
    this.faviconPreview = null;
  }

  // small helper for toggle UI
  toggleControl(controlName: string): void {
    const ctrl = this.settingsForm.get(controlName);
    if (!ctrl) return;
    ctrl.setValue(!ctrl.value);
  }

  ngOnDestroy(): void {
    // revoke object URLs
    this.objectUrls.forEach(u => URL.revokeObjectURL(u));
  }
}
