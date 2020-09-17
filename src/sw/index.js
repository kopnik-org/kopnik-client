import {container} from "@/bottle/bottle";
import Kopnik from "@/models/Kopnik";

// чтобы тело сервисворкера вызывалось после того как выполнится main.js
Promise.resolve()
  .then(() => setInterval(async function () {
      const user = container.application.user;
      if (user) {
        await user.reloadEx()
        if (user.foreman) {
          await user.foreman.reload()
        }
      }
    }, container.constants.sw.delay)
  )

