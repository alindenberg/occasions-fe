export interface Occasion {
    id: number;
    type: string;
    label: string;
    user_id: string;
    email: string;
    custom_input: string;
    date: string;
    date_processed: string;
}

export enum OCCASION_FILTERS {
    UPCOMING = 'upcoming',
    PAST = 'past'
}