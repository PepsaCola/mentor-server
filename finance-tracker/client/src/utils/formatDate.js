import dayjs from 'dayjs';

export const formatDate = (date) => dayjs(date).format('MMM D, YYYY');
export const toInputDate = (date) => dayjs(date).format('YYYY-MM-DD');
