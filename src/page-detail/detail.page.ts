import { Store } from "../core/state/app-store";

import { PtItem } from "../core/models/domain";
import { BehaviorSubject } from "rxjs";
import { PtNewItem } from "../shared/models/dto/pt-new-item";
import { ItemType } from "../core/constants";
import { DetailScreenType } from "../shared/models/ui/types/detail-screens";

export class DetailPage {
    private store: Store = new Store();
    //private backlogRepo: BacklogRepository = new BacklogRepository();
    //private backlogService: BacklogService = new BacklogService(this.backlogRepo, this.store);


    public detalsForm = {
        title: 'Hello'
    };


    public currentScreen: DetailScreenType = 'details';


    constructor(reqScreen: DetailScreenType) {
        this.currentScreen = reqScreen;
    }

}
