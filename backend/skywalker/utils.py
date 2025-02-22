import aiohttp
import asyncio

async def send_request(session_id, debuger, applicator):
    async with aiohttp.ClientSession() as session:
        payload = {
            'session_id': session_id,
            'debuger': debuger,
            'applicator': applicator
        }
        async with session.post('http://localhost:3000/api/chat/create', json=payload) as response:
            return await response.json()