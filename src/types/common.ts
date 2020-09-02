import { Dispatch } from 'dva';
import { AnyAction } from 'dva-model-creator';

export type UmiComponentProps<P = any> = {
  dispatch: Dispatch<AnyAction>;
};

export type ToMap<T> = {
  [key: string]: T;
};
