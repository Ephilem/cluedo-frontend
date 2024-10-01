import type { PageLoad } from './$types';


export const load: PageLoad = ({ params, url }) => {
    const username = url.searchParams.get('username')
    return {
        gameRoomId: params.roomId,
        username: username
    };
};