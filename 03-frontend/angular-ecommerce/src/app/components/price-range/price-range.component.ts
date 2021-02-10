import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-price-range',
  templateUrl: './price-range.component.html',
  styleUrls: ['./price-range.component.css']
})
export class PriceRangeComponent implements OnInit {

  minPrice: number;
  maxPrice: number;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  rangePrice( value: number){
    console.log(`value=${value}`);
    this.router.navigateByUrl(`/price-range/${value}`);
  }

}
