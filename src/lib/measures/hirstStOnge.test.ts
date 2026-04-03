import { hirstStOnge } from './hirstStOnge';
import { runMeasureTests } from './measures.test-helpers';

runMeasureTests('hirstStOnge', hirstStOnge, { C: 8, directionWeight: 1, maxLength: 5 });
