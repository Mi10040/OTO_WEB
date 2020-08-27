import { DvaModelBuilder, actionCreatorFactory } from 'dva-model-creator';

//##===================================
//## Namespace definition
//##===================================
const NAMESPACE = 'pm2List';

//##===================================
//## State type definition
//##===================================

export type Pm2ListState = {
  list: Array<any>;
};

const initState: Pm2ListState = {
  list: [],
};

//##===================================
//## Action type definition
//##===================================
export enum Pm2ListActions {
  //
  UPDATE_STATE = 'updateState',
  SET_LIST = 'setList',
}

//##===================================
//## Action type definition
//##===================================
const actionCreator = actionCreatorFactory(NAMESPACE);
//
export const updateState = actionCreator<any>(Pm2ListActions.UPDATE_STATE);
export const setList = actionCreator<{ datas: Array<any> }>(
  Pm2ListActions.SET_LIST,
);

//##===================================
//## model definition
//##===================================
const modelBuilder = new DvaModelBuilder(initState, NAMESPACE)
  .takeLatest(setList, function*({ datas }, { call, put }) {
    yield put({
      type: 'updateState',
      payload: {
        list: datas,
      },
    });
  })
  .immer(updateState, (state, newState) => {
    Object.keys(newState).forEach(key => {
      state[key] = newState[key];
    });
  });

export default modelBuilder.build();
