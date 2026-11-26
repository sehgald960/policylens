import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-reviews-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2>Reviews</h2>`,
})
export class ReviewsPage {}
