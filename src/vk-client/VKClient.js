import ClientOAuth2 from "client-oauth2";

export default class VKClient {
  constructor(options) {
    this.token = undefined
    this.OAuth = new ClientOAuth2(options)
  }

  async auth() {
    // загружаем токен
    if (!this.token) {
      this.restoreToken()
    }

    // обновляем токен
    if (this.token) {
      if (this.token.expired()) {
        this.token = await this.token.refresh()
      }
    }
    // получаем токен впервые
    else if (!window.location.href.match(/access_token/)) {
      window.location.href = this.OAuth.token.getUri()
    } else {
      this.token = await this.OAuth.token.getToken(window.location.href)
    }

    if (!this.token /*|| this.token.expired() безсрочный*/) {
      throw new Error('Пользователь не авторизован в ВКонтакте')
    }

    // сохраняем токен
    this.storeToken()
  }

  storeToken() {
    localStorage.setItem(this.constructor.name, JSON.stringify({token: this.token,}))
  }

  restoreToken() {
    const value = localStorage.getItem(this.constructor.name)
    this.token = value ? value.token : null
  }
}
