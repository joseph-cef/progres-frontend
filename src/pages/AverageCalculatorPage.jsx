import React, { useMemo, useState } from 'react';

const initialSubjects = [
  { id: 1, name: 'المادة 1', tp: '', td: '', exam: '' },
  { id: 2, name: 'المادة 2', tp: '', td: '', exam: '' },
  { id: 3, name: 'المادة 3', tp: '', td: '', exam: '' },
];

const parseScore = (value) => {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) ? num : 0;
};

export default function AverageCalculatorPage() {
  const [subjects, setSubjects] = useState(initialSubjects);

  const handleSubjectChange = (id, field, value) => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === id ? { ...subject, [field]: value } : subject
      )
    );
  };

  const addSubject = () => {
    setSubjects((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((s) => s.id)) + 1 : 1;
      return [
        ...prev,
        { id: nextId, name: `المادة ${nextId}`, tp: '', td: '', exam: '' },
      ];
    });
  };

  const removeSubject = (id) => {
    setSubjects((prev) => prev.filter((subject) => subject.id !== id));
  };

  const subjectAverages = useMemo(() => {
    return subjects.map((subject) => {
      const tp = parseScore(subject.tp);
      const td = parseScore(subject.td);
      const exam = parseScore(subject.exam);
      const average = (tp + td + exam) / 3;
      return { id: subject.id, average };
    });
  }, [subjects]);

  const overallAverage = useMemo(() => {
    if (!subjectAverages.length) return 0;
    const sum = subjectAverages.reduce((acc, item) => acc + item.average, 0);
    return sum / subjectAverages.length;
  }, [subjectAverages]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            حساب معدل المواد
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            أدخل نقاط TP و TD و Exam لكل مادة. أي خانة فارغة سيتم اعتبارها 0.
          </p>
        </div>
        <button
          type="button"
          onClick={addSubject}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-900/30 transition hover:bg-blue-700"
        >
          إضافة مادة
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6">
        <div className="grid gap-4">
          {subjects.map((subject) => {
            const averageItem = subjectAverages.find(
              (item) => item.id === subject.id
            );

            return (
              <div
                key={subject.id}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950/40"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(event) =>
                      handleSubjectChange(
                        subject.id,
                        'name',
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/30"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubject(subject.id)}
                    className="text-xs font-semibold text-red-600 transition hover:text-red-700 md:self-start"
                  >
                    حذف
                  </button>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    { key: 'tp', label: 'TP' },
                    { key: 'td', label: 'TD' },
                    { key: 'exam', label: 'Exam' },
                  ].map((field) => (
                    <label
                      key={field.key}
                      className="flex flex-col gap-2 text-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      {field.label}
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        value={subject[field.key]}
                        onChange={(event) =>
                          handleSubjectChange(
                            subject.id,
                            field.key,
                            event.target.value
                          )
                        }
                        placeholder="0"
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/30"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-200">
                  <span>معدل المادة</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {averageItem ? averageItem.average.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200">
        المعدل العام: {overallAverage.toFixed(2)}
      </div>
    </div>
  );
}
