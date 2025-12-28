import { supabase } from '@/integrations/supabase/client';

type NotificationType = 'book' | 'quran' | 'exam' | 'result' | 'hadith' | 'attendance' | 'general';

interface SendNotificationParams {
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, string>;
  targetUserIds?: string[];
}

export const sendPushNotification = async ({
  title,
  body,
  type,
  data,
  targetUserIds,
}: SendNotificationParams): Promise<{ success: boolean; sent?: number; error?: string }> => {
  try {
    const { data: response, error } = await supabase.functions.invoke('send-push-notification', {
      body: {
        title,
        body,
        type,
        data,
        targetUserIds,
      },
    });

    if (error) {
      console.error('Error sending push notification:', error);
      return { success: false, error: error.message };
    }

    console.log('Push notification response:', response);
    return { success: true, sent: response?.sent || 0 };
  } catch (error: any) {
    console.error('Error sending push notification:', error);
    return { success: false, error: error.message };
  }
};

// Helper functions for specific notification types
export const notifyNewBook = async (bookTitle: string, language: string) => {
  return sendPushNotification({
    title: '📚 New Book Added!',
    body: `"${bookTitle}" is now available in ${language}`,
    type: 'book',
    data: { bookTitle, language },
  });
};

export const notifyNewQuran = async (quranTitle: string, language: string) => {
  return sendPushNotification({
    title: '📖 New Quran Upload!',
    body: `"${quranTitle}" (${language}) is now available`,
    type: 'quran',
    data: { quranTitle, language },
  });
};

export const notifyNewExam = async (examTitle: string, subject: string, examDate: string) => {
  return sendPushNotification({
    title: '📝 New Exam Scheduled!',
    body: `${examTitle} - ${subject} on ${examDate}`,
    type: 'exam',
    data: { examTitle, subject, examDate },
  });
};

export const notifyExamResult = async (
  studentId: string,
  examTitle: string,
  marks: number,
  totalMarks: number,
  grade: string
) => {
  return sendPushNotification({
    title: '📊 Exam Result Published!',
    body: `${examTitle}: ${marks}/${totalMarks} (Grade: ${grade})`,
    type: 'result',
    data: { examTitle, marks: String(marks), totalMarks: String(totalMarks), grade },
    targetUserIds: [studentId],
  });
};

export const notifyNewHadith = async (hadithTitle: string, author: string) => {
  return sendPushNotification({
    title: '📜 New Hadith Book!',
    body: `"${hadithTitle}" by ${author || 'Unknown'} is now available`,
    type: 'hadith',
    data: { hadithTitle, author: author || '' },
  });
};

export const notifyAttendance = async (
  studentId: string,
  studentName: string,
  status: 'present' | 'absent' | 'late' | 'excused',
  date: string
) => {
  const statusMessages: Record<string, { emoji: string; message: string }> = {
    present: { emoji: '✅', message: 'marked present' },
    absent: { emoji: '❌', message: 'marked absent' },
    late: { emoji: '⏰', message: 'marked late' },
    excused: { emoji: '📋', message: 'excused from attendance' },
  };

  const { emoji, message } = statusMessages[status];

  return sendPushNotification({
    title: `${emoji} Attendance Update`,
    body: `${studentName} has been ${message} on ${date}`,
    type: 'attendance',
    data: { studentName, status, date },
    targetUserIds: [studentId],
  });
};
