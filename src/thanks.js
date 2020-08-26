const today = new Date();
today.setHours(0, 0, 0, 0);

let thanks = [
  // Palo
  {
    who: {
      // id: 1,
      uid: null,
      photo: 'https://sun1-93.userapi.com/tvpmiLDOH0x85TWF3KktOksi7C0lmarbnu6XTQ/V26eVKeaST8.jpg',
      name: 'Palo (Slovakia)',
    },
    deals: [
      {
      project: 'Перевод на словакский язык',
      role: 'Переводчик',
      description: null,
      date: new Date(2020, 3, 13),
    },
    ]
  },
  // Артем
  {
    who: {
      // id: 1,
      uid: null,
      photo: 'https://sun1-93.userapi.com/tvpmiLDOH0x85TWF3KktOksi7C0lmarbnu6XTQ/V26eVKeaST8.jpg',
      name: 'Ражков Артем',
    },
    deals: [
      {
        project: 'kopnik.org v0.2',
        role: 'Бэкенд',
        description: null,
        date: today,
      },
      {
        project: 'kopnik.org v0.1',
        role: 'Бэкенд',
        description: null,
        date: new Date(2020, 2, 9),
      },
    ]
  },
  //Алексей
  {
    who: {
      // id: 2,
      uid: null,
      photo: 'https://i.imgur.com/lwWzCDl.jpg',
      name: 'Баранов Алексей',
    },
    deals: [
      {
        project: 'Техническое задание на создание kopnik.org',
        role: 'Заказчик/Архитектор/Техписатель',
        description: null,
        date: new Date(2019, 4, 29),
        link: 'https://docs.google.com/document/d/1hxBS1Bvay-bpUtut_QfgZRlV1-qchaPibEGbRmsBlBU/edit?usp=drive_web&ouid=115823892625183690571',
      },
      {
        project: 'Расчет и обоснование стоимости создания kopnik.org',
        role: 'Заказчик/Архитектор/Техписатель',
        description: null,
        date: new Date(2019, 4, 29),
        link: 'https://docs.google.com/spreadsheets/d/1K7H0S2NnHs-R-y0WXpNS3YJPWFtIc6KQbPlybyWIiGk/edit#gid=0',
      },
      {
        project: 'Устав команды по созданию kopnik.org',
        role: 'Автор',
        description: null,
        date: new Date(2019, 9, 6),
        link: 'https://docs.google.com/document/d/1NzlfhHoDkT9FBR1aH41bZZ_eZQeUH7kTGTXABpvY3YE/edit',
      },
      {
        project: 'Правила поведения на улице kopnik.org',
        role: 'Сходатай на копе',
        description: null,
        date: new Date(2019, 9, 19),
        link: 'https://docs.google.com/document/d/1NzlfhHoDkT9FBR1aH41bZZ_eZQeUH7kTGTXABpvY3YE/edit#heading=h.z1pjdej0nvbv',
      },
      {
        project: 'Макет сайта kopnik.org',
        role: 'Автор',
        description: null,
        date: new Date(2019, 11, 15),
        link: 'www.kopnik.org',
      },
      {
        project: 'kopnik.org v0.1',
        role: 'Web-фронтенд/Тимлид',
        description: null,
        date: new Date(2020, 2, 9),
      },
      {
        project: 'kopnik.org v0.2',
        role: 'Web-фронтенд/Тимлид',
        description: null,
        date: today,
      },
    ]
  },
  // Игорь
  {
    who: {
      id: null,
      uid: null,
      photo: null,
      name: 'Игорь',
    },
    deals: [
      {
        project: 'Сервера kopnik.org и dev.kopnik.org',
        role: 'Хозяин',
        description: null,
        date: new Date(2019, 6, 30),
      },
      {
        project: 'kopnik.org v0.1',
        role: 'Системное администрирование',
        description: null,
        date: new Date(2020, 2, 9)
      },
      {
        project: 'kopnik.org v0.2',
        role: 'Системное администрирование',
        description: null,
        date: today,
      },
    ]
  },
  //Александр
  {
    who: {
      // id: 3,
      uid: null,
      photo: 'https://sun1-91.userapi.com/c857628/v857628007/644b7/1dFOLyFpK_8.jpg',
      name: 'Титов Александр'
    },
    deals: [
      {
        project: 'Территориальные чаты kopnik.org',
        role: 'Автор идеи/Старший куратор',
        description: null,
        date: new Date(2019, 4, 29),
      },
      {
        project: 'Правила поведения на улице kopnik.org',
        role: 'Сходатай на копе',
        description: null,
        date: new Date(2019, 9, 19),
        link: 'https://docs.google.com/document/d/1NzlfhHoDkT9FBR1aH41bZZ_eZQeUH7kTGTXABpvY3YE/edit#heading=h.z1pjdej0nvbv',
      },
    ]
  },
  // Дмитрий Журбин
  {
    who: {
      id: null,
      uid: null,
      photo: 'https://sun9-43.userapi.com/c849124/v849124535/9890d/jqIsFAEYLdA.jpg',
      name: 'Журбин Дмитрий',
    },
    deals: [
      {
        project: 'Перевод ролика о сборе средств на создание kopnik.org',
        role: 'Переводчик/Голос/Монтажер',
        description: null,
        date: new Date(2019, 10, 0),
        link: 'https://www.youtube.com/watch?v=gsIbe9yMdOo',
      },
    ]
  },
  // Владимир Монухин
  {
    who: {
      id: null,
      uid: null,
      photo: 'https://sun9-28.userapi.com/c854320/v854320192/18cc9c/gL4FCPeVspo.jpg',
      name: 'Монухин Владимир',
    },
    deals: [
      {
        project: 'Перевод ролика о сборе средств на создание kopnik.org',
        role: 'Переводчик/Голос/Монтажер',
        description: null,
        date: new Date(2020, 10, 5),
      },
    ]
  },
  // Евгений
  {
    who: {
      id: null,
      uid: null,
      photo: 'https://sun1-21.userapi.com/iapk22EQe5H-gyZdPrmmWz7n77nzOwuNG3AqOw/j0EX7sM_ZCE.jpg',
      name: 'Нигматуллинн Евгений',
    },
    deals: [
      {
        project: 'Разделы "Нас поддерживают" и "Мы в соцсетях" на сайте-визитке kopnik.org',
        role: 'Веб-мастер',
        description: null,
        date: new Date(2019, 11, 1),
        link: 'kopnik.org',
      },
      {
        project: 'Новый сайт-визитка kopnik.org',
        role: 'Веб-мастер',
        description: null,
        date: new Date(2019, 11, 8),
        link: 'kopnik.org',
      },
      {
        project: 'Сбор статистики посещаемости сайта-визитки kopnik.org',
        role: 'Веб-мастер',
        description: null,
        date: new Date(2019, 11, 30),
        link: 'kopnik.org',
      },
      {
        project: 'Удаление разделов о подрядчике сайта kopnik.org',
        role: 'Веб-мастер',
        description: null,
        date: new Date(2020, 2, 24),
        link: 'kopnik.org',
      },
    ]
  },
  // Вячеслав
  {
    who: {
      id: null,
      uid: null,
      photo: 'https://sun9-24.userapi.com/c854520/v854520731/fde0e/3l9R-8h67S8.jpg',
      name: 'Богданов Вячеслав',
    },
    deals: [
      {
        project: 'Оформление  Группы ВК, FB и канла Youtube',
        role: 'Дизайн',
        description: null,
        date: new Date(2019, 6, 20),
        link: 'https://vk.com/kopnik_org',
      },
      {
        project: 'Встреча со славянской общиной',
        role: 'Организатор',
        description: null,
        date: new Date(2018, 11, 4),
      },
    ]
  },
  // Света
  {
    who: {
      id: null,
      uid: null,
      photo: 'https://sun1-99.userapi.com/c836725/v836725430/26886/vfXEfOS9IXI.jpg',
      name: 'Светлана Пенькова',
    },
    deals: [
      {
        project: 'Встреча с руководителем общественно-политической организации',
        role: 'Организатор',
        description: null,
        date: new Date(2017, 9, 24),
      },
    ]
  },
  // Вася
  {
    who: {
      id: null,
      uid: null,
      photo: 'https://sun9-45.userapi.com/c637517/v637517969/4f714/UESZM3Y2KKc.jpg',
      name: 'Василий с севера Руси',
    },
    deals: [
      {
        project: 'Открытое Письмо Алексею Баранову - автору Копной соц. сети',
        role: 'Автор',
        description: null,
        date: new Date(2018, 1, 20),
        link: 'https://www.youtube.com/watch?v=9vBbCOWsujQ&list=PL8t968Ip0ARlFShkBMnbuc7ZcSj-dGAci',
      },
      {
        project: '2й Вольный Земский Съезд МСУ. Алексей Баранов.',
        role: 'Автор',
        description: null,
        date: new Date(2019, 2, 4),
        link: 'https://www.youtube.com/watch?v=QZzj3sHjz6A&list=PL8t968Ip0ARlFShkBMnbuc7ZcSj-dGAci&index=2',
      },
      {
        project: 'Миром сообща электронное Копное Право',
        role: 'Автор',
        description: null,
        date: new Date(2019, 5, 17),
        link: 'https://www.youtube.com/watch?v=TIwkKSxNHOs&list=PL8t968Ip0ARlFShkBMnbuc7ZcSj-dGAci&index=3',
      },
      {
        project: 'Электронное Копное право - Наглядный пример. ',
        role: 'Автор',
        description: null,
        date: new Date(2020, 2, 24),
        link: 'https://www.youtube.com/watch?v=58DfysctJ50',
      },
    ]
  },
  // Володя
  {
    who: {
      id: null,
      uid: null,
      photo: 'https://sun9-19.userapi.com/c851436/v851436387/d1c1e/aDWCWjILtJU.jpg',
      name: 'Интулов Владимир',
    },
    deals: [
      {
        project: 'Создание группы в ВК, администрирование',
        role: 'Администратор',
        description: null,
        date: new Date(2017, 4, 17),
        link: 'https://vk.com/kopnik_org',
      },
      {
        project: 'Создание группы в Facebook, администрирование',
        role: 'Администратор',
        description: null,
        date: new Date(2017, 6, 17),
      },
      {
        project: 'Видеомонтаж роликов для Youtube канала',
        role: 'Видеомонтажер',
        description: null,
        date: new Date(2019, 4, 23),
        link: 'https://www.youtube.com/channel/UCJRtg8s94PTFXEfZ6sEnlGw',
      },
    ]
  },
]

thanks = thanks.map(eachThank => {
  eachThank.deals = eachThank.deals.filter(eachDeal => eachDeal.date < new Date).sort((dealA, dealB) => dealA.date > dealB.date ? -1 : 1)
  return eachThank
}).filter(eachThank => eachThank.deals.length).sort((thankA, thankB) => thankA.deals[0].date > thankB.deals[0].date ? -1 : 1)

export default thanks
