export const clientMenuItems = [
  { text: 'Личный кабинет', link: '/account/', rights: 'client' },
  { text: 'Бронирования', link: '/booking/usage/', rights: 'client' },
];

export const adminMenuItems = [
  { text: 'Управление гостиницами', link: '/hotels/manage/', rights: 'admin' },
  { text: 'Управление пользователями', link: '/users/manage/', rights: 'admin' },
];

export const managerMenuItems = [
  { text: 'Управление бронью', link: '/booking/manage/', rights: 'manager' },
  { text: 'Общение с клиентами', link: '/support/manage/', rights: 'manager' },
];

export const mainMenuItems = [
  { text: 'Гостиницы', link: '/', rights: 'all' },
  { text: 'Поиск', link: '/hotels/search/', rights: 'all' },
  { text: 'Поддержка', link: '/support/', rights: 'all' },
];

export const authMenuItems = [
  { text: 'Авторизация', link: '/logIn/', rights: 'all' },
  { text: 'Регистрация', link: '/register/', rights: 'all' },
];