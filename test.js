const url = 'https://api.talkbot.ir/v1/media/text-to-speech/REQ';
const headers = {
    'Authorization': 'Bearer sk-7c5371ca2a70048898931c4c448017ad',
    'Content-Type': 'application/json'
};
const data = {
    text: 'سلام امیدوارم حالت خوب باشه.',
    server: 'farsi',
    sound: '3'
};

fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
})
.then(response => {
    if (response.ok) {
        return response.text();
    } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
})
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error(error);
});

