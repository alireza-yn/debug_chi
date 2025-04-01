export interface Main {
    incoming_request: IncomingRequest;
    my_requests:      IncomingRequest;
}

export interface IncomingRequest {
    debug:   Debug[];
    consult: any[];
}

export interface Debug {
    id:                 number;
    title:              null;
    created_at:         Date;
    updated_at:         Date;
    session_id:         string;
    status:             "open" | "close" | "pending"
    start_at:           Date | null;
    close_at:           null;
    mode:               "chat" | "voice_call" | "video_call";
    price:              number;
    discount:           number;
    file:               string;
    description:        string;
    time:               number;
    debuger:            Debuger;
    debuger_applicator: Debuger;
}

export interface Debuger {
    id:               number;
    password:         string;
    last_login:       Date | null;
    is_superuser:     boolean;
    username:         string;
    email:            string;
    first_name:       string;
    last_name:        string;
    user_phone:       string;
    is_active:        boolean;
    is_staff:         boolean;
    unlimited:        boolean;
    created:          Date;
    updated:          Date;
    uuid:             string;
    intro_completed:  boolean;
    digital_wallet:   number;
    blocked_wallet:   number;
    user_bio:         string;
    debugger_bio:     string;
    user_score:       number;
    image_profile:    string;
    groups:           any[];
    user_permissions: any[];
}
