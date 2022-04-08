export function generateItems(numberOfItems) {
    return [...Array(numberOfItems).keys()].map(i => {
      const num = i + 1;
      return { label: `Item ${num}`, id: `value-${num}`,image: '' };
    });
  }