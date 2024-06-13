import type NodeCG from '@nodecg/types';
import type { PlaybackReplicant, DiscordChatReplicant, DiscordVoiceReplicant, InfoReplicant } from '../types/schemas/index';
import { Router } from 'express';


module.exports = function (nodecg: NodeCG.ServerAPI) {
	//rep
	const vcRep = nodecg.Replicant<DiscordVoiceReplicant[]>("vc");
	const chatRep = nodecg.Replicant<DiscordChatReplicant>("chat");
    const playbackRep = nodecg.Replicant<PlaybackReplicant>("playback");
    const techRep = nodecg.Replicant<InfoReplicant[]>("tech");
    const switchRep = nodecg.Replicant<string>("switch");
	const router: Router = nodecg.Router();
    //initialize
    vcRep.value = [];
    playbackRep.value = {
        state:false,
        title:""
    }
    if(!Array.isArray(techRep.value)){
        techRep.value = [];
    }
    nodecg.Replicant<InfoReplicant>("push").value = {
        enable: false,
        content: ""
    }
    if(typeof switchRep.value === "undefined"){
        switchRep.value = "queue_1"
    }
    
	router.post("/chat", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const { name } = req.body;
        const { avatar } = req.body;
        const { content } = req.body;
        if (typeof name === "string" && typeof avatar === "string" && typeof content === "string") {
            res.send('{result: "ok", error: null}');
            chatRep.value = { name, avatar, content };
        } else {
            res.status(400).send('{result: "ng", "error": "Invaild type"}');
        }
    });
    router.post("/vc", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
		const { members } = req.body;
        if (!Array.isArray(members)) {
            res.status(400).send('{result: "ng", "error": "Invaild type"}');
            return;
        }
        if(members.length === 0){
            res.send('{result: "ok", error: null}');
            return;
        }
        for(let i=0; i< members.length; i++){
            if (typeof members[i].name !== "string" || typeof members[i].speaking !== "boolean") {
                res.status(400).send('{result: "ng", "error": "Invaild type"}');
                return;
            }
        }
        res.send('{result: "ok", error: null}');
        vcRep.value = members;
    });
    router.post("/bgm", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const { bgm } = req.body;
        const { author } = req.body;
        if (typeof bgm === "string" && typeof author === "string") {
            res.send('{result: "ok", error: null}');
            if (bgm === "" && author === "") {
                playbackRep.value = {
                    state: false,
                    title: ""
                }
            } else if (author === "") {
                playbackRep.value = {
                    state: true,
                    title: bgm
                }
            } else {
                playbackRep.value = {
                    state: true,
                    title: bgm,
                    author
                }
            }
        } else {
            res.status(400).send('{result: "ng", "error": "Invaild type"}');
        }
    });
    router.post("/current", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const assets = nodecg.Replicant("assets:streams");
        if(!Array.isArray(assets.value)) {
            res.send('{result: "ng", "error": "Asset not found"}');
            return;
        }
        var success = false;
		const { stream } = req.body;
		const { next } = req.body;
        if (stream != undefined) {
            if (typeof stream !== "string") {
                res.send('{result: "ng", "error": "Invaild type"}');
                return;
            }
            const asset = assets.value.find(element => element.name == stream);
            if (asset == undefined) {
                res.send('{result: "ng", "error": "Asset not found"}');
                return;
            }
            nodecg.Replicant("stream").value = asset.url;
            success = true;
        }
        if (next != undefined) {
            if (typeof next !== "string") {
                res.send('{result: "ng", "error": "Invaild type"}');
                return;
            }
            const asset = assets.value.find(element => element.name == next);
            if (asset == undefined) {
                res.send('{result: "ng", "error": "Asset not found"}');
                return;
            }
            nodecg.Replicant("next").value = asset.url;
            success = true;
        }
        if (success) {
            res.send('{result: "ok", error: null}');
        } else {
            res.send('{result: "ng", error: "Invalid argument"}');
        }
    });
	nodecg.mount("/tpc3-api", router);
}