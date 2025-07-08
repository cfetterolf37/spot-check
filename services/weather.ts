const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

export interface WeatherData {
  tempC: number;
  tempF: number;
  description: string;
  icon: string;
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData | null> {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeatherMap API key is missing');
    return null;
  }
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const tempC = data.main.temp;
    const tempF = tempC * 9/5 + 32;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon; // e.g., '10d'
    return { tempC, tempF, description, icon };
  } catch (e) {
    console.warn('Failed to fetch weather:', e);
    return null;
  }
} 