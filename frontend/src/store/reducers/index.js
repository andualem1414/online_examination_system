// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import exam from './exam';
import question from './question';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, exam, question });

export default reducers;
