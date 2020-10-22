import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

  products = []

  currentPage: number = 0

  constructor(private http: HttpClient) {
    this.http.get('./assets/products.json').subscribe(data => {
      const jsonVal = JSON.stringify(data)
      const toJson = JSON.parse(jsonVal)
      this.products = toJson.content
    })
  }

  ngOnInit(): void {
  }

  onChange(e) {
    console.log(this.products[264])
  }

  nextPage() {

  }

  prevPage() {

  }

}
