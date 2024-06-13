import type { EventTitleReplicant, PlaybackReplicant, InfoReplicant } from "../types/schemas";
import { clock, changeCategory, isPlayback, getJSON, type CategoryLists, isQueue } from "./common";
import anime from "animejs";

const playbackRep = nodecg.Replicant<PlaybackReplicant>("playback");
const titleRep = nodecg.Replicant<EventTitleReplicant>("title");
const nextStreamRep = nodecg.Replicant<string>("next");
const techRep = nodecg.Replicant<InfoReplicant[]>("tech");
const bgRep = nodecg.Replicant<string>("background");

const categoryName : CategoryLists = {
    GM: "ゲーム:マルチ",
    GS: "ゲーム:シングル",
    PT: "プレゼンテーション",
    WS: "ワークショップ",
    LC: "ライブコーディング",
    SP: "その他・特殊"
}

let isPlaybackAnim: boolean = false;
let techNum: number = -1;

window.onload = () =>{
    const clockElm = document.getElementById("clock");
	if(clockElm != null){
		clock(clockElm);
		setInterval(()=>{
			clock(clockElm);
		}, 1000);
	}
}

NodeCG.waitForReplicants(playbackRep, titleRep, nextStreamRep, techRep, bgRep).then(()=>{
    techTl.play();
    setInterval(()=>{
        techTl.play();
    },10100);
    anime({
        targets: '#cursor',
        opacity: [{ value: 1, duration: 0 }, { value: 0 }],
        loop: true,
        easing: 'linear',
        duration: 1500,
        endDelay: 250
    })
    playbackRep.on("change", newValue=>{
		if(isPlayback(newValue) && !isPlaybackAnim){
			playbackTl.play();
		}
	});
    titleRep.on("change", (newValue) => {
        if(!(typeof newValue === "object"
            && typeof newValue.title === "string"
            && typeof newValue.author === "string"
            && typeof newValue.url === "string"
        )){
            return;
        }
        const titleElm = document.getElementById("title-text");
        const urlElm = document.getElementById("url-text");
        const authorElm = document.getElementById("author-text");
        if(titleElm == null || urlElm == null || authorElm == null){
            return;
        }
        titleElm.innerText = newValue.title;
        urlElm.innerText = newValue.url;
        authorElm.innerText = newValue.author;
    });
    nextStreamRep.on("change", newValue => {
        if(typeof newValue !== "string"){
            return
        }
        const onair = document.getElementById("onair-text");
        const by = document.getElementById("by-text");
        const time = document.getElementById("time-text");
        const category = document.getElementById("category-text");
        const categoryIcon = document.getElementById("category-icon")
        if( onair == null || by == null || time == null
             || category == null || categoryIcon == null
        ){
            return;
        }
        anime({
            targets: "#onair",
            duration: 1000,
            direction: "alternate",
            easing: "linear",
            opacity: [1,0]
        })
        setTimeout(() => {
            getJSON(newValue, (v: unknown) => {
                if(!isQueue(v)){
                    return;
                }
                onair.innerText = v.title;
                by.innerText = v.author;
                time.innerText = v.time;
                changeCategory(categoryIcon, v.category);
                if(categoryName.hasOwnProperty(v.category)){
                    category.innerHTML = categoryName[v.category]
                }else{
                    category.innerText = "未設定"
                }
            
            });
        }, 1000)

    });
    bgRep.on("change", newValue => {
        if(typeof newValue !== "string"){
            return
        }
        const bgElm = document.getElementById("bg");
        if(bgElm instanceof HTMLImageElement){
            if(newValue !== ""){
                bgElm.src = newValue;
                bgElm.classList.remove("hidden");
            }
            else{
                bgElm.src = ""
                bgElm.classList.add("hidden");
            }
        }
        
    });
    
})

const playbackTl = anime.timeline({
    targets: "#bgm-text",
    duration: 750,
    easing: "linear",
    autoplay: false
})

playbackTl.add({
    opacity: 0,
    begin: ()=>{
        isPlaybackAnim = true;
    },
    complete: ()=>{
        const BGMElm = document.getElementById("bgm-text");
        if(isPlayback(playbackRep.value) 
            && BGMElm instanceof HTMLElement)
        {
            if(!playbackRep.value.state){
                BGMElm.innerText = "Stopped";
            }
            else if(typeof playbackRep.value.author === "string" && playbackRep.value.author !== "" ){
                BGMElm.innerText = `${playbackRep.value.author} - ${playbackRep.value.title}`
            }
            else{
                BGMElm.innerText = `Unknown Artist - ${playbackRep.value.title}`
            }
        }
    }
})
playbackTl.add({
    opacity: 1,
    complete: ()=>{
        isPlaybackAnim = false;
    }
})

const techTl = anime.timeline({
    targets: "#tech",
    easing: "linear",
    autoplay: false,
})

techTl.add({
    opacity:[0,1],
    duration: 1000,
    begin: ()=>{
        
        const techIcon = document.getElementById("tech-icon");
        const techElm = document.getElementById("tech-text");
        if(techElm == null || techIcon == null){
            return;
        }
        techNum++;
        if(!Array.isArray(techRep.value) || techRep.value.length === 0){
            techNum = -1
            techElm.innerText = "運営からのお知らせがあればこちらに表示されます。";
            techIcon.innerText = "info";
            return;
        }
        if(techNum >= techRep.value.length){
            techNum = 0;
        }
        const techInfo = techRep.value[techNum]
        if(typeof techInfo.content !== "string"){
            techElm.innerText = "運営からのお知らせがあればこちらに表示されます。";
            techIcon.innerText = "info";
            return;
        }
        techElm.innerText = techInfo.content;
        if(typeof techInfo.icon === "undefined"){
            techIcon.innerText = "info";
            return;
        }
        techIcon.innerText = techInfo.icon;
    }
}).add({
    opacity:0,
    duration: 1000,
    delay: 8000,
})