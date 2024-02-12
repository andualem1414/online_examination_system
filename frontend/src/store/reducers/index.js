// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import exam from './exam';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, exam });

export default reducers;
