import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../../products'

@Component({
  selector: 'product-holder',
  templateUrl: './product-holder.component.html',
  styleUrls: ['./product-holder.component.css']
})
export class ProductHolderComponent implements OnInit {

  @Input('init')
  product: Product = null

  constructor() {
  }

  ngOnInit(): void {
  }

}
