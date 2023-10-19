import { fromEvent, interval, merge, NEVER } from 'rxjs';
import { setCount, startButton, pauseButton } from './utilities';
import { scan, skipUntil, takeUntil } from 'rxjs/dist/types/operators';

const start$ = fromEvent(startButton, 'click');
const pause$ = fromEvent(pauseButton, 'click');

const counter$ = interval(1000).pipe(
  skipUntil(start$),
  scan((total) => total + 1, 0),
  takeUntil(pause$),
);

counter$.subscribe(setCount);
