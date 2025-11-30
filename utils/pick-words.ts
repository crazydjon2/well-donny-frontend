import type { Word } from '~/assets/types/word'

// TODO CHANGE TO ALGORYTH WITH SIMILAR WORDS!!!
export function pickWords(words: Word[], correctWord: Word, count: number): Word[] {
  // Проверка на минимальное количество слов
  if (count <= 0)
    return []
  if (count > words.length)
    count = words.length

  // Создаем копию массива, чтобы не мутировать оригинал
  const wordsCopy = [...words]

  // Удаляем correctWord из копии (если он есть), чтобы потом добавить его гарантированно
  const correctWordIndex = wordsCopy.findIndex(word => word.id === correctWord.id)
  if (correctWordIndex !== -1) {
    wordsCopy.splice(correctWordIndex, 1)
  }

  // Выбираем случайные слова (count-1, так как correctWord будет добавлен отдельно)
  // const data = $fetch(`https://api.datamuse.com/words?ml=${correctWord.translated}&max=4`)
  const randomWords = []
  for (let i = 0; i < Math.min(count - 1, wordsCopy.length); i++) {
    const randomIndex = Math.floor(Math.random() * wordsCopy.length)
    randomWords.push(wordsCopy[randomIndex])
    wordsCopy.splice(randomIndex, 1) // Удаляем выбранное слово, чтобы избежать повторов
  }

  // Добавляем correctWord и перемешиваем результат
  const result = [...randomWords, correctWord]
  return shuffleArray(result)
}

// Вспомогательная функция для перемешивания массива (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
