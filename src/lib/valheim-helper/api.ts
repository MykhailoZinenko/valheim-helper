import { IBiome, IItem } from "@/types";
import { valheimHelperApiConfig } from "./config";

const API_URL = valheimHelperApiConfig.url; 

export const getAllItems: () => Promise<{ total: number; items: IItem[] }> = async () => {
    try {
        console.log(API_URL)
        const response = await fetch(`${API_URL}/api/items`);

        if (!response.ok) {
            throw new Error("Failed to fetch items");
        }

        const data = await response.json();

        if (!data) {
            throw new Error("No items found");
        }

        console.log(data);

        return data;
    } catch (error) {
        console.log(error)
        return error
    }
}

export const getItemById = async (itemId: string) => {
    try {
        const response = await fetch(`${API_URL}/api/items/${itemId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch item");
        }

        const data = await response.json();

        if (!data) {
            throw new Error("No item found");
        }

        return data;
    } catch (error) {
        console.log(error)
        return error
    }
}

export const getAllBiomes: () => Promise<{ total: number; biomes: IBiome[] }> = async () => {
    try {
        const response = await fetch(`${API_URL}/api/biomes`);

        if (!response.ok) {
            throw new Error("Failed to fetch biomes");
        }

        const data = await response.json();

        if (!data) {
            throw new Error("No biomes found");
        }        

        return data;
    } catch (error) {
        console.log(error)
        return error
    }
}