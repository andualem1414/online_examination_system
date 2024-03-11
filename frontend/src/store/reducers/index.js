// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import exam from './exam';
import question from './question';
import user from './user';
import flag from './flag';
import examineeExam from './examineeExam';
import examineeAnswer from './examineeAnswer';
import payment from './payments';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  user,
  menu,
  exam,
  question,
  examineeAnswer,
  examineeExam,
  flag,
  payment
});

export default reducers;
