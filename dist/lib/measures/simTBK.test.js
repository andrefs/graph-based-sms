import { describe, it, expect } from 'vitest';
import { simTBK } from './simTBK';
import { runMeasureTests, runMeasureTestsDefault, createSlimaniExample1, createSlimaniExample2 } from './measures.test-helpers';
runMeasureTests('simTBK', simTBK);
runMeasureTestsDefault('simTBK', simTBK);
describe('simTBK extra (childToParent)', () => {
    describe('with SlimaniExample1', () => {
        const g = createSlimaniExample1();
        it('returns 0.4 for c1 and c2', () => {
            expect(simTBK(g, 'c1', 'c2', { edgeDirection: 'childToParent' })).toBeCloseTo(0.4, 2);
        });
        it('returns 0.29 for c2 and c3', () => {
            expect(simTBK(g, 'c2', 'c3', { edgeDirection: 'childToParent' })).toBeCloseTo(0.29, 2);
        });
    });
    describe('with SlimaniExample2', () => {
        const g = createSlimaniExample2();
        it('returns expected values', () => {
            expect(simTBK(g, 'Person', 'ResearchAssistant', { edgeDirection: 'childToParent' })).toBeCloseTo(2 / 3, 4);
            expect(simTBK(g, 'VisitingProfessor', 'FullProfessor', { edgeDirection: 'childToParent' })).toBeCloseTo(0.8, 4);
            expect(simTBK(g, 'VisitingProfessor', 'SystemsStaff', { edgeDirection: 'childToParent' })).toBeCloseTo(2 / 9, 4);
            expect(simTBK(g, 'ResearchAssistant', 'Faculty', { edgeDirection: 'childToParent' })).toBeCloseTo(0.2, 4);
            expect(simTBK(g, 'Chair', 'AdministrativeStaff', { edgeDirection: 'childToParent' })).toBeCloseTo(1 / 6, 4);
            expect(simTBK(g, 'Research', 'GraduateCourse', { edgeDirection: 'childToParent' })).toBeCloseTo(0.2, 4);
            expect(simTBK(g, 'SystemsStaff', 'Professor', { edgeDirection: 'childToParent' })).toBeCloseTo(0.5, 4);
            expect(simTBK(g, 'SystemsStaff', 'Dean', { edgeDirection: 'childToParent' })).toBeCloseTo(2 / 9, 4);
            expect(simTBK(g, 'Person', 'Schedule', { edgeDirection: 'childToParent' })).toBeCloseTo(0, 4);
        });
    });
});
//# sourceMappingURL=simTBK.test.js.map