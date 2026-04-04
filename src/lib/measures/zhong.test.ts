import { describe, it, expect } from 'vitest';
import { zhong } from './zhong';
import { runMeasureTests, runMeasureTestsDefault } from './measures.test-helpers';

runMeasureTests('zhong', zhong, { kZhong: 2 });
runMeasureTestsDefault('zhong', zhong, { kZhong: 2 });
