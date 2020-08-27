import { Dispatch } from 'dva';

export type UmiComponentProps<P = any> = {
  dispatch: Dispatch<any>;
};

export type ToMap<T> = {
  [key: string]: T;
};
