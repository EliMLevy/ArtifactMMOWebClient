// Utilities
import { defineStore } from "pinia";

interface CharacterData {
    lastState: {
      state: string
    };
    defaultState: {
      state: string
    };
    upcomingActions: {
      state: string,
      [key: string]: string,
    }[];
    character: any;
    currentMap: any;
}

export const useAppStore = defineStore("app", {
    state: () => ({
        characters: {
            Bobby: {} as CharacterData,
            Stuart: {} as CharacterData,
            George: {} as CharacterData,
            Tim: {} as CharacterData,
            Joe: {} as CharacterData,
        },
        loading: {
            Bobby: false,
            Stuart: false,
            George: false,
            Tim: false,
            Joe: false,
        },
    }),
    actions: {
        async fetchCharacter(
            characterName: "Bobby" | "Stuart" | "George" | "Tim" | "Joe"
        ) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                characterName,
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };

            try {
                this.loading[characterName] = true;
                const response = await fetch(
                    "http://localhost:3000/character",
                    // @ts-ignore
                    requestOptions
                );
                const result = await response.json();
                console.log(result);
                this.characters[characterName] = result;
                this.loading[characterName] = false;
            } catch (error) {
                console.log("Error", error);
            }
        },
        async setDefaultAction(
            characterName: "Bobby" | "Stuart" | "George" | "Tim" | "Joe",
            action: string
        ) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                characterName,
                action,
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };
            try {
                const response = await fetch(
                    "http://localhost:3000/default",
                    // @ts-ignore
                    requestOptions
                );
                const result = await response.json();
                this.characters[characterName] = result;
                console.log(result);
            } catch (error) {
                console.log("error", error);
            }
        },
        async clearCharacterQueue(
            characterName: "Bobby" | "Stuart" | "George" | "Tim" | "Joe"
        ) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                characterName,
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };
            try {
                const response = await fetch(
                    "http://localhost:3000/clear",
                    // @ts-ignore
                    requestOptions
                );
                const result = await response.json();
                this.characters[characterName] = result;
                console.log(result);
            } catch (error) {
                console.log("error", error);
            }
        },
        async addActionToQueue(
            characterName: "Bobby" | "Stuart" | "George" | "Tim" | "Joe",
            action: string,
            params: any
        ) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                characterName,
                action,
                ...params,
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };
            try {
                const response = await fetch(
                    "http://localhost:3000/action",
                    // @ts-ignore
                    requestOptions
                );
                const result = await response.json();
                this.characters[characterName] = result;
                console.log(result);
            } catch (error) {
                console.log("error", error);
            }
        },
    },
});
