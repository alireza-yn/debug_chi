export interface Main {
    id:              number;
    email:           string;
    username:        string;
    image_profile:   string;
    password:        string;
    user_phone:      string;
    first_name:      string;
    last_name:       string;
    is_active:       boolean;
    is_staff:        boolean;
    intro_completed: boolean;
    unlimited:       boolean;
    created:         Date;
    updated:         Date;
    uuid:            string;
    user_roles:      string[];
    user_resume:     UserResume[];
    user_language:   UserLanguage[];
    user_expertise:  Expertise[];
    user_bio:        string;
    debugger_bio:    string;
    user_score:      number;
    digital_wallet:  number;
    followers:       Followers;
}

export interface Followers {
    count: number;
    users: User[];
}

export interface User {
    id:       number;
    username: string;
    image:    string;
    uuid:     string;
}

export interface Expertise {
    id:         number;
    expertise?: Expertise[];
    created_at: Date;
    updated_at: Date;
    title?:     string;
}

export interface UserLanguage {
    language_name: LanguageName;
}

export interface LanguageName {
    id:         number;
    name:       string;
    created_at: Date;
    updated_at: Date;
    image:      string;
    video:      null;
    level:      string;
}

export interface UserResume {
    id:          number;
    title:       string;
    description: string;
    image:       null;
    cv_file:     string;
    created_at:  Date;
    updated_at:  Date;
    user:        number;
}
