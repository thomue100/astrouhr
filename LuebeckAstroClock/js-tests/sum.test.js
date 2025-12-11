import { sum } from '../wwwroot/js/sum.js';
test('addiert 2 + 3 = 5', () => {
    expect(sum(2,3)).toBe(5);
});
