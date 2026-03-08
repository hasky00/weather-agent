import { describe, it, expect } from 'vitest';
import { weatherWorkflow } from './index';

describe('weatherWorkflow', () => {
  it('has correct id', () => {
    expect(weatherWorkflow.id).toBe('weather-workflow');
  });

  it('has an input schema that requires a city string', () => {
    const result = weatherWorkflow.inputSchema.safeParse({ city: 'London' });
    expect(result.success).toBe(true);

    const invalid = weatherWorkflow.inputSchema.safeParse({});
    expect(invalid.success).toBe(false);

    const wrongType = weatherWorkflow.inputSchema.safeParse({ city: 123 });
    expect(wrongType.success).toBe(false);
  });

  it('has an output schema that expects activities string', () => {
    const result = weatherWorkflow.outputSchema.safeParse({ activities: 'Go hiking' });
    expect(result.success).toBe(true);

    const invalid = weatherWorkflow.outputSchema.safeParse({});
    expect(invalid.success).toBe(false);
  });
});
