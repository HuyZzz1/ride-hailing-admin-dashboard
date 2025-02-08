export const PAGE_ROUTES = {
  BOOKING: '/',
  DRIVER: '/driver',
  ACTIVITY_LOG: '/activity-log',
  SIGN_IN: '/sign-in',
  UN_AUTH: {
    '500': '/500',
    '404': '/404',
  },
};

export const UN_LAYOUT_ROUTES = [PAGE_ROUTES.SIGN_IN];
export const UN_AUTH_ROUTES = [
  PAGE_ROUTES.SIGN_IN,
  PAGE_ROUTES.UN_AUTH[500],
  PAGE_ROUTES.UN_AUTH[404],
];
export const UN_FETCH_PROFILE_ROUTES = [
  PAGE_ROUTES.UN_AUTH[500],
  PAGE_ROUTES.UN_AUTH[404],
];
