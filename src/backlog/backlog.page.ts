import { Store } from "../core/state/app-store";
import { BacklogRepository } from "./backlog.repository";
import { BacklogService } from "./backlog.service";
import { PtItem } from "../core/models/domain";
import { PresetType } from "../core/models/domain/types";
import { BehaviorSubject } from "rxjs";

export class BacklogPage {
    private store: Store = new Store();
    private backlogRepo: BacklogRepository = new BacklogRepository();
    private backlogService: BacklogService = new BacklogService(this.backlogRepo, this.store);

    public items: PtItem[] = [];
    public currentPreset: PresetType = 'open';

    constructor(reqPreset: PresetType) {
        this.currentPreset = reqPreset;
    }

    public refresh(): Promise<PtItem[]> {
        return this.backlogService.getItems(this.currentPreset)
            .then(ptItems => {
                this.items = ptItems;
                return ptItems;
            });
    }
}
