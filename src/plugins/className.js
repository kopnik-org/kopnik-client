import * as models from "../models";

global.className=  function (constructor)
{         // uglify минимизирует имена классов, гаденыш https://github.com/vuejs/vue-cli/issues/1118
    if (constructor === models.Kopnik) {
        return 'Kopnik'
    }
    else{
        return constructor.name
    }
}
