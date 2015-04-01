import { implement    } from "../helpers"; 
import { RETURN_THIS  } from "../const";
implement({
    extend(mixins, global) {
        return mixins ? global ? implement(mixins) : implement(mixins, null, () => RETURN_THIS) : false;
    }
});