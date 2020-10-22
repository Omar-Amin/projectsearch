import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductHolderComponent } from './product-holder.component';

describe('ProductHolderComponent', () => {
  let component: ProductHolderComponent;
  let fixture: ComponentFixture<ProductHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductHolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
