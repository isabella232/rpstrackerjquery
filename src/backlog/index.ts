//import * as _ from 'lodash';
import $ from "jquery";
//import 'kendo-ui';
//import 'rxjs';

//import "@progress/kendo-ui/js/kendo.datepicker.js";

import '@progress/kendo-ui';
//import '@progress/kendo-ui/css/common';

import 'kendo-ui-core/css/web/kendo.common.css';
import 'kendo-ui-core/css/web/kendo.default.min.css';

import './backlog.css';


import { Store } from "../core/state/app-store";
import { BacklogRepository } from "./backlog.repository";
import { BacklogService } from "./backlog.service";
import { PtItem } from "../core/models/domain";
import { PresetType } from "../core/models/domain/types";
import { ItemType } from "../core/constants";
import { getIndicatorClass } from "../shared/helpers/priority-styling";


/*
function component() {
    let element = document.createElement('div');

    // Lodash, currently included via a script, is required for this line to work
    element.innerHTML = _.join(['Hello', 'webpack4 3'], ' ');

    return element;
}

document.body.appendChild(component());
*/

export class BacklogPage {
    private store: Store = new Store();
    private backlogRepo: BacklogRepository = new BacklogRepository();
    private backlogService: BacklogService = new BacklogService(this.backlogRepo, this.store);

    public items: PtItem[] = [];
    public currentPreset: PresetType = 'open';


    public refresh(): Promise<PtItem[]> {
        return this.backlogService.getItems(this.currentPreset)
            .then(ptItems => {
                this.items = ptItems;
                return ptItems;
            });
    }
}

const backlogPage = new BacklogPage();
function getIndicatorImage(item: PtItem) {
    return ItemType.imageResFromType(item.type);
}

function renderTableRows(items: PtItem[]): string {
    return items.map(i => renderTableRow(i)).join();
}
function renderTableRow(item: PtItem): string {
    return `
    <tr class="pt-table-row" data-id="${item.id}">
        <td><img src="${getIndicatorImage(item)}" class="backlog-icon"></td>
        <td><img src="${item.assignee.avatar}"
                class="li-avatar rounded mx-auto d-block" /></td>
        <td><span class="li-title">${item.title}</span></td>
        <td><span class="${'badge ' + getIndicatorClass(item.priority)}">${item.priority}</span></td>
        <td><span class="li-estimate">${item.estimate}</span></td>
        <td><span class="li-date">${item.dateCreated.toDateString()}</span></td>
    </tr>
    `;
}

$(() => {
    $(document).on("click", "#itemsTableBody tr", (e) => {
        const itemId = $(e.currentTarget).attr('data-id');
        console.log(itemId);
    });

    backlogPage.refresh()
        .then(items => {
            $('#itemsTableBody').html(renderTableRows(items));
        });

});
