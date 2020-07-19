/**
 * Created by alexey2baranov on 07.02.17.
 */
import {container} from "../../bottle/bottle";

const logger={
  created(){
    this.logger= container.logger.getLogger(this.$options.name+".vue")
  }
}
export default logger
