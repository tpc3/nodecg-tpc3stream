import type { PlaybackReplicant, QueueReplicant } from "../types/schemas"
export const clock = (e: HTMLElement) => {
	const chk = (i: number) => {
		if (i < 10) {
			return '0' + i;
		}

		return String(i);
	};

	const time = new Date();
	e.innerText = chk(time.getHours()) + ':' + chk(time.getMinutes()) + ':' + chk(time.getSeconds());
};

export interface CategoryLists{
	GM: string;
	GS: string;
	PT: string;
	WS: string;
	SP: string;
	[key: string]: string; 
}

export const changeCategory = (elm: HTMLElement, category: string) => {
	const CategoryIconList: CategoryLists = {
		GM: "mdi-cards-playing",
		GS: "mdi-gamepad-variant",
		PT: "mdi-presentation",
		WS: "mdi-hammer-wrench",
		SP: "mdi-forum"
	}
	elm.classList.remove("mdi-information");
	Object.keys(CategoryIconList).forEach((key) =>{
		elm.classList.remove(CategoryIconList[key]);
	})
	if(CategoryIconList.hasOwnProperty(category)){
		elm.classList.add(CategoryIconList[category]);
	}
	else{
		elm.classList.add("mdi-information");
	}
}

export function isPlayback(value: unknown): value is PlaybackReplicant{
    if(typeof value !== "object" || value == null ) {
        return false;
    }
    const { state, title } =  value as Record<keyof PlaybackReplicant, unknown>;
    if(typeof title !== "string" || title == null){
        return false;
    }
    if(typeof state !== "boolean"){
        return false;
    }
    return true;
}

export function isQueue(value: unknown): value is QueueReplicant{
	if(typeof value !== "object" || value == null ) {
        return false;
    }
	const { title, author, time, category } = value as Record<keyof QueueReplicant, unknown>;
	if(typeof title !== "string" || title == null){
        return false;
    }
	if(typeof author !== "string" || author == null){
        return false;
    }
	if(typeof time !== "string" || time == null){
        return false;
    }
	if(typeof category !== "string" || category == null){
        return false;
    }
	return true;
}

export const getJSON = function (url: string, callback: Function) {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'json';
	xhr.onload = function () {
		const {status} = xhr;
		if (status === 200) {
			callback(xhr.response);
		} else {
			console.log('Error while GETting json, ' + String(status));
			callback(null);
		}
	};

	xhr.send();
};