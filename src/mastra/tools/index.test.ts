import { describe, it, expect, vi, beforeEach } from 'vitest';
import { weatherTool } from './index';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('weatherTool', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('has correct id and description', () => {
    expect(weatherTool.id).toBe('get-weather');
    expect(weatherTool.description).toBe('Get current weather for a location');
  });

  it('fetches weather for a valid location', async () => {
    // Mock geocoding response
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        results: [{ latitude: 48.8566, longitude: 2.3522, name: 'Paris' }],
      }),
    });

    // Mock weather response
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        current: {
          time: '2026-03-08T12:00',
          temperature_2m: 12.5,
          apparent_temperature: 10.2,
          relative_humidity_2m: 65,
          wind_speed_10m: 15.3,
          wind_gusts_10m: 25.1,
          weather_code: 2,
        },
      }),
    });

    const result = await weatherTool.execute!({ location: 'Paris' }, {} as any);

    expect(result).toEqual({
      temperature: 12.5,
      feelsLike: 10.2,
      humidity: 65,
      windSpeed: 15.3,
      windGust: 25.1,
      conditions: 'Partly cloudy',
      location: 'Paris',
    });

    // Verify geocoding URL was called correctly
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch.mock.calls[0][0]).toContain('geocoding-api.open-meteo.com');
    expect(mockFetch.mock.calls[0][0]).toContain('name=Paris');
  });

  it('throws error for unknown location', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ results: undefined }),
    });

    await expect(
      weatherTool.execute!({ location: 'Nonexistentcity123' }, {} as any),
    ).rejects.toThrow("Location 'Nonexistentcity123' not found");
  });

  it('maps weather codes correctly', async () => {
    const testCases = [
      { code: 0, expected: 'Clear sky' },
      { code: 3, expected: 'Overcast' },
      { code: 65, expected: 'Heavy rain' },
      { code: 75, expected: 'Heavy snow fall' },
      { code: 95, expected: 'Thunderstorm' },
      { code: 99, expected: 'Thunderstorm with heavy hail' },
      { code: 999, expected: 'Unknown' },
    ];

    for (const { code, expected } of testCases) {
      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          results: [{ latitude: 0, longitude: 0, name: 'Test' }],
        }),
      });
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          current: {
            time: '2026-03-08T12:00',
            temperature_2m: 20,
            apparent_temperature: 20,
            relative_humidity_2m: 50,
            wind_speed_10m: 10,
            wind_gusts_10m: 15,
            weather_code: code,
          },
        }),
      });

      const result = await weatherTool.execute!({ location: 'Test' }, {} as any) as { conditions: string };
      expect(result.conditions).toBe(expected);
    }
  });
});
