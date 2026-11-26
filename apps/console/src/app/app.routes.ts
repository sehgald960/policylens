import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'policies' },
  {
    path: 'policies',
    loadComponent: () =>
      import('./policies/policies-page').then((m) => m.PoliciesPage),
  },
  {
    path: 'reviews',
    loadComponent: () =>
      import('./reviews/reviews-page').then((m) => m.ReviewsPage),
  },
];
