export const data = [
  {
    default1: 'Kiichiro Toyoda',
    country: 'Japan',
    brand: 'Toyota',
    model: 'Corolla',
    year: '1966',
    price: '389,000 yen'
  },
  {
    default1: 'Henry Ford',
    country: 'USA',
    brand: 'Ford',
    model: 'ModelT',
    year: '1908',
    price: '825 USD'
  },
  {
    default1: 'Ignaz Schustala',
    country: 'Czech',
    brand: 'Tatra',
    model: 'V570',
    year: '1931',
    price: 'na'
  }
];

export const countries = data.map(el => el.country);
export const brands = data.map(el => el.brand);
export const models = data.map(el => el.model);
export const years = data.map(el => el.year)

