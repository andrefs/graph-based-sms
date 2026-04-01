import { describe, it, expect } from 'vitest';
import { wuPalmer } from './wuPalmer';
import { runMeasureTests, createSlimaniExample1, createSlimaniExample2 } from './measures.test-helpers';

runMeasureTests('wuPalmer', wuPalmer);

describe('wuPalmer', () => {
  // extracted from Slimani et al. 2003
  it('returns 0.4 for c1 and c2', () => {
    const g = createSlimaniExample1();
    expect(wuPalmer(g, 'c1', 'c2')).toBeCloseTo(0.4, 2);
  });

  it('returns 0.57 for c2 and c3', () => {
    const g = createSlimaniExample1();
    expect(wuPalmer(g, 'c2', 'c3')).toBeCloseTo(0.57, 2);
  });

  // extracted from Slimani et al. 2003 - larger hierarchy
  describe('with SlimaniExample2', () => {
    const g = createSlimaniExample2();

    it('returns 2/3 for Person and ResearchAssistant', () => {
      expect(wuPalmer(g, 'Person', 'ResearchAssistant')).toBeCloseTo(2 / 3, 4);
    });

    it('returns 0.8 for VisitingProfessor and FullProfessor', () => {
      expect(wuPalmer(g, 'VisitingProfessor', 'FullProfessor')).toBeCloseTo(0.8, 4);
    });

    it('returns 4/9 for VisitingProfessor and SystemsStaff', () => {
      expect(wuPalmer(g, 'VisitingProfessor', 'SystemsStaff')).toBeCloseTo(4 / 9, 4);
    });

    it('returns 0.4 for ResearchAssistant and Faculty', () => {
      expect(wuPalmer(g, 'ResearchAssistant', 'Faculty')).toBeCloseTo(0.4, 4);
    });

    it('returns 0.5 for Chair and AdministrativeStaff', () => {
      expect(wuPalmer(g, 'Chair', 'AdministrativeStaff')).toBeCloseTo(0.5, 4);
    });

    it('returns 0.4 for Research and GraduateCourse', () => {
      expect(wuPalmer(g, 'Research', 'GraduateCourse')).toBeCloseTo(0.4, 4);
    });

    it('returns 0.5 for SystemsStaff and Professor', () => {
      expect(wuPalmer(g, 'SystemsStaff', 'Professor')).toBeCloseTo(0.5, 4);
    });

    it('returns 4/9 for SystemsStaff and Dean', () => {
      expect(wuPalmer(g, 'SystemsStaff', 'Dean')).toBeCloseTo(4 / 9, 4);
    });

    it('returns 0 for Person and Schedule', () => {
      expect(wuPalmer(g, 'Person', 'Schedule')).toBeCloseTo(0, 4);
    });
  });
});
