export const environment = {
    production: false,
    apiBaseUrl: 'https://localhost:7216/api',
    address: {
        countries: [
            { name: 'Canada', code: 'CA' },
            { name: 'United States', code: 'US' },
            { name: 'France', code: 'FR' },
            { name: 'Tunisia', code: 'TN' }
        ],
        defaultCountry: 'TN',
        disableCountryChange: true
    }
}; 
