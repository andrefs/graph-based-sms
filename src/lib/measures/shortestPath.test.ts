import { describe, it, expect } from 'vitest';
import { shortestPath } from './shortestPath';
import { runMeasureTests, runMeasureTestsDefault } from './measures.test-helpers';

runMeasureTests('shortestPath', shortestPath);
runMeasureTestsDefault('shortestPath', shortestPath);
