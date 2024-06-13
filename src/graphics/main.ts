import anime, { AnimeInstance, AnimeTimelineInstance } from "animejs";
import type {InfoReplicant} from "../types/schemas"
let switchval: string,  switchTl: AnimeTimelineInstance;
let isAnime: boolean = false;
let pushTextWidth: number = 0;

const switchRep = nodecg.Replicant<string>("switch");
const konfesRep = nodecg.Replicant<boolean>("konfes");
const pushRep = nodecg.Replicant<InfoReplicant>("push");

const queueScreen = document.getElementById("queue");
const frameScreen = document.getElementById("frame");

NodeCG.waitForReplicants(switchRep, konfesRep, pushRep).then(()=>{        
    nodecg.Replicant("switch").on("change", (newValue,oldValue) => {
        if(typeof newValue !== "string"){
            return;
        }
        if(newValue.startsWith("queue") || newValue.startsWith("frame")){
            switchval = newValue;
        }
        if(typeof oldValue !== "string"){
            if(switchval.startsWith("queue") && queueScreen instanceof HTMLIFrameElement){
                queueScreen.src="./"+ switchval + ".html";
                queueScreen.classList.remove("hidden");
            }
            else if(switchval.startsWith("frame") && frameScreen instanceof HTMLIFrameElement){
                frameScreen.src="./"+ switchval +".html";
                frameScreen.classList.remove("hidden");
            }
            return;
        }
        if(isAnime){
            return;
        }
        isAnime = true;
        switchTl.play();    
    });
    switchTl = anime.timeline({
        autoplay: false,

    });

    pushRep.on("change", newValue => {
        if(!isInfoReplicant(newValue)){
            return;
        }
        const pushTextElm = document.getElementById("push-text")
        if(!(pushTextElm instanceof HTMLElement)){
            return;
        }
        if(newValue.enable){
            pushTextElm.innerText = newValue.content;
            if(typeof pushTextElm.scrollWidth === "number") pushTextWidth = pushTextElm.scrollWidth
            anime({
                targets: "#push-text",
                loop: true,
                easing: "linear",
                duration: 20 * (window.innerWidth + pushTextWidth),
                translateX: [{ value: window.innerWidth, duration: 0 }, { value: -1 * pushTextWidth }],
            })
            anime({
                targets:"#push",
                easing: "linear",
                height: 48,
                duration: 750
            })
        }
        else{
            anime({
                targets:"#push",
                height: 0,
                duration: 750,
                easing: "linear",
                complete:()=>{
                    pushTextWidth = 0;
                    anime.remove("#push-text");
                }
            })
        }
    })
    switchTl.add({
        targets: "#background",
        translateX: 840,
        scale: 0,
        opacity: 1,
        duration: 1,
    });
    switchTl.add({
        targets: "#background",
        scale: 2.4,
        duration: 1800,
        easing: "linear",
        complete: () => {
            if(switchval.startsWith("queue") && queueScreen instanceof HTMLIFrameElement && frameScreen instanceof HTMLIFrameElement){
                queueScreen.src="./"+ switchval + ".html";
                queueScreen.classList.remove("hidden");
                frameScreen.classList.add("hidden");
            }
            else if(switchval.startsWith("frame") && queueScreen instanceof HTMLIFrameElement && frameScreen instanceof HTMLIFrameElement){
                frameScreen.src="./"+ switchval +".html";
                frameScreen.classList.remove("hidden");
                queueScreen.classList.add("hidden");
            }      
        },
    });
    switchTl.add({
        targets: "#tpc3",
        opacity: 1,
        duration: 500,
        easing: "linear",

    });
    switchTl.add({
        duration: 1000,
    });
    switchTl.add({
        targets: "#background",
        backgroundColor: "#FFF",
        duration: 300,
        easing: "easeOutCirc",
    });
    switchTl.add({
        duration: 800,
    });
    switchTl.add({
        targets: ".cutin",
        opacity: 0,
        duration: 500,
        easing: "easeOutCirc",
        complete: () =>{
            isAnime = false;
        }
    });

})

function isInfoReplicant(value: unknown): value is InfoReplicant {
    if(typeof value !== "object" || value == null ) {
        return false;
    }
    const { enable, content, icon } =  value as Record<keyof InfoReplicant, unknown>;
    if(typeof enable !== "boolean" || enable == null){
        return false;
    }
    if(typeof content !== "string" || content == null){
        return false;
    }
    return true;
}