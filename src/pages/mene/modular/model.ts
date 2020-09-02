import { DvaModelBuilder, actionCreatorFactory } from 'dva-model-creator';

//##===================================
//## Namespace definition
//##===================================
const NAMESPACE = 'modularList';

//##===================================
//## State type definition
//##===================================

export type ModularListListState = {
  packageList: Array<{ name: string; version: string }>;
};

const initState: ModularListListState = {
  packageList: [],
};

//##===================================
//## Action type definition
//##===================================
export enum ModularListListActions {
  //
  UPDATE_STATE = 'updateState',
  SET_PACKAGE_LIST = 'setPackageList',
}

//##===================================
//## Action type definition
//##===================================
const actionCreator = actionCreatorFactory(NAMESPACE);
//
export const updateState = actionCreator<any>(
  ModularListListActions.UPDATE_STATE,
);
export const setPackageList = actionCreator<{ datas: Array<any> }>(
  ModularListListActions.SET_PACKAGE_LIST,
);

//##===================================
//## model definition
//##===================================
const modelBuilder = new DvaModelBuilder(initState, NAMESPACE)
  .takeLatest(setPackageList, function*({ datas }, { call, put }) {
    yield put({
      type: 'updateState',
      payload: {
        packageList: datas,
      },
    });
  })
  .immer(updateState, (state, newState) => {
    Object.keys(newState).forEach(key => {
      state[key] = newState[key];
    });
  });

export default modelBuilder.build();
