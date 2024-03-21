import { ITracking } from "./tracking";
import { IVehicle } from "./vehicle";

/**
 * @var string column:
 *  @Description Enter the name of the column to which the filter is to be applied.
 *
 * @var string filter:
 *      @value exact
 *      @value iexact
 *      @value contains
 *      @value lte
 *      @value gte
 *      @value range
 *
 *      @value orderBy
 *
 * @var string value:
 *  @Description This column stores the value that should be taken into account for the filter,
 *  for example asc or desc only when filter contains orderBy
 *
 */
export interface IFilter {
    column: string;
    filter: string;
    value?: boolean | string | number | null;
  }
  
  export default interface IPagination {
    page: number;
    objectsPerPage: number;
    maxPage?: number;
    filters: IFilter[];
    total?: number;
    previousPage?: number; 
    nextPage?: number;
    list?: IVehicle[] | ITracking[] | any[];
  }
  
  export const iPagination: IPagination = {
    page: 1,
    objectsPerPage: 25,
    maxPage: 1,
    filters: []
  };