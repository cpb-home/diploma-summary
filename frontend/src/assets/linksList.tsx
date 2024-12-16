export const clientMenuItems = [
  { text: 'Брони', link: '/bookings/', rights: 'client', state: {page: ''} },
  { text: 'Поддержка', link: '/support/', rights: 'client' },
];

export const adminMenuItems = [
  { text: 'Гостиницы', link: '/', rights: 'admin' },
  { text: 'Номера', link: '/hotels/search/', rights: 'admin', state: {hotelId: ''} },
  { text: 'Пользователи', link: '/account/', rights: 'admin', state: {page: 'users'} },
];

export const managerMenuItems = [
  { text: 'Обращения', link: '/', rights: 'manager' },
  { text: 'Пользователи', link: '/account/', rights: 'manager', state: {page: 'users'} },
];

export const mainMenuItems = [
  { text: 'Гостиницы', link: '/', rights: 'all' },
  { text: 'Поиск', link: '/hotels/search/', rights: 'all' },
  { text: 'Поддержка', link: '/support/', rights: 'all' },
];

export const authMenuItems = [
  { text: 'Вход', link: '/account/', rights: 'all', state: {page: 'account'} },
  { text: 'Регистрация', link: '/account/', rights: 'all', state: {page: 'register'} },
];