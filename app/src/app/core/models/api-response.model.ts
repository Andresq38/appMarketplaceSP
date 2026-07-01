export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface ApiPaginatedResponse<T> {
    status: number;
    message: string;
    data: T[];
    pagination?: {
        total: number;
        page: number;
        limit: number;
    };
}
