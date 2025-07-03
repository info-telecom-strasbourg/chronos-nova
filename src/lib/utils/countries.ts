import { getAlpha2Code, getName, registerLocale } from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";

registerLocale(frLocale);

export const getCountryName = (country: string) => {
  const countryName = getName(country, "fr");
  return countryName || country;
};

export const getCountryAlpha2Code = (country: string) => {
  const alpha2Code = getAlpha2Code(country, "fr");
  return alpha2Code?.toLocaleLowerCase() || country.toLowerCase();
};

export const getCountryCode = (countryCode: string) => {
  return countryCode.toLowerCase();
};
