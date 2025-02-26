import { DebugIcon, HomeIcon, PublicClassIcon, VipIcon } from "@/components/ui/icons";



export const navigation = [
    {
        id:1,
        title_fa:"خانه",
        
        title_en:"Home",
        url:"/",
        icon:<HomeIcon />
    },
    {
        id:2,
        title_fa:"دیباگ",
        
        title_en:"Debug",
        url:"/debug",
        icon:<DebugIcon />
    },
    {
        id:3,
        title_fa:"کلاس خصوصی",
        
        title_en:"Private Class",
        url:"/",
        icon:<VipIcon />
    },
    {
        id:4,
        title_fa:"کلاس عمومی",
        
        title_en:"Public Class",
        url:"/",
        icon:<PublicClassIcon />
    },
]