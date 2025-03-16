import fs from "fs";
import path from "path";

const saveAudioFile = async (audioBuffer: Buffer, sender: string): Promise<string | null> => {
  try {
    const uploadsDir = path.join(__dirname, "..","uploads");
    console.log(uploadsDir)
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `audio_${sender}_${Date.now()}.wav`;
    const filePath = path.join(uploadsDir, fileName);
    console.log(filePath)

    fs.writeFileSync(filePath, audioBuffer);

    return filePath; // مسیر ذخیره‌شده را برمی‌گرداند
  } catch (error) {
    console.error("Error saving audio file:", error);
    return null;
  }
};

export default saveAudioFile;
