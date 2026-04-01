import { describe, it, expect } from 'vitest';
import { hirstStOnge } from './hirstStOnge';
import { runMeasureTests } from './measures.test-helpers';

runMeasureTests('hirstStOnge', hirstStOnge, { C: 8, k: 1, maxLength: 5 });
