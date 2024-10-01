import { env } from '$env/dynamic/public';
import axios from "axios";

const API_URL = env.PUBLIC_API_URL;

// Config axios client

const axiosClient = axios.create({
    baseURL: API_URL
});

export const getAllRooms = async () => {
    const response = await axiosClient.get('/game-room');
    return response.data;
}

export const createGameRoom = async (username: string) => {
    const response = await axiosClient.post('/game-room', {
        username,
        name: `${username}\'s Room`
    });
    return response.data;
}

export const deleteGameRoom = async (gameRoomId: string) => {
    const response = await axiosClient.delete(`/game-room/${gameRoomId}`);
    return response.data;
}