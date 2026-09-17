// No test framework in this repo yet — run with: yarn test
import { formatCurrency } from "./formatCurrency";

function assertEqual(actual: string, expected: string): void {
  if (actual !== expected) {
    throw new Error(`expected "${expected}", got "${actual}"`);
  }
}

assertEqual(formatCurrency(1234.56), "£1,234.56");
assertEqual(formatCurrency(0), "£0.00");
assertEqual(formatCurrency(5), "£5.00");
assertEqual(formatCurrency(-1234.56), "-£1,234.56");
assertEqual(formatCurrency(1234.565), "£1,234.57");

console.log("formatCurrency: all assertions passed");
