import type { EventTitleReplicant } from "../types/schemas"

const titleRep = nodecg.Replicant<EventTitleReplicant>("title");

NodeCG.waitForReplicants(titleRep).then(()=>{
    const title = document.getElementById("title");
	const url = document.getElementById("url");
	const author = document.getElementById("author");
    const applyBtn = document.getElementById("apply");
    if(!(title instanceof HTMLInputElement
        && url instanceof HTMLInputElement
        && author instanceof HTMLInputElement
        && applyBtn instanceof HTMLButtonElement
    )){
        return;
    }
    applyBtn.onclick = () => {
        titleRep.value = {
            title: title.value,
            url: url.value,
            author: author.value
        };
    }
    titleRep.on("change", newValue => {
        if(typeof newValue === "object"
            && typeof newValue.title === "string"
            && typeof newValue.author === "string"
            && typeof newValue.url === "string"
        ){
            title.value = newValue.title;
            url.value = newValue.url;
            author.value = newValue.author;
        }
    });
})