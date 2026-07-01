"use strict";

const dialogues = {};

class Dialogue {
    constructor({ name, 
                  starting_text = `Talk to ${name}`,
                  ending_text = `Return`,
                  is_unlocked = true, 
                  is_finished = false, 
                  textlines = {}, 
                  location_name,
    }) 
    {
        this.name = name; //displayed name, e.g. "Village elder"
        this.starting_text = starting_text;
        this.ending_text = ending_text; //text shown on option to finish talking
        this.is_unlocked = is_unlocked;
        this.is_finished = is_finished; //separate bool to remove dialogue option if it's finished
        this.textlines = textlines; //all the lines in dialogue

        this.location_name = location_name; //this is purely informative and wrong value shouldn't cause any actual issues
    }
}

class Textline {
    constructor({name,
                 text,
                 getText,
                 is_unlocked = true,
                 is_finished = false,
                 unlocks = {textlines: [],
                            locations: [],
                            dialogues: [],
                            traders: [],
                            stances: [],
                            flags: [],
                            items: [],
                            spec: [],
                            },
                locks_lines = {},
                otherUnlocks,
                required_flags,
            }) 
    {
        this.name = name; // displayed option to click, don't make it too long
        this.text = text; // what's shown after clicking
        this.getText = getText || function(){return this.text;};
        this.otherUnlocks = otherUnlocks || function(){return;};
        this.is_unlocked = is_unlocked;
        this.is_finished = is_finished;
        this.unlocks = unlocks || {};
        //this.spec = spec;
        
        this.unlocks.textlines = unlocks.textlines || [];
        this.unlocks.locations = unlocks.locations || [];
        this.unlocks.dialogues = unlocks.dialogues || [];
        this.unlocks.traders = unlocks.traders || [];
        this.unlocks.stances = unlocks.stances || [];
        this.unlocks.flags = unlocks.flags || [];
        this.unlocks.items = unlocks.items || []; //not so much unlocks as simply items that player will receive
        
        this.required_flags = required_flags;

        this.locks_lines = locks_lines;
        //related text lines that get locked; might be itself, might be some previous line 
        //e.g. line finishing quest would also lock line like "remind me what I was supposed to do"
        //should be alright if it's limited only to lines in same Dialogue
        //just make sure there won't be Dialogues with ALL lines unavailable
    }
}

