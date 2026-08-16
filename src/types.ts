export type DataRow = Record<string, string | number | boolean | null | undefined>;

export type FilterCondition = 'contains' | 'equals' | 'gt' | 'lt' | 'neq' | 'startsWith' | 'endsWith';

export type SortOrder = 'asc' | 'desc';

export type CFRule = 'none' | 'gt' | 'lt' | 'eq' | 'between';

export type AggregatorType = 'Sum' | 'Count' | 'Average' | 'Max' | 'Min';

export type MergeMode = 'append' | 'merge_nokey' | 'merge_key';

export type CalcMode =
  | 'formula_fx'
  | 'operator'
  | 'item_sum'
  | 'item_avg'
  | 'item_max'
  | 'item_min'
  | 'item_count'
  | 'sumif'
  | 'countif'
  | 'averageif'
  | 'sumifs'
  | 'countifs'
  | 'averageifs';

export interface MultiCriteriaItem {
  id: string;
  col: string;
  op: 'equals' | 'contains' | 'gt' | 'lt' | 'neq';
  val: string;
}

export interface SheetInfo {
  name: string;
  rowCount: number;
}
