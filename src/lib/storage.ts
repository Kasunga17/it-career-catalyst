export const STORAGE_KEYS = {
  USERS: 'it_system_users',
  OPPORTUNITIES: 'it_system_opportunities',
  APPLICATIONS: 'it_system_applications',
  ORGANIZATIONS: 'it_system_organizations',
  REFEREES: 'it_system_referees',
  AUTH: 'it_system_auth'
};

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

export const setToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setToStorage(STORAGE_KEYS.USERS, [
      {
        id: 'admin-1',
        name: 'System Administrator',
        email: 'admin@system.com',
        password: 'password123',
        role: 'admin'
      }
    ]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES)) {
    setToStorage(STORAGE_KEYS.OPPORTUNITIES, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    setToStorage(STORAGE_KEYS.APPLICATIONS, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS)) {
    setToStorage(STORAGE_KEYS.ORGANIZATIONS, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REFEREES)) {
    setToStorage(STORAGE_KEYS.REFEREES, []);
  }
};
