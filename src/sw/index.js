import {container} from "@/bottle/bottle";
import Kopnik from "@/models/Kopnik";

setInterval(async function () {
  const user = container.application.user;
  if (user) {
    const ids = [user.id]
    // container.application.user.reloadSubordinates()
    if (user.foreman) {
      ids.push(user.foreman.id)
    }
    if (user.subordinates) {
      ids.push(...user.subordinates.map(eachSubordinates => eachSubordinates.id))
    }
    const result = await Kopnik.api('get?ids=' + ids.join(','))

    if (user) {
      // мержим всех в кеш
      result.forEach(eachKopnikAsJson => {
        Kopnik.merge(eachKopnikAsJson)
      })

      // удаляем из подчиненных отказавшихся
      if (user.subordinates) {
        user.subordinates= user.subordinates.filter(eachSubordinate=>eachSubordinate.foreman === user)
      }
    }
  }
}, container.constants.sw.delay)
