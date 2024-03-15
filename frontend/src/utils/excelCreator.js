import { writeFileXLSX, utils } from 'xlsx';

export const excelCreator = (event, examineeAnswers) => {
  console.log(examineeAnswers);
  const examinees = examineeAnswers.map((examineeAnswer) => {
    return {
      name: examineeAnswer.examinee.full_name,
      flags: examineeAnswer.flags,
      score: examineeAnswer.score,
      total_time: examineeAnswer.total_time
    };
  });

  const worksheet = utils.json_to_sheet(examinees);
  const workbook = utils.book_new();

  const excelHeader = ['Full Name', 'Flags', 'Score', 'Total Time'];
  utils.sheet_add_aoa(worksheet, [excelHeader], { origin: 'A1' });

  //   increase the width of the column
  let wscols = [];
  excelHeader.forEach((arr) => {
    wscols.push({ wch: arr.length + 10 });
  });
  worksheet['!cols'] = wscols;

  utils.book_append_sheet(workbook, worksheet, 'Examinees');

  writeFileXLSX(workbook, 'Examinee Lists.xlsx', { compression: true });
};
