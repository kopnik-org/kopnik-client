const today = new Date();
today.setHours(0,0,0,0);

let thanks = [
    // Артем
    {
        who: {
            id: 1,
            uid: null,
            photo: null,
            name: null,
        },
        deals: [
            {
                project: 'v0.1 kopnik.org',
                role: 'PHP-мастер',
                description: null,
                date: today,
            },
        ]
    },
    //Алексей
    {
        who: {
            id: 2,
            uid: null,
            photo: null,
            name: null,
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
                role: 'Автор/Дизайнер',
                description: null,
                date: new Date(2019, 11, 15),
                link: 'www.kopnik.org',
            },
            {
                project: 'v0.1 kopnik.org',
                role: 'Vue.js-мастер',
                description: null,
                date: today,
            },
        ]
    },
    //Александр
    {
        who: {
            id: 3,
            uid: null,
            photo: null,
            name: null
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
    // Дмитрий журбин
    {
        who: {
            id: null,
            uid: null,
            photo: 'https://sun9-43.userapi.com/c849124/v849124535/9890d/jqIsFAEYLdA.jpg',
            name: 'Дмитрий Журбин',
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
            name: 'Владимир Монухин',
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
            name: 'Евгений Нигматуллинн',
        },
        deals: [
            {
                project: 'Разделы "Нас поддерживают" и "Мы в соцсетях" на временном сайте kopnik.org',
                role: 'Веб-мастер',
                description: null,
                date: new Date(2019, 11, 1),
                link: 'kopnik.org',
            },
            {
                project: 'Новый временный сайт kopnik.org',
                role: 'Веб-мастер',
                description: null,
                date: new Date(2019, 12, 8),
                link: 'kopnik.org',
            },
        ]
    },
]
thanks = thanks.map(eachThank => {
    eachThank.deals = eachThank.deals.filter(eachDeal => eachDeal.date < new Date).sort((dealA, dealB) => dealA.date > dealB.date ? -1 : 1)
    return eachThank
}).filter(eachThank => eachThank.deals.length).sort((thankA, thankB)=>thankA.deals[0]>thankB.deals[0]?-1:1)

export default thanks
