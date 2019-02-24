import { Store } from "../core/state/app-store";

import { PtItem, PtUser } from "../core/models/domain";
import { BehaviorSubject, Observable } from "rxjs";
import { DetailScreenType } from "../shared/models/ui/types/detail-screens";
import { PtItemDetailsEditFormModel, ptItemToFormModel } from "../shared/models/forms/pt-item-details-edit-form";
import { BacklogRepository } from "../core/services/backlog.repository";
import { BacklogService } from "../core/services/backlog.service";
import { ItemType } from "../core/constants";
import { PT_ITEM_STATUSES } from "../core/constants";
import { PT_ITEM_PRIORITIES } from "../core/constants";
import { PtUserService } from "../core/services/pt-user-service";

export class DetailPage {
    private store: Store = new Store();
    private backlogRepo: BacklogRepository = new BacklogRepository();
    private backlogService: BacklogService = new BacklogService(this.backlogRepo, this.store);
    private ptUserService: PtUserService = new PtUserService(this.store);


    public itemForm: PtItemDetailsEditFormModel;
    public itemTypesProvider = ItemType.List.map((t) => t.PtItemType);
    public statusesProvider = PT_ITEM_STATUSES;
    public prioritiesProvider = PT_ITEM_PRIORITIES;
    public selectedAssignee: PtUser | undefined;

    public currentUser: PtUser;
    public itemId: number = 0;
    public currentScreen: DetailScreenType = 'details';
    public item$: BehaviorSubject<PtItem> = new BehaviorSubject<PtItem>(null);
    public users$: Observable<PtUser[]> = this.store.select<PtUser[]>('users');
    private users: PtUser[] = [];

    constructor(reqScreen: DetailScreenType, itemId: number) {
        this.itemId = itemId;
        this.currentScreen = reqScreen;
        this.currentUser = this.store.value.currentUser;

        this.item$.subscribe(item => {
            if (item) {
                this.itemForm = ptItemToFormModel(item);
                this.selectedAssignee = item.assignee;
            }
        });

        this.users$.subscribe(users => this.users = users);
    }

    public refresh() {
        return this.backlogService.getPtItem(this.itemId)
            .then(item => {
                this.item$.next(item);
                //this.tasks$.next(item.tasks);
                //this.comments$.next(item.comments);


            });
    }

    public notifyUpdateItem() {
        if (!this.itemForm) {
            return;
        }
        const updatedItem = this.getUpdatedItem(this.item$.value, this.itemForm, this.selectedAssignee);
        this.onItemSaved(updatedItem);
    }

    private getUpdatedItem(item: PtItem, itemForm: PtItemDetailsEditFormModel, assignee: PtUser): PtItem {
        const updatedItem = Object.assign({}, item, {
            title: itemForm.title,
            description: itemForm.description,
            type: itemForm.typeStr,
            status: itemForm.statusStr,
            priority: itemForm.priorityStr,
            estimate: itemForm.estimate,
            assignee: assignee
        });
        return updatedItem;
    }

    private onItemSaved(item: PtItem) {
        this.backlogService.updatePtItem(item)
            .then((updateItem: PtItem) => {
                this.item$.next(updateItem);
            });
    }

    public onUsersRequested() {
        this.ptUserService.fetchUsers();
    }

    public selectUserById(userId: number) {
        this.selectedAssignee = this.users.find(u => u.id === userId);
        this.itemForm.assigneeName = this.selectedAssignee.fullName;
        this.notifyUpdateItem();
    }

}
