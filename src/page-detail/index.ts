import $ from "jquery";
import "bootstrap/dist/js/bootstrap";

import { PtItem } from "../core/models/domain";
import { pushUrl, getQueryParameter } from '../utils/url';
import { DetailScreenType } from "../shared/models/ui/types/detail-screens";
import { DetailPageModel } from "./detail-page-model";
import { renderScreenDetails } from "./screens/details-screen";
import { PtItemDetailsScreenProps, DetailsScreenModel } from "./screens/details-screen-model";
import { PtItemTasksScreenProps, TasksScreenModel } from "./screens/tasks-screen-model";
import { renderScreenTasks } from "./screens/tasks-screen";

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

function createScreenTasks(detailPageModel: DetailPageModel) {
    const modelProps: PtItemTasksScreenProps = {
        tasks$: detailPageModel.tasks$,
        addNewTask: (newTask) => detailPageModel.onAddNewTask(newTask),
        updateTask: (taskUpdate) => detailPageModel.onUpdateTask(taskUpdate)
    };

    const tasksScreenModel: TasksScreenModel = new TasksScreenModel(modelProps);

    renderScreenTasks(tasksScreenModel);
}

detailPageModel.item$.subscribe(item => {
    if (item) {
        renderPageChanges(item);
        switch (detailPageModel.currentScreen) {
            case 'details':
                createScreenDetails(detailPageModel);
                break;
            case 'tasks':
                createScreenTasks(detailPageModel);
                break;
            case 'chitchat':
                //renderScreenChitchat(detailPageModel);
                break;
        }
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

detailPageModel.refresh();
