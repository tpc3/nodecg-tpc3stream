const embedRep = nodecg.Replicant<string>("embed");
const urlElem = document.getElementById("url");
const applyBtn = document.getElementById("apply");
const embedElem = document.getElementById("embed");

NodeCG.waitForReplicants(embedRep).then(()=>{
    if( !(urlElem instanceof HTMLInputElement 
        && applyBtn instanceof HTMLButtonElement
        && embedElem instanceof HTMLIFrameElement
    )){
        return;
    }
	applyBtn.onclick = () => {
        embedRep.value = urlElem.value;
	}
    embedRep.on("change", newVal => {
        if(typeof newVal === "string"){
            embedElem.src = newVal;
            urlElem.value = newVal;
        }
	})
})