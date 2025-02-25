const BIRTH_DETAILS_KEY = "birth_details";

export interface StoredBirthDetails {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
}

export const saveBirthDetails = (details: StoredBirthDetails) => {
  localStorage.setItem(BIRTH_DETAILS_KEY, JSON.stringify(details));
};

export const getBirthDetails = (): StoredBirthDetails | null => {
  const stored = localStorage.getItem(BIRTH_DETAILS_KEY);
  return stored ? JSON.parse(stored) : null;
};
