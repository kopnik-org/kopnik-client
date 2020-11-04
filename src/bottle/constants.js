/**
 * Created by alexey2baranov on 8/20/16.
 *
 * домены и редикт урлы
 * https://vk.com/apps?act=manage
 * дебаг на телефоне
 * https://developers.google.com/web/tools/chrome-devtools/remote-debugging?utm_source=dcc&utm_medium=redirect&utm_campaign=2016q3
 */
let constants = {
  "development": {
    sw: {
      delay: 15000,
    },
    messenger: {
      // идентификатор нашего приложения ВК
      // clientId: 7210289,
      // страница, на которую нужно перейти для аутентификации
      loginUrl: 'http://localhost:8081/connect/vkontakte',
      // с мобилки
      // loginUrl: 'http://192.168.43.84:8081/connect/vkontakte'
    },
    api: {
      path: "http://localhost:8081/api"
      // с мобилки
      // path: "http://192.168.43.84:8081/api"
    },
    di: {
      fetch: true,
      cookie: false
    }
  },
  "test": {
    sw: {
      delay: Number.MAX_SAFE_INTEGER,
    },
    messenger: {
      // clientId: 7210289,
      loginUrl: 'http://localhost:8082/connect/vkontakte',
      // redirectUrl: 'http://localhost:8082/login/check-vk'
    },
    api: {
      path: "http://localhost:8082/api"
    },
    di: {
      fetch: false,
      cookie: true
    }
  },
  "staging": {
    sw: {
      delay: 20000,
    },
    messenger: {
      loginUrl: 'https://staging.kopnik.org/connect/vkontakte',
      // clientId: 7210289,
      // redirectUrl: 'https://staging.kopnik.org/login/check-vk'
    },
    api: {
      path: "https://staging.kopnik.org/api"
    },
    di: {
      fetch: true,
      cookie: false
    }
  }
}

export default constants
