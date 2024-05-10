import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Footer,
  NumberFormat,
  AlignmentType,
  PageNumber,
  HeadingLevel
} from 'docx';

import { saveAs } from 'file-saver';
import { secondsToHMS } from './utils';

export const generateWordDocument = (event, questions, examDetails) => {
  event.preventDefault();
  // Create a new instance of Document for the docx module
  let totalMark = 0;

  let questionsList = questions.map((question, i) => {
    totalMark += question.point;
    let choices = JSON.parse(question.choices)
      .map((choice, i) => {
        return [
          new TextRun({
            text: `\t${choice.identifier}`,
            size: 22,
            bold: true
          }),
          new TextRun({
            text: `\t${choice.choice}`,
            size: 22
          }),
          new TextRun({
            break: 1
          })
        ];
      })
      .flat(Infinity);

    return new Paragraph({
      children: [
        new TextRun({
          break: 1
        }),
        //   Question
        new TextRun({
          text: `${i + 1}.`,
          bold: true,
          size: 22
        }),
        new TextRun({
          text: `\t${question.question}`,
          size: 22
        }),
        new TextRun({
          break: 2
        }),
        //   Choice if any
        ...choices,
        // Points
        new TextRun({
          break: 1
        }),
        new TextRun({
          text: '\tPoints:',
          bold: true,
          size: 22
        }),
        new TextRun({
          text: `\t${question.point}`,
          size: 22
        }),
        //   Answer
        new TextRun({
          break: 1
        }),
        new TextRun({
          text: '\tAnswer:',
          bold: true,
          size: 22
        }),
        new TextRun({
          text: `\t${question.answer}`,
          size: 22
        })
      ]
    });
  });

  let doc = new Document({
    sections: [
      {
        properties: {
          page: {
            pageNumbers: {
              start: 1,
              formatType: NumberFormat.DECIMAL
            }
          }
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: ['Page Number: ', PageNumber.CURRENT]
                  }),
                  new TextRun({
                    children: [' to ', PageNumber.TOTAL_PAGES]
                  })
                ]
              })
            ]
          })
        },

        children: [
          new Paragraph({
            text: examDetails?.title,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,

            spacing: {
              after: 200
            }
          }),

          new Paragraph({
            border: {
              top: {
                color: 'auto',
                space: 1,
                style: 'single',
                size: 6
              },
              bottom: {
                color: 'auto',
                space: 1,
                style: 'single',
                size: 6
              }
            },

            children: [
              new TextRun({
                text: 'Number of Questions:',
                bold: true
              }),
              new TextRun({
                text: `\t${questions.length}`,
                italics: true
              }),
              new TextRun({
                break: 1
              }),
              new TextRun({
                text: 'Allowed time:',
                bold: true
              }),
              new TextRun({
                text: `\t${secondsToHMS(examDetails.duration)}`,
                italics: true
              }),
              new TextRun({
                break: 1
              }),
              new TextRun({
                text: 'Total Mark:',
                bold: true
              }),
              new TextRun({
                text: `\t${totalMark}`,
                italics: true
              })
            ]
          }),
          ...questionsList
        ]
      }
    ]
  });

  // Call saveDocumentToFile with the document instance and a filename
  saveDocumentToFile(doc, `${examDetails?.title}.docx`);
};

const saveDocumentToFile = (doc, fileName) => {
  // Create a mime type that will associate the new file with Microsoft Word
  const mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  // Create a Blob containing the Document instance and the mimeType
  Packer.toBlob(doc).then((blob) => {
    const docblob = blob.slice(0, blob.size, mimeType);

    // Save the file using saveAs from the file-saver package
    saveAs(docblob, fileName);
  });
};
