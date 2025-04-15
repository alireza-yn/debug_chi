import mongoose from "mongoose";

export const saveComment = async (data: any) => {
  console.log("Received data:", data.payload);  // بررسی داده‌های دریافتی
  try {
    // اتصال به دیتابیس
    if (mongoose.connection && mongoose.connection.db) {
      const collection = mongoose.connection.db.collection("comments");

      // جستجو برای کامنت بر اساس comment_id
      const exist_comment = await collection.findOne({ comment_id: data.comment_id });
      console.log("Existing comment:", exist_comment);  // نمایش کامنت پیدا شده

      if (exist_comment) {
        // اگر کامنت وجود داشته باشه، آپدیتش می‌کنیم
        const result = await collection.updateOne(
          { comment_id: data.comment_id }, // اطمینان از مطابقت درست
          { $push: { comments: data.payload } } // افزودن کامنت جدید به آرایه
        );
        console.log("Update result:", result); // نمایش نتیجه آپدیت
      } else {
        // اگر کامنت وجود نداشته باشه، یک کامنت جدید اضافه می‌کنیم
        const result = await collection.insertOne({
          comment_id: data.comment_id,
          comments: [data.payload],
        });
        console.log("Insert result:", result); // نمایش نتیجه درج
      }
      return true;  // اگر عملیات با موفقیت انجام بشه
    } else {
      console.error("Database connection is not established");
      return false;
    }
  } catch (error) {
    console.error("Error in saveComment:", error);  // نمایش خطاها برای دیباگ
    return false;
  }
};



export const getComments = async (comment_id:any)=>{
  if (mongoose.connection && mongoose.connection.db) {
    const collection = mongoose.connection.db.collection("comments");
    const comments = await collection.findOne({comment_id:comment_id})
    if(comments){

      return comments
    }else{
      return false
    }

  }else{
    return false
  }

}

export const saveReply = async (comment_id: any, replyData: any) => {
  if (mongoose.connection && mongoose.connection.db) {
    const collection = mongoose.connection.db.collection("comments");

    const result = await collection.updateOne(
      { comment_id: comment_id }, // پیدا کردن کامنت بر اساس آیدی
      { $push: { reply: replyData } } // اضافه کردن ریپلای به آرایه‌ی reply
    );

    if (result.modifiedCount > 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};