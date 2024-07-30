import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Quote } from '../Quote'
import { QuoteService } from '../quote.service';
import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';

@Component({
  selector: 'app-lineOfBusiness-detail',
  templateUrl: './lineOfBusiness-detail.component.html',
  styleUrls: [ './lineOfBusiness-detail.component.css' ]
})
export class LineOfBusinessDetailComponent implements OnInit {
  lineOfBusiness: LineOfBusiness | undefined;

  constructor(
    private route: ActivatedRoute,
    private lineOfBusinessService: LineOfBusinessService,
    private location: Location,
    private quoteService: QuoteService
  ) {}

  ngOnInit(): void {
    this.getLineOfBusiness();
  }

  getLineOfBusiness(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.lineOfBusinessService.getLineOfBusiness(id)
      .subscribe(lineOfBusiness => {
        let quote: Quote[] = [];
        this.quoteService.getQuotesByLineOfBusiness(id)
          .subscribe( quotes => lineOfBusiness.quotes = quotes.length);
        this.lineOfBusiness = lineOfBusiness;
      } );
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.lineOfBusiness) {
      this.lineOfBusinessService.updateLineOfBusiness(this.lineOfBusiness)
        .subscribe(() => this.goBack());
    }
  }
}
