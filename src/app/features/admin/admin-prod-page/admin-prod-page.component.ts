import { Component, inject, computed, signal } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductService } from 'src/app/core/services/product.service';
import Swal from 'sweetalert2';

interface Product {
  id: number;
  name: string;
  sku?: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  brand?:string;
}

@Component({
  selector: 'app-admin-prod-page',
  templateUrl: './admin-prod-page.component.html',
  styleUrls: ['./admin-prod-page.component.scss']
})
export class AdminProdPageComponent {

  liveSearch! :string;

  prodService: ProductService = inject(ProductService);

  // Template-friendly mutable state (ngModel, template checks)
  products: Product[] = [];
  filteredProductsArray: Product[] = []; // not strictly required, but kept for safety
  selectedProduct: Product = this.emptyProduct();
  isEditMode = false;
  modalOpen = false;

  // Signals for reactive filters (internal)
  private filterCategoryValue = signal<string>('all');
  private searchQuery = signal<string>('');

  // computed signal that delegates to your service's filter method
  private filteredProductsSignal = computed(() =>
    this.prodService.filterProductByCategorySearch(this.filterCategoryValue(), this.searchQuery())
  );

  // Expose getter so template can use `filteredProducts` as before (no parentheses)
  get filteredProducts(): Product[] {
    // return copy to be safe for template usage
    return this.filteredProductsSignal().map(p => ({ ...p }));
  }

  // Keep old-style getters expected by template (names unchanged)
  get totalProducts(): number {
    return this.prodService.getProducts().length;
  }

  get totalCategories(): number {
    // return new Set(this.prodService.getProducts().map(p => p.category)).size;
    return 4
  }

  get lowStockCount(): number {
    return this.prodService.getProducts().filter(p => p.stock <= 5).length;
  }

  // ---------- utilities ----------
  emptyProduct(): Product {
    return {
      id: 0,
      name: '',
      sku: '',
      category: '',
      price: 0,
      stock: 0,
      image: '',
      description: ''
    };
  }

  // load initial products into local 'products' array (optional; template uses filteredProducts getter)
  ngOnInit(): void {
    // Ensure service products are loaded (service getProducts refreshes from localStorage)
    this.products = this.prodService.getProducts().map(p => ({ ...p }));
    // Keep filteredProductsArray in sync (not required because template uses getter)
    this.filteredProductsArray = this.filteredProducts;
  }

  // ---------- modal / CRUD handlers ----------
  openAdd(): void {
    this.selectedProduct = this.emptyProduct();
    this.isEditMode = false;
    this.modalOpen = true;
  }

  openEdit(product: Product): void {
    this.selectedProduct = { ...product }; // clone so edits don't mutate the list until save
    this.isEditMode = true;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedProduct = this.emptyProduct();
    this.isEditMode = false;
  }

  saveProduct(): void {
    const prod = this.selectedProduct;
    if (!prod) return;

    if (this.isEditMode) {
      // update via service (service persists and checks admin)
      this.prodService.updateProduct(prod);
    } else {
      // create new id using current products from service
      const all = this.prodService.getProducts();
      const nextId = all.length ? Math.max(...all.map(p => p.id)) + 1 : 1;
      prod.id = nextId;

      if (!prod.sku) {
        prod.sku = 'SKU-' + String(nextId).padStart(3, '0');
      }

      this.prodService.addProduct({ ...prod });
    }

    // refresh local arrays / computed will pick it up automatically
    this.products = this.prodService.getProducts().map(p => ({ ...p }));
    this.filteredProductsArray = this.filteredProducts;
    this.closeModal();
    this.searchQuery.set(('').toLowerCase());
    this.liveSearch = ''
  }

  deleteProduct(product: Product): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${product.name}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      customClass: { popup: 'custom-swal' },
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.prodService.deleteProduct(product.id);
        // refresh local arrays; computed will reflect service changes
        this.products = this.prodService.getProducts().map(p => ({ ...p }));
        this.filteredProductsArray = this.filteredProducts;
        this.searchQuery.set(('').toLowerCase());
        this.liveSearch = ''
      }
    });
  }

  // ---------- filters (update signals) ----------
  filterCategory(category: string): void {
    this.filterCategoryValue.set(category);
    // optional quick local update
    this.filteredProductsArray = this.filteredProducts;
  }

  searchProducts(query: string): void {
    this.liveSearch = query;
    this.searchQuery.set((query || '').toLowerCase());
    this.filteredProductsArray = this.filteredProducts;
  }

  // template helper kept for compatibility (if template uses this)
  getProductsForTemplate(): Product[] {
    return this.filteredProducts;
  }
}
