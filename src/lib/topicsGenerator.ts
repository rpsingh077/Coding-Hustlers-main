export function generateDefaultTopics(description: string, title: string): string[] {
  const descParts = description.split(/,| and /).map(s => s.trim()).filter(s => s.length > 0);

  const topics: string[] = [];
  const actionVerbs = ['Understand', 'Work with', 'Implement', 'Apply'];

  if (descParts.length >= 2) {
    descParts.slice(0, 4).forEach((part, index) => {
      const verb = actionVerbs[index % actionVerbs.length];
      let cleanPart = part.trim();

      if (cleanPart.length > 0) {
        const firstChar = cleanPart.charAt(0).toLowerCase();
        const restOfString = cleanPart.slice(1);
        cleanPart = firstChar + restOfString;

        if (!cleanPart.match(/^(how to|using|by|with)/i)) {
          topics.push(`${verb} ${cleanPart}`);
        } else {
          topics.push(cleanPart.charAt(0).toUpperCase() + cleanPart.slice(1));
        }
      }
    });
  }

  while (topics.length < 4) {
    const titleWords = title.split(' ').filter(w => w.length > 2);
    const mainTopic = titleWords.length > 0 ? titleWords.join(' ').toLowerCase() : 'concepts';

    if (topics.length === 0) {
      topics.push(`Master ${mainTopic} fundamentals`);
    } else if (topics.length === 1) {
      topics.push(`Apply ${mainTopic} in real-world scenarios`);
    } else if (topics.length === 2) {
      topics.push(`Understand core ${mainTopic} principles`);
    } else if (topics.length === 3) {
      topics.push(`Build practical solutions with ${mainTopic}`);
    }
  }

  return topics.slice(0, 4);
}
