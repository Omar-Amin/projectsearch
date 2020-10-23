import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { debounceTime, exhaustMap, distinctUntilChanged, combineAll } from 'rxjs/operators'
import { Product } from '../../../../products'

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})

export class ProductSearchComponent implements OnInit {

  products = null
  filtered = []

  titleNum: number = 0
  barcodeNum: number = 0
  priceNum: number = 0

  currentSearch: string = ""

  currentPage: number = 0
  productsAmount: number = 10

  searchSubject = new Subject<string>()

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      exhaustMap(() => {
        if (!this.products) {
          return this.getProducts()
        }
        return this.searchSubject
      })
    ).subscribe(val => {
      if (!this.products) {
        this.products = val['content']
        this.filtered = this.products.filter(e => this.containsProduct(this.currentSearch, e))
      } else {
        this.filtered = this.products.filter(e => this.containsProduct(val, e))
      }
      this.priceNum = 0
      this.titleNum = 0
      this.barcodeNum = 0
    })
  }

  onChange(e: any): void {
    const val = e.target.value
    this.currentSearch = val
    this.searchSubject.next(val)

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

  containsProduct(searchVal, product: Product): boolean {
    const val = searchVal.toLowerCase().split(" ")
    const title = product.title.toLowerCase()

    var contains = true

    val.forEach(e => {
      if (!title.includes(e)) {
        contains = false
      }
    })

    return contains
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('./assets/products.json')
  }

  // Sorts depending on the attribute that is pressed on.
  // Type 1 = sort by title, type 2 = sort by price and 3 = sort by barcode
  sortSearch(type) {
    if (type == 1) {

      this.priceNum = 0
      this.barcodeNum = 0

      if (this.titleNum == 0) {
        this.filtered.sort((a: Product, b: Product) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
      } else if (this.titleNum == 1) {
        this.filtered.sort((b: Product, a: Product) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
      } else {
        this.filtered = this.products.filter(e => this.containsProduct(this.currentSearch, e))
        this.titleNum = 0
        return
      }
      this.titleNum++

    } else if (type == 2) {

      this.barcodeNum = 0
      this.titleNum = 0

      if (this.priceNum == 0) {
        this.filtered.sort((a: Product, b: Product) => a.price - b.price)
      } else if (this.priceNum == 1) {
        this.filtered.sort((b: Product, a: Product) => a.price - b.price)
      } else {
        this.filtered = this.products.filter(e => this.containsProduct(this.currentSearch, e))
        this.priceNum = 0
        return
      }
      this.priceNum++
    } else {

      this.priceNum = 0
      this.titleNum = 0

      if (this.barcodeNum == 0) {
        this.filtered.sort((a: Product, b: Product) => a.barcode.localeCompare(b.barcode))
      } else if (this.barcodeNum == 1) {
        this.filtered.sort((b: Product, a: Product) => a.barcode.localeCompare(b.barcode))
      } else {
        this.filtered = this.products.filter(e => this.containsProduct(this.currentSearch, e))
        this.barcodeNum = 0
        return
      }
      this.barcodeNum++
    }
  }

}
