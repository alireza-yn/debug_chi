

export interface Main {
    id:string;
    sender:string;
    receiver:string;
    data:chatData;
}



export interface chatData {
  type: "file" | "text" | "audio" | "picture" | "anydesk" | "code" | "payment";
  text?: string;
  data?:any;
  language?:string;
  url?: string;
  time?: string;
  audioUrl?:string;
  status?: "sent" | "pending" | "recieved";
  reply?: boolean;
  uuid?: string;
  file?: File;
  created_at?:string;
}