import { createClient } from 'redis';

// اتصال به Redis
const redisClient = createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Error:', err);
});

redisClient.connect()
  .then(() => console.log('🟢 Connected to Redis'))
  .catch(err => console.error('🔴 Redis Connection Failed:', err));

/**
 * مدیریت رویدادهای Redis: انتشار و گوش دادن
 * @param channel نام کانال Redis
 * @param callback تابعی که هنگام دریافت پیام اجرا می‌شود (اختیاری)
 */
export const handleRedisEvents = async (channel: string, callback?: (message: any) => void) => {
  try {
    const subscriber = redisClient.duplicate();
    await subscriber.connect();

    await subscriber.subscribe(channel, (message) => {
      console.log(`📩 [${channel}] New message received:`, message);
      if (callback) {
        callback(JSON.parse(message));
      }
    });
  } catch (error) {
    console.error(`❌ Error handling Redis events for ${channel}:`, error);
  }
};

/**
 * ارسال پیام به Redis
 * @param channel کانال موردنظر در Redis
 * @param message پیام ارسالی
 */
export const publishMessage = async (channel: string, message: any) => {
  try {
    await redisClient.publish(channel, JSON.stringify(message));
    console.log(`🚀 Message sent to [${channel}]:`, message);
  } catch (error) {
    console.error("❌ Error publishing message to Redis:", error);
  }
};

/**
 * تابع اصلی مدیریت Redis
 * همه رویدادهای مورد نیاز را اینجا تعریف کن
 */
export const redisHandler = () => {
  console.log("🔄 Redis Event Handler Started...");

  handleRedisEvents("new_user", (message) => {
    console.log("📥 New User Event:", message);
  });

  handleRedisEvents("chat_message", (message) => {
    console.log("💬 Chat Message:", message);
  });

  handleRedisEvents("notification", (message) => {
    console.log("🔔 Notification:", message);
  });


  handleRedisEvents("new_user",(message)=>{
    console.log("new_user_created",message)
  })
};
