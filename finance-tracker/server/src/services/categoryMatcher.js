export const matchCategory = (description, categories, type = 'EXPENSE') => {
  const text = (description ?? '').toLowerCase();

  if (text) {
    const match = categories.find(
      (category) =>
        category.type === type &&
        category.keywords.some((keyword) => text.includes(keyword.toLowerCase()))
    );
    if (match) return match;
  }

  const fallbackName = type === 'INCOME' ? 'Other Income' : 'Other';
  return (
    categories.find((category) => category.isDefault && category.name === fallbackName) ?? null
  );
};
