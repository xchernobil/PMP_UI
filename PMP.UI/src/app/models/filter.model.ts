import { Paging } from './paging.model';

export class SortingAndFiltering {
    constructor() {
        this.Paging=new Paging();
    }
    FilterValue: string;
    FilterField: string;
    SortField: string;
    SortOrder: string;
    Paging: Paging;
}