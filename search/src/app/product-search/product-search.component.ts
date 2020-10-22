import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { Product } from '../../../../products'

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})

export class ProductSearchComponent implements OnInit {

  products = []
  filtered = []

  currentPage: number = 0
  productsAmount: number = 10

  searchSubject = new Subject<string>()

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(val => {
      if (this.products.length === 0) {
        this.getProducts()
      }
      this.filtered = this.products.filter(e => this.containsProduct(val, e))
    })
  }

  onChange(e): void {
    this.searchSubject.next(e.target.value)
  }

  nextPage(): void {
    this.endOfPage() ? null : this.currentPage++
  }

  prevPage(): void {
    this.currentPage === 0 ? null : this.currentPage--
  }

  // Checks if we are at the end of the page
  // Returns a boolean
  endOfPage(): boolean {
    return (this.currentPage + 1) * this.productsAmount >= this.filtered.length
  }

  containsProduct(searchVal: string, product: Product): boolean {
    const val = searchVal.toLowerCase()
    const title = product.title.toLowerCase()

    if (title.includes(val)) {
      return true
    }

    return false
  }

  getProducts(): void {
    this.http.get<Product[]>('./assets/products.json').subscribe(data => {
      this.products = data['content']
      this.filtered = this.products
    })
  }

}
