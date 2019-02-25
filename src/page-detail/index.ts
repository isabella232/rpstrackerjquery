import $ from "jquery";
import "bootstrap/dist/js/bootstrap";

import { PtUser, PtItem } from "../core/models/domain";
import { pushUrl, getQueryParameter } from '../utils/url';
import { DetailScreenType } from "../shared/models/ui/types/detail-screens";
import { DetailPageModel } from "./detail-page-model";
import { renderAssignees, renderScreenDetails } from "./screens/details-screen";
import { PtItemDetailsScreenProps, DetailsScreenModel } from "./screens/details-screen-model";

const reqScreen = getQueryParameter('screen') as DetailScreenType;
const reqItemId = Number(getQueryParameter('itemId'));
const detailPageModel = new DetailPageModel(reqScreen, reqItemId);

function createScreenDetails(detailPageModel: DetailPageModel) {
    const modelProps: PtItemDetailsScreenProps = {
        item: detailPageModel.item$.value,
        users$: detailPageModel.users$,
        itemSaved: (item) => detailPageModel.onItemSaved(item),
        usersRequested: () => detailPageModel.onUsersRequested()
    };

    const detailsScreenModel: DetailsScreenModel = new DetailsScreenModel(modelProps);

    renderScreenDetails(detailsScreenModel);
}

detailPageModel.item$.subscribe(item => {
    if (item) {
        renderPageChanges(item);
        switch (detailPageModel.currentScreen) {
            case 'details':
                createScreenDetails(detailPageModel);
                break;
            case 'tasks':
                //renderScreenTasks(detailPageModel);
                break;
            case 'chitchat':
                //renderScreenChitchat(detailPageModel);
                break;
        }
    }
});

detailPageModel.users$.subscribe((users: PtUser[]) => {
    if (users.length > 0) {
        renderAssignees(users);
    }
});


$('.btn-screen-switch').click((e) => {
    const selScreen = $(e.currentTarget).attr('data-screen') as DetailScreenType;
    pushUrl('', 'page-detail/detail.html', `?screen=${selScreen}&itemId=${detailPageModel.itemId}`);
    detailPageModel.currentScreen = selScreen;
    detailPageModel.refresh();
});

function renderPageChanges(item: PtItem) {
    $('#itemTitle').text(item.title);
}

/*
function renderScreenTasks() {
    const tasksTemplate = $('#tasksTemplate').html();
    const renderedHtml = tasksTemplate
        .replace(/{{title}}/ig, detailPageModel.itemForm.title)
        .replace(/{{description}}/ig, detailPageModel.itemForm.description)
        .replace(/{{assigneeName}}/ig, detailPageModel.itemForm.assigneeName);

    $('#detailScreenContainer').html(renderedHtml);
}

function renderScreenChitchat() {
    const chitchatTemplate = $('#chitchatTemplate').html();
    const renderedHtml = chitchatTemplate
        .replace(/{{title}}/ig, detailPageModel.itemForm.title)
        .replace(/{{description}}/ig, detailPageModel.itemForm.description)
        .replace(/{{assigneeName}}/ig, detailPageModel.itemForm.assigneeName);

    $('#detailScreenContainer').html(renderedHtml);
}
*/


detailPageModel.refresh();


/*
backlogPage.items$.subscribe(items => {
    $('#itemsTableBody').html(renderTableRows(items));
});

const newItemTypeSelectObj = $('#newItemType');
$.each(backlogPage.itemTypesProvider, (key, value) => {
    newItemTypeSelectObj.append($("<option></option>")
        .attr("value", value)
        .text(value));
});

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


$('.btn-backlog-filter').click((e) => {
    const selPreset = $(e.currentTarget).attr('data-preset') as PresetType;
    pushUrl('', 'backlog/backlog.html', '?preset=' + selPreset);
    backlogPage.currentPreset = selPreset;
    backlogPage.refresh();
});

$('#btnAddItemSave').click(() => {
    const newTitle = $('#newItemTitle').val() as string;
    const newDescription = $('#newItemDescription').val() as string;
    const newItemType = $('#newItemType').val() as PtItemType;
    const newItem: PtNewItem = {
        title: newTitle,
        description: newDescription,
        typeStr: newItemType
    };
    backlogPage.onAddSave(newItem);
});

$(document).on("click", "#itemsTableBody tr", (e) => {
    const itemId = $(e.currentTarget).attr('data-id');
    console.log(itemId);
});

backlogPage.refresh();
*/
