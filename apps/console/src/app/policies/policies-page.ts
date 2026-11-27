import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PoliciesService } from './policies.service';

@Component({
  selector: 'app-policies-page',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './policies-page.html',
  styleUrl: './policies-page.scss',
})
export class PoliciesPage {
  protected readonly policies = inject(PoliciesService).listPolicies;
}
