import { describe, it, expect } from 'vitest';
import { simTBK, computeLambda } from './simTBK';
import { createSlimaniExample1, createSlimaniExample2, createTaxonomy, runMeasureTests } from './measures.test-helpers';

runMeasureTests('simTBK', simTBK);

// extracted from Slimani et al. 2003
describe('simTBK with SlimaniExample1', () => {
  it('returns expected value for c1 and c2 (same hierarchy, lambda=0)', () => {
    const g = createSlimaniExample1();
    expect(simTBK(g, 'c1', 'c2')).toBeCloseTo(0.4, 2);
  });

  it('returns expected value for c2 and c3 (neighborhood, lambda=1)', () => {
    const g = createSlimaniExample1();
    expect(simTBK(g, 'c2', 'c3')).toBeCloseTo(0.29, 2);
  });
});

// extracted from Slimani et al. 2003 - larger hierarchy
describe('simTBK with SlimaniExample2', () => {
  const g = createSlimaniExample2();

  it('returns 2/3 for Person and ResearchAssistant', () => {
    expect(simTBK(g, 'Person', 'ResearchAssistant')).toBeCloseTo(2 / 3, 4);
  });

  it('returns 0.8 for VisitingProfessor and FullProfessor', () => {
    expect(simTBK(g, 'VisitingProfessor', 'FullProfessor')).toBeCloseTo(0.8, 4);
  });

  it('returns 2/9 for VisitingProfessor and SystemsStaff', () => {
    expect(simTBK(g, 'VisitingProfessor', 'SystemsStaff')).toBeCloseTo(2 / 9, 4);
  });

  it('returns 0.2 for ResearchAssistant and Faculty', () => {
    expect(simTBK(g, 'ResearchAssistant', 'Faculty')).toBeCloseTo(0.2, 4);
  });

  it('returns 1/6 for Chair and AdministrativeStaff', () => {
    expect(simTBK(g, 'Chair', 'AdministrativeStaff')).toBeCloseTo(1 / 6, 4);
  });

  it('returns 0.2 for Research and GraduateCourse', () => {
    expect(simTBK(g, 'Research', 'GraduateCourse')).toBeCloseTo(0.2, 4);
  });

  it('returns 0.5 for SystemsStaff and Professor', () => {
    expect(simTBK(g, 'SystemsStaff', 'Professor')).toBeCloseTo(0.5, 4);
  });

  it('returns 2/9 for SystemsStaff and Dean', () => {
    expect(simTBK(g, 'SystemsStaff', 'Dean')).toBeCloseTo(2 / 9, 4);
  });

  it('returns 0 for Person and Schedule', () => {
    expect(simTBK(g, 'Person', 'Schedule')).toBeCloseTo(0, 4);
  });
});

describe('computeLambda', () => {
  const g = createTaxonomy();

  it('returns 1 for same node', () => {
    expect(computeLambda(g, 'dog', 'dog')).toBe(1);
  });

  it('returns 0 for parent-child (same hierarchy)', () => {
    expect(computeLambda(g, 'mammal', 'dog')).toBe(0);
  });

  it('returns 0 for child-parent (same hierarchy)', () => {
    expect(computeLambda(g, 'dog', 'mammal')).toBe(0);
  });

  it('returns 1 for siblings (neighborhood)', () => {
    expect(computeLambda(g, 'dog', 'cat')).toBe(1);
  });

  it('returns 1 for cousins (neighborhood)', () => {
    expect(computeLambda(g, 'dog', 'penguin')).toBe(1);
  });

  it('returns 1 for disconnected nodes', () => {
    const g = createTaxonomy();
    g.addNode('plant');
    expect(computeLambda(g, 'dog', 'plant')).toBe(1);
  });
});
