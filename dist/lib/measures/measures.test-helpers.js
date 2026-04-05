import { describe, it, expect } from 'vitest';
import { MultiDirectedGraph } from 'graphology';
export const MAX_DEPTH = 3;
export const createTaxonomy = () => {
    const g = new MultiDirectedGraph();
    ['animal', 'mammal', 'bird', 'dog', 'cat', 'penguin'].forEach(n => g.addNode(n));
    g.addEdge('mammal', 'animal', { predicate: 'is-a' });
    g.addEdge('bird', 'animal', { predicate: 'is-a' });
    g.addEdge('dog', 'mammal', { predicate: 'is-a' });
    g.addEdge('cat', 'mammal', { predicate: 'is-a' });
    g.addEdge('penguin', 'bird', { predicate: 'is-a' });
    return g;
};
export const createTaxonomyParentToChild = () => {
    const g = new MultiDirectedGraph();
    ['animal', 'mammal', 'bird', 'dog', 'cat', 'penguin'].forEach(n => g.addNode(n));
    g.addEdge('animal', 'mammal', { predicate: 'is-a' });
    g.addEdge('animal', 'bird', { predicate: 'is-a' });
    g.addEdge('mammal', 'dog', { predicate: 'is-a' });
    g.addEdge('mammal', 'cat', { predicate: 'is-a' });
    g.addEdge('bird', 'penguin', { predicate: 'is-a' });
    return g;
};
export const createSlimaniExample1 = () => {
    const g = new MultiDirectedGraph();
    ['v', 'c1', 'w', 'x', 'y', 'z', 'c2', 'c3'].forEach(n => g.addNode(n));
    g.addEdge('c1', 'v', { predicate: 'is-a' });
    g.addEdge('w', 'v', { predicate: 'is-a' });
    g.addEdge('x', 'c1', { predicate: 'is-a' });
    g.addEdge('y', 'c1', { predicate: 'is-a' });
    g.addEdge('z', 'x', { predicate: 'is-a' });
    g.addEdge('c2', 'z', { predicate: 'is-a' });
    g.addEdge('c3', 'x', { predicate: 'is-a' });
    return g;
};
export const createSlimaniExample2 = () => {
    const g = new MultiDirectedGraph();
    const nodes = [
        'Root', 'Schedule', 'Person', 'Organization', 'Work', 'Publication',
        'Student', 'GraduateStudent', 'ResearchAssistant', 'Employee', 'UndergraduateStudent',
        'Research', 'Course', 'GraduateCourse',
        'AdministrativeStaff', 'Faculty', 'ClericalStaff', 'SystemsStaff',
        'PostDoc', 'Professor', 'Lecturer', 'AssistantProfessor', 'VisitingProfessor',
        'Dean', 'Chair', 'FullProfessor',
        'Department', 'ResearchGroup', 'University', 'Program', 'Institute', 'College',
        'UnofficialPublication', 'Software', 'Manual', 'Book', 'Specification', 'Article',
        'ConferencePaper', 'TechnicalReport', 'JournalArticle'
    ];
    nodes.forEach(n => g.addNode(n));
    g.addEdge('Schedule', 'Root', { predicate: 'is-a' });
    g.addEdge('Person', 'Root', { predicate: 'is-a' });
    g.addEdge('Work', 'Root', { predicate: 'is-a' });
    g.addEdge('Organization', 'Root', { predicate: 'is-a' });
    g.addEdge('Publication', 'Root', { predicate: 'is-a' });
    g.addEdge('Student', 'Person', { predicate: 'is-a' });
    g.addEdge('GraduateStudent', 'Person', { predicate: 'is-a' });
    g.addEdge('ResearchAssistant', 'Person', { predicate: 'is-a' });
    g.addEdge('Employee', 'Person', { predicate: 'is-a' });
    g.addEdge('UndergraduateStudent', 'Student', { predicate: 'is-a' });
    g.addEdge('Research', 'Work', { predicate: 'is-a' });
    g.addEdge('Course', 'Work', { predicate: 'is-a' });
    g.addEdge('GraduateCourse', 'Course', { predicate: 'is-a' });
    g.addEdge('AdministrativeStaff', 'Employee', { predicate: 'is-a' });
    g.addEdge('Faculty', 'Employee', { predicate: 'is-a' });
    g.addEdge('ClericalStaff', 'AdministrativeStaff', { predicate: 'is-a' });
    g.addEdge('SystemsStaff', 'AdministrativeStaff', { predicate: 'is-a' });
    g.addEdge('PostDoc', 'Faculty', { predicate: 'is-a' });
    g.addEdge('Professor', 'Faculty', { predicate: 'is-a' });
    g.addEdge('Lecturer', 'Faculty', { predicate: 'is-a' });
    g.addEdge('AssistantProfessor', 'Professor', { predicate: 'is-a' });
    g.addEdge('VisitingProfessor', 'Professor', { predicate: 'is-a' });
    g.addEdge('Dean', 'Professor', { predicate: 'is-a' });
    g.addEdge('Chair', 'Professor', { predicate: 'is-a' });
    g.addEdge('FullProfessor', 'Professor', { predicate: 'is-a' });
    g.addEdge('Department', 'Organization', { predicate: 'is-a' });
    g.addEdge('ResearchGroup', 'Organization', { predicate: 'is-a' });
    g.addEdge('University', 'Organization', { predicate: 'is-a' });
    g.addEdge('Program', 'Organization', { predicate: 'is-a' });
    g.addEdge('Institute', 'Organization', { predicate: 'is-a' });
    g.addEdge('College', 'Organization', { predicate: 'is-a' });
    g.addEdge('UnofficialPublication', 'Publication', { predicate: 'is-a' });
    g.addEdge('Software', 'Publication', { predicate: 'is-a' });
    g.addEdge('Manual', 'Publication', { predicate: 'is-a' });
    g.addEdge('Book', 'Publication', { predicate: 'is-a' });
    g.addEdge('Specification', 'Publication', { predicate: 'is-a' });
    g.addEdge('Article', 'Publication', { predicate: 'is-a' });
    g.addEdge('ConferencePaper', 'Article', { predicate: 'is-a' });
    g.addEdge('TechnicalReport', 'Article', { predicate: 'is-a' });
    g.addEdge('JournalArticle', 'Article', { predicate: 'is-a' });
    return g;
};
const legacyTestCases = [
    {
        name: 'same node',
        c1: 'dog', c2: 'dog',
        expected: { shortestPath: 0, radaSimilarity: 1, resnikEdge: 6, wuPalmer: 1, pekarStaab: 1, simTBK: 1, zhong: 1 / Math.pow(2, 2), leacockChodorow: Math.log(6), hirstStOnge: 8 },
    },
    {
        name: 'direct parent-child',
        c1: 'mammal', c2: 'dog',
        expected: { shortestPath: 1, radaSimilarity: 0.5, resnikEdge: 5, wuPalmer: 2 / 3, pekarStaab: 0.5, simTBK: 2 / 3, zhong: 1 / Math.pow(2, 1) - 1 / (2 * Math.pow(2, 1)) - 1 / (2 * Math.pow(2, 2)), leacockChodorow: Math.log(6) - Math.log(2), hirstStOnge: 7 },
    },
    {
        name: 'grandparent-grandchild',
        c1: 'animal', c2: 'dog',
        expected: { shortestPath: 2, radaSimilarity: 1 / 3, resnikEdge: 4, wuPalmer: 0, pekarStaab: 0, simTBK: 0, zhong: 0, leacockChodorow: Math.log(6) - Math.log(3), hirstStOnge: 6 },
    },
    {
        name: 'siblings',
        c1: 'dog', c2: 'cat',
        expected: { shortestPath: 2, radaSimilarity: 1 / 3, resnikEdge: 4, wuPalmer: 0.5, pekarStaab: 1 / 3, simTBK: 0.5, zhong: 1 / Math.pow(2, 1) - 2 * (1 / (2 * Math.pow(2, 2))), leacockChodorow: Math.log(6) - Math.log(3), hirstStOnge: 5 },
    },
    {
        name: 'cousins',
        c1: 'dog', c2: 'penguin',
        expected: { shortestPath: 4, radaSimilarity: 1 / 5, resnikEdge: 2, wuPalmer: 0, pekarStaab: 0, simTBK: 0, zhong: 0, leacockChodorow: Math.log(6) - Math.log(5), hirstStOnge: 3 },
    },
];
export function runMeasureTests(measureName, measureFn, options) {
    describe(measureName + ' (legacy childToParent)', () => {
        const g = createTaxonomy();
        for (const tc of legacyTestCases) {
            it(`returns expected value for ${tc.name}`, () => {
                const result = measureFn(g, tc.c1, tc.c2, { ...options, edgeDirection: 'childToParent' });
                const expected = tc.expected[measureFn.name];
                if (Number.isInteger(expected)) {
                    expect(result).toBe(expected);
                }
                else {
                    expect(result).toBeCloseTo(expected, 5);
                }
            });
        }
        it('returns 0 when no path exists', () => {
            const g = createTaxonomy();
            g.addNode('plant');
            expect(measureFn(g, 'dog', 'plant', { ...options, edgeDirection: 'childToParent' })).toBe(0);
        });
        it('handles nonexistent nodes gracefully', () => {
            const g = createTaxonomy();
            expect(measureFn(g, 'nonexistent1', 'nonexistent2', { ...options, edgeDirection: 'childToParent' })).toBe(0);
        });
    });
}
export function runMeasureTestsDefault(measureName, measureFn, options) {
    describe(measureName + ' (default parentToChild)', () => {
        const g = createTaxonomyParentToChild();
        for (const tc of legacyTestCases) {
            it(`returns expected value for ${tc.name}`, () => {
                const result = measureFn(g, tc.c1, tc.c2, options);
                const expected = tc.expected[measureFn.name];
                if (Number.isInteger(expected)) {
                    expect(result).toBe(expected);
                }
                else {
                    expect(result).toBeCloseTo(expected, 5);
                }
            });
        }
        it('returns 0 when no path exists', () => {
            const g = createTaxonomyParentToChild();
            g.addNode('plant');
            expect(measureFn(g, 'dog', 'plant', options)).toBe(0);
        });
        it('handles nonexistent nodes gracefully', () => {
            const g = createTaxonomyParentToChild();
            expect(measureFn(g, 'nonexistent1', 'nonexistent2', options)).toBe(0);
        });
    });
}
//# sourceMappingURL=measures.test-helpers.js.map