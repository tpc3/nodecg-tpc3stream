import type { DiscordChatReplicant, DiscordVoiceReplicant, PlaybackReplicant } from "../types/schemas";
import { clock, changeCategory, isPlayback, isQueue, getJSON } from "./common";
import anime from "animejs"

const vcRep = nodecg.Replicant<DiscordVoiceReplicant[]>("vc");
const chatRep = nodecg.Replicant<DiscordChatReplicant>("chat");
const playbackRep = nodecg.Replicant<PlaybackReplicant>("playback");
const streamRep = nodecg.Replicant<string>("stream");

let isPlaybackAnim: boolean = false;

window.onload = () =>{
    const clockElm = document.getElementById("clock");
	if(clockElm != null){
		clock(clockElm);
		setInterval(()=>{
			clock(clockElm);
		}, 1000);
	}
}

NodeCG.waitForReplicants(vcRep, chatRep, playbackRep, streamRep).then(()=>{
    playbackRep.on("change", newValue=>{
		if(isPlayback(newValue) && !isPlaybackAnim){
            isPlaybackAnim = true;
			BGMChangeAnime();
		}
	});
	vcRep.on("change" , (newValue) =>{
        const vcElm = document.getElementById("vc");
	    const templateElm = document.getElementById("vc-template");
	    if(!(vcElm instanceof HTMLElement && templateElm instanceof HTMLElement)){
		    return;
	    }
		vcElm.innerHTML=""
		if(!Array.isArray(newValue) || newValue.length === 0){
			return;
		}
		newValue.forEach((member) =>{
			let newElm = <HTMLElement>templateElm.cloneNode(true)
			if(!(newElm.firstElementChild instanceof HTMLImageElement && newElm.lastElementChild instanceof HTMLElement && newElm.childElementCount === 2) ){
				return;
			}
			newElm.id = "";
			if(member.avatar != null && member.avatar !== ""){
				newElm.firstElementChild.src = member.avatar;
			}
			newElm.lastElementChild.innerText = member.name;
			if(member.speaking){
				newElm.firstElementChild.classList.add("outline","outline-emerald-500", "outline-4");
			}
			vcElm.appendChild(newElm);
		})
	})
    chatRep.on("change", (newValue,oldValue) =>{
        if(!isChat(oldValue) || !isChat(newValue)){
			return;
		}
        if(oldValue === newValue){
			return;
		}
        const chatElm = document.getElementById("chat")
		const tempElm = document.getElementById("chat-template");
		const authorElm = document.getElementById("chat-author");
		const contentElm = document.getElementById("chat-content");
        if (chatElm == null || tempElm == null || authorElm == null || contentElm == null){
			return;
		}
        authorElm.innerText = newValue.name;
        contentElm.innerText = newValue.content;
        const newChatElm = <HTMLElement>tempElm.cloneNode(true);
        newChatElm.id = "";
		anime({
			targets: newChatElm,
			duration: 1000,
			translateX:["5vw", 0],
			opacity: [0,1],
			scale: [0.8,1],
			easing: "easeOutExpo"
		})
        chatElm.appendChild(newChatElm);
        while(Math.ceil(chatElm.getBoundingClientRect().height) < chatElm.scrollHeight){
			if (chatElm.firstElementChild != null){
				chatElm.removeChild(chatElm.firstElementChild);
			}
		}
    });
    streamRep.on("change", newValue => {
        if(typeof newValue !== "string"){
            return;
        };
        const onair = document.getElementById("onair");
        const by = document.getElementById("by");
        const category = document.getElementById("category");
        if(onair == null || by == null || category == null){
            return;
        }
        getJSON(newValue, (v: unknown) => {
            if(!isQueue(v)){
                return;
            }
            onair.innerText = v.title;
            by.innerText = v.author;
            changeCategory(category, v.category);
        });
    })

});

const BGMChangeAnime = () => {
    anime({
        targets: "#playback",
        duration: 500,
        easing: "easeOutCirc",
        translateY: "120%",
        complete: () => {
            const track = document.getElementById("track");
            const artist = document.getElementById("artist");
            if(isPlayback(playbackRep.value) 
                && track instanceof HTMLElement 
                && artist instanceof HTMLElement)
            {
                if(!playbackRep.value.state){
                    track.innerText = "";
                    artist.innerText = "Stopped";
                    isPlaybackAnim = false;
                }
                else{
                    track.innerText = playbackRep.value.title;
                    if( typeof playbackRep.value.author === "string" && playbackRep.value.author !== ""){
                        artist.innerText = playbackRep.value.author;
                    }
                    else{
                        artist.innerText = "Unknown Artist"
                    }
                    const tl = anime.timeline({})
                    tl.add({
                        targets: "#playback-text",
                        duration: 1,
                        easing: "linear",
                        translateY: 0,
                    })
                    tl.add({
                        targets: "#playback",
                        duration: 1000,
                        easing: "easeOutElastic",
                        translateY: "0%",
                    });
                    tl.add({
                        delay: 5000,
                        targets: "#playback-text",
                        duration: 750,
                        easing: "easeOutExpo",
                        translateY: -40,
                        complete: () => {
                            isPlaybackAnim = false;
                        }
                })
                }
            }
        }
    })
}


function isChat(value: unknown): value is DiscordChatReplicant{
    if(typeof value !== "object" || value == null ) {
        return false;
    }
    const { name, content, avatar } = value as Record<keyof DiscordChatReplicant, unknown>;
    if(typeof name !== "string" || name == null){
        return false;
    }
    if(typeof content !== "string" || content == null){
        return false
    }
    if(typeof avatar !== "string" || avatar == null){
        return false
    }
    return true;
}