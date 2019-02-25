import { BehaviorSubject, Observable } from "rxjs";

import { Store } from "../core/state/app-store";
import { BacklogRepository } from "../core/services/backlog.repository";
import { BacklogService } from "../core/services/backlog.service";
import { PtUserService } from "../core/services/pt-user-service";
import { PtItem, PtUser } from "../core/models/domain";
import { DetailScreenType } from "../shared/models/ui/types/detail-screens";

export class DetailPageModel {
    private store: Store = new Store();
    private backlogRepo: BacklogRepository = new BacklogRepository();
    private backlogService: BacklogService = new BacklogService(this.backlogRepo, this.store);
    private ptUserService: PtUserService = new PtUserService(this.store);

    public currentUser: PtUser;
    public itemId: number = 0;
    public currentScreen: DetailScreenType = 'details';
    public item$: BehaviorSubject<PtItem> = new BehaviorSubject<PtItem>(null);
    public users$: Observable<PtUser[]> = this.store.select<PtUser[]>('users');

    constructor(reqScreen: DetailScreenType, itemId: number) {
        this.itemId = itemId;
        this.currentScreen = reqScreen;
        this.currentUser = this.store.value.currentUser;
    }

    public refresh() {
        return this.backlogService.getPtItem(this.itemId)
            .then(item => this.item$.next(item));
    }

    public onItemSaved(item: PtItem) {
        this.backlogService.updatePtItem(item)
            .then((updateItem: PtItem) => {
                this.item$.next(updateItem);
            });
    }

    public onUsersRequested() {
        this.ptUserService.fetchUsers();
    }
}
