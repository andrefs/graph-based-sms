import { describe, it, expect } from 'vitest';
import { shortestPath } from './shortestPath';
import { runMeasureTests, MAX_DEPTH } from './measures.test-helpers';

runMeasureTests('shortestPath (Rada Distance)', shortestPath);
