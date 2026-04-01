import { describe, it, expect } from 'vitest';
import { zhong } from './zhong';
import { runMeasureTests } from './measures.test-helpers';

runMeasureTests('zhong', zhong, { k: 2 });
