import {container} from "@/bottle/bottle";
import Kopnik from "@/models/Kopnik";

setInterval(async function () {
  if (container.application.user) {
    const ids = [container.application.user.id]
    if (container.application.user.foreman) {
      ids.push(container.application.user.foreman.id)
    }
    const result = await Kopnik.api('get?ids=' + ids.join(','))
    result.forEach(eachKopnikAsJson => Kopnik.merge(eachKopnikAsJson))
  }
}, container.constants.sw.delay)