(function(){
    dialogues["village elder"] = new Dialogue({
        name: "village elder",
        textlines: {
            "hello": new Textline({
                name: "Hello?",
                text: "Hello. Glad to see you got better",
                unlocks: {
                    textlines: [{dialogue: "village elder", lines: ["what happened", "where am i", "dont remember", "about"]}],
                },
                locks_lines: ["hello"],
            }),
            "what happened": new Textline({
                name: "My head hurts.. What happened?",
                text: `Some of our people found you unconscious in the forest, wounded and with nothing but pants and an old sword, so they brought you to our village. `
                + `It would seem you were on your way to a nearby town when someone attacked you and hit you really hard in the head.`,
                is_unlocked: false,
                locks_lines: ["what happened", "where am i", "dont remember"],
                unlocks: {
                    textlines: [{dialogue: "village elder", lines: ["ask to leave 1"]}],
                },
            }),
            "where am i": new Textline({
                name: "Where am I?",
                text: `Some of our people found you unconscious in the forest, wounded and with nothing but pants and an old sword, so they brought you to our village. `
                + `It would seem you were on your way to a nearby town when someone attacked you and hit you really hard in the head.`,
                is_unlocked: false,
                locks_lines: ["what happened", "where am i", "dont remember"],
                unlocks: {
                    textlines: [{dialogue: "village elder", lines: ["ask to leave 1"]}],
                },
            }),
            "dont remember": new Textline({
                name: "I don't remember how I got here, what happened?",
                text: `Some of our people found you unconscious in the forest, wounded and with nothing but pants and an old sword, so they brought you to our village. `
                + `It would seem you were on your way to a nearby town when someone attacked you and hit you really hard in the head.`,
                is_unlocked: false,
                locks_lines: ["what happened", "where am i", "dont remember"],
                unlocks: {
                    textlines: [{dialogue: "village elder", lines: ["ask to leave 1"]}],
                },
            }),
            "about": new Textline({
                name: "Who are you?",
                text: "I'm the unofficial leader of this village. If you have any questions, come to me",
                is_unlocked: false,
                locks_lines: ["about"]
            }),
            "ask to leave 1": new Textline({
                name: "Great... Thank you for help, but I think I should go there then. Maybe it will help me remember more.",
                text: "Nearby lands are dangerous and you are still too weak to leave. Do you plan on getting ambushed again?",
                is_unlocked: false,
                unlocks: {
                    textlines: [{dialogue: "village elder", lines: ["need to"]}],
                },
                locks_lines: ["ask to leave 1"],
            }),
            "need to": new Textline({
                name: "But I want to leave",
                text: `You first need to recover, to get some rest and maybe also training, as you seem rather frail... Well, you know what? Killing a few wolf rats could be a good exercise. `
                        +`You could help us clear some field of them, how about that?`,
                is_unlocked: false,
                unlocks: {
                    textlines: [{dialogue: "village elder", lines: ["rats", "ask to leave 2", "equipment"]}],
                    locations: ["Infested field"],
                    activities: [{location:"Village", activity:"weightlifting"}],
                },
                locks_lines: ["need to"],
            }),
            "equipment": new Textline({
                name: "Is there any way I could get a weapon and proper clothes?",
                text: `We don't have anything to spare, but you can talk with our trader. He should be somewhere nearby. `
                        +`If you need money, try selling him some rat remains. Fangs, tails or pelts, he will buy them all. I have no idea what he does with this stuff...`,
                is_unlocked: false,
                locks_lines: ["equipment"],
                unlocks: {
                    textlines: [{dialogue: "village elder", lines: ["money"]}],
                    traders: ["village trader"]
                }
            }),
            "money": new Textline({
                name: "Are there other ways to make money?",
                text: "You could help us with some fieldwork. I'm afraid it won't pay too well.",
                is_unlocked: false,
                locks_lines: ["money"],
                unlocks: {
                    activities: [{location: "Village", activity: "fieldwork"}],
                }
            }),
            "ask to leave 2": new Textline({
                name: "Can I leave the village?",
                text: "We talked about this, you are still too weak",
                is_unlocked: false,
            }),
            "rats": new Textline({
                name: "Are wolf rats a big issue?",
                text: `Oh yes, quite a big one. Not literally, no, though they are much larger than normal rats... `
                        +`They are a nasty vermin that's really hard to get rid of. And with their numbers they can be seriously life-threatening. `
                        +`Only in a group though, single wolf rat is not much of a threat`,
                is_unlocked: false,
            }),
            "cleared field": new Textline({ //will be unlocked on clearing infested field combat_zone
                name: "I cleared the field, just as you asked me to",
                text: `You did? That's good. How about a stronger target? Nearby cave is just full of this vermin. `
                        +`Before that, maybe get some sleep? Some folks prepared that shack over there for you. It's clean, it's dry, and it will give you some privacy. `
                        +`Oh, and before I forget, our old craftsman wanted to talk to you.`,
                is_unlocked: false,
                unlocks: {
                    locations: ["Nearby cave", "Infested field", "Shack"],
                    textlines: [{dialogue: "village elder", lines: ["ask to leave 3"]}],
                    dialogues: ["old craftsman"],
                },
                locks_lines: ["ask to leave 2", "cleared field"],
            }),
            "ask to leave 3": new Textline({
                name: "Can I leave the village?",
                text: "You still need to get stronger.",
                unlocks: {
                    locations: ["Nearby cave", "Infested field"],
                    dialogues: ["old craftsman"],
                },
                is_unlocked: false,
            }),
            "cleared cave": new Textline({
                name: "I cleared the cave. Most of it, at least",
                text: `Then I can't call you "too weak" anymore, can I? You are free to leave whenever you want, but still, be careful. You might also want to ask the guard for some tips about the outside. He used to be an adventurer.`,
                is_unlocked: false,
                unlocks: {
                    textlines: [{dialogue: "village elder", lines: ["ask to leave 4"]}],
                    locations: ["Forest road", "Infested field", "Nearby cave"],
                    dialogues: ["village guard"],
                },
                locks_lines: ["ask to leave 3", "rats", "cleared cave"],
            }),
            "ask to leave 4": new Textline({
                name: "Can I leave the village?",
                text: "You are strong enough, you can leave and come whenever you want.",
                is_unlocked: false,
                unlocks: {
                    locations: ["Forest road", "Infested field", "Nearby cave"],
                    dialogues: ["village guard", "old craftsman"],
                },
            }),
            "new tunnel": new Textline({
                name: "I found an even deeper tunnel in the cave",
                text: "The what?... I have a bad feeling about this, you better avoid it until you get better equipment. Don't forget to bring a good shield too.",
                is_unlocked: false,
                locks_lines: ["new tunnel"],
            }),
        }
    });

    dialogues["old craftsman"] = new Dialogue({
        name: "old craftsman",
        is_unlocked: false,
        textlines: {
            "hello": new Textline({
                name: "Hello, I heard you wanted to talk to me?",
                text: "Ahh, good to see you traveler. I just thought of a little something that could be of help for someone like you. See, young people this days "+
                "don't care about the good old art of crafting and prefer to buy everything from the store, but I have a feeling that you just might be different. "+
                "Would you like a quick lesson?",
                unlocks: {
                    textlines: [{dialogue: "old craftsman", lines: ["learn", "leave"]}],
                },
                locks_lines: ["hello"],
            }),
            "learn": new Textline({
                name: "Sure, I'm in no hurry.",
                text: "Ahh, that's great. Well then... \n*[Old man spends some time explaining all the important basics of crafting and providing you with tips]*\n"+
                "Ahh, and before I forget, here, take these. They will be helpful for gathering necessary materials.",
                unlocks: {
                    textlines: [{dialogue: "old craftsman", lines: ["remind1", "remind2", "remind3"]}],
                    items: ["Old pickaxe" ,"Old axe", "Old sickle"],
                    flags: ["is_gathering_unlocked", "is_crafting_unlocked"],
                },
                locks_lines: ["learn","leave"],
                is_unlocked: false,
            }),
            "leave": new Textline({
                name: "I'm not interested.",
                text: "Ahh, I see. Maybe some other time then, when you change your mind, hmm?",
                is_unlocked: false,
            }),
            
            "remind1": new Textline({
                name: "Could you remind me how to create equipment for myself?",
                text: "Ahh, of course. Unless you are talking about something simple like basic clothing, then you will first need to create components that can then be assembled together. "+
                "For weapons, you generally need a part that you use to hit an enemy and a part that you hold in your hand. For armor, you will need some actual armor and then something softer to wear underneath, "+
                "which would mostly mean some clothes.",
                is_unlocked: false,
            }),
            "remind2": new Textline({
                name: "Could you remind me how to improve my creations?",
                text: "Ahh, that's simple, you just need more experience. This alone will be a great boon to your efforts. For equipment, you might also want to start with better components. "+
                "After all, even with the most perfect assembling you can't turn a bent blade into a legendary sword.",
                is_unlocked: false,
            }),
            "remind3": new Textline({
                name: "Could you remind me how to get crafting materials?",
                text: "Ahh, there's multiple ways of that. You can gain them from fallen foes, you can gather them around, or you can even buy them if you have some spare coin.",
                is_unlocked: false,
            }),
        }
    });

    dialogues["village guard"] = new Dialogue({
        name: "village guard",
        is_unlocked: false,
        textlines: {
            "hello": new Textline({
                name: "Hello?",
                text: "Hello. I see you are finally leaving, huh?",
                unlocks: {
                    textlines: [{dialogue: "village guard", lines: ["tips", "job"]}],
                },
                locks_lines: ["hello"],
            }),
            "job": new Textline({
                name: "Do you maybe have any jobs for me?",
                is_unlocked: false,
                text: "You are somewhat combat capable now, so how about you help me and the boys on patrolling? Not much happens, but it pays better than working on fields",
                unlocks: {
                    activities: [{location:"Village", activity:"patrolling"}],
                },
                locks_lines: ["job"],
            }),
            "tips": new Textline({
                name: "Can you give me any tips for the journey?",
                is_unlocked: false,
                text: `First and foremost, don't rush. It's fine to spend some more time here, to better prepare yourself. `
                +`There's a lot of dangerous animals out there, much stronger than those damn rats, and in worst case you might even run into some bandits. `
                +`If you see something that is too dangerous to fight, try to run away.`,
                unlocks: {
                    textlines: [{dialogue: "village guard", lines: ["teach"]}],
                },
            }),
            "teach": new Textline({
                name: "Could you maybe teach me something that would be of use?",
                is_unlocked: false,
                text: `Lemme take a look... Yes, it looks like you know some basics. Do you know any proper techniques? No? I thought so. I could teach you the most standard three. `
                +`They might be more tiring than fighting the "normal" way, but if used in a proper situation, they will be a lot more effective. Two can be easily presented through `
                + `some sparring, so let's start with it. The third I'll just have to explain. How about that?`,
                unlocks: {
                    locations: ["Sparring with the village guard (quick)", "Sparring with the village guard (heavy)"],
                },
                locks_lines: ["teach"],
            }),
            "quick": new Textline({
                name: "So about the quick stance...",
                is_unlocked: false,
                text: `It's usually called "quick steps". As you have seen, it's about being quick on your feet. `
                +`While power of your attacks will suffer, it's very fast, making it perfect against more fragile enemies`,
                otherUnlocks: () => {
                    if(dialogues["village guard"].textlines["heavy"].is_finished) {
                        dialogues["village guard"].textlines["wide"].is_unlocked = true;
                    }
                },
                locks_lines: ["quick"],
                unlocks: {
                    stances: ["quick"]
                }
            }),
            "heavy": new Textline({
                name: "So about the heavy stance...",
                is_unlocked: false,
                text: `It's usually called "crushing force". As you have seen, it's about putting all your strength in attacks. ` 
                +`It will make your attacks noticeably slower, but it's a perfect solution if you face an enemy that's too tough for normal attacks`,
                otherUnlocks: () => {
                    if(dialogues["village guard"].textlines["quick"].is_finished) {
                        dialogues["village guard"].textlines["wide"].is_unlocked = true;
                    }
                },
                locks_lines: ["heavy"],
                unlocks: {
                    stances: ["heavy"]
                }
            }),
            "wide": new Textline({
                name: "What's the third technique?",
                is_unlocked: false,
                text: `It's usually called "broad arc". Instead of focusing on a single target, you make a wide swing to hit as many as possible. ` 
                +`It might work great against groups of weaker enemies, but it will also significantly reduce the power of your attacks and will be even more tiring than the other two stances.`,
                locks_lines: ["wide"],
                unlocks: {
                    stances: ["wide"]
                }
            }),
        }
    });

    dialogues["gate guard"] = new Dialogue({
        name: "gate guard",
        textlines: {
            "enter": new Textline({
                name: "Hello, can I get in?",
                text: "The town is currently closed to everyone who isn't a citizen or a guild member. No exceptions.",
            }), 
        }
    });
    dialogues["suspicious man"] = new Dialogue({
        name: "suspicious man",
        textlines: {
            "hello": new Textline({ 
                name: "Hello? Why are you looking at me like that?",
                text: "Y-you! You should be dead! *the man pulls out a dagger*",
                unlocks: {
                    locations: ["Fight off the assailant"],
                },
                locks_lines: ["hello"],
            }), 
            "defeated": new Textline({ 
                name: "What was that about?",
                is_unlocked: false,
                text: "I... We... It was my group that robbed you. I thought you came back from your grave for revenge... Please, I don't know anything. "
                +"If you want answers, ask my boss. He's somewhere in the town.",
                locks_lines: ["defeated"],
                unlocks: {
                    textlines: [{dialogue: "suspicious man", lines: ["behave"]}],
                },
            }), 
            "behave": new Textline({ 
                name: "Are you behaving yourself?",
                is_unlocked: false,
                text: "Y-yes! Please don't beat me again!",
                locks_lines: ["defeated"],
            }), 
        }
    });
    dialogues["farm supervisor"] = new Dialogue({
        name: "farm supervisor",
        textlines: {
            "hello": new Textline({ 
                name: "Hello",
                text: "Hello stranger",
                unlocks: {
                    textlines: [{dialogue: "farm supervisor", lines: ["things", "work", "animals", "fight", "fight0"]}],
                },
                locks_lines: ["hello"],
            }),
            "work": new Textline({
                name: "Do you have any work with decent pay?",
                is_unlocked: false,
                text: "We sure could use more hands. Feel free to help my boys on the fields whenever you have time!",
                unlocks: {
                    activities: [{location: "Town farms", activity: "fieldwork"}],
                },
                locks_lines: ["work"],
            }),
            "animals": new Textline({
                name: "Do you sell anything?",
                is_unlocked: false,
                text: "Sorry, I'm not allowed to. I could however let you take some stuff in exchange for physical work, and it just so happens our sheep need shearing.",
                required_flags: {yes: ["is_gathering_unlocked"]},
                unlocks: {
                    activities: [{location: "Town farms", activity: "animal care"}],
                },
                locks_lines: ["animals"],
            }),
            "fight0": new Textline({
                name: "Do you have any task that requires some good old violence?",
                is_unlocked: false,
                text: "I kinda do, but you don't seem strong enough for that. I'm sorry.",
                required_flags: {no: ["is_deep_forest_beaten"]},
            }),
            "fight": new Textline({
                name: "Do you have any task that requires some good old violence?",
                is_unlocked: false,
                text: "Actually yes. There's that annoying group of boars that keep destroying our fields. "
                + "They don't do enough damage to cause any serious problems, but I would certainly be calmer if someone took care of them. "
                + "Go to the forest and search for a clearing in north, that's where they usually roam when they aren't busy eating our crops."
                + "I can of course pay you for that, but keep in mind it won't be that much, I'm running on a strict budget here.",
                required_flags: {yes: ["is_deep_forest_beaten"]},
                unlocks: {
                    locations: ["Forest clearing"],
                },
                locks_lines: ["fight"],
            }),
            "things": new Textline({
                is_unlocked: false,
                name: "How are things around here?",
                text: "Nothing to complain about. Trouble is rare, pay is good, and the soil is as fertile as my wife!",
                unlocks: {
                    textlines: [{dialogue: "farm supervisor", lines: ["animals", "fight", "fight0"]}],
                }
            }), 
            "defeated boars": new Textline({
                is_unlocked: false,
                name: "I took care of those boars",
                text: "Really? That's great! Here, this is for you.",
                locks_lines: ["defeated boars"],
                unlocks: {
                    money: 1000,
                }
            }), 
        }

    });

    //NekoRPG dialogues below
    dialogues["猫妖"] = new Dialogue({
        name: "Cat Demon",
        textlines: {
            "你是谁": new Textline({
                name: "Who are you?",
                text: "This is Cat Demon! Now, let me give you a brief introduction to this place.",
                unlocks: {
                    textlines: [{dialogue: "猫妖", lines: ["背景故事"]}],
                },
                locks_lines: ["你是谁"],
            }),
            "背景故事": new Textline({
                is_unlocked: false,
                name: "Where is this place?",
                text: "In the beginning, a continent called Xuelo came into being.<br>The Xuelo Continent brims with energy, giving rise to countless races and forms of life.<br>On this continent, the strong can trample the weak underfoot without restraint!<br>And here — within the Xuelo Continent, the Siyong World, the Yangang Territory — is the Nya Clan.",


                unlocks: {
                    textlines: [{dialogue: "猫妖", lines: ["Neko是谁"]}],
                },

                locks_lines: ["背景故事"],
            }),
            "Neko是谁": new Textline({
                is_unlocked: false,
                name: "And who is Neko?",
                text: "Neko — an ordinary, unremarkable girl of the Nya Clan in Yangang City.<br>"+
                "One day, just as Neko finished her morning cultivation,<br>"+
                "she discovered that her elder sister Nanami, who had grown up alongside her, was nowhere to be found.<br>"+
                "Upon learning from the clan that Nanami had gone out to train the day before and had not yet returned, Neko could not spare a moment to think.<br>"+
                "She resolutely left the clan alone, setting out to find any trace of Nanami.<br>"+
                "And so our story begins...",

                unlocks: {

                    flags: ["is_gathering_unlocked", "is_crafting_unlocked"],
                    locations: ["纳家练兵场 - 1"],
                },

                locks_lines: ["Neko是谁"],
            }),
            "MT10_clear": new Textline({
                is_unlocked: false,
                name: "Open the Gate",
                text: "In [V0.13], this dialogue should theoretically never unlock.<br>" +
                "If you are loading an old save after an update, you may use this dialogue to unlock subsequent areas.<br>" +
                "MOD - NekoRPG author: Supernatural Creature Fire-Breathing Research Association - Sayuki (perpetually whimpering =w=)<br>" +
                "Original: Yet Another Idle RPG - miktaew <br>" +
                "Settings from: I Eat Tomatoes - Swallowed Star, Qianye - Neko's Story <br>",
                unlocks: {
                    locations: ["燕岗城"],
                },
                locks_lines: ["MT10_clear"],
            })
            // "what happened": new Textline({
            //     name: "My head hurts.. What happened?",
            //     text: `Some of our people found you unconscious in the forest, wounded and with nothing but pants and an old sword, so they brought you to our village. `
            //     + `It would seem you were on your way to a nearby town when someone attacked you and hit you really hard in the head.`,
            //     is_unlocked: false,
            //     locks_lines: ["what happened", "where am i", "dont remember"],
            //     unlocks: {
            //         textlines: [{dialogue: "village elder", lines: ["ask to leave 1"]}],
            //     },
            // }),
        }
    });
    dialogues["秘法石碑 - 1"] = new Dialogue({
        name: "Arcane Stele - 1",
        textlines: {
            "Speed": new Textline({
                is_unlocked: false,
                name: "Comprehend: Blood Fusion - Swift",
                text: "Blood Fusion - Swift has been added to available Arcane Arts!",
                locks_lines: ["Speed"],
                unlocks: {
                    stances: ["MB_Speed"],
                },
            }), 
            "Power": new Textline({
                is_unlocked: false,
                name: "Comprehend: Blood Fusion - Edge",
                text: "Blood Fusion - Edge has been added to available Arcane Arts!",

                locks_lines: ["Power"],
                unlocks: {
                    stances: ["MB_Power"],
                },
            }), 
        }
    });
    
    dialogues["路人甲"] = new Dialogue({
        name: "Passerby",
        textlines: {
            "shop": new Textline({ 
                is_unlocked: false,
                name: "Excuse me, is there a shop around here?",
                text: "Little girl, just left your clan, haven't you?<br>" +
                "Space is precious in central Yangang City — shops are mostly in the outer districts.<br>" +
                "The nearest one is the chain store \"Yangang General Store\"<br>"+"Walk another half mile to the east and you'll find it",

                unlocks: {
                    traders: ["Yangang General Store"],
                },
                locks_lines: ["shop"],
            }), 
        }
    });
    
    dialogues["百兰"] = new Dialogue({
        name: "Bailan",
        textlines: {
            "before": new Textline({ 
                is_unlocked: true,
                name: "Excuse me, who are you?",
                text: "Where did you come from, little girl? With your level of cultivation, going out to train all on your own —<br>are you sure that's a good idea? The Wild Beasts out there will eat you alive.",

                unlocks: {
                    textlines: [{dialogue: "百兰", lines: ["before2"]}],
                },
                locks_lines: ["before"],
            }),
            "before2": new Textline({ 
                is_unlocked: false,
                name: "Sir, it's not right to look down on people, you know.",
                text: "Hey, who are you calling 'sir'?! Don't push your luck——",

                unlocks: {
                    locations: ["燕岗近郊 - 0"],
                },
                locks_lines: ["before2"],
            }), 
            "defeat": new Textline({ 
                is_unlocked: false,
                name: "Wait, what's that you're holding in your hand?",
                text: "This... this is a map,<br>drawn to show the location of a recently discovered Treasure Site.",

                unlocks: {
                    textlines: [{dialogue: "百兰", lines: ["defeat2"]}],
                },
                locks_lines: ["defeat"],
            }), 
            "defeat2": new Textline({ 
                is_unlocked: false,
                name: "Is there more detailed information?",
                text: "Oh yes, yes — I've heard there are quite a few valuable things inside,<br>but it's rather dangerous. Very few people make it out alive.",

                unlocks: {
                    textlines: [{dialogue: "百兰", lines: ["defeat3"]}],
                },
                locks_lines: ["defeat2"],
            }), 
            "defeat3": new Textline({ 
                is_unlocked: false,
                name: "Hand it over, and you can go.",
                text: "......Fine.<br>(Ugh, to lose to a little girl like this —<br>my luck is truly awful. How am I going to explain this to the clan...)",

                unlocks: {
                    items: [{item_name:"地图-藏宝地"}],
                    //items: ["地图-藏宝地"],
                    locations: ["燕岗近郊 - 1"],
                },
                locks_lines: ["defeat3"],
            }),
            "V0.21 Recover": new Textline({ 
                is_unlocked: false,
                name: "V0.21 update: click here to unlock the next area if loading an old save",
                text: "Area 3-1 has been unlocked!",

                unlocks: {
                    locations: ["燕岗近郊 - 1"],
                },
                locks_lines: ["V0.21 Recover"],
            }),
        }
    });
    
    dialogues["地宫老人"] = new Dialogue({
        name: "Old Man of the Underground Palace",
        textlines: {
            "dig": new Textline({ 
                is_unlocked: true,
                name: "Hmm... old man, what is it you want to say?",
                text: "Sometimes, fighting monsters directly yields very little.<br>" +
                "But when you put your pickaxe to clever use,<br>" +
                "you may find surprising and unexpected results.<br>However, don't be too greedy...<br>The law of diminishing returns plays out perfectly here.",
                
                locks_lines: ["dig"],
            }),
        }
    });

    
    dialogues["纳娜米"] = new Dialogue({
        name: "Nanami",
        textlines: {
            "1": new Textline({ 
                is_unlocked: true,
                name: "Sister!",
                text: "Koko?!<br>Why are you here? It's dangerous here,<br>listen to me — stop fooling around and get back to the clan.",

                unlocks: {
                    textlines: [{dialogue: "纳娜米", lines: ["2"]}],
                },
                locks_lines: ["1"],
            }),
            "2": new Textline({ 
                is_unlocked: false,
                name: "No. A well-behaved child would never abandon their sister at a time like this.",
                text: "......It's my fault for not explaining clearly.<br>The truth is, this expedition was tacitly approved by Clan Head Nabu.<br>Or rather, it was he who deliberately arranged for me to come.",

                unlocks: {
                    textlines: [{dialogue: "纳娜米", lines: ["3"]}],
                },
                locks_lines: ["2"],
            }),
            "3": new Textline({ 
                is_unlocked: false,
                name: "Eh, wait, what?",
                text: "...To tell you the truth, during a Wild Beast hunt some time ago,<br>the clan was ambushed by unknown assailants and suffered heavy losses.<br>"+
                "The attackers were extraordinarily powerful —<br>with eerie movement techniques and speed,<br>they cut down our clansmen almost effortlessly.<br>"+
                "The Clan Head was furious and dispatched our finest elites to investigate,<br>ultimately discovering this underground palace housing a great treasure,<br>and let word spread!<br>"+
                "Now, Earth Rank cultivators from a thousand miles around<br>have been receiving the news and making their way here.<br>Yet the master of this underground palace has shown no sign of movement.",

                unlocks: {
                    textlines: [{dialogue: "纳娜米", lines: ["4"]}],
                },
                locks_lines: ["3"],
            }),
            "4": new Textline({ 
                is_unlocked: false,
                name: "So that's how it is? A bit frightening. But then, Sister, why would you...",
                text: "Well... this enemy is extremely cunning.<br>If the clan were to rashly send out Sky Rank cultivators,<br>it would only put them on guard.<br>"+
                "That's why they quietly sent someone unassuming like me,<br>disguised as a reckless ordinary adventurer.<br>And I have in my hands a trump card capable of eliminating the enemy.<br>"+
                "But there are simply too many Wild Beasts down here.<br>I can handle a few at most,<br>and I can't reveal that trump card — so I got trapped.",

                unlocks: {
                    textlines: [{dialogue: "纳娜米", lines: ["5"]}],
                },
                locks_lines: ["4"],
            }),
            "5": new Textline({ 
                is_unlocked: false,
                name: "Leave it to me, Sister. We'll take them all out together!",
                text: "No no, it's too dangerous.<br>...Wait, Koko, how did you get down here?<br>Don't tell me you already dealt with that Wild Beast elite upstairs?<br>",

                unlocks: {
                    textlines: [{dialogue: "纳娜米", lines: ["6"]}],
                },
                locks_lines: ["5"],
            }),
            "6": new Textline({ 
                is_unlocked: false,
                name: "I've told you before, don't underestimate me. Besides, if I can't even help my sister with something this small, what good am I?",
                text: "...<br>I see... without realizing it, you've grown up, haven't you...<br>Alright, I understand.",

                unlocks: {
                    items: [{item_name: "纳娜米"}],
                },
                locks_lines: ["6"],
            }),
        }
    });
    
    dialogues["纳布"] = new Dialogue({
        name: "Nabu",
        textlines: {
            "1": new Textline({ 
                is_unlocked: true,
                name: "Father, Sister.",
                text: "[Nabu] You're both here. Koko, Nana — good work this time.<br>[Nanami] Koko, we really made a great contribution this time!<br>The City Lord's Mansion gave us so many rewards.",

                unlocks: {
                    textlines: [{dialogue: "纳布", lines: ["2"]}],
                },
                locks_lines: ["1"],
            }),
            "2": new Textline({ 
                is_unlocked: false,
                name: "Yes... far more generous than I had imagined.",
                text: "[Nabu] Koko, is something weighing on your mind?<br>[Nanami] Senior Clan Head, Koko will say what she wants to say when she's ready.<br>Please don't press her...<br>[Nabu] Very well. After all, our little girl is eleven years old now.<br>How does it feel? Are you close to breaking through to Earth Rank?",

                unlocks: {
                    textlines: [{dialogue: "纳布", lines: ["3"]}],
                },
                locks_lines: ["2"],
            }),
            "3": new Textline({ 
                is_unlocked: false,
                name: "Yes... ever since the underground palace trip, I've felt a great deal — and I've faintly touched that threshold.",
                text: "There are two ways to reach Earth Rank.<br>The first is to slowly accumulate comprehension until it naturally comes together.<br>The second — to break through swiftly through real-world tempering.",

                unlocks: {
                    textlines: [{dialogue: "纳布", lines: ["4"]}],
                },
                locks_lines: ["3"],
            }),
            "4": new Textline({ 
                is_unlocked: false,
                name: "...I don't want to wait any longer. Father, Sister — I want to go to the Wild Beast Forest and seek an opportunity to break through.",
                text: "[Nanami] Koko...<br>[Nabu] The Wild Beast Forest is extremely perilous,<br>but you have the heart of an adventurer — your father will surely support you.<br>"+
                "The sword and armor you cobbled together from scraps at the training grounds<br>are yours from this day forward.<br>"+
                "And here is a protective talisman inscribed with a teleportation formation.<br>Use it if you find yourself in danger.<br>"+
                "[Nanami] Senior Clan Head, the Wild Beast Forest is far too dangerous —<br>could you give Koko the laser rifle I used before?<br>"+
                "No. While that would make things easier for Koko,<br>it would also remove the pressure needed for a true breakthrough.<br>",

                unlocks: {
                    textlines: [{dialogue: "纳布", lines: ["5"]}],
                },
                locks_lines: ["4"],
            }),
            "5": new Textline({ 
                is_unlocked: false,
                name: "Father, what is a laser rifle?",
                text: "It is time to tell you these things.<br>They relate to a legend —<br>" +
                `<span style="color:lightblue">The legend of the [Extraterrestrial Clan].</span><br>Once you break through to Earth Rank, Koko, I will tell you more.`,

                unlocks: {
                    textlines: [{dialogue: "纳布", lines: ["6"]}],
                },
                locks_lines: ["5"],
            }),
            "6": new Textline({ 
                is_unlocked: false,
                name: "I see... I understand. Then wait for good news from me.",
                text: "Hmph, always giving your sister worry.<br>You'd better do your best, little girl.<br>...Just like before — make sure you come back safe and sound.",

                unlocks: {
                    //items: [{item_name: "纳娜米"}],
                    locations: ["荒兽森林"],
                },
                locks_lines: ["6"],
            }),
        }
    });
    
    dialogues["清野瀑布"] = new Dialogue({
        name: "Qingye Waterfall",
        starting_text: "Gazing at Qingye Waterfall",
        textlines: {
            "wf1": new Textline({
                is_unlocked: false,
                name: "...",
                text: "Father always said the outside world is dangerous and cruel.<br>...But I don't believe it. I want to see further places for myself.",
                locks_lines: ["wf1"],
                unlocks: {
                    textlines: [{dialogue: "清野瀑布", lines: ["wf2"]}],
                },
            }), 
            "wf2": new Textline({
                is_unlocked: false,
                name: "...",
                text: "Now I've truly experienced a brush with death,<br>and I understand what Father meant.",
                locks_lines: ["wf2"],
                unlocks: {
                    spec:"DeathCount-1",
                    textlines: [{dialogue: "清野瀑布", lines: ["wf3"]}],
                },
            }), 
            "wf3": new Textline({
                is_unlocked: false,
                name: "...",
                text: "Perhaps, when the day comes that I truly become a strong cultivator,<br>this wish might be fulfilled.",
                locks_lines: ["wf3"],
                unlocks: {
                    textlines: [{dialogue: "清野瀑布", lines: ["wf4"]}],
                },
            }), 
            "wf4": new Textline({
                is_unlocked: false,
                name: "Beyond the waterfall are mountains — what lies beyond the mountains?",
                text: "[Strange Voice] What are you afraid of?<br>You must become strong! Go explore the world beyond!<br>The trials of life and death — what doesn't kill you only sends you back to bed when you fail!",
                locks_lines: ["wf4"],
                unlocks: {
                    textlines: [{dialogue: "清野瀑布", lines: ["wf5"]}],
                },
            }), 
            "wf5": new Textline({
                is_unlocked: false,
                name: "*Swings sword instinctively*",
                text: "The body gradually becomes more agile and nimble.<br>All the accumulation of these days —<br>finally ignited in this very moment!",
                locks_lines: ["wf5"],
                unlocks: {
                    textlines: [{dialogue: "清野瀑布", lines: ["wf6"]}],
                },
            }), 
            "wf6": new Textline({
                is_unlocked: false,
                name: "......What just happened? What did I just do?",
                text: "Water Heartless: Flowing Water, Water Heartless: Flood, and Water Heartless: Rainfall have been added to available Arcane Arts!",

                locks_lines: ["wf6"],
                unlocks: {
                    stances: ["WH_Power","WH_Speed","WH_Multi"],
                },
            }), 
        }
    });
    dialogues["纳布(江畔)"] = new Dialogue({
        name: "Nabu (Riverside)",
        starting_text: "Talk to father Nabu",
        textlines: {
            "jp1": new Textline({ 
                is_unlocked: false,
                name: "...",
                text: "Koko! Are you alright? What happened to you, all those injuries?",
                unlocks: {
                    textlines: [{dialogue: "纳布(江畔)", lines: ["jp2"]}],
                },
                
                locks_lines: ["jp1"],
            }),
            "jp2": new Textline({ 
                is_unlocked: false,
                name: "It's a long story... I got into a fight with people from the Bai Clan outside. Good thing I had that talisman.",
                text: "Neko told Nabu everything that had happened,<br>including the unexpected gain she had<br>while meditating on Qingye Waterfall after being injured.<br><br>[Nabu] How outrageous — those Bai Clan bastards! They deserve everything coming to them!<br>All they did was get jealous of what our clan obtained, and stoop to such underhanded tactics.<br>That Bailan isn't even Earth Rank,<br>has no real standing in the Bai Clan at all — saying they're helping him save face is just a shameful excuse!",
                unlocks: {
                    textlines: [{dialogue: "纳布(江畔)", lines: ["jp3"]}],
                },
                
                locks_lines: ["jp2"],
            }),
            "jp3": new Textline({ 
                is_unlocked: false,
                name: "This matter... I bear some responsibility too. I shouldn't have provoked the powerful Bai Clan and brought trouble to the family.",
                text: "Koko, this is not your fault.<br>Don't go out alone for a while — I'll send someone to protect you. [Neko] I'm fine. Father, you always said that opportunity only comes in dangerous places.",
                unlocks: {
                    textlines: [{dialogue: "纳布(江畔)", lines: ["jp4"]}],
                },
                
                locks_lines: ["jp3"],
            }),
            "jp4": new Textline({ 
                is_unlocked: false,
                name: "It is precisely because of this life-and-death crisis that I have the strength I have now.",
                text: "",
                unlocks: {
                    spec:"Realm-A3",
                    textlines: [{dialogue: "纳布(江畔)", lines: ["jp5"]}],
                },
                
                locks_lines: ["jp4"],
            }),
            "jp5": new Textline({ 
                is_unlocked: false,
                name: "(Setting for the Extraterrestrial Clan abridged) What a fascinating world —",
                text: "......It is also time to send you into the clan's Secret Realm for tempering. Know that the requirement to enter the Nya Secret Realm is reaching the mid-stage of Earth Rank.",
                unlocks: {
                    textlines: [{dialogue: "纳布(江畔)", lines: ["jp6"]}],
                },
                
                locks_lines: ["jp5"],
            }),
            "jp6": new Textline({ 
                is_unlocked: false,
                name: "Oh, the clan's Secret Realm?",
                text: "",
                unlocks: {
                    spec:"Realm-A4",
                    locations: ["纳家秘境"],
                },
                
                locks_lines: ["jp6"],
            }),
        }
    });
    dialogues["秘境心火精灵"] = new Dialogue({
        name: "Secret Realm Heart-Fire Spirit",
        textlines: {
            "xh1": new Textline({ 
                is_unlocked: false,
                name: "Hmph~ Now you know how fearsome I am!",
                text: "Spare me, spare me——<br>This one is just a 'Spirit' born from the Secret Realm,<br>with absolutely no wealth or resources...",
                unlocks: {
                    textlines: [{dialogue: "秘境心火精灵", lines: ["xh2"]}],
                },
                
                locks_lines: ["xh1"],
            }),
            "xh2": new Textline({ 
                is_unlocked: false,
                name: "Hey, in a core area like this, you must have some authority over the Secret Realm, right?",
                text: "Ah yes, yes indeed!<br>I can help you adjust the Secret Realm's Spirit Formation Power!<br>That way you can gain more battle comprehension!",
                unlocks: {
                    textlines: [{dialogue: "秘境心火精灵", lines: ["check"]},{dialogue: "秘境心火精灵", lines: ["powerup"]},{dialogue: "秘境心火精灵", lines: ["powerdown"]},{dialogue: "秘境心火精灵", lines: ["powermax"]}],
                    locations: ["纳家秘境 - ∞"],
                },
                
                locks_lines: ["xh2"],
            }),
            "check": new Textline({ 
                is_unlocked: false,
                name: "How much Spirit Formation Power is currently active?",
                text: "",
                unlocks: {
                    textlines:[{dialogue: "秘境心火精灵", lines: ["powermax"]}],
                    spec: "A6-check"
                },
            }),
            "powerup": new Textline({ 
                is_unlocked: false,
                name: "Increase Spirit Formation Power by one level \\o/",
                text: "",
                unlocks: {
                    spec: "A6-up"
                },
            }),
            "powerdown": new Textline({ 
                is_unlocked: false,
                name: "Decrease Spirit Formation Power by one level T_T",
                text: "",
                unlocks: {
                    spec: "A6-down"
                },
            }),
            "powermax": new Textline({ 
                is_unlocked: false,
                name: "Raise Spirit Formation Power to the current maximum (ノ▼Д▼)ノ",
                text: "",
                unlocks: {
                    spec: "A6-max"
                },
            }),
        }
    });
    dialogues["纳鹰"] = new Dialogue({
        name: "Naying",
        starting_text: "Speak with the mysterious cultivator of the Barrier Lake",
        textlines: {
            "nb1": new Textline({ 
                is_unlocked: true,
                name: "...Senior, may I ask who you are?",
                text: "Heh heh, you don't recognize me?<br>True enough — it has been several thousand years since my fall.<br>Back in those days, I followed the Lord of Yangang City into battle,<br>and founded the Nya Clan within Yangang City.<br>I never imagined the clan would come this far.",
                unlocks: {
                    textlines: [{dialogue: "纳鹰", lines: ["nb2"]}],
                },
                
                locks_lines: ["nb1"],
            }),
            "nb2": new Textline({ 
                is_unlocked: false,
                name: "...You are the ancestor of the Nya Clan! This... how is it possible — the Elders and Father both said you were...",
                text: "No need to be surprised — I am indeed the ancestor of the Nya Clan, known as Naying.<br>None of the Nya descendants today know of this consciousness of mine,<br>hidden within the Secret Realm.<br>Were it to become known, I fear this Secret Realm<br>would be turned upside down by those adventurers.<br>",
                unlocks: {
                    textlines: [{dialogue: "纳鹰", lines: ["nb3"]}],
                },
                
                locks_lines: ["nb2"],
            }),
            "nb3": new Textline({ 
                is_unlocked: false,
                name: "How did this come to be? What happened back then that led to this state?",
                text: "Heh heh, little girl, no need to rush.<br>It is nothing more than a dull old tale.<br>In those days, I took a great risk to gather materials for a transaction,<br>venturing deep into the perilous Demon Blood Sea<br>to hunt powerful Wild Beasts.<br>In the Demon Blood Sea, I unwittingly fell into a trap<br>and became the soul slave of a <span style='color:pink'>Domain Rank</span> cultivator.<br>That cultivator... was likely comparable in power to the Lord of Yangang City.<br>",
                unlocks: {
                    textlines: [{dialogue: "纳鹰", lines: ["nb4"]}],
                },
                
                locks_lines: ["nb3"],
            }),
            "nb4": new Textline({ 
                is_unlocked: false,
                name: "...",
                text: "Such powerful cultivators forge soul slaves<br>for nothing more than to gain a powerful 'cannon fodder'.<br>At the time, I had absolutely no means of escape.<br>Those soul slaves obey their masters for life, without freedom,<br>with death ready to descend upon them at any moment.<br>Most met miserable ends after enduring endless dangers day and night!<br>To break free from this fate, I chose to destroy my own soul!<br>And transferred my consciousness into this single thread of thought.<br>This thread of thought had originally been stored within the clan's Secret Realm<br>to maintain communication with the clan — now it served a greater purpose.",
                unlocks: {
                    textlines: [{dialogue: "纳鹰", lines: ["nb5"]}],
                },
                
                locks_lines: ["nb4"],
            }),
            "nb5": new Textline({ 
                is_unlocked: false,
                name: "Ah...",
                text: "",
                unlocks: {
                    textlines: [{dialogue: "纳鹰", lines: ["nb6"]}],
                    spec: "A7-begin",
                },
                
                locks_lines: ["nb5"],
            }),
            "nb6": new Textline({ 
                is_unlocked: false,
                name: "I... can I?<br>Anything I can help with, Senior — please don't hesitate to ask.",
                text: "Your Fire Element comprehension has made some progress,<br>but there is still much room to grow.<br>That Domain Rank cultivator<br>was able to expand a [Domain] infused with law comprehension against his enemies —<br>I witnessed him use it several times.<br>Over thousands of years, I have developed my own understanding of this Domain.<br>Now I will impart my comprehension of these Arcane Arts<br>to you. Listen carefully.<br>",
                unlocks: {
                    textlines: [{dialogue: "纳鹰", lines: ["nb7"]}],
                },
                
                locks_lines: ["nb6"],
            }),
            "nb7": new Textline({ 
                is_unlocked: false,
                name: "Yes, this junior obeys.",
                text: "Naying extended a finger and pressed it between Neko's brows.<br>Instantly, a flood of complex information poured into her mind,<br>immersing her in all manner of profound states of comprehension.<br>After a moment, Neko opened her eyes,<br>with excitement gleaming at the depths of her gaze.<br>She could feel how greatly these insights would benefit her.<br>  [Neko] Senior, thank you.<br>I now have a clear understanding of the path ahead.<br>[Naying] No need for thanks.<br>I believe my legacy is nearly at its end here.<br>What you must do next is work hard to improve yourself —<br>and when I awaken once more, I hope to see you reach even greater heights.<br>",
                unlocks: {
                    textlines: [{dialogue: "纳鹰", lines: ["nb8"]}],
                    spec: "A7-exp",
                },
                
                locks_lines: ["nb7"],
            }),
            "nb8": new Textline({ 
                is_unlocked: false,
                name: "Senior... are you going to sleep again?",
                text: "  Heh heh, a single thread of thought cannot sustain itself indefinitely.<br>The next time, who knows when I shall wake.<br>If you wish to test yourself —<br>go to the depths of this Barrier Lake.<br>There, some 'Spirits' have naturally grown within the barrier,<br>developed consciousness, and seek to resist and break free.<br>For the stability of the Secret Realm, I entrust this task to you.<br>Go now — I won't keep you.",
                unlocks: {
                    locations: ["结界湖 - 1"],
                },
                
                locks_lines: ["nb8"],
            }),
        }
    });
    
    dialogues["纳娜米(废墟)"] = new Dialogue({
        name: "Nanami (Ruins)",
        textlines: {
            "fx1": new Textline({ 
                is_unlocked: true,
                name: "Sister, this vast expanse of ruins... is this where Shenlv City once stood?",
                text: "Yes. It is said that the Sky-Outsider<br>controlled a massive flying craft —<br>a palace-class treasure known as a 'D9-class Vessel'.<br>That craft reduced the entire city to rubble,<br>inflicting devastating casualties on our side of the Xuelo Continent.<br>In the end — through the combined assault of several hundred City Lord-level cultivators,<br>and even the intervention of a Heaven-Reaching existence,<br>they finally brought that craft down!",
                unlocks: {
                    textlines: [{dialogue: "纳娜米(废墟)", lines: ["fx2"]}],
                },
                
                locks_lines: ["fx1"],
            }),
            "fx2": new Textline({ 
                is_unlocked: false,
                name: "...Several hundred City Lord-level cultivators! Have the powerful fighters from over a dozen nearby territories already gathered here?",
                text: "More than half of them, at least.<br>But when the cultivators stormed inside the D9-class Vessel,<br>they found the Sky-Outsider wasn't in it at all.<br>We had underestimated him —<br>he had long since quietly launched over a hundred small craft,<br>known as 'B9-class Vessels', in an attempt to flee.",
                unlocks: {
                    textlines: [{dialogue: "纳娜米(废墟)", lines: ["fx3"]}],
                },
                
                locks_lines: ["fx2"],
            }),
            "fx3": new Textline({ 
                is_unlocked: false,
                name: "D9, B9. It feels like some kind of classification system — I wonder what it is...",
                text: "Who knows.<br>True, these small craft were made of only precious-grade materials,<br>but they were small and fast — for a time no one could track them.<br>It took that great figure personally intervening;<br>within his soul-detection range,<br>nothing could hide.<br>In the end, the cultivators intercepted the vessel he was riding<br>beneath the eighteenth cloud layer,<br>and destroyed every last one of the vessels.",
                unlocks: {
                    textlines: [{dialogue: "纳娜米(废墟)", lines: ["fx4"]}],
                },
                
                locks_lines: ["fx3"],
            }),
            "fx4": new Textline({ 
                is_unlocked: false,
                name: "Whew... quite a story. Our goal is to find those crashed 'Vessels' and search for the treasures we need, right?",
                text: "Exactly. The treasures within the main battle Vessel<br>are currently being fought over by Cloud Rank and above cultivators.<br>Our target, however, is those smaller vessels.<br>But — there is one more target,<br>Koko, right before your eyes.<br>The ruins of Shenlv City.",
                unlocks: {
                    textlines: [{dialogue: "纳娜米(废墟)", lines: ["fx5"]}],
                },
                
                locks_lines: ["fx4"],
            }),
            "fx5": new Textline({ 
                is_unlocked: false,
                name: "The ruins of... Shenlv City?",
                text: "Yes, that's right. The once-flourishing Shenlv City,<br>now in ruins, with many of its original inhabitants gone,<br>has left behind many things. The Clan Head has already issued orders<br>for the entire Nya Clan to split up and search.<br>After finding useful valuables and treasures——",
                unlocks: {
                    textlines: [{dialogue: "纳娜米(废墟)", lines: ["fx6"]}],
                },
                
                locks_lines: ["fx5"],
            }),
            "fx6": new Textline({ 
                is_unlocked: false,
                name: "Wait, Sister — this kind of thing... it doesn't feel right. Won't the people of this city be unable to rest in peace?",
                text: "Koko, all your sister knows is<br>that anything that helps the Nya Clan grow faster<br>is worth doing.<br>Right now, every power great and small in the surrounding cities is doing the same thing.<br>It is not easy for us to claim more than others,<br>and there is no time to grieve for those refugees.",
                unlocks: {
                    textlines: [{dialogue: "纳娜米(废墟)", lines: ["fx7"]}],
                },
                
                locks_lines: ["fx6"],
            }),
            "fx7": new Textline({ 
                is_unlocked: false,
                name: "...I, I will listen to you, Sister.",
                text: "(If the same thing were to happen to Yangang City, would everyone... treat us the same way?)",
                unlocks: {
                    textlines: [{dialogue: "声律城难民", lines: ["fx8"]}],
                    
                    locations: ["声律城废墟 - 1"],
                },
                
                locks_lines: ["fx7"],
            }),
        }
    });
    dialogues["声律城难民"] = new Dialogue({
        name: "Shenlv City Refugee",
        textlines: {
            "fx8": new Textline({ 
                is_unlocked: false,
                name: "...Are you thirsty? Let me go find you some water.",
                text: "Thank you, little girl, but there's no need.<br>Thanks to this disaster, I no longer have to repay my debts to the City Lord's Mansion.<br>In a little while, I'll head back into the city —<br>the Sky Rank and Cloud Rank fortunes left behind in there<br>are quite considerable.<br>Even just a portion of one powerful cultivator's belongings<br>would be enough to keep me comfortable for the rest of my life, hahaha——",
                unlocks: {
                    textlines: [{dialogue: "声律城难民", lines: ["fx9"]}],
                },
                
                locks_lines: ["fx8"],
            }),
            "fx9": new Textline({ 
                is_unlocked: false,
                name: "...S-sorry to bother you.",
                text: "(Come to think of it... when I get back to Yangang City,<br>should I ask the City Lord's Mansion for a<span class='coin coin_moneyT'>10B, 8B</span> loan?)<br>If the same thing were to happen to Yangang City,<br>at least there would be resources to start over with.",
                unlocks: {
                },
                
                locks_lines: ["fx9"],
            }),
        }
    });
    
    dialogues["心魔(战场)"] = new Dialogue({
        name: "Inner Demon (Battlefield)",
        starting_text: "Stop and steady your mind",
        textlines: {
            "zc1": new Textline({ 
                is_unlocked: true,
                name: "The sharp stench of blood hits you the moment you leave the city... it's suffocating.",
                text: "Just this one Sky-Outsider<br>has caused the fall of so many powerful cultivators.<br>I must stay clear-headed — I cannot engage in needless killing.<br>Otherwise... I will only drift further and further down that path.<br>",
                unlocks: {
                    textlines: [{dialogue: "心魔(战场)", lines: ["zc2"]}],
                    locations: ["声律城战场 - 1"],
                },
                
                locks_lines: ["zc1"],
            }),
            "zc2": new Textline({ 
                is_unlocked: false,
                name: "...(Review past experiences)",
                text: "",
                unlocks: {
                    spec: "A8-killcount",
                },
            }),
        }
    });
    
    dialogues["御兰"] = new Dialogue({
        name: "Yulan",
        starting_text: "Watch the battle between Yulan and Haohuang",
        textlines: {
            "yl1": new Textline({ 
                is_unlocked: false,
                name: "...",
                text: "[Haohuang] Yulan! You again —<br>this Vessel was discovered first by our people of Shenghuan City,<br>and yet your Lanling City insists on shamelessly contesting it?",
                unlocks: {
                    textlines: [{dialogue: "御兰", lines: ["yl2"]}],
                },
                
                locks_lines: ["yl1"],
            }), 
            "yl2": new Textline({ 
                is_unlocked: false,
                name: "(A Vessel! There's news about a Vessel?)",
                text: "[Yulan] What are you saying, General Hao?<br>This time, it was your Shenghuan City's forces who provoked us first —<br>Lanling City was merely acting in self-defense.<br>[Haohuang] Since you are so utterly unreasonable, I have no need to waste more words on you!<br>With just your handful of people, you think you can break our Huang Clan Formation?<br>What a ridiculous fantasy!",
                unlocks: {
                    textlines: [{dialogue: "御兰", lines: ["yl3"]}],
                },
                
                locks_lines: ["yl2"],
            }),
            "yl3": new Textline({ 
                is_unlocked: false,
                name: "Oh, have they already clashed? What an exciting battle!",
                text: "(Intense greatsword effects)<br>(Intense lightning strike effects)<br><br>[Neko] Whew... even from this distance,<br>I can clearly feel the terrifying energy shockwaves.",
                unlocks: {
                    textlines: [{dialogue: "御兰", lines: ["yl4"]}],
                },
                
                locks_lines: ["yl3"],
            }),
            "yl4": new Textline({ 
                is_unlocked: false,
                name: "...",
                text: "But more than fearful,<br>being able to witness such powerful and refined Arcane Arts being unleashed with my own eyes —<br>it is truly exciting.<br>I can feel it — some of those insights deep in my mind<br>have already begun to become my own.",
                unlocks: {
                    flags: ["is_realm_enabled"],
                },
                
                locks_lines: ["yl4"],
            }),
        }
    });
    
    dialogues["皎月神像"] = new Dialogue({
        name: "Moonlight Idol",
        starting_text: "Pay respects to the Moonlight Idol on the battlefield",
        textlines: {
            "jy1": new Textline({ 
                is_unlocked: false,
                name: "(Bow respectfully three times)",
                text: "[Moonlight Projection]<br>(This is an automated response)<br>What era do you think this is? Drop the old formalities —<br>just offer some Blade Coins as tribute.<br>In return, you shall receive the Moonlight Blessing...<br><br>By the way, the greater your vitality, the greater the blessing cost,<br>so you'll need to pay more.<br>Cultivators above <span class='realm_sky'>Sky Rank 4th Stage</span> need not apply —<br>this small idol cannot bear a projection of too powerful a force.",
                unlocks: {
                    textlines: [{dialogue: "皎月神像", lines: ["jy2"]},{dialogue: "皎月神像", lines: ["jy3"]}],
                },
                
                locks_lines: ["jy1"],
            }), 
            "jy2": new Textline({ 
                is_unlocked: false,
                name: "(Check current blessing and cost information)",
                text: "",
                unlocks: {
                    spec: "JY-check",
                },
            }), 
            "jy3": new Textline({ 
                is_unlocked: false,
                name: "(Offer Blade Coins to receive the blessing)",
                text: "",
                unlocks: {
                    spec: "JY-sacrifice",
                },
            }), 
        }
    });


    
    dialogues["纳娜米(飞船)"] = new Dialogue({
        name: "Nanami (Vessel)",
        textlines: {
            "nnm1": new Textline({ 
                is_unlocked: false,
                name: "Sister! What are you doing here?",
                text: "[Neko] ......Sister? *poke*<br>Neko tilted her head —<br>her sister didn't seem to respond at all,<br>currently absorbed in reading a book in her hands.<br>[Neko] The spine reads... 'Gene Primal Energy Application - Spirit Body Arts'?<br>It seems like she is completely immersed in this book,<br>as if on the verge of an epiphany — best not to disturb her...",

                unlocks: {
                    textlines: [{dialogue: "纳娜米(飞船)", lines: ["nnm2"]}],
                },
                locks_lines: ["nnm1"],
            }),
            "nnm2": new Textline({ 
                is_unlocked: false,
                name: "Neko quietly waited by her side, and in the blink of an eye three hours had passed.",
                text: "[Nanami] Ah, I see — no wonder!<br>This book is so detailed; to gain so much in such a short time,<br>simply wonderful!<br>She tossed the book aside,<br>stood up, stretched with a lazy yawn,<br>and glanced over — Neko was staring at her with a look of profound grievance.<br>[Nanami/Neko] WAAAAAH!!",

                unlocks: {
                    textlines: [{dialogue: "纳娜米(飞船)", lines: ["nnm3"]}],
                },
                locks_lines: ["nnm2"],
            }),
            "nnm3": new Textline({ 
                is_unlocked: false,
                name: "What are you doing, Sister! Why did you suddenly make that sound!",
                text: "[Nanami] K-Koko, when, when did you get here?<br>I thought those iron-skinned monsters had come...<br>[Neko] Hmm, about three hours — no matter how much I called, Sister wouldn't respond.<br>[Nanami] Boo hoo, it's all my fault for worrying you. That cultivation book just now seemed to have a pull to it — I got absorbed in it without even noticing.",

                unlocks: {
                    textlines: [{dialogue: "纳娜米(飞船)", lines: ["nnm4"]}],
                },
                locks_lines: ["nnm3"],
            }),
            "nnm3": new Textline({ 
                is_unlocked: false,
                name: "But Sister, a Spirit Body value of 200 million gets fully negated if the enemy has 2 million Agility — and all the enemies here have over 2 million Agility...",
                text: "[Nanami] Huh, Koko, what did you just say?<br>[Neko] From what I know about this game,<br>as long as you don't learn the Restraint arts, it can't hurt.<br>[Nanami] ......Is that really how it works now?!<br>The two exchanged their gains from this vessel expedition,<br>along with everything they had seen and heard along the way.<br>[Nanami] Much of the intelligence I found came from the books on this bookshelf.<br>They seem to contain quite a bit of information about the Extraterrestrial Clan,<br>but unfortunately the more core content is not mentioned at all.",

                unlocks: {
                    textlines: [{dialogue: "纳娜米(飞船)", lines: ["nnm4"]}],
                },
                locks_lines: ["nnm3"],
            }),
            "nnm4": new Textline({ 
                is_unlocked: false,
                name: "Sister, you said these puppets are called 'Techno-Constructs' by the Extraterrestrial Clan? And the ones we encountered along the way, many of them are 'A9' and 'B1' grade?",
                text: "[Nanami] Yes, if the records in these books are accurate,<br>the three grades A, B, and C correspond to Earth, Sky, and Cloud Rank,<br>and the numbers that follow correspond to minor cultivation stages in order.<br>[Neko] So 'A9' grade is the ninth stage of Earth Rank?<br>But the ones I encountered along the way, like that blue-skinned creature...<br>they must be equivalent to early Sky Rank combat power.<br>[Nanami] One can only conclude... the Extraterrestrial Clan's classification is far stricter.<br>More than half a rank above the Xuelo World standard.<br>Koko, you've become so strong.<br>Without my laser rifle, the me of today<br>would be completely helpless against those Techno-Constructs.",

                unlocks: {
                    textlines: [{dialogue: "纳娜米(飞船)", lines: ["nnm5"]}],
                },
                locks_lines: ["nnm4"],
            }),
            "nnm5": new Textline({ 
                is_unlocked: false,
                name: "I suppose so, heh heh. So Sister, what do we do now?",
                text: "[Nanami] We've already come this far, so naturally we press on.<br>A vessel from the Sky-Outsiders...<br>who knows how many years until we see one again.<br>Even setting aside all the potentially precious treasures, I want to try out the new insights I've learned.<br>[Neko] That's really not that useful...<br>Sister, why not take a Moonlight Blessing during the new moon<br>and then drink this Returning Wind Potion?<br>I guarantee it can more than double your damage output!<br>With your HP, you can receive the blessing for just sixteen Blade Coins!<br><br>[Nanami] Hm... forget it,<br>we're already inside the vessel —<br>we can't exactly run all the way out to find the idol...",

                unlocks: {
                    items: [{item_name: "纳娜米(飞船)",quality:130}],
                },
                locks_lines: ["nnm5"],
            }),
        }
    });
    
    dialogues["核心反应堆"] = new Dialogue({
        name: "Core Reactor",
        starting_text: "Use [Core Reactor]",
        textlines: {
            "reactor": new Textline({ 
                is_unlocked: true,
                name: "Use [Core Reactor]",
                text: "...",
                unlocks: {
                    spec:"A7-reactor",
                },
            }),
        }
    });

    dialogues["纳布(沼泽)"] = new Dialogue({
        name: "Nabu (Swamp)",
        textlines: {
            "zz1": new Textline({ 
                is_unlocked: true,
                name: "...",
                text: "No one could have anticipated<br>that the radiation from the Sky-Outsider vessel's crash<br>would cause so many Wild Beasts to mutate.<br>Perhaps this is the outsider's final act of revenge...<br>These Wild Beasts have become stronger and more ferocious than before.<br>A vast number of Sky Rank and even Cloud Rank Wild Beasts have emerged — a Beast Tide has formed.",
                unlocks: {
                    textlines: [{dialogue: "纳布(沼泽)", lines: ["zz2"]}],
                },
                locks_lines: ["zz1"],
            }),
            "zz2": new Textline({ 
                is_unlocked: false,
                name: "Father, have you ever experienced a Beast Tide before? What is it like?",
                text: "[Nabu] As the name implies...<br>Countless berserk Wild Beasts assault human towns and cities,<br>countless weak common folk lose their homes and are displaced.<br>[Neko] ...So tragic...<br>[Nabu] Koko, the City Lord's Mansion has offered generous rewards this time,<br>taken from what was recovered from the Sky-Outsider by the major territories.<br>Hunt Wild Beasts and bring back proof, and you can claim your reward.",
                unlocks: {
                    textlines: [{dialogue: "纳布(沼泽)", lines: ["zz3"]}],
                },
                locks_lines: ["zz2"],
            }),
            "zz3": new Textline({ 
                is_unlocked: false,
                name: "Father, has Sister already departed with the clan's first group?",
                text: "",
                unlocks: {
                    spec:"3-1-nanami",
                    textlines: [{dialogue: "纳布(沼泽)", lines: ["zz4"]}],
                },
                locks_lines: ["zz3"],
            }),
            "zz4": new Textline({ 
                is_unlocked: false,
                name: "...Understood",
                text: "Alright, it's about time —<br>the next Nya Clan contingent has already set out.<br>Get your head in the game and let's move.<br>With the elite cultivators of Yangang City's main force leading the way,<br>there's no need to worry about encountering wandering Domain or Cloud Rank Beast Kings.",
                unlocks: {
                    
                    locations: ["赫尔沼泽"],
                },
                locks_lines: ["zz4"],
            }),
        }
    });

    dialogues["结界湖转化器"] = new Dialogue({
        name: "Barrier Lake Converter",
        starting_text: "Exchange Wild Beast vouchers for items (including the converter)",
        textlines: {
            "jjh": new Textline({ 
                is_unlocked: true,
                name: "Convert Barrier Lake Core (requires Barrier Lake Core in equipment slot)",
                text: "",
                unlocks: {
                    spec:"jjhzx",
                },
            }),
            "pz-my": new Textline({ 
                is_unlocked: true,
                name: "Exchange for Mithril Ingot (30:1)",
                text: "",
                unlocks: {
                    spec:"pz-my",
                },
            }),
            "pz-bs": new Textline({ 
                is_unlocked: true,
                name: "Exchange for Epic Topaz (80:1)",
                text: "",
                unlocks: {
                    spec:"pz-bs",
                },
            }),
            "pz-Bq": new Textline({ 
                is_unlocked: true,
                name: "Exchange for Purple Blade Coin (250:1)",
                text: "",
                unlocks: {
                    spec:"pz-Bq",
                },
            }),


            //20:1 宝石
            //40:1 秘银
            //250:1 紫刀币
        }
    });

    dialogues["峰"] = new Dialogue({
        name: "Feng",
        starting_text: "Talk to the armored young man",
        textlines: {
            "lf1": new Textline({ 
                is_unlocked: false,
                name: "You, you...",
                text: "[???] Thank you.<br>[Neko] Who are you, and why would you be in a place like this?<br>It's way too suspicious!<br>[???] Uh... do I really look suspicious?",
                unlocks: {
                    textlines: [{dialogue: "峰", lines: ["lf2"]}],
                },
                locks_lines: ["lf1"],
            }),
            "lf2": new Textline({ 
                is_unlocked: false,
                name: "And do you know how dangerous that was just now? That big one was Sky Rank 4th Stage!",
                text: "[???] Is that so, Sky Rank 4th Stage...<br>(According to intelligence, that corresponds to Stellar Rank 4th Stage.)<br>With your level of strength, dealing with that Wild Beast just now<br>carried quite considerable risk for you too, didn't it?<br>Even so, you chose to help someone without hesitation?",
                unlocks: {
                    textlines: [{dialogue: "峰", lines: ["lf3"]}],
                },
                locks_lines: ["lf2"],
            }),
            "lf3": new Textline({ 
                is_unlocked: false,
                name: "It was nothing, and it's none of your business — are you looking down on me?",
                text: "",
                unlocks: {
                    textlines: [{dialogue: "峰", lines: ["lf4"]}],
                    spec: "lf-1",
                    flags: ["is_moonwheel_unlocked"],
                },
                locks_lines: ["lf3"],
            }),
            "lf4": new Textline({ 
                is_unlocked: false,
                name: "...Wait! Don't go!",
                text: "[???] Is there something else?<br>[Neko] You...<br>Since you're so capable, guide me out of the forest then.<br>I can't find my way back.<br>[???] Heh heh, alright. Little girl, what's your name?<br>[Neko] ......<br><br>Neko. That's my name. And you?<br>[Feng] My name is <span style='color:aqua'>[Feng]</span>",
                unlocks: {
                    textlines: [{dialogue: "峰", lines: ["lf5"]}],
                },
                locks_lines: ["lf4"],
            }),
            "lf5": new Textline({ 
                is_unlocked: false,
                name: "...Along the way, the two gradually opened up to each other.",
                text: "[Neko] (How to put it...<br>this person, when I first saw him,<br>seemed to be acting very strangely.)<br>(But after walking together for a while,<br>he's unexpectedly easy to get along with.)<br>Feng... you must be older than me,<br>so I'll call you Big Brother Feng.<br>If you don't mind, call me Koko.<br>[Feng] Sure. Koko, you said earlier<br>that this is the heart of Yangang Territory's sphere of influence?<br>And where we're heading<br>is Yangang City, the [Territorial Capital] of Yangang Territory?",
                unlocks: {
                    textlines: [{dialogue: "峰", lines: ["lf6"]}],
                },
                locks_lines: ["lf5"],
            }),
            "lf6": new Textline({ 
                is_unlocked: false,
                name: "Yes, although the Beast Tide has struck,",
                text: "[Neko] All the powerful cultivators of Yangang Territory are out defending against the Beast Tide,<br>so the city is temporarily rather empty.<br>[Feng] In that case... once we're out of the forest,<br>I'll be counting on you to lead the way.<br><br>[Feng] has joined the party!",
                unlocks: {
                    textlines: [{dialogue: "峰", lines: ["lf7"]}],
                    items: [{item_name: "峰"}],
                },
                locks_lines: ["lf6"],
            }),
            "lf7": new Textline({ 
                is_unlocked: false,
                name: "Something's happening!",
                text: "(Baifang appears with a group of Bai Clan members!)<br>[Baifang] Haha, I wondered who it was —<br>turns out it's Miss Neko.<br>(Twist: Our ally Leidong appears)<br>(Intense standoff)<br>(Twist: The enemy's Baiyanta appears)<br>(Another intense standoff)<br>(Twist: The enemy is scared off by Big Brother Feng)",
                unlocks: {
                    textlines: [{dialogue: "峰", lines: ["lf8"]}],
                },
                locks_lines: ["lf7"],
            }),
            "lf8": new Textline({ 
                is_unlocked: false,
                name: "Another turn of events!",
                text: "(The Bai Clan members are robbed by the Thirteen Axes!)<br>(The Bai Clan members can't beat the Thirteen Axes without Restraint potions!)<br>(Baiyanta flees and begs Neko for help!)<br>(The Thirteen Axes think Neko is carrying the valuables and try to rob her!)<br><br>Not gonna lie, she really does have a <span class='coin coin_moneySp'>1.21Δ</span> gem...<br>(<span class='coin coin_moneySp'>1.21Δ</span> goes berserk and wipes out all the Thirteen Axes!)<br>(Uncle Lei suddenly gets excited and urges Neko and Feng to become friends!)",
                unlocks: {
                    textlines: [{dialogue: "峰", lines: ["lf9"]}],
                },
                locks_lines: ["lf8"],
            }),
            "lf9": new Textline({ 
                is_unlocked: false,
                name: "What in the world is even going on...",
                text: "[Feng] Heh heh, never mind. We're safe for now —<br>let's get moving. We can talk when we reach the capital.<br>[Neko] Ugh, what is up with this guy —<br>if he's this strong, why didn't he say so earlier!<br>I spent all that effort saving him,<br>but that Barbarian Beast with a hundred million buffs couldn't even scratch him!",
                unlocks: {
                    locations: ["黑暗森林 - 3"],
                },
                locks_lines: ["lf9"],
            }),
            "lf10": new Textline({ 
                is_unlocked: false,
                name: "Phew — we're finally out of that pitch-black forest.",
                text: "[Leidong] Lord Feng, I know this city very well —<br>if there's somewhere you'd like to go...<br>[Feng] That won't be necessary... let's part ways here.<br>[Neko] Part ways... already?<br>(A flicker of disappointment crosses Neko's expression)<br>[Feng] By the way, where is the best lodging in Yangang City?<br>[Neko] Feiyun Pavilion.<br>[Feng] Good. If you want to find me, head to Feiyun Pavilion.<br><br>[Feng] has left the party!",
                unlocks: {
                    locations: ["飞云阁"],
                    spec:"lf-leave",
                },
                locks_lines: ["lf10"],
            }),
        }
    });
    
    dialogues["峰(飞云)"] = new Dialogue({
        name: "Feng (Feiyun)",
        starting_text: "Talk to Big Brother Feng",
        textlines: {
            "lf11": new Textline({ 
                is_unlocked: true,
                name: "Big Brother Feng... is there something you wanted to ask?",
                text: "Little one, the Arcane Arts you're currently using —<br>where did you get them?",
                unlocks: {
                    textlines: [{dialogue: "峰(飞云)", lines: ["lf12"]}],
                },
                locks_lines: ["lf11"],
            }),
            "lf12": new Textline({ 
                is_unlocked: false,
                name: "...Two years ago, I found them on the Sky-Outsider's vessel.",
                text: "[Feng] This set of Arcane Arts only covers the basics,<br>and there are many imperfections.<br>Let me give you a deeper set to study.<br><br>Feng flicked his fingers lightly; two beams of light shot out and drilled into Neko's brow.<br>Neko felt only a throbbing pain in her head,<br>followed suddenly by a flood of knowledge.<br><br>Starflower - Star Cluster, Starflower - Giant Star, Starflower - Flower Sea<br> have been added to available Arcane Arts!",
                unlocks: {
                    textlines: [{dialogue: "峰(飞云)", lines: ["lf13"]}],
                    stances: ["SF_Power","SF_Lucky","SF_Multi"],
                },
                locks_lines: ["lf12"],
            }),
            "lf13": new Textline({ 
                is_unlocked: false,
                name: "...About this Beast Tide defense,",
                text: "[Neko] Even the rewards the City Lord's Mansion gives to the top few<br>probably can't compare to what Big Brother Feng just gave me.<br>[Feng] The Beast Tide?<br>Speaking of which, there is something suspicious about it.<br>It appears to have been caused by the vessel's crash,<br>but from what I know, the [D9-class Vessel]<br>contains an enormous reactor —<br>and this continent lacks the knowledge to operate it safely.",
                unlocks: {
                    textlines: [{dialogue: "峰(飞云)", lines: ["lf14"]}],
                },
                locks_lines: ["lf13"],
            }),
            "lf14": new Textline({ 
                is_unlocked: false,
                name: "...?",
                text: "Every time this type of Primal Energy reactor explodes,<br>it releases large amounts of [Primal Energy Radiation].<br>Based on the evidence at the scene,<br>to refine a batch of [Supreme Evolution Crystals],<br>this reactor exploded a total of 58 times.",
                unlocks: {
                    textlines: [{dialogue: "峰(飞云)", lines: ["lf15"]}],
                },
                locks_lines: ["lf14"],
            }),
            "lf15": new Textline({ 
                is_unlocked: false,
                name: "But — so many people died because of this, why would anyone...",
                text: "So long as the sacrifice of thousands of the weak<br>can bring about a single powerful cultivator's breakthrough,<br>the value to the clan far outweighs those thousands.<br>Moreover, mutated Wild Beasts are more valuable as materials<br>and make for suitable training targets.<br>Can't accept that? That's fine.<br>After all, I have never detonated a Core Reactor myself.<br>This is ultimately nothing more than my speculation.",
                unlocks: {
                    textlines: [{dialogue: "峰(飞云)", lines: ["lf16"]}],
                },
                locks_lines: ["lf15"],
            }),
            "lf16": new Textline({ 
                is_unlocked: false,
                name: "Suddenly... I've lost all interest in defending against the Beast Tide.",
                text: "These are things a [strong cultivator] must come to understand.<br>Rather than defending against the Beast Tide,<br>there may be a place more suited to you.<br>About ten thousand miles east of Yangang City,<br>there is a secluded place<br>where the flow of time seems to be accelerated.",
                unlocks: {
                    textlines: [{dialogue: "峰(飞云)", lines: ["lf17"]}],
                },
                locks_lines: ["lf16"],
            }),
            "lf17": new Textline({ 
                is_unlocked: false,
                name: "But Big Brother Feng, why don't you go there yourself...",
                text: "There's no need. Those things were left behind by a domain master —<br>a Domain Rank cultivator,<br>and packing them up isn't worth <span class='coin coin_moneySp'>0.01Δ</span> to me;<br>they are meaningless in my eyes.<br>Remember — be very careful.<br>I will leave a spirit imprint on you;<br>use it to communicate with me when you are in danger.<br><br>",
                unlocks: {
                    locations: ["纯白冰原"],
                },
                locks_lines: ["lf17"],
            }),
        }
    });

    dialogues["纳娜米(冰原)"] = new Dialogue({
        name: "Nanami (Ice Plains)",
        textlines: {
            "by1": new Textline({ 
                is_unlocked: true,
                name: "It's so cold... Sister. Why is this snowy plain not marked on the map of Yangang Territory?",
                text: "This must be the place that mysterious cultivator Feng spoke of.<br>The environment is indeed harsh — low temperatures combined with ice elements;<br>Earth Rank cultivators probably risk freezing to death here.",
                //冰元素设定：微型而懒惰的拉普拉斯妖怪，可以在气温并不十分离谱的情况下制造负热量，吸收人的能量

                unlocks: {
                    textlines: [{dialogue: "纳娜米(冰原)", lines: ["by2"]}],
                },
                locks_lines: ["by1"],
            }),
            "by2": new Textline({ 
                is_unlocked: false,
                name: "Can't take it anymore, it's too cold — I'll open the Flame Domain to warm up.",
                text: "[Nanami] Don't use the Domain for something like this...<br>Wait, Koko, have you ever actually closed your Flame Domain?<br>[Neko] Eh...<br>In any case, Sister come closer!<br><br>Nanami has joined the party! Ability effectiveness increased by 5%!",
                //火焰领域设定：高温会让冰元素活化，释放出负热量，但高温领域的量级高于一小片区域的冰元素，起到驱散效果

                unlocks: {
                    items: [{item_name: "纳娜米(冰原)",quality:160}],
                },
                locks_lines: ["by2"],
            }),
        }
    });


    dialogues["极寒相变引擎"] = new Dialogue({
        name: "Freezing Air Phase Transformation Engine",
        starting_text: "Use [Freezing Air Phase Transformation Engine]",
        textlines: {
            "engine": new Textline({
                is_unlocked: false,
                name: "Use [Freezing Air Phase Transformation Engine]",
                text: "...",
                unlocks: {
                    spec: "freezing-engine",
                },
            }),
        }
    });



















    dialogues["心之石像"] = new Dialogue({
        name: "Heart Stone Idol",
        starting_text: "Crystallize insights accumulated in battle",
        textlines: {
            "clumbs": new Textline({ 
                is_unlocked: true,
                name: "Wild Beast Forest Insight / Click to receive!! (will be removed in v1.10)",
                text: "...",
                unlocks: {
                    spec:"A1-fusion",
                },
                
                locks_lines: ["clumbs"],
            }),
        }
    });
})();

export {dialogues};