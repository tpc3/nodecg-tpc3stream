
const bgRep = nodecg.Replicant<string>("background");
const asset = nodecg.Replicant("assets:images");

NodeCG.waitForReplicants(bgRep, asset).then(()=>{
    const bgPulldown = document.getElementById("pulldown-bg");
    const applyBtn = document.getElementById("apply");
    if(!(bgPulldown instanceof HTMLSelectElement
        && applyBtn instanceof HTMLButtonElement
    )){
        return;
    }
    applyBtn.onclick = () => {
		send();
	}

    const send = () =>{
        bgRep.value = bgPulldown.selectedOptions[0].value;
    };

	asset.on('change', newVal => {
        bgPulldown.innerHTML="";
        if(Array.isArray(newVal)) {
            const arr = [ ...newVal ].sort((a,b) => a.name > b.name ? 1 : -1);
            for (const assetKey of arr.sort()) {
                let option = document.createElement("option");
                option.text = assetKey.name;
                option.value = assetKey.url;
                bgPulldown.appendChild(option.cloneNode(true));
            }
        }
	});
});