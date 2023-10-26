import { fromEvent, of, timer, merge, NEVER } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  catchError,
  exhaustMap,
  mapTo,
  mergeMap,
  retry,
  startWith,
  switchMap,
  tap,
  pluck,
} from 'rxjs/operators';

import {
  fetchButton,
  stopButton,
  clearError,
  clearFacts,
  addFacts,
  setError,
} from './utilities';

const endpoint =
  'http://localhost:3333/api/facts?delay=2000&chaos=true&flakiness=2';

const fetchData = () => {
  return fromFetch(endpoint).pipe(
    tap(clearError),
    mergeMap((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    }),
    retry(4),
    catchError((error) => {
      console.warn(error);
      return of({ error: error.message });
    }),
  );
};

const fetch$ = fromEvent(fetchButton, 'click').pipe(mapTo(true));
const stop$ = fromEvent(stopButton, 'click').pipe(mapTo(false));

const factStream$ = merge(fetch$, stop$).pipe(
  switchMap((shouldFetch) => {
    if (shouldFetch) {
      return timer(0, 5000).pipe(
        tap(() => clearError()),
        tap(() => clearFacts()),
        exhaustMap(fetchData),
      );
    } else {
      return NEVER;
    }
  }),
);

fetch$.subscribe(addFacts);
