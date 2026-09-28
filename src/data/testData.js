const existingRateIds = [1, 42, 100];
const usernameInitialCases = [
    { initial: 'J', expectedUsernames: [] },
    { initial: 'K', expectedUsernames: ['Karianne', 'Kamren'] },
    { initial: 'M', expectedUsernames: ['Maxime_Nienow', 'Moriah.Stanton'] },
    ];
const shippingQuotes = [
        {
        scenario: 'domestic standard',
        quote: { userId: 1, title: 'STANDARD | Berlin, DE -> Munich, DE', body: 'weightKg=2.5; price=7.90 EUR' },
        },
        {
        scenario: 'international express',
        quote: { userId: 5, title: 'EXPRESS | Madrid, ES -> New York, US', body: 'weightKg=12; price=184.50 EUR' },
        },
        {
        scenario: 'non-ASCII address',
        quote: {
        userId: 10,
        title: 'ECONOMY | Zürich, CH -> Kraków, PL',
        body: 'weightKg=0.4; price=11.20 CHF',
        },
        },
        ];
const nonExistentRateIds = [
            { label: 'the first id after the last rate', id: 101 },
            { label: 'a very large id', id: 9_999_999 },
            { label: 'zero', id: 0 },
            { label: 'a negative id', id: -1 },
            { label: 'a non-numeric id', id: 'abc' },
            ];
const unknownCustomerId = 9_999;
            module.exports = {
            existingRateIds, usernameInitialCases, shippingQuotes, nonExistentRateIds, unknownCustomerId,
            };