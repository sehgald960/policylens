import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-policies-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2>Policies</h2>`,
})
export class PoliciesPage {}
