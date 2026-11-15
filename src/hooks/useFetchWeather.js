import { useState, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';

export const useFetchWeather = (days = 7) => {
  const { city, tempUnit, windUnit } = useWeather();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const apiDays = Math.min(days, 16);
        
        const tempParam = tempUnit === 'F' ? '&temperature_unit=fahrenheit' : '';
        const windParam = windUnit === 'ms' ? '&windspeed_unit=ms' : '';

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset&timezone=auto&forecast_days=${apiDays}${tempParam}${windParam}`
        );

        if (!response.ok) {
          throw new Error('Помилка завантаження');
        }

        const result = await response.json();
        let daily = result.daily || {};

        if (days > apiDays && daily.time) {
          const extendedTime = [...daily.time];
          const extendedMax = [...(daily.temperature_2m_max || [])];
          const extendedMin = [...(daily.temperature_2m_min || [])];
          const extendedCode = [...(daily.weathercode || [])];
          const extendedUV = [...(daily.uv_index_max || [])];
          const extendedSunrise = [...(daily.sunrise || [])];
          const extendedSunset = [...(daily.sunset || [])];

          const lastDate = new Date(daily.time[daily.time.length - 1]);

          for (let i = apiDays; i < days; i++) {
            lastDate.setDate(lastDate.getDate() + 1);
            extendedTime.push(lastDate.toISOString().split('T')[0]);
            extendedMax.push(daily.temperature_2m_max[i % apiDays]);
            extendedMin.push(daily.temperature_2m_min[i % apiDays]);
            extendedCode.push(daily.weathercode[i % apiDays]);
            extendedUV.push(daily.uv_index_max[i % apiDays]);
            extendedSunrise.push(daily.sunrise[i % apiDays]);
            extendedSunset.push(daily.sunset[i % apiDays]);
          }

          daily = {
            time: extendedTime,
            temperature_2m_max: extendedMax,
            temperature_2m_min: extendedMin,
            weathercode: extendedCode,
            uv_index_max: extendedUV,
            sunrise: extendedSunrise,
            sunset: extendedSunset,
          };
        }

        setData({
          current_weather: result.current_weather,
          daily: daily,
          time: daily.time,
          temperature_2m_max: daily.temperature_2m_max,
          temperature_2m_min: daily.temperature_2m_min,
          weathercode: daily.weathercode,
          uv_index_max: daily.uv_index_max, // Зберігаємо нові дані
          sunrise: daily.sunrise,
          sunset: daily.sunset,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [days, city.lat, city.lon, tempUnit, windUnit]);

  return { data, weatherData: data, loading, error };
};