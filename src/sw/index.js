import {container} from "@/bottle/bottle";
import Kopnik from "@/models/Kopnik";

setInterval(async function () {
  const user = container.application.user;
  if (user) {
    await user.reloadEx()
  }
}, container.constants.sw.delay)
