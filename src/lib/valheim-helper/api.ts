const API_URL = import.meta.env.VALHEIM_HELPER_API_URL || "http://localhost:3000";

export const getAllItems = async () => {
    try {
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