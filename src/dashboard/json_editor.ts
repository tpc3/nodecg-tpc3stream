import type { QueueReplicant } from "../types/schemas/";

const asset = nodecg.Replicant("assets:streams");

NodeCG.waitForReplicants(asset).then(()=>{
    const pulldown = document.getElementById("pulldown");
    const nameElm = document.getElementById("name");
    const titleElm = document.getElementById("title");
    const authorElm = document.getElementById("author");
    const startElm = document.getElementById("startTime");
    const endElm = document.getElementById("endTime");
    const categoryElm = document.getElementById("category");
    const saveBtn = document.getElementById("save");
    const loadBtn = document.getElementById("load");

    if(!(pulldown instanceof HTMLSelectElement
        && nameElm instanceof HTMLInputElement
        && titleElm instanceof HTMLInputElement
        && authorElm instanceof HTMLInputElement
        && startElm instanceof HTMLInputElement
        && endElm instanceof HTMLInputElement
        && categoryElm instanceof HTMLInputElement
        && saveBtn instanceof HTMLButtonElement
        && loadBtn instanceof HTMLButtonElement
    )){
        return;
    }
    asset.on('change', newVal => {
        pulldown.innerHTML="";
        if(Array.isArray(newVal)) {
            const arr = [ ...newVal ].sort((a,b) => a.name > b.name ? 1 : -1);
            for (const assetKey of arr.sort()) {
                let option = document.createElement("option");
                option.text = assetKey.name;
                option.value = assetKey.url;
                pulldown.appendChild(option.cloneNode(true));
            }
        }
    });
    loadBtn.onclick = () => {
        getJSON(pulldown.selectedOptions[0].value, (v: unknown) => {
            if(!isQueue(v)){
                return;
            }
            nameElm.value = pulldown.selectedOptions[0].innerText;
            titleElm.value = v.title;
            authorElm.value = v.author;
            const times = v.time.split('~');
            startElm.value = times[0];
            endElm.value = times[1];
            categoryElm.value = v.category;
        });
    }
    saveBtn.onclick = () => {
        const newVal: QueueReplicant = {
            title: titleElm.value,
            author: authorElm.value,
            time: `${startElm.value}~${endElm.value}`,
            category: categoryElm.value

        }
        const newJSON = JSON.stringify(newVal);
        const blob = new Blob([newJSON],{type:"application/json"});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = nameElm.value + '.json';
        link.click();
    }

});

function isQueue(value: unknown): value is QueueReplicant{
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

const getJSON = function (url: string, callback: Function) {
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