/**
 * Former mock data module for the Tvarita Artist Dashboard.
 *
 * All Artisan dashboard pages and components now fetch live data from the
 * backend via `frontend/src/services/artisanService.js`. Every constant that
 * used to live here (ARTIST_PROFILE, OVERVIEW_METRICS, INDIVIDUAL_REQUESTS,
 * INSTITUTION_REQUESTS, UPCOMING_EVENTS, PAST_EVENTS, INITIAL_CALENDAR_DAYS,
 * EARNINGS_DATA, FOLLOWERS_LIST, PRODUCTS_CATALOG) was removed after
 * confirming (via repo-wide grep) that no file under frontend/src imports it
 * any longer.
 */

export {};
