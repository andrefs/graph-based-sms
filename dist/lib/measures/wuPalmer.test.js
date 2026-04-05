import { describe, it, expect } from 'vitest';
import { wuPalmer } from './wuPalmer';
import { runMeasureTests, runMeasureTestsDefault, createSlimaniExample1, createSlimaniExample2 } from './measures.test-helpers';
runMeasureTests('wuPalmer', wuPalmer);
runMeasureTestsDefault('wuPalmer', wuPalmer);
describe('wuPalmer extra tests (childToParent)', () => {
    it('returns 0.4 for c1 and c2 (Slimani)', () => {
        const g = createSlimaniExample1();
        expect(wuPalmer(g, 'c1', 'c2', { edgeDirection: 'childToParent' })).toBeCloseTo(0.4, 2);
    });
    it('returns 0.57 for c2 and c3 (Slimani)', () => {
        const g = createSlimaniExample1();
        expect(wuPalmer(g, 'c2', 'c3', { edgeDirection: 'childToParent' })).toBeCloseTo(0.57, 2);
    });
    describe('with SlimaniExample2', () => {
        const g = createSlimaniExample2();
        it('returns expected values', () => {
            expect(wuPalmer(g, 'Person', 'ResearchAssistant', { edgeDirection: 'childToParent' })).toBeCloseTo(2 / 3, 4);
            expect(wuPalmer(g, 'VisitingProfessor', 'FullProfessor', { edgeDirection: 'childToParent' })).toBeCloseTo(0.8, 4);
            expect(wuPalmer(g, 'VisitingProfessor', 'SystemsStaff', { edgeDirection: 'childToParent' })).toBeCloseTo(4 / 9, 4);
            expect(wuPalmer(g, 'ResearchAssistant', 'Faculty', { edgeDirection: 'childToParent' })).toBeCloseTo(0.4, 4);
            expect(wuPalmer(g, 'Chair', 'AdministrativeStaff', { edgeDirection: 'childToParent' })).toBeCloseTo(0.5, 4);
            expect(wuPalmer(g, 'Research', 'GraduateCourse', { edgeDirection: 'childToParent' })).toBeCloseTo(0.4, 4);
            expect(wuPalmer(g, 'SystemsStaff', 'Professor', { edgeDirection: 'childToParent' })).toBeCloseTo(0.5, 4);
            expect(wuPalmer(g, 'SystemsStaff', 'Dean', { edgeDirection: 'childToParent' })).toBeCloseTo(4 / 9, 4);
            expect(wuPalmer(g, 'Person', 'Schedule', { edgeDirection: 'childToParent' })).toBeCloseTo(0, 4);
        });
    });
});
//# sourceMappingURL=wuPalmer.test.js.map