export interface Occasion {
    id: number;
    type: string;
    summary: string;
    label: string;
    user_id: string;
    email: string;
    custom_input: string;
    date: string;
    date_processed: string;
    tone: string;
    is_recurring: boolean;
    is_draft: boolean;
}

export enum OCCASION_FILTERS {
    UPCOMING = 'upcoming',
    PAST = 'past',
    DRAFT = 'draft'
}

export enum OCCASION_SORTS {
    DATE_DESCENDING = 'date_desc',
    DATE_ASCENDING = 'date_asc'
}