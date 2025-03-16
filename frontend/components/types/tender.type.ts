export interface Main {
    results: Result[];
}

export interface Result {
    tender: Tender;
    bids:   Bid[];
}

export interface Bid {
    id:         number;
    user:       CreatedBy;
    amount:     number;
    created_at: Date;
    updated_at: Date;
}

export interface CreatedBy {
    id:             number;
    email:          string;
    username:       string;
    image_profile:  string;
    user_phone:     string;
    first_name:     string;
    last_name:      string;
    uuid:           string;
    user_language:  UserLanguage[];
    user_expertise: string[];
    user_bio:       string;
    debugger_bio:   string;
    user_score:     number;
}

export interface UserLanguage {
    language_name: Language;
}

export interface Language {
    id:         number;
    name:       Name;
    created_at: Date;
    updated_at: Date;
    image:      string;
    video:      null;
    level:      Level;
}

export enum Level {
    Advanced = "advanced",
    Beginner = "beginner",
    Intermediate = "intermediate",
}

export enum Name {
    Java = "Java",
    Javascript = "javascript",
    PHP = "php",
    Python = "Python",
}

export interface Tender {
    id:number;
    created_by:  CreatedBy;
    active:      boolean;
    title:       string;
    description: string;
    image:       null | string;
    file:        null | string;
    start_time:  Date;
    end_time:    Date;
    start_bid:   string;
    highest_bid: string;
    winner:      null;
    language:    Language[];
    skills:      Skill[];
}

export interface Skill {
    id:          number;
    name:        string;
    skill_level: Level;
    image:       string;
    created_at:  Date;
    updated_at:  Date;
}
    