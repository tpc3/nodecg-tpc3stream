const switchRep = nodecg.Replicant<string>("switch");
const konfesRep = nodecg.Replicant("konfes");
NodeCG.waitForReplicants(switchRep, konfesRep).then(()=>{
    const queueButton = document.getElementById("queue");
    const frameButton = document.getElementById("frame");
    if(!(queueButton instanceof HTMLButtonElement && frameButton instanceof HTMLButtonElement) ){
        return;
    }
    queueButton.onclick = () => {
        const queueSelector = document.getElementById("queue-selector");
        let val: string;
        if(queueSelector instanceof HTMLInputElement){
            val = queueSelector.value;
        }else{
            val = "1"
        }
        switchRep.value = "queue_" + val;
	}
	frameButton.onclick = () => {
		const frameSelector = document.getElementById("frame-selector");
        let val: string;
        if(frameSelector instanceof HTMLInputElement){
            val = frameSelector.value;
        }else {
			val = "1"
		}
        switchRep.value = "frame_" + val;
	}
	switchRep.on('change', newVal => {
		let color = "white";
		if (newVal != null && newVal.startsWith("queue")) {
			color = "red";
		}
		else if (newVal != null && newVal.startsWith("frame")) {
			color= "green";
		}
		document.body.style.backgroundColor = color;
	});
})
	