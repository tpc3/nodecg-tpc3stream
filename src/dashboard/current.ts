import { run } from "node:test";

const streamRep = nodecg.Replicant<string>("stream");
const nextRep = nodecg.Replicant<string>("next");
const asset = nodecg.Replicant("assets:streams");

NodeCG.waitForReplicants(streamRep, nextRep, asset).then(()=>{
    const pulldown = document.getElementById("pulldown");
    const pulldown_next = document.getElementById("pulldown-next");
    const applyBtn = document.getElementById("apply");
    if(!(pulldown instanceof HTMLSelectElement
        && pulldown_next instanceof HTMLSelectElement
        && applyBtn instanceof HTMLButtonElement
    )){
        return;
    }
    applyBtn.onclick = () => {
		send();
	}

    const send = () =>{
        streamRep.value = pulldown.selectedOptions[0].value;
		nextRep.value = pulldown_next.selectedOptions[0].value;
    };

	asset.on('change', newVal => {
        pulldown.innerHTML="";
		pulldown_next.innerHTML = "";
        if(Array.isArray(newVal)) {
            const arr = [ ...newVal ].sort((a,b) => a.name > b.name ? 1 : -1);
            for (const assetKey of arr.sort()) {
                let option = document.createElement("option");
                option.text = assetKey.name;
                option.value = assetKey.url;
                pulldown.appendChild(option.cloneNode(true));
                pulldown_next.appendChild(option.cloneNode(true));
            }
        }
	});
});