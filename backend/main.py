# from tkinter import *
# from tkinter.ttk import *
# from tkinter import messagebox, ttk

# screen=Tk()
# screen.geometry("500x700+500+10")
# screen.title("FORM tamrin.1")
# # screen.iconbitmap("image1/icon.ico")
# screen.config(bg="#52B788")
# font="nazanin 15 bold "
# screen.resizable(width=False, height=False)

# a={

#     "foreground":"#D8F3DC",
#     "background":"#52B788"
# }

# b={

#     "foreground":"#081C15",
#     "background":"#2D6A4F"
# }


# def check():
#     age=combage.get()
#     jens=combjens.get()
#     name=txtf.get()
#     if jens=="آقا":
#         messagebox.showinfo("توجه!","اگر در حال گذراندن دوره سربازی هستید اطلاع دهید")
#         if age==19:
#              messagebox.showerror("اخطار","برای ثبت و استخدام نیاز به کارت سربازی هست!!")
#         elif age==20:
#                 messagebox.showwarning("معافیت","لطفا مدارک مرتبط با معافیت خود را همراه داشته باشید")


#      # for age in range(21,81):
#       #messagebox.showinfo("ثبت" ,f"آقای {name}لطفا کپی مدارک مرتبط با سربازی خود را به شرکت تحویل دهید"  )

#     else:
#         messagebox.showinfo("بررسی شد", f"   خانم  {name} خوش آمدید    ")

# conf={
#     "foreground":"#1B4332",
#     "background":"#2D6A4F",
#     "width":22
# }

# def print_func():
#     loutput.config(text=combjens.get()+" "+txtf.get()+" "+combage.get()+ " ساله"+" " +"با موفقیت ثبت شد"  )
#     txtf.set("")
#     combjens.set(" ")





# #prompt

# lbl1=Label(screen,text="به نام خدا",font=font,background="#52B788",foreground="white")
# lbl1.place(relx=0.44,rely=0)
# lbl2=Label(screen,text="*لطفا فرم زیر را با توجه به مشخصات خود پر کنید*",font=font)
# lbl2.config(background="#52B788",foreground="#081C15")
# lbl2.place(relx=0.15,rely=0.1)
# lbln=Label(screen,text="نام",font=font,**a)
# lbln.place(relx=0.8,rely=0.3)
# lblf=Label(screen,text="نام خانوادگی",font=font,**a)
# lblf.place(relx=0.1,rely=0.4)
# lblf.place(relx=0.8,rely=0.36)
# lblage=Label(screen,text="سن",font=font,**a)
# lblage.place(relx=0.1,rely=0.6)
# lblage.place(relx=0.8,rely=0.42)
# lbljens=Label(screen,text="جنسیت",font=font,**a)
# lbljens.place(relx=0.1,rely=0.8)
# lbljens.place(relx=0.8,rely=0.48)
# lbljob=Label(screen,text="شغل",font=font,**a)
# lbljob.place(relx=0.8,rely=0.54)
# lblmar=Label(screen,text="تاهل",font=font,**a)
# lblmar.place(relx=0.8,rely=0.6)
# lblq=Label(screen,text="آیا مایل به ثبت هستید؟",font=font,**a)
# lblq.place(relx=0.6,rely=0.74)

# #input
# tval=StringVar()
# tval1=StringVar()

# txtn=Entry(screen,**conf,textvariable=tval,font="nazanin 12 ",takefocus=True)
# txtn.focus()
# txtn.place(relx=0.42,rely=0.31)
# txtf=Entry(screen,**conf,textvariable=tval1,font="nazanin 12",takefocus=True)
# txtf.place(relx=0.42,rely=0.37)

# def lst_age():
#     lage=[]
#     for i in range(18,81):
#         lage.append(i)
#     return lage


# combage=ttk.Combobox(screen,values=lst_age(),font="nazanin 12 italic",state="readonly")
# combage.place(relx=0.42,rely=0.43)
# combage.current(0)


# jens=["خانم","آقا"]
# combjens=ttk.Combobox(screen,**b,values=jens,font="nazanin 12 italic",state="readonly")
# combjens.place(relx=0.42,rely=0.49)
# combjens.current(0)


# job=["کارمند دولتی","کارمند خصوصی","ازاد","دانشجو"]
# combjob=ttk.Combobox(screen,**b,values=job,font="nazanin 12 italic",state="readonly")
# combjob.place(relx=0.42,rely=0.55)
# combjob.current(2)

# lstm=["مجرد","متاهل","مطلقه"]
# combm=ttk.Combobox(screen,**b,values=lstm,font="nazanin 12 italic",state="readonly")
# combm.place(relx=0.42,rely=0.61)
# combm.current(0)

# #inout

# btn1=Button(screen,text="بررسی کنید",command=check).place(relx=0.4,rely=0.7)

# ans=IntVar()
# btnj=Radiobutton(screen,text="بله",variable=jens,value=1)
# btnj.place(relx=0.44,rely=0.75)


# btn2=Button(screen,text="ثبت" ,command=print_func).place(relx=0.4,rely=0.8)


# loutput=Label(screen,width=40,font=font,background="#52B788",foreground="#1B4332")
# loutput.place(relx=0.42,rely=0.85)

# # messag=messagebox.askquestion("اتمام","آیا از روند ثبت نام راضی بودید")

# screen.mainloop()



import boto3
import os
s3 = boto3.client(
    's3',
    endpoint_url='https://c244557.parspack.net',
    aws_access_key_id='jwRi59W3fYhsw1tp',
    aws_secret_access_key='XRW9K7VcDvC0E5P86EMgPcVsCE4PWmix'
)

# لیست سطل‌ها
print(s3.list_buckets())

# # آپلود تستی
#  extra_args = {'ContentLength': os.path.getsize("local_file.tx")}
# s3.upload_file(
#     ExtraArgs:{},
#     'local_file.txt',  # فایل لوکال
#     'test-bucket-0631',  # نام سطل
#     'remote_file.txt'  # نام فایل در S3
# )