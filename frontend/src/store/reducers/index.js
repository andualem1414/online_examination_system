// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import exam from './exam';
import question from './question';
import user from './user';
import examineeExam from './examineeExam';
import examineeAnswer from './examineeAnswer';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ user, menu, exam, question, examineeAnswer, examineeExam });

export default reducers;
