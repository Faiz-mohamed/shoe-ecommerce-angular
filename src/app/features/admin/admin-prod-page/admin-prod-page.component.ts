import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
}

@Component({
  selector: 'app-admin-prod-page',
  templateUrl: './admin-prod-page.component.html',
  styleUrls: ['./admin-prod-page.component.scss']
})
export class AdminProdPageComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProduct: Product = this.emptyProduct();
  isEditMode = false;
  modalOpen = false;

  filterCategoryValue = 'all';
  searchQuery = '';

  // localStorage key (optional persistence)
  private storageKey = 'mock_products_v1';

  ngOnInit(): void {
    this.loadProducts();
    this.applyFilters();
  }

  // initial empty product
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

  // load products from localStorage, fallback to defaults
  private loadProducts() {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        this.products = JSON.parse(raw) as Product[];
      } catch {
        this.products = this.defaultProducts();
      }
    } else {
      this.products = this.defaultProducts();
    }
  }

  // default seed data
  private defaultProducts(): Product[] {
    return [
      {
        id: 1,
        name: 'Nike Air Zoom',
        sku: 'NKA-001',
        category: 'sneakers',
        price: 9999,
        stock: 12,
        image: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000',
        description: 'Short description'
      },
      {
        id: 2,
        name: 'Adidas Runner',
        sku: 'ADR-002',
        category: 'running',
        price: 7999,
        stock: 8,
        image: 'https://plus.unsplash.com/photo-1599009955624-028f5f27e7b9?fm=jpg&q=60&w=3000',
        description: 'Lightweight running shoes'
      }
    ];
  }

  // persist products to localStorage
  private saveProducts() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.products));
  }

  // CRUD / Modal logic
  openAdd() {
    this.selectedProduct = this.emptyProduct();
    this.isEditMode = false;
    this.modalOpen = true;
  }

  openEdit(product: Product) {
    this.selectedProduct = { ...product };
    this.isEditMode = true;
    this.modalOpen = true;
  }

  saveProduct() {
    if (!this.selectedProduct) return;

    if (this.isEditMode && this.selectedProduct.id) {
      const idx = this.products.findIndex(p => p.id === this.selectedProduct.id);
      if (idx > -1) {
        this.products[idx] = { ...this.selectedProduct };
      }
    } else {
      // new product
      const nextId = this.getNextId();
      this.selectedProduct.id = nextId;
      // generate SKU if not provided
      if (!this.selectedProduct.sku) {
        this.selectedProduct.sku = 'SKU-' + String(nextId).padStart(3, '0');
      }
      this.products.push({ ...this.selectedProduct });
    }

    this.saveProducts();
    this.applyFilters();
    this.closeModal();
  }

  // ---------- replaced modal delete flow with SweetAlert2 ----------
  deleteProduct(product: Product) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${product.name}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      customClass: {
      popup: 'custom-swal'   // apply your custom class
      },
      // optional: focus cancel to avoid accidental deletion
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        // perform deletion
        this.products = this.products.filter(p => p.id !== product.id);
        this.saveProducts();
        this.applyFilters();

        // Note: user said they'll use Toastr — if you want to show toastr here, inject it and call it.
        // e.g. this.toastr.success(`${product.name} deleted`, 'Deleted');
      }
    });
  }
  // ----------------------------------------------------------------

  closeModal() {
    this.modalOpen = false;
    // small delay not required; clear selected after closing to reset form
    this.selectedProduct = this.emptyProduct();
    this.isEditMode = false;
  }

  // search & filter
  filterCategory(category: string) {
    this.filterCategoryValue = category;
    this.applyFilters();
  }

  searchProducts(query: string) {
    this.searchQuery = (query || '').toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const categoryMatch = this.filterCategoryValue === 'all' || p.category === this.filterCategoryValue;
      const searchMatch = !this.searchQuery || p.name.toLowerCase().includes(this.searchQuery) || (p.sku && p.sku.toLowerCase().includes(this.searchQuery));
      return categoryMatch && searchMatch;
    });
  }

  // helpers
  getNextId(): number {
    return this.products.length ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
  }

  // summary getters used by template
  get totalProducts(): number {
    return this.products.length;
  }

  get totalCategories(): number {
    return new Set(this.products.map(p => p.category)).size;
  }

  get lowStockCount(): number {
    return this.products.filter(p => p.stock <= 5).length;
  }
}
