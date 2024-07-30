import { Component, OnInit } from '@angular/core';
import { Quote } from './Quote';
import { QuoteService } from './quote.service';
import { LineOfBusiness } from './LineOfBusiness';
import { LineOfBusinessService } from './lineOfBusiness.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Agency Authority - Insurance Coverages Allowed to be Rated';

  quotes: Quote[] = [];
  popular: LineOfBusiness[] = [];

  constructor(private lineOfBusinessService: LineOfBusinessService, private quoteService: QuoteService) { }

  ngOnInit() {
    this.getQuotes();
    this.calcPopular();
  }

  getQuotes(): void {
    this.quoteService.getQuotes()
      .subscribe(recentQuote => this.quotes = recentQuote);
  }

  calcPopular(): void {
    let highest: LineOfBusiness = { id: 0, name: '', description: '', quotes: 0 };
    let secondHighest: LineOfBusiness = { id: 0, name: '', description: '', quotes: 0 };

    this.lineOfBusinessService.getLinesOfBusiness()
      .subscribe(lineOfBusiness => {
        let lines: LineOfBusiness[] = lineOfBusiness;

        lines.forEach(line => {
          line.quotes = this.quotes.filter(q => q.lineOfBusiness == line.id).length;
          if (line.quotes >= highest.quotes) {
            secondHighest = highest;
            highest = line;
          } else if (line.quotes >= secondHighest.quotes) {
            secondHighest = line;
          }
        })

        this.popular = [highest, secondHighest];
      });
    
    this.popular = [highest, secondHighest];
  }


}
