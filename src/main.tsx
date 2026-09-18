import { bubbleSort } from './algorithms/sorting/bubbleSort';

const steps = bubbleSort.generateSteps([5, 2, 8, 1, 9]);
console.log('Total steps:', steps.length);
console.log('First step:', steps[0]);
console.log('Last step:', steps[steps.length - 1]);