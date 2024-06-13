import e from "express";
import type { InfoReplicant } from "../types/schemas/infoReplicant";
const techList = document.getElementById("tech-list");
const addBtn = document.getElementById("tech-add");
const removeBtn = document.getElementById("tech-remove");
const applyBtn = document.getElementById("tech-apply");
const pushEnable = document.getElementById("push-enable");
const pushForm = document.getElementById("push-form");

const techRep = nodecg.Replicant<InfoReplicant[]>("tech");
const pushRep = nodecg.Replicant<InfoReplicant>("push");
let activeForms: number = 0;

NodeCG.waitForReplicants(techRep, pushRep).then(() => {
    if(!(addBtn instanceof HTMLButtonElement 
        && removeBtn instanceof HTMLButtonElement 
        && applyBtn instanceof HTMLButtonElement
        && techList instanceof HTMLElement
        && pushEnable instanceof HTMLInputElement
        && pushEnable.type === "checkbox"
        && pushForm instanceof HTMLInputElement))
    {
        return;
    }
    if(Array.isArray(techRep.value)){
        for(let i=0; i < techRep.value.length; i++){
            if (!isInfoReplicant(techRep.value[i], true)){
                continue
            }
            addNewForm();
            const currentForm = document.forms[i];
            const currentInfo = techRep.value[i];
            if(currentForm.info instanceof HTMLInputElement){
                currentForm.info.value = currentInfo.content;
            }
            if(currentForm.icon instanceof HTMLInputElement && typeof currentInfo.icon === "string"){
                currentForm.icon.value = currentInfo.icon;
            }   
        }
    }
    pushEnable.addEventListener("change", changePush);
    
    addBtn.onclick = () =>
    {
        addNewForm();
    }
    removeBtn.onclick = () =>
    {
        const lastElm = techList.lastElementChild
        if(lastElm instanceof HTMLElement)
        techList.removeChild(lastElm);
        activeForms--;
        if (activeForms === 0 && removeBtn instanceof HTMLButtonElement){
            removeBtn.disabled = true;
        }
        send();
    }
    applyBtn.onclick = () =>{
        send();
    }
})

const addNewForm = () =>{
    const templateElm = document.getElementById("template");
    if (!(templateElm instanceof HTMLElement)){
        return;
    }
    const newElm = templateElm.cloneNode(true);
    if(!(newElm instanceof HTMLElement)){
        return;
    }
    newElm.id = "";
    newElm.classList.remove("hidden");
    if(techList instanceof HTMLElement){
        techList.appendChild(newElm);
        activeForms++;
    }
    if(removeBtn instanceof HTMLButtonElement){
        removeBtn.disabled = false;
    }
}

const send = () => {
    let newObj: InfoReplicant[] = [];
    for(let i=0; i<activeForms; i++){
        const currentForm = document.forms[i];
        newObj.push({
            enable: true,
            icon: currentForm.icon.value,
            content: currentForm.info.value,
        });
    }
    techRep.value = newObj;
}

const changePush = (event: Event) => {
    if(!(pushForm instanceof HTMLInputElement
        && event.target instanceof HTMLInputElement
        && event.target.type === "checkbox"
    )) return;
    let newObj: InfoReplicant = {
        enable: event.target.checked,
        content: pushForm.value
    };
    pushRep.value = newObj;
}

function isInfoReplicant(value: unknown, needIcon: boolean): value is InfoReplicant {
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
    if(!needIcon){
        return true;
    }
    if(typeof icon !== "string" || icon == null){
        return false;
    }
    return true;
}