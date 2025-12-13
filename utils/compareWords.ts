// utils/checkAnswer.ts
import levenshtein from 'fast-levenshtein'

export type AnswerResult = 'perfect' | 'good' | 'wrong'

export function checkAnswer(
  userAnswer: string,
  correctAnswer: string | string[],
  options: { strictDiacritics?: boolean } = {},
): AnswerResult {
  const { strictDiacritics = false } = options

  const user = userAnswer.trim()
  if (user === '')
    return 'wrong'

  const answers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer]

  // Все варианты правильного ответа (включая слова из скобок)
  const variants = new Set<string>()
  for (const ans of answers) {
    const trimmed = ans.trim()
    variants.add(trimmed)

    // исправлено: НЕ удаляем содержимое скобок — заменяем только сами скобки на пробелы,
    // чтобы "лаба (баба)" → "лаба баба"
    const cleaned = trimmed
      .replace(/[()]/g, ' ') // сохраняем содержимое скобок, убираем только скобки
      // eslint-disable-next-line regexp/no-useless-escape
      .replace(/[{}\[\]\/,–—;]+/g, ' ') // остальные разделители → пробел

    cleaned
      .split(/\s+/)
      .map(s => s.trim())
      .filter(Boolean)
      .forEach(v => variants.add(v))
  }

  const baseNormalize = (s: string) =>
    s.toLowerCase().replace(/\s+/g, ' ').trim()

  const softNormalize = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036F]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()

  const normalize = strictDiacritics ? baseNormalize : softNormalize

  const userNorm = normalize(user)

  let foundGood = false

  // 1) Сначала ищем perfect среди всех вариантов
  for (const variant of variants) {
    const correctNorm = normalize(variant)
    const correctBase = baseNormalize(variant)

    if (baseNormalize(user) === correctBase)
      return 'perfect'

    if (!strictDiacritics && userNorm === correctNorm)
      return 'perfect'
  }

  // 2) Теперь ищем good (опечатки)
  for (const variant of variants) {
    const correctNorm = normalize(variant)

    const distance = levenshtein.get(userNorm, correctNorm)

    // возвращаем прежнюю разумную формулу: минимум 1 ошибка + по 1 на каждые 5 символов
    const allowedErrors = Math.max(1, Math.floor(correctNorm.length / 5))

    if (distance === 0)
      return 'perfect'
    if (distance <= allowedErrors)
      foundGood = true
  }

  // 3) Возвращаем лучшее, что нашли
  return foundGood ? 'good' : 'wrong'
}
