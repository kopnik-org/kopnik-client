/**
 * Created by alexey2baranov on 07.02.17.
 */
import {container} from "../../plugins/bottle";

export default {
  created(){
    this.logger= container.logger.getLogger(this.$options.name+".vue")
  }
}
