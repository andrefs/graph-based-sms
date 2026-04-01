import { describe, it, expect } from 'vitest';
import { pekarStaab } from './pekarStaab';
import { runMeasureTests } from './measures.test-helpers';

runMeasureTests('pekarStaab', pekarStaab);
