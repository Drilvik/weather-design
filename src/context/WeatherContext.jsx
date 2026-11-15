import React, { createContext, useState, useContext, useEffect } from 'react';

const WeatherContext = createContext();

const API_BASE_URL = 'https://6af4549955a1de7dcf03def9.mockapi.io/api/v1';

// Універсальне витягнення назви міста з рядка або об'єкта будь-якої структури
const getCityNameFromObj = (obj) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj.name || obj.cityName || obj.city || '';
};

// Нормалізація назви міста для порівняння ("Ужгород, UA" -> "ужгород")
const cleanCityName = (cityInput) => {
  const name = getCityNameFromObj(cityInput);
  if (!name) return '';
  return name.split(',')[0].trim().toLowerCase();
};

export const WeatherProvider = ({ children }) => {
  const [city, setCityState] = useState({
    name: 'Ужгород',
    country: 'Україна',
    lat: 48.62,
    lon: 22.28,
  });

  const [favoriteCities, setFavoriteCities] = useState([]);
  const [tempUnit, setTempUnitState] = useState('C');
  const [windUnit, setWindUnitState] = useState('kmh');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);

        const userRes = await fetch(`${API_BASE_URL}/users/1`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserProfile(userData);

          if (userData.tempUnit) setTempUnitState(userData.tempUnit);
          if (userData.windUnit) setWindUnitState(userData.windUnit);

          if (userData.cityName && userData.lat && userData.lon) {
            setCityState({
              name: String(userData.cityName).split(',')[0].trim(),
              country: userData.country || '',
              lat: Number(userData.lat),
              lon: Number(userData.lon),
            });
          }
        } else if (userRes.status === 404) {
          const initialUser = {
            username: 'dariia.lavriuk',
            email: 'dariia@example.com',
            tempUnit: 'C',
            windUnit: 'kmh',
            cityName: 'Ужгород',
            country: 'Україна',
            lat: 48.62,
            lon: 22.28,
            notifRain: true,
            notifWind: true,
            notifMorning: true,
            notifUv: false,
            avatar: '',
          };

          const createRes = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(initialUser),
          });

          if (createRes.ok) {
            const createdUser = await createRes.json();
            setUserProfile(createdUser);
          }
        }

        const favRes = await fetch(`${API_BASE_URL}/favorites`);
        if (favRes.ok) {
          const favData = await favRes.json();
          const normalizedFavs = Array.isArray(favData)
            ? favData.map((item) => ({
                ...item,
                name: getCityNameFromObj(item),
              }))
            : [];
          setFavoriteCities(normalizedFavs);
        }
      } catch (err) {
        console.error('Помилка завантаження даних:', err);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const setCity = async (newCity) => {
    if (!newCity) return;
    const cityNameRaw = getCityNameFromObj(newCity);
    if (!cityNameRaw) return;

    const formattedCity = {
      name: cityNameRaw.split(',')[0].trim(),
      country: newCity.country || '',
      lat: Number(newCity.lat || newCity.latitude || 48.62),
      lon: Number(newCity.lon || newCity.longitude || 22.28),
    };

    setCityState(formattedCity);

    try {
      await fetch(`${API_BASE_URL}/users/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityName: formattedCity.name,
          country: formattedCity.country,
          lat: String(formattedCity.lat),
          lon: String(formattedCity.lon),
        }),
      });
    } catch (err) {
      console.error('Помилка оновлення міста:', err);
    }
  };

  const isFavorite = (cityName) => {
    if (!cityName) return false;
    const target = cleanCityName(cityName);
    if (!target) return false;
    return favoriteCities.some((c) => cleanCityName(c) === target);
  };

  const addFavorite = async (cityToAdd) => {
    if (!cityToAdd) return;
    const rawName = getCityNameFromObj(cityToAdd);
    if (!rawName) return;

    const targetName = rawName.split(',')[0].trim();

    if (isFavorite(targetName)) return;

    const tempId = Date.now().toString();
    const newFavObj = {
      userId: '1',
      name: targetName,
      cityName: targetName,
      country: cityToAdd.country || '',
      lat: String(cityToAdd.lat || cityToAdd.latitude || 0),
      lon: String(cityToAdd.lon || cityToAdd.longitude || 0),
    };

    const tempFav = { ...newFavObj, id: tempId };

    // Фіксуємо місто в UI
    setFavoriteCities((prev) => [...prev, tempFav]);

    try {
      const res = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFavObj),
      });

      if (res.ok) {
        const savedFav = await res.json();
        const normalizedSaved = {
          ...savedFav,
          name: savedFav.name || savedFav.cityName || targetName,
        };
        setFavoriteCities((prev) =>
          prev.map((item) => (item.id === tempId ? normalizedSaved : item))
        );
      }
    } catch (err) {
      console.error('Помилка відправки в улюблені:', err);
    }
  };

  const removeFavorite = async (cityName) => {
    if (!cityName) return;

    const target = cleanCityName(cityName);
    if (!target) return;

    const existing = favoriteCities.find((c) => cleanCityName(c) === target);

    // Оптимістично видаляємо з UI
    setFavoriteCities((prev) =>
      prev.filter((item) => cleanCityName(item) !== target)
    );

    if (existing && existing.id) {
      try {
        await fetch(`${API_BASE_URL}/favorites/${existing.id}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Помилка видалення з улюблених:', err);
      }
    }
  };

  const toggleFavorite = async (targetCity) => {
    if (!targetCity) return;
    const rawName = getCityNameFromObj(targetCity);
    if (isFavorite(rawName)) {
      await removeFavorite(rawName);
    } else {
      await addFavorite(targetCity);
    }
  };

  const setTempUnit = async (unit) => {
    setTempUnitState(unit);
    try {
      await fetch(`${API_BASE_URL}/users/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempUnit: unit }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const setWindUnit = async (unit) => {
    setWindUnitState(unit);
    try {
      await fetch(`${API_BASE_URL}/users/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ windUnit: unit }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleNotification = async (key, currentValue) => {
    const updatedValue = !currentValue;
    if (userProfile) {
      setUserProfile((prev) => ({ ...prev, [key]: updatedValue }));
    }
    try {
      await fetch(`${API_BASE_URL}/users/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: updatedValue }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateAvatar = async (base64Image) => {
    if (userProfile) {
      setUserProfile((prev) => ({ ...prev, avatar: base64Image }));
    }
    try {
      await fetch(`${API_BASE_URL}/users/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: base64Image }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        city,
        setCity,
        tempUnit,
        setTempUnit,
        windUnit,
        setWindUnit,
        favoriteCities,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        userProfile,
        setUserProfile,
        toggleNotification,
        updateAvatar,
        loading,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);