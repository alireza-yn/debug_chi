import fs from 'fs';

const  saveBase64Audio = async (base64String:any, outputFilePath:any)=> {
    // حذف بخش "data:audio/mpeg;base64," از رشته Base64 (اگر وجود دارد)
    // const base64Data = base64String.replace(/^data:audio\/\w+;base64,/, '');
    // console.log(base64String)
    // ایجاد یک بافر از داده‌های Base64
    // const buffer = Buffer.from(base64Data, 'base64');

    // ذخیره بافر به عنوان فایل صوتی
    // fs.writeFileSync(outputFilePath, buffer);
    fs.writeFileSync('file.wav', Buffer.from(base64String.replace('data:audio/wav; codecs=opus;base64,', ''), 'base64'));
    console.log(`فایل صوتی در مسیر ${outputFilePath} ذخیره شد.`);
}

// مثال استفاده از تابع

const outputFilePath = 'output.mp3'; // مسیر ذخیره فایل صوتی


export default saveBase64Audio