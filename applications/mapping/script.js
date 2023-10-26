import { interval, fromEvent, mergeMap } from 'rxjs/operators';
import { of, from } from 'rxjs';

import {
  getCharacter,
  render,
  startButton,
  pauseButton,
  setStatus,
} from './utilities';

const character$ = of(1, 2, 3, 4).pipe(mergeMap((n) => from(getCharacter(n))));

character$.subscribe(render);
