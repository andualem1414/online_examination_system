import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!

import MainCard from 'components/MainCard';
import { useSelector, useDispatch } from 'react-redux';
import { formatDate } from 'utils/utils';
import { useNavigate } from 'react-router-dom';
import { fetchExams } from 'store/reducers/exam';
import { fetchExamineeExams } from 'store/reducers/examineeExam';

const ExamSchedules = () => {
  const dispatch = useDispatch();

  const exams = useSelector((state) => state.exam.exams);
  const examineeExams = useSelector((state) => state.examineeExam.examineeExams);
  const user = useSelector((state) => state.user.userDetails);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.user_type === 'EXAMINER') {
      dispatch(fetchExams());
    }

    if (user.user_type === 'EXAMINEE') {
      dispatch(fetchExamineeExams());
    }
  }, []);
  const handleDateClick = (arg) => {
    if (user.user_type === 'EXAMINEE') {
      localStorage.setItem('examineeExamId', arg.event.id);
    } else {
      localStorage.setItem('examId', arg.event.id);
    }
    navigate('/my-exams/exam-details');
  };

  console.log(examineeExams);
  let examsList =
    user.user_type === 'EXAMINER'
      ? exams.map((exam) => {
          return {
            title: exam.title,
            id: exam.id,
            date: formatDate(exam.start_time),
            color: exam.status === 'Conducted' ? '#2ba822' : '#0daade'
          };
        })
      : examineeExams.map((examExam) => {
          return {
            title: examExam.exam.title,
            id: examExam.exam.id,
            date: formatDate(examExam.exam.start_time),
            color: examExam.exam.status === 'Conducted' ? '#2ba822' : '#0daade'
          };
        });

  return (
    <MainCard sx={{ p: 2 }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        eventClick={handleDateClick}
        eventMouseEnter={(mouseEnterInfo) => {
          mouseEnterInfo.el.style.cursor = 'pointer';
        }}
        initialView="dayGridMonth"
        events={examsList}
      />
    </MainCard>
  );
};

export default ExamSchedules;
