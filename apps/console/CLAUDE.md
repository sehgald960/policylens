# Console (Angular 22)

- Standalone components only. No NgModules.
- Zoneless change detection. Do not add zone.js.
- State with signals and NgRx SignalStore. Use RxJS only for streams and HTTP interop.
- Templates use @if, @for and @defer.
- Inject with inject(). Functional guards and interceptors.
- Tests with Vitest. Styles in SCSS.
- Offline writes go through the IndexedDB queue service, never straight to the network.
