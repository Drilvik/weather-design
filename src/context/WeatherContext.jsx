import React, { createContext, useState, useContext, useEffect } from 'react';

const WeatherContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};


const getCityNameFromObj = (obj) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj.name || obj.cityName || obj.city || '';
};


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
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const userRes = await fetch(`${API_BASE_URL}/users/me`, {
          headers: getAuthHeaders(),
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setUserProfile(userData);
          localStorage.setItem('user', JSON.stringify(userData));

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
        } else {
          console.error('Помилка завантаження профілю:', userRes.status);
        }

        const favRes = await fetch(`${API_BASE_URL}/favorites`, {
          headers: getAuthHeaders(),
        });

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

  const updateUserOnServer = async (updates) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Сесія не знайдена. Натисніть «Вийти» і увійдіть у свій акаунт знову.');
      return null;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert('Термін сесії вийшов. Натисніть «Вийти» і увійдіть у свій акаунт заново.');
        }
        return null;
      }

      const updatedUser = await res.json();
      setUserProfile(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      console.error('Помилка оновлення профілю на сервері:', err);
      return null;
    }
  };

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

    if (localStorage.getItem('token')) {
      await updateUserOnServer({
        cityName: formattedCity.name,
        country: formattedCity.country,
        lat: String(formattedCity.lat),
        lon: String(formattedCity.lon),
      });
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

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Щоб зберігати улюблені міста, натисніть «Вийти» і увійдіть у свій акаунт.');
      return;
    }

    const tempId = Date.now().toString();
    const newFavObj = {
      name: targetName,
      cityName: targetName,
      country: cityToAdd.country || '',
      lat: String(cityToAdd.lat || cityToAdd.latitude || 0),
      lon: String(cityToAdd.lon || cityToAdd.longitude || 0),
    };

    const tempFav = { ...newFavObj, id: tempId };

    setFavoriteCities((prev) => [...prev, tempFav]);

    try {
      const res = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: getAuthHeaders(),
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
      } else {
        setFavoriteCities((prev) => prev.filter((item) => item.id !== tempId));
      }
    } catch (err) {
      setFavoriteCities((prev) => prev.filter((item) => item.id !== tempId));
      console.error('Помилка відправки в улюблені:', err);
    }
  };

  const removeFavorite = async (cityName) => {
    if (!cityName) return;

    const target = cleanCityName(cityName);
    if (!target) return;

    const existing = favoriteCities.find((c) => cleanCityName(c) === target);

   
    setFavoriteCities((prev) =>
      prev.filter((item) => cleanCityName(item) !== target)
    );

    if (existing && existing.id) {
      try {
        await fetch(`${API_BASE_URL}/favorites/${existing.id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
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
    await updateUserOnServer({ tempUnit: unit });
  };

  const setWindUnit = async (unit) => {
    setWindUnitState(unit);
    await updateUserOnServer({ windUnit: unit });
  };

  const toggleNotification = async (key, currentValue) => {
    const updatedValue = !currentValue;
    setUserProfile((prev) => ({ ...(prev || {}), [key]: updatedValue }));
    await updateUserOnServer({ [key]: updatedValue });
  };

  const updateAvatar = async (base64Image) => {
    setUserProfile((prev) => ({ ...(prev || {}), avatar: base64Image }));
    await updateUserOnServer({ avatar: base64Image });
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